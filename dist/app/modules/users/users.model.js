"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const userSchema = new mongoose_1.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ['seller', 'buyer', 'admin'] },
    password: { type: String, required: true },
    name: {
        type: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
        },
        required: true,
    },
    address: { type: String, required: true },
    budget: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
}, {
    timestamps: true,
});
userSchema.statics.isUserExist = function (phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User.findOne({ phoneNumber }, { _id: 1, phoneNumber: 1, password: 1, role: 1 });
    });
};
userSchema.statics.isPasswordMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(48, givenPassword, savedPassword);
        console.log(yield bcrypt_1.default.compare(givenPassword, savedPassword));
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
// User.create() / user.save()
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // hashing user password
        const user = this;
        console.log('this', this);
        if (user.password) {
            user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bycrypt_salt_rounds));
        }
        next();
    });
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
