"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.patch('/users/my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), users_controller_1.UserController.updateProfile);
router.get('/users/my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), users_controller_1.UserController.myProfile);
router.post('/auth/signup', users_controller_1.UserController.createUser);
router.get('/users/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), users_controller_1.UserController.getSingleUser);
router.patch('/users/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), users_controller_1.UserController.updateUser);
router.delete('/users/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), users_controller_1.UserController.deleteUser);
router.get('/users', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), users_controller_1.UserController.getAllUsers);
exports.UserRouter = router;
