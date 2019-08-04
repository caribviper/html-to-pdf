# html-to-pdf"
Provides a library to create PDFs from html utilising the puppeteer library. Allows for documents with headers and footers as well as cover-page header and footer if need be. Can also merge to documents into one document for output.

# Install
npm install caribviper/html-to-pdf

# Usage
## Create a simple PDF
```javascript
(async () => {
  const pdfTemplate = new PdfDocumentTemplate('<b>Hellow World</b>');
  const buffer = await pdfTemplate.createPdf(); //returns a buffer
  return buffer;
});
```
## Creat a complex PDF with styles
```javascript
(async () => {
  const content = '...'; //any html content
  
  //create documents from sylesheets
  const documentStyles: PdfDocumentStyle[] =
      PdfDocumentStyle.createUrls(
          'http://localhost:8080/css/pdf.css',
          'http://localhost:8080/css/sample.css');

  //add document styles as plain content
  documentStyles.push({ content: `p {font-size: 12pt !important;font-family: 'Times New Roman'!important;}` } as PdfDocumentStyle);

  //set up page format
  const pageFormat: PdfPageFormat = new PdfPageFormat();

  //indicate to display header and footer
  pageFormat.displayHeaderFooter = true;

  //style header
  const styleHeader = `font-size: 11pt !important;font-family: 'Times New Roman', Times, serif !important;
                  margin-left: 56px; margin-right: 56px;
                  text-align: left;
                  color: #696969;`;
  //style footer
  const styleFooter = `font-size: 8pt !important;font-family: 'Times New Roman', Times, serif !important;
                  margin-left: 56px; margin-right: 56px;
                  text-align: center;
                  color: #696969;`;
  
  //set up header and footer templates with the above styles
  pageFormat.headerTemplate = new PdfBaseHeaderFooterTemplate(styleHeader, '<p>This is a header: <b>Bold Stuff</b></p>', PdfBaseHeaderFooterTemplate.EMPTY_TAG);
  pageFormat.footerTemplate = new PdfBaseHeaderFooterTemplate(styleFooter, `<b>
  This is a footer
  </b>`, '');

  //page size
  pageFormat.format = 'Letter'; //A4, Legal etc
  pageFormat.hasCoverPage = true; //indicates whether the style has cover page
  pageFormat.margins = new PdfDocumentMargins('56px', '60px', '56px', '56px'); //set document margins, can use inches as well
  
  //create template
  const pdfTemplate = new PdfDocumentTemplate(content, pageFormat, ...documentStyles);
  const buffer = await pdfTemplate.createPdf();
  return buffer;
});
```
