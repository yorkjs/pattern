import { Pattern, Token } from './type';
export declare function normalizeUrl(url: string): string;
export declare function createToken(match: RegExpExecArray | RegExpMatchArray, pattern: Pattern, data?: Record<string, string>): Token;
