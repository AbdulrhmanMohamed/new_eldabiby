import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

export const webhookApi = createApi({
  reducerPath: 'webhook',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  tagTypes: ['webhook'],
  endpoints: (builder) => ({
    webhookPayment: builder.mutation({
      query: (paymentId) => ({
        url: `/webhook/moyasar`,
        method: 'POST',
        body: { id: paymentId },
      }),
      invalidatesTags: ['webhook'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useWebhookPaymentMutation } = webhookApi
export default webhookApi
