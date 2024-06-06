"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.soapPostRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const customEror_1 = __importDefault(require("../../utils/lib/customEror"));
const baseUrl = "https://webservices.cert.platform.sabre.com";
const headers = {
    Authorization: `Bearer T1RLAQKSiCvIwPr3BZB26BEnA0UYKU5rV28hc6uMm2yMsdYhVBB2aPjw9t+UTb7OgGCfC5rWAADgqFzvHOfiRAwpu6xGu54JMYHgO/KBDYsfwHJ5CRpHxLY+US2YJKpWKESznRg59vhBCGpBoj60Eq6ZvtMovBz0GgvFznUnIitIN5qwhzXCAVO9uOX1OC8UpleJGdb8Zkfu2SGELWNKkNsypVKgPUfLOeY5EBpnnJUhnRIVtn75TkGp8fRqo2pc8wUQBloq/ElooTHogQp2zS8MBf4kUmxMzKqsUgafgFZR7DXJFVeRbJVFQEzqxzOqp9X84/q/pzCtxqQqS10Tu5NGOmfbh3i/9A48t0VAdy3GO5/tBdqr7TQ*`,
    "Content-Type": "text/xml; charset=utf-8",
};
function soapPostRequest(requestBody) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(baseUrl, requestBody, { headers });
            return response === null || response === void 0 ? void 0 : response.data;
        }
        catch (error) {
            console.error(error);
            throw new customEror_1.default(error === null || error === void 0 ? void 0 : error.message, (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status);
        }
    });
}
exports.soapPostRequest = soapPostRequest;
//# sourceMappingURL=soap_request.js.map