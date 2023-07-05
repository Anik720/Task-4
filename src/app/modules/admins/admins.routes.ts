import express from 'express'
import { AdminController } from './admins.controller'

const router = express.Router()

router.post('/create-admin', AdminController.createAdmin)
router.post(
  '/login',

  AdminController.loginUser
)

export const AdminRouter = router
