export default abstract class Overlay {
    private contentElement: HTMLDivElement;

    constructor(viewPortElement: HTMLDivElement, width: number, height: number) {
        this.contentElement = document.createElement("div");
        this.contentElement.style.position = "absolute";
        this.contentElement.style.width = String(width) + "px";
        this.contentElement.style.height = String(height) + "px";
        this.contentElement.style.display = "none";

        viewPortElement.appendChild(this.contentElement);
    }

    public abstract setPosition(x: number, y: number): void;
    
    public abstract show(x?: number, y?: number): void;
    public abstract hide(): void;

}