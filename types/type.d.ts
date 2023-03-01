export interface Pattern {
    type: string;
    pattern: RegExp;
    parse: (match: RegExpExecArray | RegExpMatchArray) => Token;
}
export interface Token {
    type: string;
    text: string;
    data?: Record<string, string>;
}
