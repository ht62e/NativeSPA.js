export default interface Part {
    load(): void;
    initialize(): void;
    onShow(): void;
    close(): void;

}