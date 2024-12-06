"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const accessLog_1 = __importDefault(require("./middleware/accessLog"));
const maintainCors_1 = __importDefault(require("./middleware/maintainCors"));
const requestDuration_1 = __importDefault(require("./middleware/requestDuration"));
const body_parser_1 = __importDefault(require("body-parser"));
//import todoRoutes from './routes/todo';
const httpStatusCodes_1 = __importDefault(require("./constants/httpStatusCodes"));
const app = (0, express_1.default)();
exports.app = app;
dotenv_1.default.config();
const staticDirectory = process.env.STATIC_DIRECTORY || 'public';
const port = 3000;
//Use logging middleware
app.use(accessLog_1.default);
app.use(requestDuration_1.default);
//Serve static files
app.use(express_1.default.static(staticDirectory));
//Use other middleware
app.use(maintainCors_1.default);
app.use(body_parser_1.default.json());
//Use todoRoutes
//app.use(todoRoutes);
app.use((req, res) => {
    res
        .status(httpStatusCodes_1.default.NOT_FOUND)
        .sendFile('public/notFoundErrorPage.html', { root: __dirname });
});
//Function to start the server
const startServer = () => {
    const server = app.listen(port, (err) => {
        if (err) {
            console.log('This port is already being used!');
            return;
        }
        console.log(`Server is running on http://localhost:${port}`);
    });
    return server;
};
exports.startServer = startServer;
if (require.main === module) {
    startServer();
}
