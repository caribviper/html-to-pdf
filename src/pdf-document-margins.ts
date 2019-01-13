
/**
 * Manages the document margins of a pdf document
 */
export class PdfDocumentMargins {
    /**
     * Creates a new PdfDocumentMargins object
     * @param top Margin from top page
     * @param bottom Margin from bottom page
     * @param left Margin from left of page
     * @param right Margin from right of page
     */
    constructor(public top: string = '', public bottom: string = '', public left: string = '', public right: string = '') { }
}