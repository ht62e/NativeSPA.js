import AbstractContainer from "./abstract_container";
import Module from "./module";
import SourceRepository from "./source_repository";

export default abstract class Component implements Module {
    private isFetched: boolean = false;
    private isMounted: boolean = false;
    private source: string;
    private contentHtml: string;
    private currentContainer: AbstractContainer;
    private subContainerNames = new Map<string, string>();
    private subContainers = new Map<string, AbstractContainer>();

    constructor(private name: string, private sourceUri: string) {
        // this.source = null;
        // const repository = SourceRepository.getInstance();
        // repository.fetch(this.sourceUri).then((res) => {
        //     this.source = res;
        //     if (this.waitingLoadMethodCall) {
        //         this.load(this.waitingLoadMethodCall);
        //         this.waitingLoadMethodCall = null;
        //     }
        // });
    }

    async fetch(): Promise<boolean> {
        const repository = SourceRepository.getInstance();
        this.source = await repository.fetch(this.sourceUri);
        
        const regExp = /<div *id *= *["'](.+)["'] *.*data-container-name *= *["'](.+)["'].*>/g;

        let match: RegExpExecArray;
        while (match = regExp.exec(this.source)) {
            this.subContainers.set(match[1], null);
            this.subContainerNames.set(match[1], match[2]);
        }

        this.isFetched = true;
        return null;
    }

    async mount(containerElement: HTMLDivElement): Promise<boolean> {
        //NOTE このメソッドはAbstractContainerのaddModule内からコールされる


        if (!this.isFetched) await this.fetch();

        //TODO サブコンテナをContainerManagerで生成・登録

        //TODO ここでテンプレート処理

        //TODO targetContainerのコンテナDOMを取得して自身（のDOMツリー）をロード

        //TODO scriptタグをevalで実行

        this.isMounted = true;

        return true;
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
    
    getContentHtml(): string {
        return this.contentHtml;
    }

    getCurrentContainer(): AbstractContainer {
        return this.currentContainer;
    }

    getSubContainerNames(): Array<string> {
        let ary = new Array<string>();
        this.subContainerNames.forEach((value: string) => {
            ary.push(value);
        });
        return ary;
    }

    getName(): string {
        return this.name;
    }

}