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
exports.OrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../helper/pagination");
const users_model_1 = __importDefault(require("../users/users.model"));
const cow_model_1 = __importDefault(require("../cow/cow.model"));
const order_model_1 = __importDefault(require("./order.model"));
const createOrder = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const findBuyer = yield users_model_1.default.findById({ _id: order.buyer }, { budget: 1 });
    const findCow = yield cow_model_1.default.findById({ _id: order.cow }, { price: 1, label: 1, seller: 1 });
    // generate student id
    let newOrderAllData = null;
    if (findBuyer &&
        findCow &&
        (findBuyer === null || findBuyer === void 0 ? void 0 : findBuyer.budget) &&
        (findCow === null || findCow === void 0 ? void 0 : findCow.price) &&
        (findBuyer === null || findBuyer === void 0 ? void 0 : findBuyer.budget) < (findCow === null || findCow === void 0 ? void 0 : findCow.price)) {
        throw new ApiErrors_1.default(400, 'You have not enough budget.');
    }
    else {
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            if (findCow) {
                findCow.label = 'sold out';
            }
            let newBudget = findBuyer && findCow && (findBuyer === null || findBuyer === void 0 ? void 0 : findBuyer.budget) && (findCow === null || findCow === void 0 ? void 0 : findCow.price)
                ? (findBuyer === null || findBuyer === void 0 ? void 0 : findBuyer.budget) - (findCow === null || findCow === void 0 ? void 0 : findCow.price)
                : 0;
            if (findBuyer) {
                findBuyer.budget = newBudget;
            }
            const findSeller = yield users_model_1.default.findOne({ _id: findCow === null || findCow === void 0 ? void 0 : findCow.seller }, { income: 1 });
            //array
            if (findSeller && (findSeller === null || findSeller === void 0 ? void 0 : findSeller.income) && (findCow === null || findCow === void 0 ? void 0 : findCow.price)) {
                findSeller.income = (findCow === null || findCow === void 0 ? void 0 : findCow.price) + (findSeller === null || findSeller === void 0 ? void 0 : findSeller.income);
                // findSeller.income =
                //   findCow && findSeller && findSeller.income
                //     ? findCow?.price + findSeller.income
                //     : 0
            }
            const newOrder = yield order_model_1.default.create([order], { session });
            if (!newOrder.length) {
                throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create order');
            }
            newOrderAllData = newOrder[0];
            yield (findBuyer === null || findBuyer === void 0 ? void 0 : findBuyer.save());
            yield (findCow === null || findCow === void 0 ? void 0 : findCow.save());
            yield (findSeller === null || findSeller === void 0 ? void 0 : findSeller.save());
            yield session.commitTransaction();
            yield session.endSession();
        }
        catch (error) {
            yield session.abortTransaction();
            yield session.endSession();
            throw error;
        }
    }
    if (newOrderAllData) {
        newOrderAllData = yield order_model_1.default.findOne({
            _id: newOrderAllData._id,
        }).populate({
            path: 'cow',
        });
    }
    return newOrderAllData;
});
const getAllOrders = (paginationOptions, loggedinUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    console.log(78, loggedinUser);
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    let result;
    let total = 0;
    if (loggedinUser.role === 'admin') {
        console.log(86);
        result = yield order_model_1.default.find({})
            .populate({ path: 'cow' })
            .populate({ path: 'buyer' })
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);
        total = yield order_model_1.default.countDocuments({});
    }
    if (loggedinUser.role === 'buyer') {
        result = yield order_model_1.default.find({})
            .populate({ path: 'cow' })
            .populate({ path: 'buyer' })
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);
        total = yield order_model_1.default.countDocuments({});
        result = result.filter(item => {
            var _a;
            return (JSON.stringify((_a = item === null || item === void 0 ? void 0 : item.buyer) === null || _a === void 0 ? void 0 : _a._id) === JSON.stringify(loggedinUser.userId));
        });
        console.log(111, result);
    }
    if (loggedinUser.role === 'seller') {
        result = yield order_model_1.default.find({})
            .populate({ path: 'cow' })
            .populate({ path: 'buyer' })
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);
        total = yield order_model_1.default.countDocuments({});
        result = result.filter(item => {
            return JSON.stringify(item === null || item === void 0 ? void 0 : item.cow) === JSON.stringify(loggedinUser.userId);
            // return (
            //   JSON.stringify(item?.cow?.seller) ===
            //   JSON.stringify(loggedinUser.userId)
            // )
        });
    }
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleOrder = (id, loggedinUser) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    let total = 0;
    console.log(163, loggedinUser);
    if (loggedinUser.role === 'buyer') {
        result = yield order_model_1.default.find({ _id: id })
            .populate({ path: 'cow' })
            .populate({ path: 'buyer' });
        total = yield order_model_1.default.countDocuments({});
        result = result.find(item => {
            var _a;
            return (JSON.stringify((_a = item === null || item === void 0 ? void 0 : item.buyer) === null || _a === void 0 ? void 0 : _a._id) === JSON.stringify(loggedinUser.userId));
        });
    }
    if (loggedinUser.role === 'seller') {
        result = yield order_model_1.default.find({ _id: id })
            .populate({ path: 'cow' })
            .populate({ path: 'buyer' });
        total = yield order_model_1.default.countDocuments({});
        result = result.find(item => {
            return JSON.stringify(item === null || item === void 0 ? void 0 : item.cow) === JSON.stringify(loggedinUser.userId);
            // return (
            //   JSON.stringify(item?.cow?.seller) ===
            //   JSON.stringify(loggedinUser.userId)
            // )
        });
        // console.log(111, result)
    }
    return {
        result,
    };
});
exports.OrderService = {
    createOrder,
    getAllOrders,
    getSingleOrder,
};
