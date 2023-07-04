import express from 'express'
import { AdminController } from './admins.controller'

const router = express.Router()

router.post('/create-admin', AdminController.createAdmin)
router.post(
  '/login',

  AdminController.loginUser
)

router.post(
  '/refresh-token',

  AdminController.refreshToken
)
export const AdminRouter = router
