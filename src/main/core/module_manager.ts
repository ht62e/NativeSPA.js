import ModuleDescription from "./module_description";

export default class ModuleManager {
    private resources: Map<string, ModuleDescription>;

    constructor () {
        this.resources = new Map<string, ModuleDescription>();
    }

    public registerModule(
        name: string, 
        sourceUri: string, 

        instanceName: string) {

    }
}