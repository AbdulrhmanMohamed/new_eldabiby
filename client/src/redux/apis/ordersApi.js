import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
let task = ''
const ordersApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  reducerPath: 'order',
  tagTypes: ['Orders', 'Cart'],
  endpoints: (builder) => ({
    getUserOrders: builder.query({
      query: () => '/orders/myOrders',
      providesTags: ['Orders'],
    }),
    addOrder: builder.mutation({
      query: (payload) => ({
        url: `/orders`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Orders', 'Cart'],
    }),
    getVerifyOrder: builder.mutation({
      query: (payload) => ({
        url: `/orders/verifyOrder`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Orders', 'Cart'],
    }),
  }),
})
export const {
  useGetUserOrdersQuery,
  useLazyGetUserOrdersQuery,
  useAddOrderMutation,
  useGetVerifyOrderMutation,
} = ordersApi
export default ordersApi
