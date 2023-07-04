import { Model, Schema, model } from 'mongoose'
import { IUser, UserModel } from './users.interface'
import bcrypt from 'bcrypt'
import config from '../../../config'
const userSchema = new Schema<IUser>(
  {
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ['seller', 'buyer', 'admin'] },

    password: { type: String, required: true },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    address: { type: String, required: true },
    budget: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)
userSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<Pick<
  IUser,
  '_id' | 'password' | 'role' | 'phoneNumber' | 'name' | 'address'
> | null> {
  return await User.findOne(
    { phoneNumber },
    { _id: 1, phoneNumber: 1, password: 1, role: 1 }
  )
}

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  console.log(48, givenPassword, savedPassword)
  console.log(await bcrypt.compare(givenPassword, savedPassword))
  return await bcrypt.compare(givenPassword, savedPassword)
}

// User.create() / user.save()
userSchema.pre('save', async function (next) {
  // hashing user password
  const user = this
  console.log('this', this)
  if (user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bycrypt_salt_rounds)
    )
  }

  next()
})
const User = model<IUser, UserModel>('User', userSchema)

export default User
