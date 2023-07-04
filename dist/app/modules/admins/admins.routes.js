"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const admins_controller_1 = require("./admins.controller");
const router = express_1.default.Router();
router.post('/create-admin', admins_controller_1.AdminController.createAdmin);
router.post('/login', admins_controller_1.AdminController.loginUser);
router.post('/refresh-token', admins_controller_1.AdminController.refreshToken);
exports.AdminRouter = router;
