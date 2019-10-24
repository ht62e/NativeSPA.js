export default class SharedCssScriptLoader {
    private cssUris: Array<string> = [];
    private scriptUris: Array<string> = [];
    private loadFinishResolver: (value?: void | PromiseLike<void>) => void = null;

    private currentCssLoadIndex: number = 0;
    private currentScriptLoadIndex: number = 0;
    private cssLoadIsComplete: boolean = false;
    private scriptLoadIsComplete: boolean = false;
    
    private loadedCss: Set<string> = new Set<string>();
    private loadedScript: Set<string> = new Set<string>();

    constructor(cssUris: Array<string>, scriptUris: Array<string>) {
        this.cssUris = cssUris;
        this.scriptUris = scriptUris;        
    }

    public async load(): Promise<void> {
        return new Promise(resolve => {
            this.loadFinishResolver = resolve;
            this.loadCss();
            this.loadScript();
        });
    }

    private onCompleteHandler(): void {
        if (this.cssLoadIsComplete && this.scriptLoadIsComplete) {
            this.loadFinishResolver();
        }
    }

    private loadCss(): void {
        const targetUri = this.cssUris[this.currentCssLoadIndex];
        const skip = this.loadedCss.has(targetUri) || this.cssUris.length === 0;
        let element: HTMLLinkElement;

        if (!skip) {
            const head = document.getElementsByTagName('head')[0];
            element = document.createElement("link");
            element.rel = "stylesheet";
            element.type = "text/css";
            element.href = targetUri + "?ver=" + new Date().getTime();
            head.insertBefore(element, head.firstChild);
            this.loadedScript.add(targetUri);
        }
        if (++this.currentCssLoadIndex < this.cssUris.length) {
            if (!skip) {
                element.onload = this.loadCss.bind(this);
            } else {
                this.loadCss();
            }
        } else {
            if (!skip) {
                element.onload = () => {
                    this.cssLoadIsComplete = true;
                    this.onCompleteHandler();
                }
            } else {
                this.cssLoadIsComplete = true;
                this.onCompleteHandler();
            }
        }        
    }

    private loadScript(): void {
        const targetUri = this.scriptUris[this.currentScriptLoadIndex];
        const skip = this.loadedScript.has(targetUri) || this.scriptUris.length === 0;
        let element: HTMLScriptElement;

        if (!skip) {
            element = document.createElement("script");
            element.src = targetUri + "?ver=" + new Date().getTime();
            document.body.appendChild(element);
            this.loadedScript.add(targetUri);
        }
        if (++this.currentScriptLoadIndex < this.scriptUris.length) {
            if (!skip) {
                element.onload = this.loadScript.bind(this);
            } else {
                this.loadScript();
            }
        } else {
            if (!skip) {
                element.onload = () => {
                    this.scriptLoadIsComplete = true;
                    this.onCompleteHandler();
                }
            } else {
                this.scriptLoadIsComplete = true;
                this.onCompleteHandler();
            }
        }
    }

}