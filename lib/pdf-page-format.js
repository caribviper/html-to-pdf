"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_header_footer_1 = require("./pdf-header-footer");
const pdf_document_margins_1 = require("./pdf-document-margins");
class PdfPageFormat {
    constructor() {
        this.format = 'Letter';
        this.landscape = false;
        this.preferCSSPageSize = false;
        this.margins = new pdf_document_margins_1.PdfDocumentMargins();
        this.displayHeaderFooter = false;
        this.hasCoverPage = false;
        this.headerTemplate = new pdf_header_footer_1.PdfBaseHeaderFooterTemplate();
        this.footerTemplate = new pdf_header_footer_1.PdfBaseHeaderFooterTemplate();
    }
    getOptions(cover = pdf_header_footer_1.PDF_COVER_OPTIONS_VALUES.NO_COVER) {
        if (this.displayHeaderFooter) {
            if (!this.margins.top)
                this.margins.top = '10px';
            if (!this.margins.bottom)
                this.margins.bottom = '10px';
        }
        return {
            format: this.format,
            landscape: this.landscape,
            displayHeaderFooter: this.displayHeaderFooter,
            preferCSSPageSize: this.preferCSSPageSize,
            headerTemplate: (cover === pdf_header_footer_1.PDF_COVER_OPTIONS_VALUES.COVER || cover === pdf_header_footer_1.PDF_COVER_OPTIONS_VALUES.COVER_WITH_ALL) ? this.headerTemplate.templateCoverPage : this.headerTemplate.template,
            footerTemplate: (cover === pdf_header_footer_1.PDF_COVER_OPTIONS_VALUES.COVER || cover === pdf_header_footer_1.PDF_COVER_OPTIONS_VALUES.COVER_WITH_ALL) ? this.footerTemplate.templateCoverPage : this.footerTemplate.template,
            margin: this.margins,
            pageRanges: (cover === pdf_header_footer_1.PDF_COVER_OPTIONS_VALUES.COVER) ? '1' : (cover === pdf_header_footer_1.PDF_COVER_OPTIONS_VALUES.SECOND_NO_COVER) ? '2-' : '',
            printBackground: true
        };
    }
}
exports.PdfPageFormat = PdfPageFormat;
