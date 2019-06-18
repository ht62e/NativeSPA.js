export default class SourceRepository {
    private cache: Map<string, string>

    constructor () {
        this.cache = new Map<string, string>();
    }
    

    public async fetch(path: string) {

        return path + " is loaded.";
    }


}