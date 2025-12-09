declare module 'pngjs' {
  import { Buffer } from 'buffer';

  export interface PNGOptions {
    width?: number;
    height?: number;
    fill?: boolean;
    colorType?: number;
    inputHasAlpha?: boolean;
  }

  export class PNG {
    width: number;
    height: number;
    data: Uint8Array;

    constructor(options?: PNGOptions);

    static sync: {
      read(data: Buffer): PNG;
      write(png: PNG): Buffer;
    };
  }
}


