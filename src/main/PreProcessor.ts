export default class PreProcessor {
    private static definitions: Map<string, string> = new Map();

    private static evaluateCondition(condition: string): boolean {
        // 数値比較の正規表現
        const numericComparison = /(\w+)\s*(==|!=|>|<|>=|<=)\s*(\d+)/g;
        // defined()チェックの正規表現
        const definedCheck = /defined\s*\(\s*(\w+)\s*\)/g;
        // !defined()チェックの正規表現
        const notDefinedCheck = /!\s*defined\s*\(\s*(\w+)\s*\)/g;

        // 条件式を評価可能な形式に変換
        let evaluatableCondition = condition;

        // defined()の評価
        evaluatableCondition = evaluatableCondition.replace(definedCheck, (_, name) => {
            return this.definitions.has(name) ? 'true' : 'false';
        });

        // !defined()の評価
        evaluatableCondition = evaluatableCondition.replace(notDefinedCheck, (_, name) => {
            return this.definitions.has(name) ? 'false' : 'true';
        });

        // 数値比較の評価
        evaluatableCondition = evaluatableCondition.replace(numericComparison, (match, varName, operator, valueStr) => {
            const definedValue = this.definitions.get(varName);
            if (definedValue === undefined) return 'false';

            const value1 = parseInt(definedValue);
            const value2 = parseInt(valueStr);

            switch (operator) {
                case '==': return value1 === value2 ? 'true' : 'false';
                case '!=': return value1 !== value2 ? 'true' : 'false';
                case '>': return value1 > value2 ? 'true' : 'false';
                case '<': return value1 < value2 ? 'true' : 'false';
                case '>=': return value1 >= value2 ? 'true' : 'false';
                case '<=': return value1 <= value2 ? 'true' : 'false';
                default: return 'false';
            }
        });

        // 論理演算子の評価
        try {
            // 安全な評価のため、条件式を検証
            if (!/^[a-zA-Z0-9\s\(\)!&|]+$/.test(evaluatableCondition)) {
                throw new Error('Invalid condition');
            }

            // 論理演算子の前後にスペースを追加
            evaluatableCondition = evaluatableCondition
                .replace(/&&/g, ' && ')
                .replace(/\|\|/g, ' || ')
                .replace(/!/g, ' ! ')
                .replace(/\s+/g, ' ')
                .trim();

            // JavaScriptの論理式として評価
            return Function(`return ${evaluatableCondition}`)();
        } catch (error) {
            console.error('Error evaluating condition:', error);
            return false;
        }
    }

    public static process(splittedLines: string[], startLineStr?: string, endLineStr?: string): string[] {
        const define = /#define[\t ]+(\w+)(?:[\t ]+(\S+))?/;
        const ifdef = /#ifdef[\t ]+(\w+)/;
        const ifndef = /#ifndef[\t ]+(\w+)/;
        const _if = /#if[\t ]+(.+)/;
        const elif = /#elif[\t ]+(.+)/;
        const _else = /#else/;
        const endif = /#endif/;
        const previousOutputStates: boolean[] = [];
        let outputFlg = true;
        const ifdefs: string[][] = [];
        const ifdefMatched: boolean[] = [];
        const outputLines: string[] = [];

        this.definitions.clear();

        let startLine = 0;
        let endLine = splittedLines.length;
        if (startLineStr) {
            startLine = splittedLines.findIndex(line => line.includes(startLineStr));
        }
        if (endLineStr) {
            endLine = splittedLines.findIndex(line => line.includes(endLineStr));
        }
        for (let i = startLine; i < endLine; i++) {
            const line = splittedLines[i];
            let isPragma = false;

            { // #define
                const re = line.match(define);
                if (re != null) {
                    const [_, name, value = "1"] = re;
                    this.definitions.set(name, value);
                    isPragma = true;
                }
            }

            { // #ifdef, #ifndef, #if
                const reIfdef = line.match(ifdef);
                const reIfndef = line.match(ifndef);
                const reIf = line.match(_if);

                if (reIfdef || reIfndef || reIf) {
                    previousOutputStates.push(outputFlg);
                    let condition = '';
                    
                    if (reIfdef) {
                        condition = `defined(${reIfdef[1]})`;
                    } else if (reIfndef) {
                        condition = `!defined(${reIfndef[1]})`;
                    } else if (reIf) {
                        condition = reIf[1];
                    }

                    ifdefs.push([condition]);
                    
                    if (outputFlg) {
                        outputFlg = this.evaluateCondition(condition);
                        ifdefMatched.push(outputFlg);
                    } else {
                        ifdefMatched.push(false);
                    }
                    isPragma = true;
                }
            }

            { // #elif
                const re = line.match(elif);
                if (re != null) {
                    const condition = re[1];
                    const currentIfdefs = ifdefs[ifdefs.length - 1];
                    
                    if (previousOutputStates[previousOutputStates.length - 1] && !ifdefMatched[ifdefMatched.length - 1]) {
                        outputFlg = this.evaluateCondition(condition);
                        if (outputFlg) {
                            ifdefMatched[ifdefMatched.length - 1] = true;
                        }
                    } else {
                        outputFlg = false;
                    }
                    currentIfdefs.push(condition);
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

