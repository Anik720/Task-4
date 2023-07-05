import express from 'express'
import { UserController } from './users.controller'
import validateRequest from '../../middlewares/validateRequest'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
import { AdminController } from '../admins/admins.controller'

const router = express.Router()

router.patch(
  '/users/my-profile',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  UserController.updateProfile
)

router.get(
  '/users/my-profile',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  UserController.myProfile
)

router.post('/auth/signup', UserController.createUser)
router.post(
  '/auth/refresh-token',

  AdminController.refreshToken
)
router.post(
  '/auth/login',

  AdminController.loginUser
)
router.get(
  '/users/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.getSingleUser
)
router.patch(
  '/users/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.updateUser
)
router.delete(
  '/users/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.deleteUser
)

router.get('/users', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers)
export const UserRouter = router
