import * as puppeteer from 'puppeteer';
import { PDF_COVER_OPTIONS, PdfBaseHeaderFooterTemplate } from './pdf-header-footer';
import { PdfDocumentMargins } from './pdf-document-margins';
export declare class PdfPageFormat {
    format: puppeteer.PDFFormat;
    landscape: boolean;
    preferCSSPageSize: boolean;
    margins: PdfDocumentMargins;
    displayHeaderFooter: boolean;
    hasCoverPage: boolean;
    headerTemplate: PdfBaseHeaderFooterTemplate;
    footerTemplate: PdfBaseHeaderFooterTemplate;
    getOptions(cover?: PDF_COVER_OPTIONS): puppeteer.PDFOptions;
}
