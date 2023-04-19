export interface Pattern {
    type: string;
    pattern: RegExp;
    parse: (match: RegExpExecArray | RegExpMatchArray) => Token | void;
}
export interface Token {
    type: string;
    text: string;
    data?: Record<string, string>;
}
