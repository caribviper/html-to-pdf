import { PdfDocumentStyle } from "./pdf-document-style";
import { PdfPageFormat } from "./pdf-page-format";
export declare class PdfDocumentSettings {
    styles: PdfDocumentStyle[];
    pageFormat: PdfPageFormat;
    content: string;
    constructor(styles: PdfDocumentStyle[], pageFormat: PdfPageFormat, content?: string);
}
