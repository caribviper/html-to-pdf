"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const hummus = require("hummus");
const streams = require("memory-streams");
const pdf_page_format_1 = require("./pdf-page-format");
const pdf_header_footer_1 = require("./pdf-header-footer");
const pdf_document_settings_1 = require("./pdf-document-settings");
const pdf_document_margins_1 = require("./pdf-document-margins");
const render_item_1 = require("./render-item");
class PdfDocumentTemplate extends render_item_1.RenderItem {
    constructor(content, pageFormat = new pdf_page_format_1.PdfPageFormat(), ...documentStyles) {
        super();
        this.content = content;
        this.pageFormat = pageFormat;
        this.documentStyles = [];
        this.documentStyles = documentStyles;
    }
    createPdf() {
        return __awaiter(this, void 0, void 0, function* () {
            let allPagesBuffer = undefined;
            let browser = undefined;
            if (!this.pageFormat)
                return false;
            browser = yield puppeteer.launch({ dumpio: true });
            let coverPageBuffer = undefined;
            let secondPageBuffer = undefined;
            const coverOption = this.pageFormat.hasCoverPage ? pdf_header_footer_1.PDF_COVER_OPTIONS_VALUES.COVER_WITH_ALL : pdf_header_footer_1.PDF_COVER_OPTIONS_VALUES.NO_COVER;
            allPagesBuffer = yield this.renderPage(browser, coverOption);
            const totalPages = yield this.getPageCounter(allPagesBuffer);
            if (!!this.pageFormat.displayHeaderFooter && this.pageFormat.hasCoverPage && totalPages > 1) {
                coverPageBuffer = yield this.renderPage(browser, pdf_header_footer_1.PDF_COVER_OPTIONS_VALUES.COVER);
                secondPageBuffer = yield this.renderPage(browser, pdf_header_footer_1.PDF_COVER_OPTIONS_VALUES.SECOND_NO_COVER);
                allPagesBuffer = yield this.merge(coverPageBuffer, secondPageBuffer);
            }
            if (!!browser)
                yield browser.close();
            return allPagesBuffer;
        });
    }
    createPdfFromTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = this.parseHtml(template);
            this.content = settings.content;
            this.pageFormat = settings.pageFormat;
            this.documentStyles = settings.styles;
            return yield this.createPdf();
        });
    }
    parseHtml(template) {
        let pdfSettings = undefined;
        try {
            const $ = cheerio.load(template);
            const html = $('.template').html();
            const documentStyles = [];
            const styles = $('.style');
            const styleUrlItems = styles.find($('.style-url'));
            const styleContent = styles.find($('.style-content'));
            const stylePath = styles.find($('.style-path'));
            styleUrlItems.each((i, u) => {
                if (!!u && !!$(u).text())
                    documentStyles.push({ url: $(u).text() });
            });
            styleContent.each((i, r) => {
                if (!!r && !!$(r).text())
                    documentStyles.push({ content: $(r).text() });
            });
            stylePath.each((i, r) => {
                if (!!r && !!$(r).text())
                    documentStyles.push({ path: $(r).text() });
            });
            const settings = $('.page-settings');
            const pageFormat = new pdf_page_format_1.PdfPageFormat();
            pageFormat.displayHeaderFooter = this.getSetting($, settings, 'displayHeaderFooter', true);
            pageFormat.hasCoverPage = this.getSetting($, settings, 'hasCoverPage', true);
            pageFormat.format = this.getSetting($, settings, 'format');
            pageFormat.landscape = this.getSetting($, settings, 'landscape', true);
            pageFormat.preferCSSPageSize = this.getSetting($, settings, 'preferCSSPageSize', true);
            pageFormat.margins = new pdf_document_margins_1.PdfDocumentMargins(this.getSetting($, settings, 'top'), this.getSetting($, settings, 'bottom'), this.getSetting($, settings, 'left'), this.getSetting($, settings, 'right'));
            pageFormat.headerTemplate = new pdf_header_footer_1.PdfBaseHeaderFooterTemplate();
            pageFormat.headerTemplate.template = this.getSetting($, settings, 'header');
            pageFormat.headerTemplate.templateCoverPage = this.getSetting($, settings, 'header-cover');
            pageFormat.footerTemplate = new pdf_header_footer_1.PdfBaseHeaderFooterTemplate();
            pageFormat.footerTemplate.template = this.getSetting($, settings, 'footer');
            pageFormat.footerTemplate.templateCoverPage = this.getSetting($, settings, 'footer-cover');
            pdfSettings = new pdf_document_settings_1.PdfDocumentSettings(documentStyles, pageFormat, html);
        }
        catch (error) {
            return undefined;
        }
        return pdfSettings;
    }
    getSetting($, settings, name, isBoolean = false) {
        if (settings.find(`.${name}`).length > 0) {
            const setting = settings.find(`.${name}`)[0];
            if (!!isBoolean)
                return $(setting).html() === "true" ? true : false;
            return $(setting).html();
        }
        return (isBoolean) ? false : '';
    }
    renderPage(browser, coverOption) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield browser.newPage();
            yield page.setContent(this.content, { waitUntil: 'networkidle0' });
            if (!!this.documentStyles && this.documentStyles.length > 0) {
                for (const docStyle of this.documentStyles) {
                    if (!!docStyle.content || !!docStyle.path || !!docStyle.url)
                        yield page.addStyleTag(docStyle);
                }
            }
            yield page.evaluate(() => { window.scrollBy(0, window.innerHeight); });
            const pageOptions = this.pageFormat.getOptions(coverOption);
            return yield page.pdf(pageOptions);
        });
    }
    merge(sourceFile, appendFile) {
        return __awaiter(this, void 0, void 0, function* () {
            let buffer = undefined;
            const outStream = new streams.WritableStream();
            try {
                const fileStream1 = new hummus.PDFRStreamForBuffer(sourceFile);
                const fileStream2 = new hummus.PDFRStreamForBuffer(appendFile);
                const writer = new hummus.createWriterToModify(fileStream1, new hummus.PDFStreamForResponse(outStream));
                writer.appendPDFPagesFromPDF(fileStream2);
                writer.end();
                buffer = outStream.toBuffer();
                outStream.end();
            }
            catch (error) {
                buffer = undefined;
                outStream.end();
            }
            finally {
                return buffer;
            }
        });
    }
}
exports.PdfDocumentTemplate = PdfDocumentTemplate;
