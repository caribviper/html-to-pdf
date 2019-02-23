import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import * as hummus from 'hummus';
import * as streams from 'memory-streams';
import { PdfDocumentStyle } from './pdf-document-style';
import { PdfPageFormat } from './pdf-page-format';
import { PDF_COVER_OPTIONS_VALUES, PDF_COVER_OPTIONS, PdfBaseHeaderFooterTemplate } from './pdf-header-footer';
import { PdfDocumentSettings } from './pdf-document-settings';
import { PdfDocumentMargins } from './pdf-document-margins';
import { RenderItem } from './render-item';

export class PdfDocumentTemplate extends RenderItem {
  /** An array of document stypes to be applied to all pages */
  public documentStyles: PdfDocumentStyle[] = [];

  /**
   * Creates a new PdfDocumentTemplate
   * @param content Html content to be used to create pdf
   * @param pageFormat Page format options to be used to create pdf
   * @param documentStyles An array of document stypes to be applied to all pages
   */
  constructor(public content: string, public pageFormat: PdfPageFormat = new PdfPageFormat(), ...documentStyles: PdfDocumentStyle[]) {
    super();
    this.documentStyles = documentStyles;
  }

  /**
   * Creates the pdf based on the page settings and document styles
   */
  public async createPdf(): Promise<Buffer | boolean> {
    let allPagesBuffer: Buffer = undefined;
    let browser: puppeteer.Browser = undefined;
    if (!this.pageFormat)
      return false;
    // try {
      console.log('Starting puppeteer');
      browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      let coverPageBuffer: Buffer = undefined;
      let secondPageBuffer: Buffer = undefined;

      // // set cover options
      console.log('rendering cover');
      const coverOption = this.pageFormat.hasCoverPage ? PDF_COVER_OPTIONS_VALUES.COVER_WITH_ALL : PDF_COVER_OPTIONS_VALUES.NO_COVER;
      allPagesBuffer = await this.renderPage(browser, coverOption);

      // get total pages
      console.log('get page count');
      const totalPages = await this.getPageCounter(allPagesBuffer);

      // check for cover and display header and footer and total pages are greater than 1
      if (!!this.pageFormat.displayHeaderFooter && this.pageFormat.hasCoverPage && totalPages > 1) {
        // do cover page
        coverPageBuffer = await this.renderPage(browser, PDF_COVER_OPTIONS_VALUES.COVER);

        // do rest of pages
        secondPageBuffer = await this.renderPage(browser, PDF_COVER_OPTIONS_VALUES.SECOND_NO_COVER);

        // merge pages
        allPagesBuffer = await this.merge(coverPageBuffer, secondPageBuffer);
      }

    // } catch (error) {
    //   console.log('PDF Document Template: ' + error);
    //   return false;
    // }
    // finally {
      if (!!browser)
        await browser.close();
    // }
    return allPagesBuffer;
  }

  /**
   * Creates a pdf document from a preloaded with data, template info and settings for rendering
   * @param template html template containing the settings and the preformatted html content
   */
  public async createPdfFromTemplate(template: string): Promise<Buffer | boolean> {
    // let buffer: Buffer | boolean = undefined;
    // try {
      const settings = this.parseHtml(template);

      // render pdf
      this.content = settings.content;
      this.pageFormat = settings.pageFormat;
      this.documentStyles = settings.styles;
      return await this.createPdf();
    // } catch (error) {
    //   buffer = false;
    // }
    // return buffer;
  }

