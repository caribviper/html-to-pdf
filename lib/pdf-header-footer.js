"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDF_COVER_OPTIONS_VALUES = {
    COVER: 'Cover',
    COVER_WITH_ALL: 'Cover With All',
    SECOND_NO_COVER: 'Second',
    NO_COVER: ''
};
class PdfBaseHeaderFooterTemplate {
    constructor(style = PdfBaseHeaderFooterTemplate.DEFAULT_STYLE, template = PdfBaseHeaderFooterTemplate.EMPTY_TAG, templateFirstPage = '') {
        this._template = PdfBaseHeaderFooterTemplate.EMPTY_TAG;
        this._templateCoverPage = PdfBaseHeaderFooterTemplate.EMPTY_TAG;
        this.style = 'font-size: 8px !important;';
        this.style = style;
        this.template = template;
        this.templateCoverPage = templateFirstPage;
    }
    static get EMPTY_TAG() { return '<div></div>'; }
    static get DEFAULT_STYLE() { return 'font-size: 8px !important;'; }
    get template() {
        return !!this.style ? `<div style="${this.style}">${this._template}</div>` : this._template;
    }
    set template(value) {
        this._template = value;
    }
    get templateCoverPage() {
        if (!this._templateCoverPage)
            return this.template;
        else
            return !!this.style ? `<div style="${this.style}">${this._templateCoverPage}</div>` : this._templateCoverPage;
    }
    set templateCoverPage(value) {
        this._templateCoverPage = value;
    }
    getTemplate(cover = false) {
        return (!!cover && !!this._templateCoverPage) ? this.templateCoverPage : this.template;
    }
}
exports.PdfBaseHeaderFooterTemplate = PdfBaseHeaderFooterTemplate;
