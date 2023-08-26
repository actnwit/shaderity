export default class PreProcessor {
    public static process(splittedLines: string[]): string[] {
        const define = /#define[\t ]+(\w+)/;
        const ifdef = /#ifdef[\t ]+(\w+)/;
        const outputHistory: boolean[] = [];
        let outputFlg = true;
        const _else = /#else/;
        const endif = /#endif/;
        const definitions: string[] = [];
        const ifdefs: string[] = [];
        const outputLines: string[] = [];

        for (const line of splittedLines) {
            let isPragma = false;
            { // #define
                const re = line.match(define);
                if (re != null) {
                    definitions.push(re[1]);
                    isPragma = true;
                }
            }

            if (outputHistory.indexOf(false) === -1) { // #ifdef
                const re = line.match(ifdef);
                if (re != null) {
                    outputHistory.push(outputFlg);
                    const toCheckDef = re[1];
                    ifdefs.push(toCheckDef);
                    if (definitions.indexOf(toCheckDef) === -1) {
                        outputFlg = false;
                    }
                    isPragma = true;
                }
            }

            if (outputHistory.indexOf(false) === -1) {
                const re = line.match(_else);
                if (re != null) {
                    const currentIfdef = ifdefs[ifdefs.length - 1];
                    if (definitions.indexOf(currentIfdef) === -1) {
                        outputFlg = true;
                    } else {
                        outputFlg = false;
                    }
                    isPragma = true;
                }
            }

            { // #endif
                const re = line.match(endif);
                if (re != null) {
                    outputFlg = true;
                    isPragma = true;
                    ifdefs.pop();
                    outputHistory.pop();
                }
            }

            if (outputFlg && !isPragma) {
                outputLines.push(line);
            }
        }
        return outputLines;
    }
}