  private parseHtml(template: string): PdfDocumentSettings {
    let pdfSettings: PdfDocumentSettings = undefined;
    try {
      // load settings from cherrio
      const $ = cheerio.load(template);

      // get content
      const html = $('.template').html();

      // get document styles
      const documentStyles: PdfDocumentStyle[] = [];
      const styles = $('.style');
      const styleUrlItems = styles.find($('.style-url'));
      const styleContent = styles.find($('.style-content'));
      const stylePath = styles.find($('.style-path'));
      styleUrlItems.each((i, u) => {
        if (!!u && !!$(u).text())
          documentStyles.push({ url: $(u).text() } as PdfDocumentStyle);
      });
      styleContent.each((i, r) => {
        if (!!r && !!$(r).text())
          documentStyles.push({ content: $(r).text() } as PdfDocumentStyle);
      });
      stylePath.each((i, r) => {
        if (!!r && !!$(r).text())
          documentStyles.push({ path: $(r).text() } as PdfDocumentStyle);
      });

      // load page format
      const settings = $('.page-settings');
      const pageFormat: PdfPageFormat = new PdfPageFormat();
      pageFormat.displayHeaderFooter = this.getSetting($, settings, 'displayHeaderFooter', true);
      pageFormat.hasCoverPage = this.getSetting($, settings, 'hasCoverPage', true);
      pageFormat.format = this.getSetting($, settings, 'format');
      pageFormat.landscape = this.getSetting($, settings, 'landscape', true);
      pageFormat.preferCSSPageSize = this.getSetting($, settings, 'preferCSSPageSize', true);
      pageFormat.margins = new PdfDocumentMargins(
        this.getSetting($, settings, 'top'),
        this.getSetting($, settings, 'bottom'),
        this.getSetting($, settings, 'left'),
        this.getSetting($, settings, 'right')
      );
      pageFormat.headerTemplate = new PdfBaseHeaderFooterTemplate();
      pageFormat.headerTemplate.template = this.getSetting($, settings, 'header');
      pageFormat.headerTemplate.templateCoverPage = this.getSetting($, settings, 'header-cover');

      pageFormat.footerTemplate = new PdfBaseHeaderFooterTemplate();
      pageFormat.footerTemplate.template = this.getSetting($, settings, 'footer');
      pageFormat.footerTemplate.templateCoverPage = this.getSetting($, settings, 'footer-cover');

      pdfSettings = new PdfDocumentSettings(documentStyles, pageFormat, html);
    } catch (error) {
      return undefined;
    }
    return pdfSettings;
  }

  /**
   * Gets the specified setting value
   * @param $ CheerioStatic instance
   * @param settings Cheerio containing all settings
   * @param name Name of the setting to retrieve
   * @param isBoolean Specifies if the requested setting value is boolean`
   */
  private getSetting($: CheerioStatic, settings: Cheerio, name: string, isBoolean: boolean = false): any {
    if (settings.find(`.${name}`).length > 0) {
      const setting = settings.find(`.${name}`)[0];
      if (!!isBoolean)
        return $(setting).html() === "true" ? true : false;
      return $(setting).html();
    }
    return (isBoolean) ? false : '';
  }

  /**
   * Renders a page as a buffer
   * @param browser Browser to be used to cerated new page
   * @param coverOption Cover options applied to the page
   */
  private async renderPage(browser: puppeteer.Browser, coverOption: PDF_COVER_OPTIONS): Promise<Buffer> {
    const page = await browser.newPage();
    // Removed to allow for long loading images
    // await page.goto(`data:text/html,${this.content}`, { waitUntil: 'networkidle0' });
    console.log('setting content' + this.content.length);
    await page.setContent(this.content, { waitUntil: 'networkidle0' });
    console.log('content set');

    // set styles
    if (!!this.documentStyles && this.documentStyles.length > 0) {
      for (const docStyle of this.documentStyles) {
        if (!!docStyle.content || !!docStyle.path || !!docStyle.url)
          await page.addStyleTag(docStyle);
      }
    }

    // do scroll
    await page.evaluate(() => { window.scrollBy(0, window.innerHeight); });

    console.log('creating pdf');

    const pageOptions = this.pageFormat.getOptions(coverOption);
    return await page.pdf(pageOptions);
  }

  private async merge(sourceFile: string | Buffer, appendFile: string | Buffer): Promise<Buffer> {
    let buffer: Buffer = undefined;
    const outStream = new streams.WritableStream();
    try {
      const fileStream1 = new hummus.PDFRStreamForBuffer(sourceFile);
      const fileStream2 = new hummus.PDFRStreamForBuffer(appendFile);

      const writer = new hummus.createWriterToModify(fileStream1, new hummus.PDFStreamForResponse(outStream));
      writer.appendPDFPagesFromPDF(fileStream2);
      writer.end();
      buffer = outStream.toBuffer();
      outStream.end();
    } catch (error) {
      buffer = undefined;
      outStream.end();
    }
    finally {
      return buffer;
    }
  }
}
