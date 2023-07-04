"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_routes_1 = require("../modules/users/users.routes");
const cow_route_1 = require("../modules/cow/cow.route");
const order_route_1 = require("../modules/Order/order.route");
const admins_routes_1 = require("../modules/admins/admins.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/',
        route: users_routes_1.UserRouter,
    },
    {
        path: '/cows',
        route: cow_route_1.CowRouter,
    },
    {
        path: '/orders',
        route: order_route_1.OrderRouter,
    },
    {
        path: '/admins',
        route: admins_routes_1.AdminRouter,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
