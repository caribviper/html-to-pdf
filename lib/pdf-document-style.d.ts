export declare class PdfDocumentStyle {
    url: string;
    content: string;
    path: string;
    static createSingleUrl(url: string): PdfDocumentStyle;
    static createSingleContent(content: string): PdfDocumentStyle;
    static createSinglePath(path: string): PdfDocumentStyle;
    static createUrls(...urls: string[]): PdfDocumentStyle[];
    static createContents(...contents: string[]): PdfDocumentStyle[];
    static createPaths(...paths: string[]): PdfDocumentStyle[];
}
