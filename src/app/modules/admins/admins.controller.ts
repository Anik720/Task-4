import { Request, Response, NextFunction, RequestHandler } from 'express'

import httpStatus from 'http-status'
import { catchAsync } from '../../../shared/catchAsync'
import { UserService } from '../users/users.service'
import { IUser } from '../users/users.interface'
import sendResponse from '../../../shared/sendResponse'
import pick from '../../../shared/pick'
import { userSearchableFields } from '../users/user.constant'
import { paginationFields } from '../../../constants/pagination'
import { AdminService } from './admins.service'
import config from '../../../config'
import { ILoginUserResponse, IRefreshTokenResponse } from './admins.constant'

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body
    const result = await UserService.createStudent(userData)
    console.log(result)
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully',
      data: result,
    })
  }
)

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body
  const result = await AdminService.loginUser(loginData)
  const { refreshToken, ...others } = result

  // set refresh token into cookie

  const cookieOptions = {
    secure: false,
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User lohggedin successfully !',
    data: others,
  })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  console.log('52', req.cookies)
  const { refreshToken } = req.cookies

  const result = await AdminService.refreshToken(refreshToken)

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'New access token generated successfully !',
    data: result,
  })
})

export const AdminController = {
  createAdmin,
  loginUser,
  refreshToken,
}
