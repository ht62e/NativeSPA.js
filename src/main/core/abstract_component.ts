import AbstractContainer from "./abstract_container";
import Module from "./module";
import SourceRepository from "./source_repository";
import ContainerManager from "./container_manager";

export default abstract class Component implements Module {
    private isFetched: boolean = false;
    private isMounted: boolean = false;
    private source: string;
    private wrapperElement: HTMLDivElement;
    private currentContainer: AbstractContainer;
    private subContainerInfos = new Map<string, ContainerInfo>();

    constructor(private name: string, private sourceUri: string, private moduleIndex: number) {

    }

    async fetch(): Promise<boolean> {
        const repository = SourceRepository.getInstance();
        this.source = await repository.fetch(this.sourceUri);
        
        const regExp = /<div *id *= *["'](.+)["'] *.*data-container-name *= *["'](.+)["'].*>/g;

        let match: RegExpExecArray;
        while (match = regExp.exec(this.source)) {
            this.subContainerInfos.set(match[1], {
                name: match[2],
                container: null
            });
        }

        this.isFetched = true;
        return null;
    }

    async mount(container: AbstractContainer): Promise<boolean> {
        //NOTE このメソッドはAbstractContainerのaddModule内からコールされる

        if (!this.isFetched) await this.fetch();

        const toLocalPrefix = (index: number): string => {
            return "_" + this.moduleIndex.toString() + "_";
        }

        this.currentContainer = container;

        //ソースに対してテンプレート処理
        const localizeRegExp = /_LS_/g;
        this.source = this.source.replace(localizeRegExp, toLocalPrefix(this.moduleIndex));

        //引数で与えられたコンテナDOMに対して自身をロード
        this.wrapperElement = document.createElement("div");
        this.wrapperElement.innerHTML = this.source;
        container.addModuleElement(this.wrapperElement);

        //TODO scriptタグをevalで実行
        this.evalScripts();

        //サブコンテナをContainerManagerで生成・登録
        const containerManager = ContainerManager.getInstance();
        this.subContainerInfos.forEach((containerInfo: ContainerInfo, domId: string) => {
            let localElementId = domId.replace(localizeRegExp, toLocalPrefix(this.moduleIndex));
            let containerEl: HTMLDivElement = document.getElementById(localElementId) as HTMLDivElement;
            let containerId: string = this.name + "." + containerInfo.name;
            containerInfo.container = containerManager.createContainer(containerId, "", containerEl);
        });

        this.isMounted = true;

        return true;
    }

    private evalScripts(): void {
        let autoInheritScript = "";
        let nativeScript = "";

        this.wrapperElement.querySelectorAll("script").forEach((element: HTMLScriptElement) => {
            if (element.dataset["scopeMode"] === "true") {
                autoInheritScript += element.textContent;
            } else {
                nativeScript += element.textContent;
            }
        })

        const tempElement = document.createElement("script");
        tempElement.textContent = autoInheritScript;
        this.wrapperElement.appendChild(tempElement);
        this.wrapperElement.removeChild(tempElement);

        const tempElement2 = document.createElement("script");
        tempElement2.textContent = nativeScript;
        this.wrapperElement.appendChild(tempElement2);
        this.wrapperElement.removeChild(tempElement2);


        // this.wrapperElement.querySelectorAll("script").forEach((element: HTMLScriptElement) => {
        //     const tempElement = document.createElement("script");
        //     tempElement.textContent = element.textContent;
            
        //     this.wrapperElement.appendChild(tempElement);
        //     this.wrapperElement.removeChild(tempElement);

        //     console.log(element.dataset["autoInherit"]);
        // })
    }

    async initialize(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    show(): void {
        throw new Error("Method not implemented.");
    }
    close(): void {
        throw new Error("Method not implemented.");
    }
    getScopeId(): number {
        throw new Error("Method not implemented.");
    }

    getElement(): HTMLDivElement {
        throw this.wrapperElement;
    }

    getCurrentContainer(): AbstractContainer {
        return this.currentContainer;
    }

    getSubContainerNames(): Array<string> {
        let ary = new Array<string>();
        this.subContainerInfos.forEach((c: ContainerInfo) => {
            ary.push(c.name);
        });
        return ary;
    }

    getName(): string {
        return this.name;
    }

}

interface ContainerInfo {
    name: string;
    container: AbstractContainer;
}