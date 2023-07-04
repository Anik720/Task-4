import express from 'express'
import { UserRouter } from '../modules/users/users.routes'
import { CowRouter } from '../modules/cow/cow.route'
import { OrderRouter } from '../modules/Order/order.route'
import { AdminRouter } from '../modules/admins/admins.routes'

const router = express.Router()
const moduleRoutes = [
  {
    path: '/',
    route: UserRouter,
  },
  {
    path: '/cows',
    route: CowRouter,
  },
  {
    path: '/orders',
    route: OrderRouter,
  },
  {
    path: '/admins',
    route: AdminRouter,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
