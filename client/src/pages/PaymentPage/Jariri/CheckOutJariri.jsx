import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormLabel,
  Grid,
  InputBase,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { cityEnglish } from '../../../components/providers/city-english'
import VerifiedCode from '../../../components/verification/VerifiedCode'
import { imageBaseUrl } from '../../../constants/baseUrl'
import { useLazyGetMeQuery } from '../../../redux/apis/UserApis'
import {
  useGetAllCartsQuery,
  useVerifyCartMutation,
} from '../../../redux/apis/cartApi'
import { useAddOrderMutation } from '../../../redux/apis/ordersApi'
import { useGetUserCodeMutation } from '../../../redux/apis/verifiedCodeApi'
import { JaririStyle } from './Style'

// ================================|| CHECKOUT - BILLING DETAILS ||================================ //
const BillingDetails = props => {
  const [openModal, setOpenModal] = useState(false)
  const [userPhone, setUserPhone] = useState('')
  const [userData, setUserData] = useState({})
  const [_, { language }] = useTranslation()
  const [addOrder, { isLoading: orderLoad }] = useAddOrderMutation()
  const { refetch } = useGetAllCartsQuery(undefined)
  const [getUserCode, { isLoading: codeLoad }] = useGetUserCodeMutation()
  const navigate = useNavigate()
  const [getMe] = useLazyGetMeQuery(undefined)
  const [submitCheckout, { isLoading: verfyCouponLoading }] =
    useVerifyCartMutation()
  useEffect(() => {
    getMe(undefined).then(({ data }) => {
      if (data?.data) {
        setUserData(data?.data)
        formik.setFieldValue('email', data?.data?.email || '')
        formik.setFieldValue('phone', data?.data?.phone || '')
        formik.setFieldValue('name', data?.data?.name || '')
      }
    })
  }, [])
  const handelerCode = (code, phone) => {
    getUserCode({ code, phone })
      .unwrap()
      .then(res => {
        refetch()
        toast.success(res[`success_${language}`])
        if (res.paymentType === 'cash') {
          navigate('/thankYou')
        } else {
          navigate('/payment-order')
        }
      })
      .catch(err => {
        toast.error(err.data[`error_${language}`])
      })
  }
  const formik = useFormik({
    initialValues: {
      city: '',
      name: '',
      area: '',
      address: '',
      postalCode: '',
      phone: '',
      email: '',
      orderNotes: '',
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .required(language === 'en' ? 'Name Required' : 'الاسم مطلوب')
        .matches(
          /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
          language === 'en'
            ? 'Name must be in English'
            : 'يجب أن يكون الاسم باللغة الإنجليزية'
        ),

      area: yup
        .string()
        .required(language === 'en' ? 'Area Required' : 'المنطقة مطلوبة'),
      address: yup
        .string()
        .required(language === 'en' ? 'Address Required' : 'العنوان مطلوب'),
      city: yup
        .string()
        .required(language === 'en' ? 'City Required' : 'المدينة مطلوبة'),
      phone: yup
        .string()
        .required(language === 'en' ? 'Phone Required' : 'الهاتف مطلوب')
        .matches(
          /^\+?[0-9]+$/, // Updated regular expression to allow only digits
          language === 'en'
            ? 'Phone must contain only numbers'
            : 'يجب أن يحتوي الهاتف على أرقام فقط'
        )
        .length(
          userData?.email && !userData?.phone ? 9 : 13,
          language === 'en'
            ? 'Phone must be 12 digits'
            : 'يجب أن يكون رقم الهاتف 12 رقمًا'
        ),
      email: yup
        .string()
        .required(
          language === 'en' ? 'Email Required' : 'البريد الالكتروني مطلوب'
        )
        .email(
          language === 'en' ? 'Email is invalid' : 'البريد الالكتروني غير صالح'
        ),
      postalCode: yup
        .string()
        .matches(
          /^\d+$/,
          language === 'en'
            ? 'Postal Code must contain only numbers'
            : 'يجب أن يحتوي الرمز البريدي على أرقام فقط'
        )
        .required(
          language === 'en' ? 'Postal Code Required' : 'الرمز البريدي مطلوب'
        ),
      orderNotes: yup.string().optional(),
    }),
    onSubmit: values => {
      const data = {
        ...values,
        phone: values.phone.startsWith('+966')
          ? values.phone
          : `+966${values.phone}`,
      }
      if (values.orderNotes === '') {
        delete data.orderNotes
      }
      const couponData = JSON.parse(localStorage.getItem('couponData'))

      if (couponData?.couponEnter !== '') {
        submitCheckout({
          productsIds: couponData?.products,
          code: couponData?.couponEnter,
        })
          .unwrap()
          .then(res => {
            toast.success(res[`success_${language === 'en' ? 'en' : 'ar'}`])

            // cartApi.endpoints.getAllCarts.initiate()

            addOrder(data)
              .unwrap()
              .then(res => {
                setUserPhone(res?.data?.phone)
                setOpenModal(true)
              })
              .catch(err => {
                toast.error(err.data[`error_${language}`])
              })
            // nav('/checkout')
          })
          .catch(e => {
            // toast.error(e?.data[`error_${lng === 'en' ? 'en' : 'ar'}`]);
            toast.error(e?.data[`error_${language === 'en' ? 'en' : 'ar'}`])
          })
      } else {
        addOrder(data)
          .unwrap()
          .then(res => {
            setUserPhone(res?.data?.phone)
            setOpenModal(true)
          })
      }
    },
  })

  const Data = useMemo(() => cityEnglish, [cityEnglish, language])
  const { handleBlur, handleChange } = formik
  return (
    <Box
      sx={{
        direction: language === 'en' ? 'ltr' : 'rtl',
      }}
    >
      <Container
        sx={{
          py: 2,
        }}
      >
        <Box
          sx={{
            borderBottom: 2,
            borderColor: props.color ? props.color : 'gray',
            py: 2,

            marginBottom: 4,
          }}
        >
          <Typography
            variant='h4'
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '25px', md: '30px' },
              color: props.color?.title,
            }}
          >
            {language === 'en' ? 'Billing Details' : 'تفاصيل الفاتورة'}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: props.color?.label, mt: 2 }} />
        {/* form */}

        <form onSubmit={formik.handleSubmit}>
          <Box mt={4}>
            <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en' ? 'Name' : 'الاسم'}
            </FormLabel>
            <InputBase
              name='name'
              onBlur={formik.handleBlur}
              value={formik.values.name}
              onChange={formik.handleChange}
              sx={{
                width: '100%',
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `2px solid ${props.color?.label ? props.color?.label : 'gray'
                  }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
              }}
            />
            {formik.touched.name && formik.errors.name ? (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.name}
              </Typography>
            ) : null}
          </Box>
          <Box mt={3}>
            <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en' ? 'City' : 'المدينة'}
            </FormLabel>
            <Autocomplete
              disablePortal
              clearOnBlur
              onBlur={formik.handleBlur}
              // value={formik.values.city}
              getOptionLabel={option =>
                language === 'en' ? option.en : option.ar
              }
              onChange={(e, value) => {
                formik.setFieldValue('city', value?.en)
              }}
              id='combo-box-demo'
              options={Data}
              sx={{
                width: '100%',
                height: { xs: '65px', sm: '75px', md: '55px' },
                borderRadius: 0,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px' }, // Adjust the font size as needed
                  ml: 2,
                },
                backgroundColor: 'transparent !important',
                '.MuiAutocomplete-inputRoot.MuiInputBase-adornedEnd.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-fullWidth.MuiInputBase-root.MuiOutlinedInput-root.css-154xyx0-MuiInputBase-root-MuiOutlinedInput-root':
                {
                  border: `2px solid ${props.color?.label ? props.color?.label : 'gray'
                    } !important`,
                  borderRadius: '0 !important',
                },
                '.css-segi59': {
                  border: `2px solid ${props.color?.label ? props.color?.label : 'gray'
                    } !important`,
                  borderRadius: '0 !important',
                  outline: 'none !important',
                },
              }}
              renderInput={params => <TextField name='city' {...params} />}
            />

            {formik.touched.city && formik.errors.city && (
              <Typography sx={{ color: 'red', mt: 1 }}>
                {formik.errors.city}
              </Typography>
            )}
          </Box>
          <Box mt={3}>
            <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en' ? 'Area' : 'المنطقة'}
            </FormLabel>
            <InputBase
              name='area'
              onBlur={formik.handleBlur}
              value={formik.values.area}
              onChange={formik.handleChange}
              sx={{
                width: '100%',
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `2px solid ${props.color?.label ? props.color?.label : 'gray'
                  }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
              }}
            />
            {formik.touched.area && formik.errors.area && (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.area}
              </Typography>
            )}
          </Box>
          <Box mt={3}>
            <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en' ? 'Address' : 'العنوان'}
            </FormLabel>
            <InputBase
              name='address'
              onBlur={formik.handleBlur}
              value={formik.values.address}
              onChange={formik.handleChange}
              sx={{
                width: '100%',
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `2px solid ${props.color?.label ? props.color?.label : 'gray'
                  }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
              }}
            />
            {formik.touched.address && formik.errors.address && (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.address}
              </Typography>
            )}
          </Box>
          <Box mt={3}>
            <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en' ? 'Postal Code' : 'الرمز البريدي'}
            </FormLabel>
            <InputBase
              name='postalCode'
              onBlur={formik.handleBlur}
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              sx={{
                width: '100%',
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `2px solid ${props.color?.label ? props.color?.label : 'gray'
                  }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
              }}
            />
            {formik.touched.postalCode && formik.errors.postalCode && (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.postalCode}
              </Typography>
            )}
          </Box>
          <Box mt={3}>
            <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en' ? 'Phone' : 'الهاتف'}
            </FormLabel>

            <InputBase
              name='phone'
              onBlur={formik.handleBlur}
              value={
                userData?.email && !formik.values.phone.startsWith('+966')
                  ? `+966${formik.values.phone}`
                  : formik.values.phone
              }
              onChange={event => {
                const { value, selectionStart, selectionEnd } = event.target
                const prefix = '+966'
                // Check if the value starts with "+966" and only allow editing the part after it
                if (userData?.email && !userData?.phone) {
                  if (value.startsWith('+966')) {
                    const userInput = value.substring(4) // Remove "+966" from the input
                    formik.handleChange('phone')(userInput) // Update the user's input
                  } else {
                    // If the input does not start with "+966," keep the previous value
                    formik.handleChange('phone')(formik.values.phone)
                  }
                } else {
                  // When user doesn't have an email, prevent deletion of "+966"
                  if (
                    (selectionStart && selectionStart < prefix.length) ||
                    (selectionEnd && selectionEnd < prefix.length)
                  ) {
                    event.preventDefault()
                  } else {
                    formik.handleChange('phone')(value)
                  }
                }
              }}
              sx={{
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `2px solid ${props.color?.label ? props.color?.label : 'gray'
                  }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                width: '100%',
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
              }}
            />
            {formik.touched.phone && formik.errors.phone && (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.phone}
              </Typography>
            )}
          </Box>
          <Box mt={3}>
            <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en' ? 'Email' : 'البريد الالكتروني'}
            </FormLabel>
            <InputBase
              name='email'
              onBlur={formik.handleBlur}
              value={formik.values.email}
              onChange={formik.handleChange}
              sx={{
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `2px solid ${props.color?.label ? props.color?.label : 'gray'
                  }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                width: '100%',
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
              }}
            />
            {formik.touched.email && formik.errors.email && (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.email}
              </Typography>
            )}
          </Box>
          <Box mt={3}>
            <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en'
                ? ' Order Notes (optional)'
                : 'ملاحظات الطلب (اختياري)'}
            </FormLabel>
            <InputBase
              name='orderNotes'
              onBlur={formik.handleBlur}
              value={formik.values.orderNotes}
              onChange={formik.handleChange}
              sx={{
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `2px solid ${props.color?.label ? props.color?.label : 'gray'
                  }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                width: '100%',
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
              }}
            />
            {formik.touched.orderNotes && formik.errors.orderNotes && (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.orderNotes}
              </Typography>
            )}
          </Box>

          <Button
            disabled={orderLoad}
            type='submit'
            sx={{
              mt: 6,
              mb: 5,
              width: '100%',
              height: '60px',
              borderRadius: '15px',
              bgcolor: props.button?.backgroundColor
                ? `${props.button?.backgroundColor} !important`
                : 'black !important',
              color: props.button?.color
                ? `${props.button?.color} !important`
                : 'white',
              fontSize: { xs: '15px', md: '20px' },
              textTransform: 'none',
            }}
          >
            {orderLoad ? (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress
                  sx={{
                    color: props.button?.color || 'white',
                  }}
                />
              </Box>
            ) : language === 'en' ? (
              'Order Now'
            ) : (
              'اطلب الآن'
            )}
          </Button>
        </form>
      </Container>

      <VerifiedCode
        open={openModal}
        handelerCode={handelerCode}
        userPhone={userPhone}
        loading={codeLoad}
      />
    </Box>
  )
}
// ================================================================================================ //

// ================================|| CHECKOUT - ORDER SUMMARY ||================================ //

const cartPrice = (total, quantity, price) => {
  const pricePlusTax = total / quantity
  const tax = pricePlusTax - price
  return tax
}

const OrderSummary = ({ color }) => {
  const { currencyPrice, label } = useSelector(state => state.currency)
  const labelText = label.match(/\(([^)]+)\)/)
  const currencySymbol = labelText ? labelText[1] : ''
  const [_, { language }] = useTranslation()
  const { data, isSuccess } = useGetAllCartsQuery(undefined)
  const cashItems = data?.data.cashItems?.items || []
  const onlineItems = data?.data.onlineItems?.items || []
  const productInCart = [...cashItems, ...onlineItems]


  let couponData = JSON.parse(localStorage.getItem('couponData'));
  const calculateCartPrice = (online, cash) => {
    return ((online + cash) * currencyPrice).toFixed(2)
  }
  return (
    <Box>
      <Container
        sx={{
          mt: 4,
          p: 2,
        }}
      >
        {/* prouduct with images */}

        <Box
          sx={{
            overflowY: 'auto', // Apply scroll only if more than 3 items
            height: { xs: '300px', md: '400px' },
          }}
        >
          {productInCart?.map(item => (
            <Stack
              key={item.product.id}
              direction='row'
              sx={{
                mt: 2,
                mb: 2,
                p: 2,
                borderBottom: `2px solid ${color?.title ? color?.title : 'gray'
                  }`,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  width: { xs: '100px', md: '100px' },
                  height: { xs: '100px', md: '70px' },
                  overflow: 'hidden',
                  borderRadius: '10px',
                  boxShadow: `0px 0px 5px 0px ${color?.title ? color?.title : 'gray'
                    }`,
                }}
              >
                <img
                  src={`${imageBaseUrl}${item.product.images[0]}`}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: color?.title ? color?.title : 'gray',
                    mx: { xs: 2, lg: 0 },
                  }}
                >
                  {item.product[`title_${language}`]}
                </Typography>
                <Typography
                  sx={{
                    color: color?.title ? color?.title : 'gray',
                    mx: { xs: 2, lg: 0 },
                  }}
                >
                  {language == 'en' ? 'Quentity' : 'العدد'} {item?.quantity}
                </Typography>
              </Box>

              <Stack
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Typography
                  sx={{
                    color: color?.title ? color?.title : 'gray',
                  }}
                >
                  {item.product.priceAfterDiscount
                    ? (
                      (cartPrice(
                        item.total,
                        item.quantity,
                        item.product.finalPrice
                      ) +
                        item.product.priceAfterDiscount) *
                      currencyPrice
                    ).toFixed(2)
                    : (
                      (cartPrice(
                        item.total,
                        item.quantity,
                        item.product.finalPrice
                      ) +
                        item.product.priceBeforeDiscount) *
                      currencyPrice
                    ).toFixed(2)}{' '}
                  {currencySymbol}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Box>

        <Stack
          direction={'row'}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 7,
            mb: 2,
            pb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {language === 'en' ? 'Cash on delivery:' : 'الدفع عند الاستلام'}
            </Typography>
          </Box>

          {/* get user order */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {data?.data.cashItems.totalPrice !== 0
                ? (data?.data.cashItems.totalPrice * currencyPrice).toFixed(2)
                : 0}{' '}
              {currencySymbol}
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction={'row'}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 4,
            mb: 2,
            pb: 2,
            borderBottom: `2px solid ${color?.title ? color?.title : 'gray'}`,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {language === 'en' ? 'Online payment:' : ' الدفع الالكتروني'}
            </Typography>
          </Box>

          {/* get user order */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {data?.data.onlineItems.totalPrice !== 0
                ? (data?.data.onlineItems.totalPrice * currencyPrice).toFixed(2)
                : 0}{' '}
              {currencySymbol}
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction={'row'}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 4,
            mb: 2,
            pb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {language === 'en' ? 'Total' : ' الاجمالي'}
            </Typography>
          </Box>

          {/* get user order */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {

                couponData
                  ?.couponEnter ? couponData?.total :
                  calculateCartPrice(data?.data?.onlineItems.totalPrice, data?.data?.cashItems.totalPrice)}{" "}
              {currencySymbol}
            </Typography>
          </Box>
        </Stack>
        {/* {
              JSON.parse(localStorage.getItem('couponData'))?.couponEnter!==""?
        <Stack
          direction={'row'}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 4,
            mb: 2,
            pb: 2,
          }}
        >
          
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {language === 'en' ? 'Total After Discount' : '  الاجمالي بعد الخصم' }
            </Typography>
          </Box>

 
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
         
           
  <Typography
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {(JSON.parse(localStorage.getItem('couponData'))?.total.toFixed(2))}{" "}
              {currencySymbol}
            </Typography>
             
          
          </Box>
\
        </Stack>:null} */}
      </Container>
    </Box>
  )
}
// ================================================================================================ //

// ===========================|| CHECKOUT ||=========================== //

const CheckOutJariri = () => {
  const [, { language }] = useTranslation()

  return (
    <Box
      sx={{
        direction: language === 'en' ? 'ltr' : 'rtl',
        mt: 5,
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '90%' },
          mx: 'auto',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', md: 'row' },
          }}
        >
          <Grid item xs={12} md={7} lg={8}>
            <BillingDetails
              color={JaririStyle.color}
              button={JaririStyle.button}
            />
          </Grid>

          <Grid item xs={12} md={5} lg={3.6}>
            <OrderSummary color={JaririStyle.color} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default CheckOutJariri
