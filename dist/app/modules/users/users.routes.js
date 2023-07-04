"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const router = express_1.default.Router();
router.post('/auth/signup', users_controller_1.UserController.createUser);
router.get('/users/:id', users_controller_1.UserController.getSingleUser);
router.patch('/users/:id', users_controller_1.UserController.updateUser);
router.delete('/users/:id', users_controller_1.UserController.deleteUser);
router.get('/users', users_controller_1.UserController.getAllUsers);
exports.UserRouter = router;
