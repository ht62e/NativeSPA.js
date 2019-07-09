export default class SourceRepository {
    private static instance: SourceRepository  = new SourceRepository();

    private cache: Map<string, string>

    constructor () {
        this.cache = new Map<string, string>();
    }

    public static getInstance(): SourceRepository {
        return SourceRepository.instance;
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
                        const isLocalAccessSuccess = 
                            (httpRequest.responseURL.indexOf("file:///") > -1) && httpRequest.responseText !== null;
                        
                        if (httpRequest.status === 200 || isLocalAccessSuccess) {
                            const res = httpRequest.responseText;
                            this.cache.set(sourceUri, res);
                            resolve(res);
                        } else {
                            reject(httpRequest.statusText);
                        }
                    }
                }
    
                httpRequest.open("POST", sourceUri + "?ver=" + Date.now().toString(), true);
                httpRequest.send(null);                
            });

        }
        
    }

}

interface PromiseResponseInterface {
    resolve: (value?: string | PromiseLike<string>) => void,
    reject: (value?: string | PromiseLike<string>) => void
}