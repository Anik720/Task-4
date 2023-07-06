import mongoose, { ObjectId, SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiErrors'
import httpStatus from 'http-status'
import { IpaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'
import { paginationHelpers } from '../../../helper/pagination'
import { IOrder } from './order.interface'
import User from '../users/users.model'
import Cow from '../cow/cow.model'
import Order from './order.model'

const createOrder = async (order: IOrder): Promise<IOrder | null> => {
  const findBuyer = await User.findById({ _id: order.buyer }, { budget: 1 })
  const findCow = await Cow.findById(
    { _id: order.cow },
    { price: 1, label: 1, seller: 1 }
  )

  // generate student id
  let newOrderAllData = null
  if (
    findBuyer &&
    findCow &&
    findBuyer?.budget &&
    findCow?.price &&
    findBuyer?.budget < findCow?.price
  ) {
    throw new ApiError(400, 'You have not enough budget.')
  } else {
    const session = await mongoose.startSession()
    try {
      session.startTransaction()
      if (findCow) {
        findCow.label = 'sold out'
      }

      let newBudget =
        findBuyer && findCow && findBuyer?.budget && findCow?.price
          ? findBuyer?.budget - findCow?.price
          : 0
      if (findBuyer) {
        findBuyer.budget = newBudget
      }

      const findSeller = await User.findOne(
        { _id: findCow?.seller },
        { income: 1 }
      )

      //array
      if (findSeller && findSeller?.income && findCow?.price) {
        findSeller.income = findCow?.price + findSeller?.income

        // findSeller.income =
        //   findCow && findSeller && findSeller.income
        //     ? findCow?.price + findSeller.income
        //     : 0
      }
      const newOrder = await Order.create([order], { session })

      if (!newOrder.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create order')
      }

      newOrderAllData = newOrder[0]
      await findBuyer?.save()
      await findCow?.save()
      await findSeller?.save()
      await session.commitTransaction()
      await session.endSession()
    } catch (error) {
      await session.abortTransaction()
      await session.endSession()
      throw error
    }
  }

  if (newOrderAllData) {
    newOrderAllData = await Order.findOne({
      _id: newOrderAllData._id,
    }).populate({
      path: 'cow',
    })
  }

  return newOrderAllData
}
const getAllOrders = async (
  paginationOptions: IpaginationOptions,
  loggedinUser: any
): Promise<IGenericResponse<IOrder[] | null>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const sortConditions: { [key: string]: SortOrder } = {}
  console.log(78, loggedinUser)
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  let result
  let total = 0
  if (loggedinUser.role === 'admin') {
    console.log(86)
    result = await Order.find({})
      .populate({ path: 'cow' })
      .populate({ path: 'buyer' })
      .sort(sortConditions)
      .skip(skip)
      .limit(limit)

    total = await Order.countDocuments({})
  }
  if (loggedinUser.role === 'buyer') {
    result = await Order.find({})
      .populate({ path: 'cow' })
      .populate({ path: 'buyer' })
      .sort(sortConditions)
      .skip(skip)
      .limit(limit)

    total = await Order.countDocuments({})

    result = result.filter(item => {
      return (
        JSON.stringify(item?.buyer?._id) === JSON.stringify(loggedinUser.userId)
      )
    })
    console.log(111, result)
  }
  if (loggedinUser.role === 'seller') {
    result = await Order.find({})
      .populate({ path: 'cow' })
      .populate({ path: 'buyer' })
      .sort(sortConditions)
      .skip(skip)
      .limit(limit)

    total = await Order.countDocuments({})

    result = result.filter(item => {
      return JSON.stringify(item?.cow) === JSON.stringify(loggedinUser.userId)
      // return (
      //   JSON.stringify(item?.cow?.seller) ===
      //   JSON.stringify(loggedinUser.userId)
      // )
    })
  }

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

const getSingleOrder = async (id: string, loggedinUser: any) => {
  let result
  let total = 0

  if (loggedinUser.role === 'buyer') {
    result = await Order.find({ _id: id })
      .populate({ path: 'cow' })
      .populate({ path: 'buyer' })

    total = await Order.countDocuments({})

    result = result.find(item => {
      return (
        JSON.stringify(item?.buyer?._id) === JSON.stringify(loggedinUser.userId)
      )
    })
  }
  if (loggedinUser.role === 'seller') {
    result = await Order.find({ _id: id })
      .populate({ path: 'cow' })
      .populate({ path: 'buyer' })

    total = await Order.countDocuments({})

    result = result.find(item => {
      return JSON.stringify(item?.cow) === JSON.stringify(loggedinUser.userId)
      // return (
      //   JSON.stringify(item?.cow?.seller) ===
      //   JSON.stringify(loggedinUser.userId)
      // )
    })
    // console.log(111, result)
  }

  return {
    result,
  }
}

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
}
