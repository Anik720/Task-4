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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const users_model_1 = __importDefault(require("./users.model"));
const http_status_1 = __importDefault(require("http-status"));
const user_constant_1 = require("./user.constant");
const pagination_1 = require("../../../helper/pagination");
const createStudent = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield users_model_1.default.create(user);
    let obj = {
        _id: newUser._id,
        role: newUser.role,
        name: newUser.name,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
    };
    return obj;
});
const getAllUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: user_constant_1.userSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield users_model_1.default.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield users_model_1.default.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_model_1.default.findOne({ _id: id });
    return result;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield users_model_1.default.findOne({ _id: id });
    if (!isExist) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found !');
    }
    const { name } = payload, userData = __rest(payload, ["name"]);
    const updatedUserData = Object.assign({}, userData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}` // `name.fisrtName`
            ;
            updatedUserData[nameKey] = name[key];
        });
    }
    console.log(updatedUserData);
    const result = yield users_model_1.default.findOneAndUpdate({ _id: id }, updatedUserData, {
        new: true,
    });
    return result;
});
const updateProfile = (loggedinUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield users_model_1.default.findOne({ _id: loggedinUser.userId });
    if (!isExist) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found !');
    }
    const { name } = payload, userData = __rest(payload, ["name"]);
    const updatedUserData = Object.assign({}, userData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}` // `name.fisrtName`
            ;
            updatedUserData[nameKey] = name[key];
        });
    }
    console.log(updatedUserData);
    const result = yield users_model_1.default.findOneAndUpdate({ _id: loggedinUser.userId }, updatedUserData, {
        new: true,
    });
    let obj = {
        password: result === null || result === void 0 ? void 0 : result.password,
        name: result === null || result === void 0 ? void 0 : result.name,
        phoneNumber: result === null || result === void 0 ? void 0 : result.phoneNumber,
        address: result === null || result === void 0 ? void 0 : result.address,
    };
    return obj;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_model_1.default.findByIdAndDelete({ _id: id });
    return result;
});
const myProfile = (loggedinUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('loggedinUser', loggedinUser);
    const result = yield users_model_1.default.findOne({ _id: loggedinUser === null || loggedinUser === void 0 ? void 0 : loggedinUser.userId }, { name: 1, address: 1, phoneNumber: 1 });
    return result;
});
exports.UserService = {
    createStudent,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    myProfile,
    updateProfile,
};
