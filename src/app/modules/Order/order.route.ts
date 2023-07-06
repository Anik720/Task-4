import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { OrderController } from './order.controller'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'

const router = express.Router()

router.post('/', auth(ENUM_USER_ROLE.BUYER), OrderController.createOrder)
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  OrderController.getSingleOrder
)

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  OrderController.getAllOrders
)
export const OrderRouter = router
