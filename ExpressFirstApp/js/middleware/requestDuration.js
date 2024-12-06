"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
//Middleware calculating the request duration and logs the info to a file
const logDir = './logs';
const durationLogger = (req, res, next) => {
    if (!fs_1.default.existsSync(logDir)) {
        fs_1.default.mkdirSync(logDir, { recursive: true });
    }
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logMessage = `Request URL: ${req.url}, Duration: ${duration}ms\n`;
        fs_1.default.appendFile('./logs/requestsDuration.txt', logMessage, (err) => {
            if (err) {
                throw err;
            }
        });
    });
    next();
};
exports.default = durationLogger;
