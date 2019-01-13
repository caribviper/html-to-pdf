
/**
 * Available Pdf Front page options.
 */
export type PDF_COVER_OPTIONS =
    | 'Cover'
    | 'Second'
    | 'Cover With All'
    | '';

/**
 * Available PDF Cover options values for use
 */
export const PDF_COVER_OPTIONS_VALUES = {
    COVER: 'Cover' as PDF_COVER_OPTIONS,
    COVER_WITH_ALL: 'Cover With All' as PDF_COVER_OPTIONS,
    SECOND_NO_COVER: 'Second' as PDF_COVER_OPTIONS,
    NO_COVER: '' as PDF_COVER_OPTIONS
};




/**
 * Manages the header and footer objects
 */
export class PdfBaseHeaderFooterTemplate {

    /**
     * Empty div tag to be used as header/footer
     */
    public static get EMPTY_TAG(): string { return '<div></div>'; }

    /**Default style font used in creating pdf */
    public static get DEFAULT_STYLE(): string { return 'font-size: 8px !important;'; }

    /**
     * 
     * @param style Style to be used within heade/footer
     * @param template Template tag used to generate header/footer
     * @param templateFirstPage Specifies if the template appears on the first page
     */
    constructor(style: string = PdfBaseHeaderFooterTemplate.DEFAULT_STYLE, template: string = PdfBaseHeaderFooterTemplate.EMPTY_TAG, templateFirstPage: string = '') {
        this.style = style;
        this.template = template;
        this.templateCoverPage = templateFirstPage;
    }

    private _template: string = PdfBaseHeaderFooterTemplate.EMPTY_TAG;
    /** Gets the template used to for the either the header/footer */
    public get template(): string {
        return !!this.style ? `<div style="${this.style}">${this._template}</div>` : this._template;
    }
    /** Sets the template used to for the either the header/footer */
    public set template(value: string) {
        this._template = value;
    }

    private _templateCoverPage: string = PdfBaseHeaderFooterTemplate.EMPTY_TAG;
    /** Gets the template the used on the cover page */
    public get templateCoverPage(): string {
        if (!this._templateCoverPage)
            return this.template;
        else
            return !!this.style ? `<div style="${this.style}">${this._templateCoverPage}</div>` : this._templateCoverPage;
    }
    /** Sets the template the used on the cover page */
    public set templateCoverPage(value: string) {
        this._templateCoverPage = value;
    }

    /** Gets the template based on the cover and the existence of the template firstpage */
    public getTemplate(cover: boolean = false) {
        return (!!cover && !!this._templateCoverPage) ? this.templateCoverPage : this.template;
    }

    /** Style for the template. This will surround the template in a div tag */
    public style: string = 'font-size: 8px !important;';
}

