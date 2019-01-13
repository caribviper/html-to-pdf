"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PdfDocumentStyle {
    static createSingleUrl(url) {
        return !url ? undefined : { url: url };
    }
    static createSingleContent(content) {
        return !content ? undefined : { content: content };
    }
    static createSinglePath(path) {
        return !path ? undefined : { path: path };
    }
    static createUrls(...urls) {
        return urls.map((url) => {
            const u = new PdfDocumentStyle();
            u.url = url;
            return u;
        });
    }
    static createContents(...contents) {
        return contents.map((content) => {
            const u = new PdfDocumentStyle();
            u.content = content;
            return u;
        });
    }
    static createPaths(...paths) {
        return paths.map((path) => {
            const u = new PdfDocumentStyle();
            u.path = path;
            return u;
        });
    }
}
exports.PdfDocumentStyle = PdfDocumentStyle;
