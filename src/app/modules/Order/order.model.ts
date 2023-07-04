import { Model, Schema, model } from 'mongoose'
import { IOrder, OrderModel } from './order.interface'

const orderSchema = new Schema<IOrder>(
  {
    cow: {
      type: Schema.Types.ObjectId,
      ref: 'Cow',
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Order = model<IOrder, OrderModel>('Order', orderSchema)

export default Order
