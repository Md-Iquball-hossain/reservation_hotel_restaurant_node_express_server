import * as crypto from "crypto";

export class SyncCryptoService {
  public toBytes(str: any): any {
    const buffer = Buffer.from(str, "base64");
    const result = Array(buffer.length);

    for (let i = 0; i < buffer.length; i++) result[i] = buffer[i];

    return result;
  }

  // encrypted
  public encrypt(str: string) {
    try {
      const utf8Encode = new TextEncoder();
      const fixedKeyOffset = utf8Encode.encode(process.env.FIXED_OFFSET_KEY);
      const iv = crypto.randomBytes(16);
      const aesKey = new Uint8Array([...iv, ...fixedKeyOffset]);

      const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
      const encrypted = cipher.update(Buffer.from(str, "utf8"));
      const final = cipher.final();

      return Buffer.concat([iv, encrypted, final]).toString("base64");
    } catch (error: any) {
      throw new Error(error);
    }
  }

  // decrypt
  public decrypt(encryptedText: string, key?: string) {
    try {
      const utf8Encode = new TextEncoder();
      const fixedKeyOffset = utf8Encode.encode(
        key || process.env.FIXED_OFFSET_KEY
      );
      const encryptedBytes = this.toBytes(encryptedText);

      // console.log({ encryptedBytes });
      const cipherText = new Uint8Array(encryptedBytes.slice(16));
      // console.log({ cipherText });

      const offsetBytes = this.toBytes(fixedKeyOffset);
      const ivBytes = encryptedBytes.slice(0, 16);

      // console.log({ ivBytes });

      const iv = new Uint8Array(ivBytes);

      // console.log({ iv });
      const aesKey = new Uint8Array([...ivBytes, ...offsetBytes]);

      // console.log({ aesKey });

      const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);

      // console.log({ decipher });
      const decrypted = decipher.update(cipherText);
      // console.log({ decrypted });
      const decryptedText = Buffer.concat([
        decrypted,
        decipher.final(),
      ]).toString();

      return {
        success: true,
        data: decryptedText,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.reason,
      };
    }
  }

  public getDecryptedObject(obj: any) {
    const keys = Object.keys(obj);
    const decryptedObject: any = {};

    keys.forEach((key) => {
      decryptedObject[key] = this.decrypt(obj[key]);
    });

    return decryptedObject;
  }
}
