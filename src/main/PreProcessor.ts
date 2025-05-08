export default class PreProcessor {
    public static process(splittedLines: string[]): string[] {
        const define = /#define[\t ]+(\w+)/;
        const ifdef = /#ifdef[\t ]+(\w+)/;
        const elif = /#elif[\t ]+defined\((\w+)\)/;
        const _else = /#else/;
        const endif = /#endif/;
        const outputHistory: boolean[] = [];
        let outputFlg = true;
        const definitions: string[] = [];
        const ifdefs: string[][] = [];
        const outputLines: string[] = [];

        for (let i = 0; i < splittedLines.length; i++) {
            const line = splittedLines[i];
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
                    ifdefs.push([toCheckDef]);
                    if (definitions.indexOf(toCheckDef) === -1) {
                        outputFlg = false;
                    }
                    isPragma = true;
                }
            }

            if (outputHistory.indexOf(false) === -1) { // #elif
                const re = line.match(elif);
                if (re != null) {
                    const toCheckDef = re[1];
                    const currentIfdefs = ifdefs[ifdefs.length - 1];
                    let notFound = true;
                    for (const currentIfdef of currentIfdefs) {
                        if (definitions.indexOf(currentIfdef) !== -1) {
                            notFound = false;
                        }
                    }
                    if (notFound && definitions.indexOf(toCheckDef) !== -1) {
                        outputFlg = true;
                    } else {
                        outputFlg = false;
                    }
                    currentIfdefs.push(toCheckDef);
                    isPragma = true;
                }
            }

            if (outputHistory.indexOf(false) === -1) { // #else
                const re = line.match(_else);
                if (re != null) {
                    const currentIfdefs = ifdefs[ifdefs.length - 1];
                    let outputFlgInner = true;
                    for (const currentIfdef of currentIfdefs) {
                        if (definitions.indexOf(currentIfdef) !== -1) {
                            outputFlgInner = false;
                        }
                    }
                    outputFlg = outputFlgInner;
                    isPragma = true;
                }
            }

            { // #endif
                const re = line.match(endif);
                if (re != null) {
                    if (outputHistory.indexOf(false) === -1) {
                        outputFlg = true;
                    }
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

