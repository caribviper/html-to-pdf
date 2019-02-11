/// <reference types="node" />
export declare abstract class RenderItem {
    protected getPageCounter(file: string | Buffer): Promise<number>;
}
