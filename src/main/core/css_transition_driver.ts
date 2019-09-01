export interface CssTransitionDriverClasses {
    standyStateClass?: string;
    enterTransitionClass?: string;
    leaveTransitionClass?: string;
    endStateClass?: string;
}

export default class CssTransitionDriver {
    private target: HTMLElement;
    private standyStateClass: string = "standy_state";
    private enterTransitionClass: string = "enter_transition";
    private leaveTransitionClass: string = "leave_transition";
    private endStateClass: string = "end_state";

    private showResolver: (value?: boolean | PromiseLike<boolean>) => void = null;
    private hideResolver: (value?: boolean | PromiseLike<boolean>) => void = null;
    
    constructor(target: HTMLElement, customClasses?: CssTransitionDriverClasses) {
        this.target = target;
        this.setCustomTransitionClasses(customClasses);
        
        this.target.addEventListener("transitionend", (event: AnimationEvent) => {
            if (this.hideResolver) {
                this.target.style.display = "none";
                if (this.standyStateClass) {
                    this.target.classList.add(this.standyStateClass);
                }
                if (this.leaveTransitionClass) {
                    this.target.classList.remove(this.leaveTransitionClass)
                }
                if (this.endStateClass) {
                    this.target.classList.remove(this.endStateClass)
                }

                this.hideResolver(true);
                this.hideResolver = null;
            }
            if (this.showResolver) {
                this.showResolver(true);
                this.showResolver = null;
            }
        })
    }

    public setCustomTransitionClasses(classes: CssTransitionDriverClasses): void {
        if (classes) {
            if (classes.standyStateClass !== undefined) this.standyStateClass = classes.standyStateClass;
            if (classes.enterTransitionClass !== undefined) this.enterTransitionClass = classes.enterTransitionClass;
            if (classes.leaveTransitionClass !== undefined) this.leaveTransitionClass = classes.leaveTransitionClass;
            if (classes.endStateClass !== undefined) this.endStateClass = classes.endStateClass;
        }

        if (this.target.style.display === "none") {
            this.target.classList.add(this.standyStateClass);
        }
    }

    public async show(): Promise<boolean> {
        if (this.hideResolver) {
            //クローズアニメーション中に再表示した場合においても、hide呼び出し元は閉じたことを通知する
            this.hideResolver(true);
            this.hideResolver = null;
        }
        this.toggleClasses(true);

        if (this.enterTransitionClass) {
            return new Promise(resolve => {
                this.showResolver = resolve;
            });
        } else {
            return Promise.resolve(true);
        }
    }

    public async hide(): Promise<boolean> {
        if (this.showResolver) {
            this.showResolver(true);
            this.showResolver = null;
        }
        this.toggleClasses(false);

        if (this.leaveTransitionClass) {
            return new Promise(resolve => {
                this.hideResolver = resolve;
            });
        } else {
            return Promise.resolve(true);
        }
    }

    private toggleClasses(visible: boolean): void {
        if (visible) {
            this.target.style.display = "";

            window.setTimeout(() => {
                this.target.style.pointerEvents = "";
                if (this.enterTransitionClass) {
                    this.target.classList.add(this.enterTransitionClass);
                }
                if (this.standyStateClass) {
                    this.target.classList.remove(this.standyStateClass);
                }
                if (this.leaveTransitionClass) {
                    this.target.classList.remove(this.leaveTransitionClass);
                }
                if (this.endStateClass) {
                    this.target.classList.remove(this.endStateClass);
                }  

            }, 0);
        } else {
            this.target.style.pointerEvents = "none";
            if (this.standyStateClass) {
                this.target.classList.remove(this.standyStateClass);
            }
            if (this.enterTransitionClass) {
                this.target.classList.remove(this.enterTransitionClass);
            }
            if (this.leaveTransitionClass) {
                this.target.classList.add(this.leaveTransitionClass);
            } else {
                this.target.style.display = "none";
            }
            if (this.endStateClass) {
                this.target.classList.add(this.endStateClass);
            }

        }
    }
}

