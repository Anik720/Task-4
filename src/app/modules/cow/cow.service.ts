import mongoose, { SortOrder } from 'mongoose'
import config from '../../../config'
import ApiError from '../../../errors/ApiErrors'
import httpStatus from 'http-status'
import { IpaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'
import { paginationHelpers } from '../../../helper/pagination'
import { ICow, ICowFilters } from './cow.interface'
import Cow from './cow.model'
import { cowSearchableFields } from './cow.constant'

const createCow = async (cow: ICow): Promise<ICow | null> => {
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
  const newCow = await Cow.create(cow)
  return newCow
}
const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: IpaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, ...filtersData } = filters
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  if (
    Object.keys(filtersData).length &&
    filtersData?.minPrice &&
    Object.keys(filtersData).length &&
    filtersData?.maxPrice
  ) {
    console.log(109)
    const cowsFiltered = await Cow.find({
      price: {
        $gte: filtersData?.minPrice,
        $lte: filtersData?.maxPrice,
      },
    })

    return {
      meta: {
        page,
        limit,
        total: cowsFiltered.length,
      },
      data: cowsFiltered,
    }
  }
  if (Object.keys(filtersData).length && filtersData?.maxPrice) {
    console.log(129)
    const cowsFiltered = await Cow.find({
      price: {
        $lte: filtersData?.maxPrice,
      },
    })

    return {
      meta: {
        page,
        limit,
        total: cowsFiltered.length,
      },
      data: cowsFiltered,
    }
  }

  if (Object.keys(filtersData).length && filtersData?.minPrice) {
    console.log(147)
    const cowsFiltered = await Cow.find({
      price: {
        $gte: filtersData?.minPrice,
      },
    })

    return {
      meta: {
        page,
        limit,
        total: cowsFiltered.length,
      },
      data: cowsFiltered,
    }
  }

  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await Cow.find(whereConditions)
    .populate({ path: 'seller' })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await Cow.countDocuments(whereConditions)

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findOne({ _id: id })
  return result
}

const updateCow = async (
  id: string,
  loggedinUser: any,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  const isExist = await Cow.findOne({ _id: id })
  console.log(209, isExist)
  if (JSON.stringify(isExist?.seller) !== JSON.stringify(loggedinUser.userId)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not authorized!')
  }
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found !')
  }

  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}

const deleteCow = async (
  id: string,
  loggedinUser: any
): Promise<ICow | null> => {
  const isExist = await Cow.findOne({ _id: id })
  console.log(220, isExist)
  if (
    isExist &&
    JSON.stringify(isExist.seller) !== JSON.stringify(loggedinUser.userId)
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not authorized!')
  }
  const result = await Cow.findByIdAndDelete({ _id: id })

  return result
}

export const CowService = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
}
