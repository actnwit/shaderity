export default class Utility {
	static _splitByLineFeedCode(source: string) {
		return source.split(/\r\n|\n/);
	}

	static _joinSplittedLine(splittedLine: string[]) {
		return splittedLine.join('\n');
	}

	static _addLineFeedCodeIfNotNullString(source: string) {
		return source === '' ? source : source + '\n';
	}
}
