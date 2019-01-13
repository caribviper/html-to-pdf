import { PdfDocumentStyle } from "./pdf-document-style";
import { PdfPageFormat } from "./pdf-page-format";


/**
 * Stores the settings necessary to render a pdf
 */
export class PdfDocumentSettings {
    /**
     * Creates a new PdfDocumentSettings
     * @param styles Document styles to be used
     * @param pageFormat PdfPageFormat with page settings
     * @param content Html content within the template
     */
    constructor(public styles: PdfDocumentStyle[], public pageFormat: PdfPageFormat, public content: string = '') { }
}