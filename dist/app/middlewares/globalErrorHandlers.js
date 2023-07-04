"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const handleValidationError_1 = __importDefault(require("../../errors/handleValidationError"));
const ApiErrors_1 = __importDefault(require("../../errors/ApiErrors"));
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../../errors/handleZodError"));
const handleCastError_1 = __importDefault(require("../../errors/handleCastError"));
const handleDuplicateFieldsDB_1 = __importDefault(require("../../errors/handleDuplicateFieldsDB"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'something went wrong!';
    let errorMessages = [];
    // config.env === 'development'
    //   ? console.log('GlobalErrorHandler', err)
    //   : errorLogger.error('GlobalErrorHandler', err)
    if ((err === null || err === void 0 ? void 0 : err.name) === 'ValidationError') {
        let simplifiedErrorMessage = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedErrorMessage.statusCode;
        message = simplifiedErrorMessage.message;
        errorMessages = simplifiedErrorMessage.errorMessages;
    }
    else if (err instanceof zod_1.ZodError) {
        const simlifiedError = (0, handleZodError_1.default)(err);
        statusCode = simlifiedError.statusCode;
        message = simlifiedError.message;
        errorMessages = simlifiedError.errorMessages;
    }
    else if (err.code === 11000) {
        const simlifiedError = (0, handleDuplicateFieldsDB_1.default)(err);
        statusCode = simlifiedError.statusCode;
        message = simlifiedError.message;
        errorMessages = simlifiedError.errorMessages;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'CastError') {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (err instanceof ApiErrors_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorMessages = err.message
            ? [
                {
                    path: '',
                    message: err === null || err === void 0 ? void 0 : err.message,
                },
            ]
            : [];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorMessages = err.message
            ? [
                {
                    path: '',
                    message: err === null || err === void 0 ? void 0 : err.message,
                },
            ]
            : [];
    }
    console.log('GlobalErrorHandler', message, errorMessages);
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config_1.default.env !== 'production' ? err.stack : undefined,
    });
};
exports.default = globalErrorHandler;
