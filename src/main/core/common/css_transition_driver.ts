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
        
        this.target.addEventListener("transitionend", this.onTransitionEnd.bind(this))
    }

    protected onTransitionEnd(event: AnimationEvent) {
        if (this.hideResolver) {
            this.setStandbyStateClasses();

            this.hideResolver(true);
            this.hideResolver = null;
        }
        if (this.showResolver) {
            this.showResolver(true);
            this.showResolver = null;
        }        
    }

    public setCustomTransitionClasses(classes: CssTransitionDriverClasses): void {
        if (classes) {
            if (classes.standyStateClass !== undefined) this.standyStateClass = classes.standyStateClass;
            if (classes.enterTransitionClass !== undefined) this.enterTransitionClass = classes.enterTransitionClass;
            if (classes.leaveTransitionClass !== undefined) this.leaveTransitionClass = classes.leaveTransitionClass;
            if (classes.endStateClass !== undefined) this.endStateClass = classes.endStateClass;
        }

        if (this.target.style.display === "none" || this.target.style.visibility === "hidden") {
            this.target.classList.add(this.standyStateClass);
        }
    }

    public async show(withoutTransition?: boolean): Promise<boolean> {
        if (this.hideResolver) {
            //クローズアニメーション中に再表示した場合においても、hide呼び出し元は閉じたことを通知する
            this.hideResolver(true);
            this.hideResolver = null;
        }
        
        const transitionIsUsed = this.toggleClasses(true, withoutTransition);

        if (transitionIsUsed) {
            return new Promise(resolve => {
                this.showResolver = resolve;
            });
        } else {
            return Promise.resolve(true);
        }
    }

    public async hide(withoutTransition?: boolean): Promise<boolean> {
        if (this.target.style.display === "none" || this.target.style.visibility === "hidden") return;

        if (this.showResolver) {
            this.showResolver(true);
            this.showResolver = null;
        }

        const transitionIsUsed = this.toggleClasses(false, withoutTransition);

        if (transitionIsUsed) {
            return new Promise(resolve => {
                this.hideResolver = resolve;
            });
        } else {
            this.setStandbyStateClasses();
            return Promise.resolve(true);
        }
    }

    protected toggleClasses(visible: boolean, withoutTransition?: boolean): boolean {
        let transitionIsUsed: boolean = true;

        const _t = this.target;

        if (visible) {
            _t.style.display = "";
            _t.style.visibility = ""; //初回表示まではvisibility:hiddenで非表示状態になっている

            window.setTimeout(() => {
                _t.style.pointerEvents = "";
                if (this.enterTransitionClass && !withoutTransition) {
                    _t.classList.add(this.enterTransitionClass);
                } else {
                    transitionIsUsed = false;
                }
                if (this.standyStateClass) {
                    _t.classList.remove(this.standyStateClass);
                }
                if (this.leaveTransitionClass) {
                    _t.classList.remove(this.leaveTransitionClass);
                }
                if (this.endStateClass) {
                    _t.classList.remove(this.endStateClass);
                }  

            }, 0);
        } else {
            _t.style.pointerEvents = "none";
            if (this.standyStateClass) {
                _t.classList.remove(this.standyStateClass);
            }
            if (this.enterTransitionClass) {
                _t.classList.remove(this.enterTransitionClass);
            }
            if (this.leaveTransitionClass && !withoutTransition) {
                _t.classList.add(this.leaveTransitionClass);
            } else {
                _t.style.display = "none";
                transitionIsUsed = false;
            }
            if (this.endStateClass) {
                _t.classList.add(this.endStateClass);
            }
        }

        return transitionIsUsed;
    }

    protected setStandbyStateClasses(): void {
        const _t = this.target;
        _t.style.display = "none";

        if (this.standyStateClass) {
            _t.classList.add(this.standyStateClass);
        }
        if (this.leaveTransitionClass) {
            _t.classList.remove(this.leaveTransitionClass)
        }
        if (this.endStateClass) {
            _t.classList.remove(this.endStateClass)
        }
    }
}

