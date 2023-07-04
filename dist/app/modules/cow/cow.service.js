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
exports.CowService = void 0;
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../helper/pagination");
const cow_model_1 = __importDefault(require("./cow.model"));
const cow_constant_1 = require("./cow.constant");
const createCow = (cow) => __awaiter(void 0, void 0, void 0, function* () {
    // default password
    // set role
    // user.role = 'student'
    // const academicsemester = await AcademicSemester.findById(
    //   student.academicSemester
    // )
    // // generate student id
    // let newUserAllData = null
    // const session = await mongoose.startSession()
    // try {
    //   session.startTransaction()
    //   const id = await generateStudentId(academicsemester)
    //   user.id = id
    //   student.id = id
    //   //array
    //   const newStudent = await Student.create([student], { session })
    //   if (!newStudent.length) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student')
    //   }
    //   //set student -->  _id into user.student
    //   user.student = newStudent[0]._id
    //   const newUser = await User.create([user], { session })
    //   if (!newUser.length) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user')
    //   }
    //   newUserAllData = newUser[0]
    //   await session.commitTransaction()
    //   await session.endSession()
    // } catch (error) {
    //   await session.abortTransaction()
    //   await session.endSession()
    //   throw error
    // }
    // //user --> student ---> academicSemester, academicDepartment , academicFaculty
    // if (newUserAllData) {
    //   newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
    //     path: 'student',
    //     populate: [
    //       {
    //         path: 'academicSemester',
    //       },
    //       {
    //         path: 'academicDepartment',
    //       },
    //       {
    //         path: 'academicFaculty',
    //       },
    //     ],
    //   })
    // }
    // return newUserAllData
    const newCow = yield cow_model_1.default.create(cow);
    return newCow;
});
const getAllCows = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: cow_constant_1.cowSearchableFields.map(field => ({
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
    if (Object.keys(filtersData).length &&
        (filtersData === null || filtersData === void 0 ? void 0 : filtersData.minPrice) &&
        Object.keys(filtersData).length &&
        (filtersData === null || filtersData === void 0 ? void 0 : filtersData.maxPrice)) {
        console.log(109);
        const cowsFiltered = yield cow_model_1.default.find({
            price: {
                $gte: filtersData === null || filtersData === void 0 ? void 0 : filtersData.minPrice,
                $lte: filtersData === null || filtersData === void 0 ? void 0 : filtersData.maxPrice,
            },
        });
        return {
            meta: {
                page,
                limit,
                total: cowsFiltered.length,
            },
            data: cowsFiltered,
        };
    }
    if (Object.keys(filtersData).length && (filtersData === null || filtersData === void 0 ? void 0 : filtersData.maxPrice)) {
        console.log(129);
        const cowsFiltered = yield cow_model_1.default.find({
            price: {
                $lte: filtersData === null || filtersData === void 0 ? void 0 : filtersData.maxPrice,
            },
        });
        return {
            meta: {
                page,
                limit,
                total: cowsFiltered.length,
            },
            data: cowsFiltered,
        };
    }
    if (Object.keys(filtersData).length && (filtersData === null || filtersData === void 0 ? void 0 : filtersData.minPrice)) {
        console.log(147);
        const cowsFiltered = yield cow_model_1.default.find({
            price: {
                $gte: filtersData === null || filtersData === void 0 ? void 0 : filtersData.minPrice,
            },
        });
        return {
            meta: {
                page,
                limit,
                total: cowsFiltered.length,
            },
            data: cowsFiltered,
        };
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield cow_model_1.default.find(whereConditions)
        .populate({ path: 'seller' })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield cow_model_1.default.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleCow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.default.findOne({ _id: id });
    return result;
});
const updateCow = (id, loggedinUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.default.findOne({ _id: id });
    console.log(209, isExist);
    if (JSON.stringify(isExist === null || isExist === void 0 ? void 0 : isExist.seller) !== JSON.stringify(loggedinUser.userId)) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'You are not authorized!');
    }
    if (!isExist) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'Cow not found !');
    }
    const result = yield cow_model_1.default.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const deleteCow = (id, loggedinUser) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.default.findOne({ _id: id });
    console.log(220, isExist);
    if (isExist &&
        JSON.stringify(isExist.seller) !== JSON.stringify(loggedinUser.userId)) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'You are not authorized!');
    }
    const result = yield cow_model_1.default.findByIdAndDelete({ _id: id });
    return result;
});
exports.CowService = {
    createCow,
    getAllCows,
    getSingleCow,
    updateCow,
    deleteCow,
};
