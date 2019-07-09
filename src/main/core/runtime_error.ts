export default class RuntimeError extends Error {
    constructor(public message: string) {
        super();
    }
}