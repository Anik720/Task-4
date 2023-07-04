import mongoose, { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiErrors'
import { IUser, IUserFilters } from './users.interface'
import User from './users.model'
import httpStatus from 'http-status'
import { userSearchableFields } from './user.constant'
import { IpaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'
import { paginationHelpers } from '../../../helper/pagination'

const createStudent = async (user: IUser): Promise<IUser | null> => {
  const newUser = await User.create(user)
  return newUser
}
const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IpaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
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

  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await User.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await User.countDocuments(whereConditions)

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findOne({ _id: id })
  return result
}

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
  }

  const { name, ...userData } = payload

  const updatedUserData: Partial<IUser> = { ...userData }

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser> // `name.fisrtName`
      ;(updatedUserData as any)[nameKey] = name[key as keyof typeof name]
    })
  }
  console.log(updatedUserData)
  const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  })
  return result
}
const updateProfile = async (
  loggedinUser: any,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: loggedinUser.userId })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
  }

  const { name, ...userData } = payload

  const updatedUserData: Partial<IUser> = { ...userData }

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser> // `name.fisrtName`
      ;(updatedUserData as any)[nameKey] = name[key as keyof typeof name]
    })
  }
  console.log(updatedUserData)
  const result = await User.findOneAndUpdate(
    { _id: loggedinUser.userId },
    updatedUserData,

    {
      new: true,
    }
  )
  let obj = {
    password: result?.password,
    name: result?.name,
    phoneNumber: result?.phoneNumber,
    address: result?.address,
  }
  return obj
}

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete({ _id: id })

  return result
}
const myProfile = async (loggedinUser: any): Promise<IUser | null> => {
  console.log('loggedinUser', loggedinUser)
  const result = await User.findOne(
    { _id: loggedinUser?.userId },
    { name: 1, address: 1, phoneNumber: 1 }
  )

  return result
}

export const UserService = {
  createStudent,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  myProfile,
  updateProfile,
}
