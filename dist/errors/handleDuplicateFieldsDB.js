"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateFieldsDB = (error) => {
    const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value!`;
    const errors = [
        {
            path: error.path,
            message: message,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: error.errmsg,
        errorMessages: errors,
    };
};
exports.default = handleDuplicateFieldsDB;
