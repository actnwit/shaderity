export default class PreProcessor {
    public static process(splittedLines: string[]): string[] {
        const define = /#define[\t ]+(\w+)/;
        const ifdef = /#ifdef[\t ]+(\w+)/;
        const elif = /#elif[\t ]+defined\((\w+)\)/;
        const _else = /#else/;
        const endif = /#endif/;
        const outputHistory: boolean[] = [];
        const previousOutputStates: boolean[] = [];
        let outputFlg = true;
        const definitions: string[] = [];
        const ifdefs: string[][] = [];
        const ifdefMatched: boolean[] = [];
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

            { // #ifdef
                const re = line.match(ifdef);
                if (re != null) {
                    previousOutputStates.push(outputFlg);
                    outputHistory.push(outputFlg);
                    const toCheckDef = re[1];
                    ifdefs.push([toCheckDef]);
                    
                    if (outputFlg) {
                        if (definitions.indexOf(toCheckDef) === -1) {
                            outputFlg = false;
                            ifdefMatched.push(false);
                        } else {
                            ifdefMatched.push(true);
                        }
                    } else {
                        ifdefMatched.push(false);
                    }
                    isPragma = true;
                }
            }

            { // #elif
                const re = line.match(elif);
                if (re != null) {
                    const toCheckDef = re[1];
                    const currentIfdefs = ifdefs[ifdefs.length - 1];
                    
                    if (previousOutputStates[previousOutputStates.length - 1] && !ifdefMatched[ifdefMatched.length - 1]) {
                        if (definitions.indexOf(toCheckDef) !== -1) {
                            outputFlg = true;
                            ifdefMatched[ifdefMatched.length - 1] = true;
                        } else {
                            outputFlg = false;
                        }
                    } else {
                        outputFlg = false;
                    }
                    currentIfdefs.push(toCheckDef);
                    isPragma = true;
                }
            }

            { // #else
                const re = line.match(_else);
                if (re != null) {
                    if (previousOutputStates[previousOutputStates.length - 1]) {
                        outputFlg = !ifdefMatched[ifdefMatched.length - 1];
                    } else {
                        outputFlg = false;
                    }
                    isPragma = true;
                }
            }

            { // #endif
                const re = line.match(endif);
                if (re != null) {
                    outputFlg = previousOutputStates[previousOutputStates.length - 1];
                    isPragma = true;
                    ifdefs.pop();
                    ifdefMatched.pop();
                    outputHistory.pop();
                    previousOutputStates.pop();
                }
            }

            if (outputFlg && !isPragma) {
                outputLines.push(line);
            }
        }
        return outputLines;
    }
}

