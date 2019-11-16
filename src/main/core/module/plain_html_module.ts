import Container, { ContainerInfo, CssTransitionOptions } from "../container/container";
import HtmlModule from "./html_module";
import ContainerFactory from "../container/container_factory";
import { htmlModuleAdapters } from "../adapter/html_module_adapter";
import CssTransitionDriver from "../common/css_transition_driver";
import SourceRepository from "../source_repository";
import { MountOption } from "./app_module";
import Utils from "../common/utils";

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
        const regExp = /<div .*?data-container-name[ =].*?>/g;
        while (match = regExp.exec(this.source)) {
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

        const localPrefix = "_itf_" + this.moduleIndex.toString() + "_";

        //引数で与えられたコンテナDOMに対して自身をロード
        this.wrapperEl = document.createElement("div");
        this.wrapperEl.id = localPrefix + "module";
        this.wrapperEl.className = "itm_html_module";
        this.wrapperEl.style.position = "absolute";
        this.wrapperEl.style.overflow = "auto";
        this.wrapperEl.style.width = "100%";
        this.wrapperEl.style.height = "100%";
        this.wrapperEl.style.visibility = "hidden";

        this.wrapperEl.innerHTML = this.parseTemplate(this.source, localPrefix);

        const styles: Array<HTMLStyleElement> = await this.parseStyle(this.source, localPrefix, this.wrapperEl.id);
        const globalHeadEl = document.getElementsByTagName("head")[0];
        styles.forEach(el => {
            globalHeadEl.appendChild(el);
        });

        if (cssTransitionOptions && cssTransitionOptions.enableCssTransition) {
            this.cssTransitionDriver = new CssTransitionDriver(this.wrapperEl);
            this.cssTransitionDriver.setCustomTransitionClasses(cssTransitionOptions.cssTransitionDriverClasses);
        }
        
        const mountOption: MountOption = {
            order: this.moduleDefinition.orderOnFlatContainer
        }
        this.currentContainer = elementAttachHandler(this.wrapperEl, mountOption);

        const scripts: Array<HTMLScriptElement> = await this.parseScripts(this.source, localPrefix);
        scripts.forEach(el => {
            this.wrapperEl.appendChild(el);
        });

        //サブコンテナの生成・登録
        this.subContainerInfos.forEach((containerInfo: ContainerInfo, domId: string) => {
            let localElementId = domId.replace(/\\:/g, localPrefix);
            let containerEl: HTMLDivElement = document.getElementById(localElementId) as HTMLDivElement;
            let containerId: string = this.name + "." + containerInfo.name;
            containerInfo.container = ContainerFactory.createContainer(containerId, containerInfo.type, containerEl, this);
        });

        this.isMounted = true;

        this.htmlAdapter = htmlModuleAdapters.get(this.moduleIndex);
        this.htmlAdapter.setHtmlComponent(this);
        this.htmlAdapter.triggerOnLoad("name is " + this.name);

    }

    private parseTemplate(source: string, localPrefix: string): string {
        const localizeRegExp = /\\:/g;
        const htmlBlocks: Array<string> = Utils.extractOutermostHtmlTagBlocks("template", source);
        if (htmlBlocks.length > 0) {
            const h = Utils.extractInnerHtml(htmlBlocks[0]);
            return h.replace(localizeRegExp, localPrefix);
        }
    }

    private async parseStyle(source: string, localPrefix: string, wrapperDomId: string): Promise<Array<HTMLStyleElement>> {
        const elements = new Array<HTMLStyleElement>();
        const blocks: Array<string> = Utils.extractOutermostHtmlTagBlocks("style", source);
        
        for (const i in blocks) {
            const attrs: Map<string, string> = Utils.extractTagAttributes(blocks[i]);
            const extSourceUri: string = attrs.get("data-src");
            let block;

            if (extSourceUri) {
                const repository = SourceRepository.getInstance();
                block = await repository.fetch(this.sourceDirectory + extSourceUri);
            } else {
                block = Utils.extractInnerHtml(blocks[i]);
            }

            const insertLocalPrefixToIdClassSelectors = (selectorRow: string): string => {
                return selectorRow.replace(/[#.]/g, "$&" + localPrefix);
            };
    
    
            //for first selector only
            let h = block.replace(/^[^{]*/, (match: string): string => {
                let s = insertLocalPrefixToIdClassSelectors(match);
                s = s.replace(/[#.\w\-]+[,\s{]/, (match: string): string => {
                    const head = match.slice(0, 1);
                    if (head !== "#" && head !== ".") {
                        return "#" + wrapperDomId + " " + match;
                    } else {
                        return match;
                    }
                });
                s = s.replace(/([,]\s*)([\w\-]+)/g, "$1#" + wrapperDomId + " $2");
                return s;
            }); 

            h = h.replace(/}[^{";]*?{/g, (match: string): string => {
                    let s = insertLocalPrefixToIdClassSelectors(match);
                    return s.replace(/([};,]\s*)([\w\-]+)/g, "$1#" + wrapperDomId + " $2");
                });

            const el: HTMLStyleElement = document.createElement('style');
            //if (style.styleSheet) { // IE
            //    style.styleSheet.cssText = css;
            //} else {
            el.appendChild(document.createTextNode(h));
            //}

            elements.push(el);
        }

        return elements;
    }

    private async parseScripts(source: string, localPrefix: string): Promise<Array<HTMLScriptElement>> {
        const elements = new Array<HTMLScriptElement>();
        const blocks: Array<string> = Utils.extractOutermostHtmlTagBlocks("script", source);

        let jsSource = "";
        let nativeScript = "";
        let prototypeScript = "";
        let classScript = "";

        for (const i in blocks) {
            const attrs: Map<string, string> = Utils.extractTagAttributes(blocks[i]);
            const scopeMode: string = attrs.get("data-script-type");
            const sourceUri: string = attrs.get("src");

            if (sourceUri) {
                const repository = SourceRepository.getInstance();
                jsSource = await repository.fetch(this.sourceDirectory + sourceUri);
            } else {
                jsSource = Utils.extractInnerHtml(blocks[i]);
            }

            if (scopeMode === "native") {
                nativeScript += jsSource;
            } else if (!scopeMode || scopeMode === "prototype")  { //default
                prototypeScript += jsSource;
            } else if (scopeMode === "class") {
                classScript += jsSource;
            }
        }

        const nativeScriptElement = document.createElement("script");
        nativeScriptElement.textContent = nativeScript.replace(/\\:/g, localPrefix);;
        elements.push(nativeScriptElement);

        //prototypeScriptとclassScriptは1つのHTMLファイルにつきどちらか1つだけ
        if (classScript) {
            const classScriptElement = document.createElement("script");
            classScriptElement.textContent = classScript.replace(/\\:/g, localPrefix);;
            elements.push(classScriptElement);
        } else {
            const prototypeScriptElement = document.createElement("script");
            prototypeScript =   this.prototypeTemplateBegin + 
                                prototypeScript + 
                                this.prototypeTemplateEnd;
            prototypeScriptElement.textContent = prototypeScript.replace(/\\:/g, localPrefix);
            elements.push(prototypeScriptElement);
        }

        return elements;
    }

}