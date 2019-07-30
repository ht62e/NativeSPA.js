import Container from "./container";
import Overlay from "./overlay";

export default class Window extends Overlay {
    private headerEl: HTMLDivElement;
    private contentsEl: HTMLDivElement;
    private footerEl: HTMLDivElement;

    private contaner: Container;

    public setPosition(x: number, y: number): void {
        throw new Error("Method not implemented.");
    }
    public show(x?: number, y?: number): void {
        throw new Error("Method not implemented.");
    }
    public hide(): void {
        throw new Error("Method not implemented.");
    }
}