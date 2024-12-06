"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const httpStatusCodes_1 = __importDefault(require("../constants/httpStatusCodes"));
const router = express_1.default.Router();
//Creating new todo files or appending to already created
router.post('/todo', (req, res) => {
    const { todoName, id, task } = req.body;
    const newTodo = {
        id,
        task,
    };
    let todos = { tasks: [] };
    if (!todoName || !id || !task) {
        res
            .status(httpStatusCodes_1.default.BAD_REQUEST)
            .send('Missing required fields');
        return;
    }
    // Read the existing JSON file
    fs_1.default.readFile(`./todo/${todoName}.json`, 'utf-8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('File does not exist, creating a new one.');
            }
            else {
                console.error(err);
                res
                    .status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
                    .send('Could not read the file content.');
            }
        }
        else {
            todos = JSON.parse(data);
        }
        todos.tasks.push(newTodo);
        fs_1.default.writeFile(`./todo/${todoName}.json`, JSON.stringify(todos), (err) => {
            if (err) {
                console.error(err);
                return res
                    .status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
                    .send('Failed to write to the file');
            }
            res.sendStatus(httpStatusCodes_1.default.OK);
        });
    });
});
//Getting the content from to do lists
router.get('/todo', (req, res) => {
    const { todoName } = req.query;
    if (!todoName) {
        res
            .status(httpStatusCodes_1.default.BAD_REQUEST)
            .send('Missing required field "todoName"');
    }
    fs_1.default.readFile(`./todo/${todoName}.json`, 'utf-8', (err, data) => {
        if (err) {
            console.error(err.message);
            return res
                .status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
                .send('Could not read the file content.');
        }
        else {
            console.log(`${todoName}: `);
            console.log(JSON.parse(data));
            res.send(JSON.parse(data));
        }
    });
});
//Deleting tasks
router.delete('/todo', (req, res) => {
    const { todoName, id } = req.body;
    let todos = { tasks: [] };
    if (!todoName || !id) {
        res
            .status(httpStatusCodes_1.default.BAD_REQUEST)
            .send('Missing required fields');
        return;
    }
    fs_1.default.readFile(`./todo/${todoName}.json`, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res
                .status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
                .send('Could not read the file content.');
        }
        else {
            todos = JSON.parse(data);
        }
        todos.tasks = todos.tasks.filter((t) => t.id !== id);
        //Deleting the file if there are no tasks left
        if (todos.tasks.length === 0) {
            fs_1.default.unlink(`./todo/${todoName}.json`, (err) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
                        .send('Could not delete the file content.');
                }
                else {
                    return res
                        .status(httpStatusCodes_1.default.NO_CONTENT)
                        .send(`./todo/${todoName}.json was deleted because there are no tasks left`);
                }
            });
        }
        else {
            fs_1.default.writeFile(`./todo/${todoName}.json`, JSON.stringify(todos), (err) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
                        .send('Failed to write to the file');
                }
                res.sendStatus(httpStatusCodes_1.default.OK);
            });
        }
    });
});
exports.default = router;
//# sourceMappingURL=todo.js.map