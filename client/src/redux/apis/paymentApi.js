import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

const paymentApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  reducerPath: 'onlinePayment',
  tagTypes: ['OnlinePayment'],
  endpoints: (builder) => ({
    getOnlinePayment: builder.mutation({
      query: (payload) => ({
        url: `/orders/createOnlineOrder`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['OnlinePayment'],
    }),
  }),
})

export const { useGetOnlinePaymentMutation } = paymentApi
export default paymentApi
