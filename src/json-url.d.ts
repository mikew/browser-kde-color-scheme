declare module 'json-url/dist/node/index' {
  export interface Codec {
    compress: (obj: object) => Promise<string>;
    decompress: (str: string) => Promise<object>;
    stats: (
      obj: object
    ) => Promise<{ rawencoded: any; compressedencoded: any; compression: any }>;
  }

  const jsonurl: (codecName: string) => Codec;

  export default jsonurl;
}
