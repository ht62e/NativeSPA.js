export default class Utils {
    public static extractOutermostHtmlTagBlocks(tagName: string, source: string): Array<string> {
        const startTagRegExp: RegExp = new RegExp("<" + tagName + "(|\s+.*?)", "g");
        const endTagRegExp: RegExp = new RegExp("<\/" + tagName + "(|\s+.*?)", "g");

        let startTagHeadIndexList = new Array<number>();
        let endTagTailIndexList = new Array<number>();

        let regAry: RegExpExecArray;
        
        while ((regAry = startTagRegExp.exec(source)) !== null) {
            startTagHeadIndexList.push(regAry.index);
        }

        while ((regAry = endTagRegExp.exec(source)) !== null) {
            endTagTailIndexList.push(regAry.index + regAry[0].length);
        }

        let blocks = new Array<string>();
        let startIndexStack = new Array<number>();
        let startListIndex = 0, endListIndex = 0;
        let maxIndex = Math.min(startTagHeadIndexList.length, endTagTailIndexList.length);

        while (endListIndex < maxIndex) {
            let canStack: boolean = startListIndex < maxIndex && endListIndex < maxIndex
                                    && startTagHeadIndexList[startListIndex] < endTagTailIndexList[endListIndex];
            if (canStack) {
                startIndexStack.push(startTagHeadIndexList[startListIndex]);
                ++startListIndex;
            } else {
                const startTagHeadIndex = startIndexStack.pop();
                if (startIndexStack.length === 0) {
                    blocks.push(source.slice(startTagHeadIndex, endTagTailIndexList[endListIndex] + 1));
                }
                ++endListIndex;                
            }

        }

        return blocks;
    }

    public static extractTag(tagBlock: string): string {
        let regAry: RegExpExecArray = /<.*?>/.exec(tagBlock);
        return regAry ? regAry[0] : "";
    }

    public static extractInnerHtml(tagBlock: string): string {
        const startIndex = tagBlock.indexOf(">") + 1;
        const endIndex = tagBlock.lastIndexOf("<");

        if (startIndex >= 0 && startIndex < endIndex) {
            return tagBlock.slice(startIndex, endIndex);
        } else {
            return "";
        }
    }

    public static extractTagAttributes(tagBlock: string): Map<string, string> {
        const attrValueRegExp: RegExp = /([\w\-]+)[\s]*=[\s]*"(.*?)"/g;
        const tag: string = this.extractTag(tagBlock);
        let regAry: RegExpExecArray;
        let attrs = new Map<string, string>();
        
        while ((regAry = attrValueRegExp.exec(tag)) !== null) {
            attrs.set(regAry[1], regAry[2]);
        }

        const attrOnlyRegExp: RegExp = /\s+([\w\-]+)[\s>]/g;
        while ((regAry = attrOnlyRegExp.exec(tag)) !== null) {
            attrs.set(regAry[1], undefined);
        }

        return attrs;
    }
}