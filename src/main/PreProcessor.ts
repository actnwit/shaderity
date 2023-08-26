export default class PreProcessor {
    public static process(splittedLines: string[]): string[] {
        const define = /#define[\t ]+(\w+)/;
        let ignoreFlg = false;
        const ifdef = /#ifdef[\t ]+(\w+)/;
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

            { // #ifdef
                const re = line.match(ifdef);
                if (re != null) {
                    const toCheckDef = re[1];
                    ifdefs.push(toCheckDef);
                    if (definitions.indexOf(toCheckDef) === -1) {
                        ignoreFlg = true;
                    }
                    isPragma = true;
                }
            }

            {
                const re = line.match(_else);
                if (re != null) {
                    const currentIfdef = ifdefs[ifdefs.length - 1];
                    if (definitions.indexOf(currentIfdef) === -1) {
                        ignoreFlg = false;
                    } else {
                        ignoreFlg = true;
                    }
                    isPragma = true;
                }
            }

            { // #endif
                const re = line.match(endif);
                if (re != null) {
                    ignoreFlg = false;
                    isPragma = true;
                    ifdefs.pop();
                }
            }

            if (!ignoreFlg && !isPragma) {
                outputLines.push(line);
            }
        }
        return outputLines;
    }
}

