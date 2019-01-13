export declare type PDF_COVER_OPTIONS = 'Cover' | 'Second' | 'Cover With All' | '';
export declare const PDF_COVER_OPTIONS_VALUES: {
    COVER: PDF_COVER_OPTIONS;
    COVER_WITH_ALL: PDF_COVER_OPTIONS;
    SECOND_NO_COVER: PDF_COVER_OPTIONS;
    NO_COVER: PDF_COVER_OPTIONS;
};
export declare class PdfBaseHeaderFooterTemplate {
    static readonly EMPTY_TAG: string;
    static readonly DEFAULT_STYLE: string;
    constructor(style?: string, template?: string, templateFirstPage?: string);
    private _template;
    template: string;
    private _templateCoverPage;
    templateCoverPage: string;
    getTemplate(cover?: boolean): string;
    style: string;
}
