"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const hummus = require("hummus");
const streams = require("memory-streams");
const render_item_1 = require("./render-item");
const sizeOf = require("image-size");
class DigitalStamp extends render_item_1.RenderItem {
    createImage(browser, imageContent, selector, sourceFile, paddingTop = 5, paddingLeft = 5) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield browser.newPage();
            yield page.setContent(imageContent, { waitUntil: 'networkidle0' });
            const imagebuffer = yield this.screenshotDOMElement(page, selector);
            const imageDimensions = sizeOf(imagebuffer);
            const totalPages = yield this.getPageCounter(sourceFile);
            let buffer = undefined;
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
            }
            catch (error) {
                console.log(error);
                buffer = undefined;
                outStream.end();
            }
            finally {
                return buffer;
            }
        });
    }
    screenshotDOMElement(page, selector, imagePath = 'element.png', padding = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const rect = yield page.evaluate((selector) => {
                const element = document.querySelector(selector);
                const { x, y, width, height } = element.getBoundingClientRect();
                return { left: x, top: y, width, height, id: element.id };
            }, selector);
            return yield page.screenshot({
                path: imagePath,
                quality: 100,
                clip: {
                    x: rect.left - padding,
                    y: rect.top - padding,
                    width: rect.width + padding * 2,
                    height: rect.height + padding * 2
                }
            });
        });
    }
}
exports.DigitalStamp = DigitalStamp;
