import mongoose, { Model, Schema, model } from 'mongoose'
import { CowModel, ICow } from './cow.interface'
import { breed, location } from './cow.constant'

const cowSchema = new Schema<ICow>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, require: true, enum: location },
    breed: { type: String, required: true, enum: breed },
    weight: { type: Number, required: true },
    label: { type: String, required: true },
    category: { type: String, required: true },
    seller: {
      type: Schema.Types.ObjectId,

      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Cow = model<ICow, CowModel>('Cow', cowSchema)

export default Cow
