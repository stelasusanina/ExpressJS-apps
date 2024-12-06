"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// Middleware to dynamically set the Content-Type and CORS headers based on file type
const corsOptionsHTML = {
    origin: 'http://localhost:3000',
};
const corsOptionsJSON = {
    origin: '*',
};
const corsMiddleware = (req, res, next) => {
    const fileType = path_1.default.extname(req.path);
    switch (fileType) {
        case '.html':
            res.setHeader('Content-Type', 'text/html');
            (0, cors_1.default)(corsOptionsHTML)(req, res, next);
            break;
        case '.json':
            res.setHeader('Content-Type', 'application/json');
            (0, cors_1.default)(corsOptionsJSON)(req, res, next);
            break;
        default:
            break;
    }
    next();
};
exports.default = corsMiddleware;
//# sourceMappingURL=maintainCors.js.map