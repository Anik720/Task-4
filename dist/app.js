"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandlers_1 = __importDefault(require("./app/middlewares/globalErrorHandlers"));
const routes_1 = __importDefault(require("./app/routes"));
const http_status_1 = __importDefault(require("http-status"));
const cookieParser = require('cookie-parser');
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use('/api/v1/users', UserRouter)
// app.use('/api/v1/academic-semesters', AcademicSemesterRoutes)
app.use('/api/v1', routes_1.default);
app.get('/', (req, res, next) => {
    throw new Error('Testing error logger');
    //   next('Hello error')
    // Promise.reject(new Error('Unhandle rejection'))
});
// global error handler
app.use(globalErrorHandlers_1.default);
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'NOT FOUND',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API not FOUND',
            },
        ],
    });
    next();
});
exports.default = app;
