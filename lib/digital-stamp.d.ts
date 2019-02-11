/// <reference types="node" />
import * as puppeteer from 'puppeteer';
import { RenderItem } from './render-item';
export declare class DigitalStamp extends RenderItem {
    createImage(browser: puppeteer.Browser, imageContent: string, selector: string, sourceFile: string | Buffer, paddingTop?: number, paddingLeft?: number): Promise<Buffer>;
    private screenshotDOMElement;
}
