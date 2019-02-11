import * as puppeteer from 'puppeteer';
import * as hummus from 'hummus';
import * as streams from 'memory-streams';
import { RenderItem } from './render-item';
import * as sizeOf from 'image-size';

export class DigitalStamp extends RenderItem {

  /**
   * Creates and affix a stamp onto an existing pdf.
   * @param browser puppeteer browser to render content
   * @param imageContent Html string image content
   * @param selector DOM selector to get image with clippings
   * @param sourceFile Source file/buffer with the pdf to be edited
   * @param paddingTop Padding top to place the image
   * @param paddingLeft padding left to place the image
   */
  public async createImage(browser: puppeteer.Browser, imageContent: string, selector: string, sourceFile: string | Buffer, paddingTop: number = 5, paddingLeft: number = 5): Promise<Buffer> {
    const page = await browser.newPage();
    // Removed to allow for long loading images
    await page.setContent(imageContent, { waitUntil: 'networkidle0' });
    const imagebuffer = await this.screenshotDOMElement(page, selector);
    const imageDimensions = sizeOf(imagebuffer);
    const totalPages = await this.getPageCounter(sourceFile);

    let buffer: Buffer = undefined;
    const outStream = new streams.WritableStream();
    try {
      const writeStream = new hummus.PDFRStreamForBuffer(sourceFile);
      const writer = new hummus.createWriterToModify(writeStream, new hummus.PDFStreamForResponse(outStream));
      const stream = new hummus.PDFRStreamForBuffer(imagebuffer);
      const imageXObject = writer.createImageXObjectFromJPG(stream);
      for (let i = 0; i < totalPages; ++i) {
        const pageModifier = new hummus.PDFPageModifier(writer, i, true);
        const pageTop = writer.getModifiedFileParser().parsePage(i).getMediaBox()[3];
        const ctx = pageModifier
          .startContext()
          .getContext();
        ctx.q()
          .cm(imageDimensions.width, 0, 0, imageDimensions.height, paddingLeft, (pageTop - imageDimensions.height) - paddingTop)
          .doXObject(imageXObject)
          .Q();
        pageModifier.endContext().writePage();
        continue;
      }
      writer.end();
      buffer = outStream.toBuffer();
      outStream.end();
    } catch (error) {
      console.log(error);
      buffer = undefined;
      outStream.end();
    }
    finally {
      return buffer;
    }
  }

  private async screenshotDOMElement(page: puppeteer.Page, selector: string, imagePath: string = 'element.png', padding = 0): Promise<Buffer> {
    const rect = await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
    }, selector);

    return await page.screenshot({
      path: imagePath,
      quality: 100,
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      }
    });
  }
}
