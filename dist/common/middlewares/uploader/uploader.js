"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_abstract_storage_1 = __importDefault(require("../../commonAbstract/common.abstract.storage"));
const customEror_1 = __importDefault(require("../../../utils/lib/customEror"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uploaderConstants_1 = require("./uploaderConstants");
const config_1 = __importDefault(require("../../../config/config"));
const statusCode_1 = __importDefault(require("../../../utils/miscellaneous/statusCode"));
class Uploader extends common_abstract_storage_1.default {
    constructor() {
        super();
    }
    // cloud upload raw
    cloudUploadRaw(folder, types = uploaderConstants_1.allowAllFileTypes) {
        return (req, res, next) => {
            req.upFiles = [];
            const upload = (0, multer_1.default)({
                storage: (0, multer_s3_1.default)({
                    acl: "public-read",
                    s3: this.s3Client,
                    bucket: config_1.default.AWS_S3_BUCKET,
                    metadata: function (_req, file, cb) {
                        cb(null, { fieldName: file.fieldname });
                    },
                    key: function (req, file, cb) {
                        const fileWithFolder = folder +
                            "/" +
                            Date.now() +
                            "-" +
                            Math.round(Math.random() * 1e9) +
                            path_1.default.extname(file.originalname);
                        file.filename = fileWithFolder;
                        req.upFiles.push(fileWithFolder);
                        cb(null, `${uploaderConstants_1.rootFileFolder}/${fileWithFolder}`);
                    },
                }),
                fileFilter: function (_req, file, cb) {
                    // Check allowed extensions
                    if (types.includes(file.mimetype)) {
                        cb(null, true); // no errors
                    }
                    else {
                        cb(new Error("File mimetype is not allowed" + " for " + file.fieldname));
                    }
                },
            });
            upload.any()(req, res, (err) => {
                console.log(req.files);
                if (err) {
                    next(new customEror_1.default(err.message, 500));
                }
                else {
                    next();
                }
            });
        };
    }
    // cloud upload compress
    cloudUploadCompress(folder, types = uploaderConstants_1.allowAllFileTypes) { }
    // local upload raw
    localUploadRaw(folder, types = uploaderConstants_1.allowAllFileTypes) {
        return (req, _res, next) => {
            req.upFiles = [];
            const uploadsFolder = `${__dirname}/../../../${uploaderConstants_1.rootFileFolder}/${folder}`;
            const storage = multer_1.default.diskStorage({
                destination: (_req, _file, cb) => {
                    cb(null, uploadsFolder);
                },
                filename: (req, file, cb) => {
                    const nameWithFolder = folder +
                        "/" +
                        Date.now() +
                        "-" +
                        Math.round(Math.random() * 1e9) +
                        path_1.default.extname(file.originalname);
                    req.upFiles.push(nameWithFolder);
                    cb(null, nameWithFolder);
                },
            });
            const upload = (0, multer_1.default)({
                storage: storage,
                fileFilter: (_req, file, cb) => {
                    console.log(file.mimetype);
                    if (types.includes(file.mimetype)) {
                        cb(null, true);
                    }
                    else {
                        cb(new Error("File mimetype is not allowed" + " for " + file.fieldname));
                    }
                },
            });
            upload.any()(req, _res, (err) => {
                if (err) {
                    console.log({ err });
                    next(new customEror_1.default(err.message, statusCode_1.default.HTTP_BAD_REQUEST));
                }
                else {
                    next();
                }
            });
        };
    }
    // local upload compress
    localUploadCompress(folder, types = uploaderConstants_1.allowAllFileTypes) { }
}
exports.default = Uploader;
//# sourceMappingURL=uploader.js.map