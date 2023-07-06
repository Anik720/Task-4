import { Request, Response, NextFunction, RequestHandler } from 'express'
import { catchAsync } from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import pick from '../../../shared/pick'
import { OrderService } from './order.service'
import { IOrder } from './order.interface'

const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...orderData } = req.body
    const result = await OrderService.createOrder(orderData)

    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order created successfully',
      data: result,
    })
  }
)

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields)
  const loggedinUser = req.user
  const result = await OrderService.getAllOrders(
    paginationOptions,
    loggedinUser
  )

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const loggedinUser = req.user
  const result = await OrderService.getSingleOrder(id, loggedinUser)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single order retrieved successfully',
    data: result,
  })
})

export const OrderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
}
