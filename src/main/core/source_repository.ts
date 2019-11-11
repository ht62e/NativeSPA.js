export default class SourceRepository {
    private static instance: SourceRepository  = new SourceRepository();

    private version: string = "";
    private cache: Map<string, string>
    private msIeMode: boolean = false;

    constructor() {
        this.cache = new Map<string, string>();
        let userAgent = window.navigator.userAgent.toLowerCase();

        if (userAgent.indexOf("msie") != -1 || userAgent.indexOf("trident") != -1) {
            this.msIeMode = true;
        }
    }

    public static getInstance(): SourceRepository {
        return SourceRepository.instance;
    }

    public setSourceVersion(version: string) {
        this.version = version;
    }
    
    public async preload(sourceUri: string): Promise<boolean> {
        await this.fetch(sourceUri);
        return true;
    }

    public async fetch(sourceUri: string, noCache: boolean = false): Promise<string> {
        if (!noCache && this.cache.has(sourceUri)) {
            return this.cache.get(sourceUri);   
        } else {
            return new Promise((resolve, reject) => {
                const httpRequest = new XMLHttpRequest();

                httpRequest.onreadystatechange = () => {
                    if (httpRequest.readyState === 4) {
                        let isLocalAccessSuccess = false;
                        if (!this.msIeMode) {
                            isLocalAccessSuccess = 
                                (httpRequest.responseURL.indexOf("file:///") > -1) && httpRequest.responseText !== null;
                        }

                        if (httpRequest.status === 200 || isLocalAccessSuccess) {
                            const res = httpRequest.responseText;
                            this.cache.set(sourceUri, res);
                            resolve(res);
                        } else {
                            reject(httpRequest.statusText);
                        }
                    }
                }

                let versionQuery: string;
                if (this.version === "" || this.version.toLocaleLowerCase() === "debug") {
                    versionQuery = Date.now().toString();
                } else {
                    versionQuery = this.version;
                }
    
                httpRequest.open("GET", sourceUri + "?ver=" + versionQuery, true);
                httpRequest.send(null);                
            });

        }
        
    }

}
