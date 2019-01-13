import * as fs from 'fs';

/**
 * Manages the image encodingof any image to base 64 data. 
 * This ensure images are saved with html to create pdf.
 */
export class ImageEncoder {

    /**
     * Converts an image file (path) to base64 encoded string
     * @param file Image file (path) to be converted to base64
     */
    public static convertToBase64(file: string): string {
        // read binary data
        const bitmap = fs.readFileSync(file, { encoding: 'base64' });
        // convert binary data to base64 encoded string
        return bitmap.toString();
    }

    /**
     * Converts an image file to base64 encoding that can be directly inserted into html as an Uri
     * @param file Image file (path) to be converted to base64 encoded string
     * @param imageType Type of image to be converted
     */
    public static convertToBase64Uri(file: string, imageType: string): string {
        return `data:image/${imageType};base64,${this.convertToBase64(file)}`;
    }
}