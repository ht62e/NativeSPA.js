import Container, { ContainerInfo } from "../container/container";
import HTMLComponent from "./html_component";
import ContainerManager from "../container/container_manager";
import { htmlComponentAdapters } from "../adapter/html_component_adapter";

export default class NativeComponent extends HTMLComponent {
    private prototypeTemplateBegin: string;
    private prototypeTemplateEnd: string;

    
    protected onCreate(): void {
        this.prototypeTemplateBegin = 
        `(function() {
            var Com = function(moduleIndex) {
                this.super = __HTMLComponentAdapter.prototype;
                __HTMLComponentAdapter.call(this, moduleIndex);
        `;
    
        this.prototypeTemplateEnd = 
        `   }
            Object.setPrototypeOf(Com.prototype, __HTMLComponentAdapter.prototype);
            __registerHTMLComponentAdapter(${this.moduleIndex}, new Com(${this.moduleIndex}));
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

    async mount(elementAttachHandler: (element: HTMLDivElement, ownerModuleName: string) => Container): Promise<boolean> {
        if (!this.isFetched) await this.fetch();

        const localPrefix = "_" + this.moduleIndex.toString() + "_";

        //ソースに対してテンプレート処理
        const localizeRegExp = /\\:/g;
        this.source = this.source.replace(localizeRegExp, localPrefix);

        //引数で与えられたコンテナDOMに対して自身をロード
        this.wrapperElement = document.createElement("div");
        this.wrapperElement.id = localPrefix + "module"
        this.wrapperElement.style.position = "absolute";
        this.wrapperElement.style.overflow = "auto";
        this.wrapperElement.style.width = "100%";
        this.wrapperElement.style.height = "100%";
        this.wrapperElement.style.visibility = "hidden";

        this.wrapperElement.innerHTML = this.source;
        
        this.currentContainer = elementAttachHandler(this.wrapperElement, this.name);

        //scriptタグを実行
        this.evalScripts();

        //サブコンテナをContainerManagerで生成・登録
        const containerManager = ContainerManager.getInstance();
        this.subContainerInfos.forEach((containerInfo: ContainerInfo, domId: string) => {
            let localElementId = domId.replace(localizeRegExp, localPrefix);
            let containerEl: HTMLDivElement = document.getElementById(localElementId) as HTMLDivElement;
            let containerId: string = this.name + "." + containerInfo.name;
            containerInfo.container = containerManager.createContainer(containerId, containerInfo.type, containerEl);
        });

        this.isMounted = true;

        this.htmlAdapter = htmlComponentAdapters.get(this.moduleIndex);
        this.htmlAdapter.setHtmlComponent(this);
        this.htmlAdapter.triggerOnLoadHandler("name is " + this.name);

        return true;
    }

    private evalScripts(): void {
        let nativeScript = "";
        let prototypeScript = "";
        let classScript = "";

        let initialScriptElements = new Array<HTMLScriptElement>();

        const nodeList: NodeList = this.wrapperElement.querySelectorAll("script");
        for (let i = 0; i < nodeList.length; i++) {
            const element: HTMLScriptElement = nodeList[i] as HTMLScriptElement;
            const scopeMode: string = element.dataset["scopeMode"];

            if (!scopeMode || scopeMode === "native") {
                nativeScript += element.textContent;
            } else if (scopeMode === "prototype")  {
                prototypeScript += element.textContent;
            } else if (scopeMode === "class") {
                classScript += element.textContent;
            }
            initialScriptElements.push(element);            
        }

        // this.wrapperElement.querySelectorAll("script").forEach((element: HTMLScriptElement) => {
        //     const scopeMode: string = element.dataset["scopeMode"];
        //     if (!scopeMode || scopeMode === "native") {
        //         nativeScript += element.textContent;
        //     } else if (scopeMode === "prototype")  {
        //         prototypeScript += element.textContent;
        //     } else if (scopeMode === "class") {
        //         classScript += element.textContent;
        //     }
        //     initialScriptElements.push(element);
        // })

        const nativeScriptElement = document.createElement("script");
        nativeScriptElement.textContent = nativeScript;
        this.wrapperElement.appendChild(nativeScriptElement);


        const prototypeScriptElement = document.createElement("script");
        prototypeScript =   this.prototypeTemplateBegin + 
                            prototypeScript + 
                            this.prototypeTemplateEnd;
        prototypeScriptElement.textContent = prototypeScript;
        this.wrapperElement.appendChild(prototypeScriptElement);

        const classScriptElement = document.createElement("script");
        classScriptElement.textContent = classScript;
        this.wrapperElement.appendChild(classScriptElement);
        
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