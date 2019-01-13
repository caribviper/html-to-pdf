import * as puppeteer from 'puppeteer';
import { PDF_COVER_OPTIONS, PdfBaseHeaderFooterTemplate, PDF_COVER_OPTIONS_VALUES } from './pdf-header-footer';
import { PdfDocumentMargins } from './pdf-document-margins';


/**
 * Specifies the settings for each pdf page
 */
export class PdfPageFormat {
    /** Specifies the type of format of the document, e.g. Letter, A4 etc. */
    public format: puppeteer.PDFFormat = 'Letter';

    /** Indicates the orientation
     * true for landscape and false for portrait
     */
    public landscape: boolean = false;

    /** Indicates whether to use css page size attributes */
    public preferCSSPageSize: boolean = false;

    /** Indicates the page margins */
    public margins: PdfDocumentMargins = new PdfDocumentMargins();

    /** Indicates whether to display the header and footer */
    public displayHeaderFooter: boolean = false;

    /** Indicates if the document has cover page */
    public hasCoverPage: boolean = false;

    /** Header template to be used */
    public headerTemplate: PdfBaseHeaderFooterTemplate = new PdfBaseHeaderFooterTemplate();

    /** Footer template to be used */
    public footerTemplate: PdfBaseHeaderFooterTemplate = new PdfBaseHeaderFooterTemplate();

    /**
     * Gets the option to be used based on the cover option passed
     * @param cover PDF_COVER_OPTIONS to determine the type of option to return
     */
    public getOptions(cover: PDF_COVER_OPTIONS = PDF_COVER_OPTIONS_VALUES.NO_COVER): puppeteer.PDFOptions {
        // adjust margins
        if (this.displayHeaderFooter) {
            // ensure we have enough space for header
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
            headerTemplate: (cover === PDF_COVER_OPTIONS_VALUES.COVER || cover === PDF_COVER_OPTIONS_VALUES.COVER_WITH_ALL) ? this.headerTemplate.templateCoverPage : this.headerTemplate.template,
            footerTemplate: (cover === PDF_COVER_OPTIONS_VALUES.COVER || cover === PDF_COVER_OPTIONS_VALUES.COVER_WITH_ALL) ? this.footerTemplate.templateCoverPage : this.footerTemplate.template,
            margin: this.margins,
            pageRanges: (cover === PDF_COVER_OPTIONS_VALUES.COVER) ? '1' : (cover === PDF_COVER_OPTIONS_VALUES.SECOND_NO_COVER) ? '2-' : '',
            printBackground: true
        };
    }
}