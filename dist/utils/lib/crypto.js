"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncCryptoService = void 0;
const crypto = __importStar(require("crypto"));
class SyncCryptoService {
    toBytes(str) {
        const buffer = Buffer.from(str, "base64");
        const result = Array(buffer.length);
        for (let i = 0; i < buffer.length; i++)
            result[i] = buffer[i];
        return result;
    }
    // encrypted
    encrypt(str) {
        try {
            const utf8Encode = new TextEncoder();
            const fixedKeyOffset = utf8Encode.encode(process.env.FIXED_OFFSET_KEY);
            const iv = crypto.randomBytes(16);
            const aesKey = new Uint8Array([...iv, ...fixedKeyOffset]);
            const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
            const encrypted = cipher.update(Buffer.from(str, "utf8"));
            const final = cipher.final();
            return Buffer.concat([iv, encrypted, final]).toString("base64");
        }
        catch (error) {
            throw new Error(error);
        }
    }
    // decrypt
    decrypt(encryptedText, key) {
        try {
            const utf8Encode = new TextEncoder();
            const fixedKeyOffset = utf8Encode.encode(key || process.env.FIXED_OFFSET_KEY);
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
        }
        catch (error) {
            return {
                success: false,
                message: error.reason,
            };
        }
    }
    getDecryptedObject(obj) {
        const keys = Object.keys(obj);
        const decryptedObject = {};
        keys.forEach((key) => {
            decryptedObject[key] = this.decrypt(obj[key]);
        });
        return decryptedObject;
    }
}
exports.SyncCryptoService = SyncCryptoService;
//# sourceMappingURL=crypto.js.map