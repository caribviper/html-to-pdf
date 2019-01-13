"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class ImageEncoder {
    static convertToBase64(file) {
        const bitmap = fs.readFileSync(file, { encoding: 'base64' });
        return bitmap.toString();
    }
    static convertToBase64Uri(file, imageType) {
        return `data:image/${imageType};base64,${this.convertToBase64(file)}`;
    }
}
exports.ImageEncoder = ImageEncoder;
