import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
export const ProductsApi = createApi({
  reducerPath: 'Product',
  keepUnusedDataFor: 0,
  tagTypes: ['Product'],
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: headers => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  endpoints: builder => ({
    getAllProductsByCategory: builder.query({
      query: query =>
        `/categories/getAllCategoriesWithProducts?limit=10000&&populate=offer${
          query ? `&${query}` : ''
        }`,
      providesTags: ['Product'],
    }),
    getAllProducts: builder.query({
      query: query => `/products?${query ? query : ''}populate=offer`,
      providesTags: ['Product'],
    }),
    getAllProductsBySubId: builder.query({
      query: parameter => `/products/${parameter}`,
      providesTags: ['Product'],
    }),
    getMostSellingProducts: builder.query({
      query: () => `/products?sort=-sales`,
      providesTags: ['Product'],
    }),
    getMostNewiestProducts: builder.query({
      query: () => `/products?sort=-createdAt`,
      providesTags: ['Product'],
    }),
    getProductsOfCategory: builder.query({
      query: id => `/products/forSpecificCategory/${id}`,
      providesTags: ['Product'],
    }),
    getSingleProduct: builder.query({
      query: id => `/products/${id}`,
      providesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, product }) => ({
        url: `/products/${productId}`,
        body: product,
        method: 'PUT',
      }),
      invalidatesTags: ['Product'],
    }),
    addRating: builder.mutation({
      query: ({ productId, rating }) => ({
        url: `/reviews/product/${productId}`,
        body: { rating },
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
})

export const {
  useGetAllProductsQuery,
  useLazyGetAllProductsQuery,
  useGetAllProductsBySubIdQuery,
  useGetMostSellingProductsQuery,
  useGetMostNewiestProductsQuery,
  useGetProductsOfCategoryQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useAddRatingMutation,
  useGetAllProductsByCategoryQuery,
  useLazyGetProductsOfCategoryQuery,
} = ProductsApi
