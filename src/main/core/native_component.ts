import Container, { ContainerInfo } from "./container";
import HTMLComponent from "./abstract_html_component";
import ContainerManager from "./container_manager";
import HTMLComponentAdapter, { htmlComponentAdapters } from "./html_component_adapter";

export default class NativeComponent extends HTMLComponent {
    private prototypeTemplateBegin: string;
    private prototypeTemplateEnd: string;

    private htmlAdapter: HTMLComponentAdapter = null;

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
        const regExp = /<div *id *= *["'](.+)["'] *.*data-container-name *= *["'](.+)["'].*>/g;

        let match: RegExpExecArray;
        while (match = regExp.exec(this.source)) {
            this.subContainerInfos.set(match[1], {
                name: match[2],
                container: null
            });
        }
    }

    async mount(container: Container): Promise<boolean> {
        if (!this.isFetched) await this.fetch();

        const localPrefix = "_" + this.moduleIndex.toString() + "_";

        this.currentContainer = container;

        //ソースに対してテンプレート処理
        const localizeRegExp = /_LS_/g;
        this.source = this.source.replace(localizeRegExp, localPrefix);

        //引数で与えられたコンテナDOMに対して自身をロード
        this.wrapperElement = document.createElement("div");
        this.wrapperElement.id = localPrefix + "module"
        this.wrapperElement.style.position = "absolute";
        this.wrapperElement.style.visibility = "hidden";

        this.wrapperElement.innerHTML = this.source;
        container.addModuleElement(this.wrapperElement);

        //scriptタグを実行
        this.evalScripts();

        //サブコンテナをContainerManagerで生成・登録
        const containerManager = ContainerManager.getInstance();
        this.subContainerInfos.forEach((containerInfo: ContainerInfo, domId: string) => {
            let localElementId = domId.replace(localizeRegExp, localPrefix);
            let containerEl: HTMLDivElement = document.getElementById(localElementId) as HTMLDivElement;
            let containerId: string = this.name + "." + containerInfo.name;
            containerInfo.container = containerManager.createContainer(containerId, "", containerEl);
        });

        this.isMounted = true;

        this.htmlAdapter = htmlComponentAdapters.get(this.moduleIndex);
        this.htmlAdapter.callOnLoadHandler("name is " + this.name);

        return true;
    }

    private evalScripts(): void {
        let nativeScript = "";
        let prototypeScript = "";
        let classScript = "";

        let initialScriptElements = new Array<HTMLScriptElement>();

        this.wrapperElement.querySelectorAll("script").forEach((element: HTMLScriptElement) => {
            const scopeMode: string = element.dataset["scopeMode"];
            if (!scopeMode || scopeMode === "native") {
                nativeScript += element.textContent;
            } else if (scopeMode === "prototype")  {
                prototypeScript += element.textContent;
            } else if (scopeMode === "class") {
                classScript += element.textContent;
            }
            initialScriptElements.push(element);
        })

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
}