"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
// Middleware to log access details
const logDir = './logs';
const accessLogger = (req, res, next) => {
    if (!fs_1.default.existsSync(logDir)) {
        fs_1.default.mkdirSync(logDir, { recursive: true });
    }
    res.on('finish', () => {
        const log = `url="${req.url}" method="${req.method}" statusCode="${res.statusCode}" protocol="${req.protocol}" ip="${req.ip}"\n`;
        fs_1.default.appendFile(`${logDir}/accessLog.txt`, log, (err) => {
            if (err) {
                throw err;
            }
        });
    });
    next();
};
exports.default = accessLogger;
//# sourceMappingURL=accessLog.js.map