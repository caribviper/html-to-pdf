"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PdfDocumentSettings {
    constructor(styles, pageFormat, content = '') {
        this.styles = styles;
        this.pageFormat = pageFormat;
        this.content = content;
    }
}
exports.PdfDocumentSettings = PdfDocumentSettings;
