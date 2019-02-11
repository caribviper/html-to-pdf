import * as hummus from 'hummus';

export abstract class RenderItem {

  protected async getPageCounter(file: string | Buffer): Promise<number> {
    let counter = 0;
    try {
      const fileStream = new hummus.PDFRStreamForBuffer(file);
      const pdfReaderOutput = hummus.createReader(fileStream);
      counter = pdfReaderOutput.getPagesCount();
    } catch (error) {
      counter = -1;
    }
    return counter;
  }
}
