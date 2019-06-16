import Resource from "./resource";

export default class ResourcePool {
    private resources: Map<string, Resource>;

    constructor () {
        this.resources = new Map<string, Resource>();
    }

    public addResource(lookupName: string, sourceUri: string) {
        
    }
}