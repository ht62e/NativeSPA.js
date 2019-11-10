import Container, { ContainerInfo, CssTransitionOptions } from "../container/container";
import HtmlModule from "./html_module";
import ContainerFactory from "../container/container_factory";
import { htmlModuleAdapters } from "../adapter/html_module_adapter";
import CssTransitionDriver from "../common/css_transition_driver";
import SourceRepository from "../source_repository";
import { MountOption } from "./app_module";

export default class PlainHtmlModule extends HtmlModule {
    private prototypeTemplateBegin: string;
    private prototypeTemplateEnd: string;

    protected onCreate(): void {
        this.prototypeTemplateBegin = 
        `(function() {
            var Com = function(moduleIndex) {
                this.super = __HtmlModuleAdapter.prototype;
                __HtmlModuleAdapter.call(this, moduleIndex);
        `;
    
        this.prototypeTemplateEnd = 
        `   }
            Object.setPrototypeOf(Com.prototype, __HtmlModuleAdapter.prototype);
            __registerHtmlModuleAdapter(${this.moduleIndex}, new Com(${this.moduleIndex}));
         })();
        `;
    }

    protected loadSubContainerInfos(): void {
        let match: RegExpExecArray;
        //高速化のためタグ全体を個別に抽出してから各属性を抽出する
        const tagExtractRegExp = /<div .*?data-container-name[ =].*?>/g;
        while (match = tagExtractRegExp.exec(this.source)) {
            //DomIDの抽出
            const matchDomId = /id *= *["'](.+?)["']/.exec(match[0]);
            //コンテナ名の抽出
            const matchName = /data-container-name *= *["'](.*?)["']/.exec(match[0]);
            //コンテナ種別の抽出
            const matchType = /data-container-type *= *["'](.*?)["']/.exec(match[0]);
            this.subContainerInfos.set(matchDomId[1], {
                name: matchName[1],
                type: matchType ? matchType[1] : "",
                container: null
            });
        }
    }

    public async mount(elementAttachHandler: (element: HTMLDivElement, option?: MountOption) => Container,
                cssTransitionOptions?: CssTransitionOptions): Promise<void> {
        if (!this.isFetched) await this.fetch();

        const localPrefix = "_" + this.moduleIndex.toString() + "_";

        //ソースに対してテンプレート処理
        const localizeRegExp = /\\:/g;
        this.source = this.source.replace(localizeRegExp, localPrefix);

        //引数で与えられたコンテナDOMに対して自身をロード
        this.wrapperElement = document.createElement("div");
        this.wrapperElement.id = localPrefix + "module";
        this.wrapperElement.className = "itm_html_module";
        this.wrapperElement.style.position = "absolute";
        this.wrapperElement.style.overflow = "auto";
        this.wrapperElement.style.width = "100%";
        this.wrapperElement.style.height = "100%";
        this.wrapperElement.style.visibility = "hidden";
        
        this.wrapperElement.innerHTML = this.source;

        if (cssTransitionOptions && cssTransitionOptions.enableCssTransition) {
            this.cssTransitionDriver = new CssTransitionDriver(this.wrapperElement);
            this.cssTransitionDriver.setCustomTransitionClasses(cssTransitionOptions.cssTransitionDriverClasses);
        }
        
        const mountOption: MountOption = {
            order: this.moduleDefinition.orderOnFlatContainer
        }
        this.currentContainer = elementAttachHandler(this.wrapperElement, mountOption);

        await this.evalScripts();

        //サブコンテナの生成・登録
        this.subContainerInfos.forEach((containerInfo: ContainerInfo, domId: string) => {
            let localElementId = domId.replace(localizeRegExp, localPrefix);
            let containerEl: HTMLDivElement = document.getElementById(localElementId) as HTMLDivElement;
            let containerId: string = this.name + "." + containerInfo.name;
            containerInfo.container = ContainerFactory.createContainer(containerId, containerInfo.type, containerEl, this);
        });

        this.isMounted = true;

        this.htmlAdapter = htmlModuleAdapters.get(this.moduleIndex);
        this.htmlAdapter.setHtmlComponent(this);
        this.htmlAdapter.triggerOnLoad("name is " + this.name);

    }

    private async evalScripts(): Promise<void> {
        let jsSource = "";
        let nativeScript = "";
        let prototypeScript = "";
        let classScript = "";

        let initialScriptElements = new Array<HTMLScriptElement>();

        const nodeList: NodeList = this.wrapperElement.querySelectorAll("script");
        for (let i = 0; i < nodeList.length; i++) {
            const scriptElement: HTMLScriptElement = nodeList[i] as HTMLScriptElement;
            const scopeMode: string = scriptElement.dataset["scopeMode"];
            const sourceUri: string = scriptElement.dataset["source"];

            if (sourceUri) {
                const repository = SourceRepository.getInstance();
                jsSource = await repository.fetch(sourceUri);
            } else {
                jsSource = scriptElement.textContent;
            }

            if (scopeMode === "native") {
                nativeScript += jsSource;
            } else if (!scopeMode || scopeMode === "prototype")  { //default
                prototypeScript += jsSource;
            } else if (scopeMode === "class") {
                classScript += jsSource;
            }
            initialScriptElements.push(scriptElement);            
        }

        const nativeScriptElement = document.createElement("script");
        nativeScriptElement.textContent = nativeScript;
        this.wrapperElement.appendChild(nativeScriptElement);

        //prototypeScriptとclassScriptは1つのHTMLファイルにつき1種類だけ
        if (classScript) {
            const classScriptElement = document.createElement("script");
            classScriptElement.textContent = classScript;
            this.wrapperElement.appendChild(classScriptElement);
        } else {
            const prototypeScriptElement = document.createElement("script");
            prototypeScript =   this.prototypeTemplateBegin + 
                                prototypeScript + 
                                this.prototypeTemplateEnd;
            prototypeScriptElement.textContent = prototypeScript;
            this.wrapperElement.appendChild(prototypeScriptElement);
        }

        for (let element of initialScriptElements) {
            this.wrapperElement.removeChild(element);
        }
    }

    public changeModuleCssPosition(left: string, top: string) {
        this.wrapperElement.style.left = left;
        this.wrapperElement.style.top = top;
    }

    public changeModuleCssSize(width: string, height: string) {
        this.wrapperElement.style.width = width;
        this.wrapperElement.style.height = height;
    }
}