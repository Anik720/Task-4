import { Request, Response, NextFunction, RequestHandler } from 'express'
import { UserService } from './users.service'
import { catchAsync } from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import { IUser } from './users.interface'
import { userSearchableFields } from './user.constant'
import { paginationFields } from '../../../constants/pagination'
import pick from '../../../shared/pick'
const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body
    const result = await UserService.createStudent(userData)

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully',
      data: result,
    })
  }
)
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userSearchableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await UserService.getAllUsers(filters, paginationOptions)

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully !',
    meta: result.meta,
    data: result.data,
  })
})

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await UserService.getSingleUser(id)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  })
})

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const updatedData = req.body
  console.log(id)
  const result = await UserService.updateUser(id, updatedData)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully !',
    data: result,
  })
})
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await UserService.deleteUser(id)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  })
})
const myProfile = catchAsync(async (req: Request, res: Response) => {
  const loggedinUser = req.user
  const result = await UserService.myProfile(loggedinUser)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users information retrieved successfully',
    data: result,
  })
})
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const loggedinUser = req.user
  const updatedData = req.body
  const result = await UserService.updateProfile(loggedinUser, updatedData)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users information updated successfully',
    data: result,
  })
})
export const UserController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  myProfile,
  updateProfile,
}
