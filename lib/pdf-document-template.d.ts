/// <reference types="node" />
import { PdfDocumentStyle } from './pdf-document-style';
import { PdfPageFormat } from './pdf-page-format';
export declare class PdfDocumentTemplate {
    content: string;
    pageFormat: PdfPageFormat;
    documentStyles: PdfDocumentStyle[];
    constructor(content: string, pageFormat?: PdfPageFormat, ...documentStyles: PdfDocumentStyle[]);
    createPdf(): Promise<Buffer | boolean>;
    createPdfFromTemplate(template: string): Promise<Buffer | boolean>;
    private parseHtml;
    private getSetting;
    private renderPage;
    private getPageCounter;
    private merge;
}
