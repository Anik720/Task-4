import { Request, Response, NextFunction, RequestHandler } from 'express'
import { catchAsync } from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import pick from '../../../shared/pick'
import { CowService } from './cow.service'
import { ICow } from './cow.interface'
import { cowFilterableFields, cowSearchableFields } from './cow.constant'
const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...cowData } = req.body
    const result = await CowService.createCow(cowData)

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow created successfully',
      data: result,
    })
  }
)

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await CowService.getAllCows(filters, paginationOptions)

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cows retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await CowService.getSingleCow(id)

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved successfully',
    data: result,
  })
})

const updateCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const updatedData = req.body
  const loggedinUser = req.user
  const result = await CowService.updateCow(id, loggedinUser, updatedData)
  console.log(204, req.user)
  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow updated successfully !',
    data: result,
  })
})
const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const loggedinUser = req.user
  const result = await CowService.deleteCow(id, loggedinUser)

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted successfully',
    data: result,
  })
})
export const CowController = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
}
