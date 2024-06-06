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
exports.postRequest = exports.getRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../utils/config/config"));
const customEror_1 = __importDefault(require("../../utils/lib/customEror"));
const BASE_URL = 'https://api.cert.platform.sabre.com';
const headers = {
    Authorization: `Bearer ${config_1.default.AUTH_TOKEN}`,
    'Content-Type': 'application/json',
};
const getRequest = (urlPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiUrl = BASE_URL + urlPath;
        const response = yield axios_1.default.get(apiUrl, { headers });
        const data = response.data;
        return { code: response.status, data };
    }
    catch (error) {
        console.error('Error calling API:', error.response.status);
        return { code: error.response.status, data: [] };
    }
});
exports.getRequest = getRequest;
const postRequest = (urlPath, requestData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiUrl = BASE_URL + urlPath;
        const response = yield axios_1.default.post(apiUrl, requestData, { headers });
        return response.data;
    }
    catch (error) {
        if (error.response) {
            console.error('Status Code:', error.response.status, ', Error:', error.message);
            throw new customEror_1.default('From API calling.' + error.message, error.response.status);
        }
    }
});
exports.postRequest = postRequest;
//# sourceMappingURL=requests.js.map