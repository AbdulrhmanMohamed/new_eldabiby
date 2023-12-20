import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart: 0,
  totalPrice: 0,
}
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    incrementCart: (state) => {
      state.cart++
    },
    DecrementCart: (state) => {
      state.cart -= 1
    },
    setCart: (state, action) => {
      state.cart = action.payload
    },
    calculateTheTotalCart: (state, action) => {
      let sumRes = 0
      action.payload.forEach((item) => {
        sumRes += item?.product?.price * item?.Quantity
      })
      state.totalPrice = sumRes
    },
  },
})

export const { incrementCart, DecrementCart, setCart, calculateTheTotalCart } =
  cartSlice.actions
export default cartSlice.reducer
