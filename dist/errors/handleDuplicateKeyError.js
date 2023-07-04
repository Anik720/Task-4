"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateKeyError = (error) => {
    const errors = [
        {
            path: error.path,
            message: 'Invalid Id',
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: 'Duplicate Key Error',
        errorMessages: errors,
    };
};
exports.default = handleDuplicateKeyError;
