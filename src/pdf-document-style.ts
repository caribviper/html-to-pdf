/**
 * Allows for the style of pdf documents using, style sheets, style tags or file paths
 */
export class PdfDocumentStyle {
    /** Url with css stylesheet */
    public url: string;

    /** style tag content` */
    public content: string;

    /** File path to styles */
    public path: string;

    /**
     * Creates a single url path PdfDocumentStyle
     * @param url URl to the css style sheet
     */
    public static createSingleUrl(url: string): PdfDocumentStyle {
        return !url ? undefined : { url: url } as PdfDocumentStyle;
    }

    /**
     * Creats a style tag content PdfDocumentStyle
     * @param content Style tag content
     */
    public static createSingleContent(content: string): PdfDocumentStyle {
        return !content ? undefined : { content: content } as PdfDocumentStyle;
    }

    /**
     * Creates a PdfDocumentStyle of a file path
     * @param path file path to style
     */
    public static createSinglePath(path: string): PdfDocumentStyle {
        return !path ? undefined : { path: path } as PdfDocumentStyle;
    }

    /**
     * Create multiple PdfDocumentStyle from mulitple urls
     * @param urls Urls of style sheet
     */
    public static createUrls(...urls: string[]): PdfDocumentStyle[] {
        return urls.map((url) => {
            const u = new PdfDocumentStyle();
            u.url = url;
            return u;
        });
    }

    /**
     * Create mulitple PdfDocumentStyle from mulitple content items
     * @param contents Multiple style tag contents
     */
    public static createContents(...contents: string[]): PdfDocumentStyle[] {
        return contents.map((content) => {
            const u = new PdfDocumentStyle();
            u.content = content;
            return u;
        });
    }

    /**
     * Create multiple PdfDocumentStyle from mulitple paths
     * @param paths Paths to styles
     */
    public static createPaths(...paths: string[]): PdfDocumentStyle[] {
        return paths.map((path) => {
            const u = new PdfDocumentStyle();
            u.path = path;
            return u;
        });
    }
}
