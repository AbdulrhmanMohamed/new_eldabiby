import {
  Box,
  Button,
  CardMedia,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  tooltipClasses,
  Fade,
  Menu,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useGetAllCartsQuery,
  useLazyGetAllCartsQuery,
} from '../../../redux/apis/cartApi'
import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { imageBaseUrl } from '../../../constants/baseUrl'
import { toast } from 'react-toastify'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { colors } from './styles'
import { useSelector } from 'react-redux'

const qty = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Popover from '@mui/material/Popover'
import { useSubmitPointsMutation } from '../../../redux/apis/pointsApi'
import { useLazyCouponQueryQuery } from '../../../redux/apis/couponApi'
import styled from '@emotion/styled'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
const cartPrice = (total, quantity, price) => {
  const pricePlusTax = total / quantity
  const tax = pricePlusTax - price
  return tax
}
const ProductDiscount = (product) => {
  if (JSON.parse(localStorage.getItem('couponData'))) {
    const { products, couponEnter } = JSON.parse(
      localStorage.getItem('couponData')
    )
    console.log(products, product)
    if (products?.length && couponEnter !== '') {
      return products?.some((item) => item === product?.product?._id)
    }
  }
}

const calculateProductsAfterDiscount = (
  arr1,
  arr2,
  products,
  percent,
  callback
) => {
  console.log(arr1, arr2)
  const after1 = arr1.map((item) => {
    const { total } = item
    const itemAfterCoupon = (percent / 100) * total
    const isDiscount = products.includes(item.product._id)
    if (isDiscount)
      return { ...item, total: Math.abs(Math.ceil(total - itemAfterCoupon)) }
    return item
  })
  const after2 = arr2.map((item) => {
    const { total } = item
    const itemAfterCoupon = (percent / 100) * total
    const isDiscount = products.includes(item.product._id)
    if (isDiscount)
      return { ...item, total: Math.abs(Math.ceil(total - itemAfterCoupon)) }
    return item
  })

  const total = [...after1, ...after2].reduce(
    (acc, item) => item.total + acc,
    0
  )
  return callback(total)
}
const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
    textAlign: 'center',
    background: '#fff',
    color: '#333',
    padding: '10px',
    border: '1px solid #eee',
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  },
})
export default function QuantityMenu({ item }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [_, { language: lang }] = useTranslation()
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleUpdateQty = (value) => {
    handleClose()
    addToCart({
      quantity: value,
      id: item.product.id,
    })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${lang === 'en' ? 'en' : 'ar'}`])
      })
      .catch((e) => toast.error(e.data[`error_${lang === 'en' ? 'en' : 'ar'}`]))
  }
  const [addToCart] = useAddToCartMutation()

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          bgcolor: `${colors.main} !important`,
          borderRadius: '10px',
        }}
      >
        <Stack direction={'row'} alignItems={'center'}>
          <Typography sx={{ color: '#fff' }}>
            {lang === 'en' ? 'Qty: ' : 'الكمية: '}
          </Typography>
          <Typography sx={{ color: '#fff' }}>{item.quantity}</Typography>
          <KeyboardArrowDownIcon sx={{ color: '#fff' }} />
        </Stack>
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        disableScrollLock
      >
        {[...Array(10)].map((_, index) => (
          <MenuItem
            sx={{
              color: item.quantity === index + 1 ? colors.main : 'initial',
            }}
            onClick={() => {
              handleUpdateQty(index + 1)
            }}
          >
            {index + 1}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
const CartItemRow = ({ item, currencySymbol, currencyPrice, couponAdded }) => {
  const [_, { language: lng }] = useTranslation()
  const [removeItem] = useDeleteFromCartMutation()

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent={'space-between'}
      sx={{ bgcolor: colors.productsBg, p: 1 }}
    >
      {/* IMG & INFO */}
      <Stack direction={'row'} gap={5}>
        {/* IMG */}
        <Stack
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={colors.main}
          width={150}
          height={200}
        >
          <CardMedia
            component="img"
            src={imageBaseUrl + item.product.images[0]}
            sx={{
              width: 0.5,
              height: 0.5,
              objectFit: 'fill',
            }}
          />
        </Stack>
        {/* PRODUCT INFO */}
        <Stack direction={'column'} gap = {2} justifyContent={'flex-start'}>
          <Typography variant="h6" sx={{ color: colors.title }}>
            {item.product[`title_${lng === 'en' ? 'en' : 'ar'}`]}{' '}
          </Typography>
          <QuantityMenu item={item} />
          <Typography
            sx={{
              cursor: 'pointer',
              display: 'flex',
              color: colors.remove,
              fontSize: '1rem',
            }}
            onClick={() =>
              removeItem(item.product.id)
                .unwrap()
                .then((res) => {
                  toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
                })
                .catch((e) =>
                  toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
                )
            }
          >
            <DeleteOutlinedIcon sx={{ fontSize: '1.3rem' }} />
            {lng === 'en' ? 'Remove' : 'مسح'}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Typography>
          <Box
            sx={{
              color: colors.priceAfter,

              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}
          >
            <Box component={'span'} sx={{ fontSize: '1rem', mx: 0.5 }}>
              {currencySymbol}
            </Box>
            {item.product.priceAfterDiscount > 0
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
                ).toFixed(2)}
          </Box>
          {item.product.priceAfterDiscount > 0 && (
            <Box
              component={'span'}
              sx={{
                color: colors.priceBefore,
                textDecoration: `line-through 1px solid ${colors.priceBefore}`,
                fontSize: '0.7rem',
              }}
            >
              {`${(
                (cartPrice(item.total, item.quantity, item.product.finalPrice) +
                  item.product.priceBeforeDiscount) *
                currencyPrice
              ).toFixed(2)} ${currencySymbol}`}
            </Box>
          )}
        </Typography>
        {/* sdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsd */}

        {ProductDiscount(item) && couponAdded.couponEnter !== '' ? (
          <Stack
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              padding: '3px 7px',
              background: colors.main,
              borderRadius: '10px',
              fontSize: ' 13px',
              color: ' #fff',
            }}
          >
            <Stack component={'span'} sx={{ margin: '0px 10px' }}>
              {lng === 'en' ? 'discount' : 'نسبه الخصم'}
            </Stack>
            <Stack component={'span'}>{couponAdded?.persentage}%</Stack>
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  )
}

export const Cart02 = () => {
  const [coupon, setCoupon] = useState('')
  const [getCartdata, { data: cartData, isSuccess: isSuccessData }] =
    useLazyGetAllCartsQuery()

  const { currencyPrice, label } = useSelector((state) => state.currency)
  const labelText = label.match(/\(([^)]+)\)/)
  const [couponPrice, setTotalCouponPrice] = useState()

  const currencySymbol = labelText ? labelText[1] : ''
  const { data, isSuccess, isError, isLoading } = useGetAllCartsQuery(undefined)

  const nav = useNavigate()

  const [, { language: lng }] = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)

  const currentUser = useSelector((state) => state.currentUser)
  const [SubmitCouponA, { isError: ErrorCoupon, isLoading: isLoadingC }] =
    useLazyCouponQueryQuery()
  const [addPoints, { isLoading: PointsLoading, isError: PointsError }] =
    useSubmitPointsMutation()
  const [couponAdded, setCouponAdded] = useState({
    couponEnter: '',
    persentage: 0,
    products: [],
    total: 0,
  })
  useEffect(() => {
    const couponData = JSON.parse(localStorage.getItem('couponData'))
    if (couponData && Object.keys(couponData).length) setCouponAdded(couponData)
  }, [])
  useEffect(() => {
    if (couponAdded.couponEnter) {
      const { persentage, products } = couponAdded
      if (isSuccess && !isLoading) {
        const {
          cashItems: { items: cash },
          onlineItems: { items: online },
        } = data?.data

        calculateProductsAfterDiscount(
          online,
          cash,
          products,
          persentage,
          (total) => {
            setCouponAdded({
              ...couponAdded,
              total,
            })
            setTotalCouponPrice(total)
          }
        )
      }
    }
  }, [data?.data, couponAdded.couponEnter])
  const handleDelete = () => {
    setCouponAdded((prev) => ({
      ...prev,
      couponEnter: '',
      persentage: 0,
      products: [],
      total: 0,
    }))
  }
  const SubmitCoupon = (e) => {
    e.preventDefault()
    if (coupon !== '') {
      SubmitCouponA(coupon)
        .unwrap()
        .then((res) => {
          setCouponAdded({
            ...couponAdded,
            couponEnter: coupon,
            persentage: res?.data?.discount,
            products: res?.data?.productsCouponsIds,
          })
          setCoupon('')

          toast.success(
            lng === 'en' ? 'coupon added succefully' : 'تم اضافه الكوبون بنجاح'
          )
        })
        .catch((e) => {
          toast.error(
            e?.data ? e?.data[`error_${lng === 'en' ? 'en' : 'ar'}`] : e.message
          )
        })
    }
  }

  useEffect(() => {
    localStorage.setItem('couponData', JSON.stringify(couponAdded))
  }, [couponAdded.couponEnter])
  const SubmitPoints = () => {
    if (currentUser && currentUser.points) {
      addPoints(currentUser.id)
        .unwrap()
        .then((res) => {
          toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
          getCartdata()
        })
        .catch((e) => {
          toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
        })
    } else {
      toast.error(
        lng === 'en'
          ? `There 's No Points To Submit `
          : `ليست هناك نقاط للاضافه بعد `
      )
    }
  }
  const HandleNavigateToCheckout = () => {
    localStorage.setItem(
      'couponData',
      JSON.stringify({
        ...couponAdded,
        total: couponAdded?.couponEnter
          ? couponPrice * currencyPrice
          : data?.totalCartPrice * currencyPrice,
      })
    )

    nav('/checkout')
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const calculateCartPrice = (online, cash) => {
    return ((online + cash) * currencyPrice).toFixed(2)
  }

  return (
    <Grid
      container
      p={{ xs: 1, md: 3 }}
      sx={{ minHeight: '100vh', direction: lng === 'en' ? 'ltr' : 'rtl' }}
    >
      {isError && !isLoading && (
        <Typography
          color={'error'}
          sx={{ m: 5, fontSize: '2rem', textAlign: 'center', width: '100%' }}
        >
          {lng === 'en' ? 'No products found' : 'لا يوجد منتجات'}
        </Typography>
      )}
      {isSuccess ? (
        <>
          <Grid item xs={12} md={7} p={3} bgcolor={'#F8F4E8'}>
            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              mb={'-15px'}
            >
              <Typography variant="h5" sx={{ color: colors.header }}>
                {lng === 'en' ? 'Shopping Cart' : 'سلة التسوق'}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.header }}>
                {lng === 'en' ? 'Price' : 'السعر'}
              </Typography>
            </Stack>
            <Divider sx={{ border: '1px solid lightgrey', my: 3 }} />
            {data?.data?.cashItems ? (
              <>
                <Stack direction={'column'} sx={{ gap: 3 }}>
                  {/* CASH */}
                  <Typography>
                    {lng === 'en' ? 'Cash on delivery' : 'الدفع عند الإستلام'}
                  </Typography>
                  {data.data.cashItems.items.map((item, index) => (
                    <>
                      {index > 0 ? <Divider /> : undefined}
                      <CartItemRow
                        item={item}
                        key={index}
                        currencySymbol={currencySymbol}
                        currencyPrice={currencyPrice}
                        couponAdded={couponAdded}
                      />
                    </>
                  ))}
                </Stack>
                <Typography
                  textAlign={'end'}
                  sx={{ color: colors.orderSummaryBody }}
                >
                  {(data.data.cashItems.totalPrice * currencyPrice).toFixed(2)}{' '}
                  {currencySymbol}
                  <Box component={'span'} sx={{ color: colors.quantity }}>
                    ({data.data.cashItems.quantity}{' '}
                    {lng === 'en' ? 'Items' : 'منتج'})
                  </Box>
                </Typography>
                <Divider sx={{ border: '1px solid lightgrey', my: 3 }} />
              </>
            ) : null}
            {/* ONLINE */}
            {data.data.onlineItems.items.length > 0 ? (
              <>
                {' '}
                <Stack direction={'column'} sx={{ gap: 3 }}>
                  <Typography>
                    {lng === 'en' ? 'Online payment' : 'الدفع أونلاين'}
                  </Typography>
                  {data.data.onlineItems.items.map((item, index) => (
                    <>
                      {index > 0 ? <Divider /> : undefined}
                      <CartItemRow
                        item={item}
                        key={index}
                        currencySymbol={currencySymbol}
                        currencyPrice={currencyPrice}
                        couponAdded={couponAdded}
                      />
                    </>
                  ))}
                </Stack>
                <Typography
                  textAlign={'end'}
                  sx={{ color: colors.orderSummaryBody }}
                >
                  {(data.data.onlineItems.totalPrice * currencyPrice).toFixed(
                    2
                  )}{' '}
                  {currencySymbol}
                  <Box component={'span'} sx={{ color: colors.quantity }}>
                    ({data.data.onlineItems.quantity}{' '}
                    {lng === 'en' ? 'Items' : 'منتج'})
                  </Box>
                </Typography>
              </>
            ) : null}
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            p={3}
            sx={{
              bgcolor: colors.orderSummaryBg,
              height: '350px',

              position: {
                md: 'sticky',
                xs: 'relative',
              },
              top: '20px',
            }}
          >
            <Box>
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                my={3}
                flexWrap={'wrap'}
              >
                <Typography
                  sx={{ color: colors.orderSummaryBody, fontWeight: 'bold' }}
                >
                  {lng === 'en' ? 'Total:' : 'المجموع الكلي:'}
                </Typography>
                <Typography
                  sx={{ color: colors.orderSummaryBody, fontWeight: 'bold' }}
                >
                  {couponAdded?.couponEnter
                    ? couponAdded?.total
                    : calculateCartPrice(
                        data?.data?.onlineItems.totalPrice,
                        data?.data?.cashItems.totalPrice
                      )}{' '}
                  {currencySymbol}
                </Typography>
              </Stack>
              {/* {couponAdded?.couponEnter !== '' ? (
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  my={3}
                  flexWrap={'wrap'}
                >
                  <Typography
                    sx={{ color: colors.orderSummaryBody, fontWeight: 'bold' }}
                  >
                    {lng === 'en'
                      ? 'Total After Discount:'
                      : ' المجموع الكلي بعد الخصم'}
                  </Typography>
                  <Typography
                    sx={{ color: colors.orderSummaryBody, fontWeight: 'bold' }}
                  >
                    {currencySymbol} {couponAdded?.total.toFixed(2) || 0}
                  </Typography>
                </Stack>
              ) : null} */}
              {couponAdded.couponEnter !== '' ? (
                <Chip
                  label={couponAdded.couponEnter}
                  sx={{
                    padding: '10px',
                    background: colors?.buttonBg,
                    color: '#fff',
                  }}
                  onDelete={handleDelete}
                />
              ) : null}
              <Box>
                <Box>
                  <Typography
                    component={'span'}
                    sx={{
                      fontSize: '0.8',
                      color: colors.quantity,
                    }}
                  ></Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      width: '100%',
                    }}
                  >
                    <form
                      onSubmit={(e) => SubmitCoupon(e)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        margin: '10px auto',
                      }}
                    >
                      <input
                        label="coupon"
                        value={coupon}
                        style={{
                          width: '100%',
                          padding: '13px',
                          height: '40px',
                          border: '1px solid #ddd ',
                          padding: '10px',
                          background: 'transparent',
                          outline: 'none',
                          borderRadius: '5px',
                        }}
                        placeholder={
                          lng === 'en' ? 'add coupon' : 'اضافه كوبون'
                        }
                        onChange={(e) => setCoupon(e.target.value)}
                      ></input>
                      <CustomWidthTooltip
                        title={
                          data?.data?.isPointUsed
                            ? lng === 'en'
                              ? "You can't use coupons because you have already used Your Points "
                              : ' لا يمكنك استخدام نقاطك لانك استخدمت نقاطك بالفعل '
                            : ''
                        }
                        sx={{
                          background: '#fff !important',
                        }}
                      >
                        <span
                          style={{
                            width: '100%',
                            margin: 'auto',
                            display: 'flex',
                            justifyContent: 'end',
                          }}
                        >
                          <Button
                            sx={{
                              border: '1px solid #ddd',
                              padding: '10px',
                              height: '40px',
                              margin: '10px auto',
                              background: colors?.buttonBg,
                              color: colors?.button,
                              transition: '0.7s all ease-in-out',
                              width: '45%',
                              fontSize: { xs: '11px', sm: '12px' },
                              '&:hover': {
                                background: colors?.buttonBg,
                                opacity: '0.7',
                              },
                              width: '70%',
                              margin: 'auto 20px',
                            }}
                            disabled={isLoadingC || data?.data?.isPointUsed}
                            type={'submit'}
                          >
                            {lng === 'en' ? 'Add Coupon' : 'اضافه كوبون'}
                          </Button>
                        </span>
                      </CustomWidthTooltip>
                    </form>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      direction: lng === 'en' ? 'rtl' : 'ltr',
                    }}
                  >
                    <Typography
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <span
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                        }}
                      >
                        {currentUser?.points}
                        <HelpOutlineIcon
                          sx={{
                            width: '20px',
                            height: '20px',
                            marginRight: '10px',
                            cursor: 'pointer',
                          }}
                          aria-describedby={id}
                          type="button"
                          onClick={handleClick}
                        />
                      </span>
                      {lng === 'en' ? 'Your Points' : 'النقاط'}
                    </Typography>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      disableScrollLock
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        padding: '3px',
                      }}
                    >
                      <Typography
                        sx={{
                          p: 2,
                          textTransform: 'capitalize',
                          fontSize: {
                            xs: '13px',
                            width: 'fit-content',
                          },
                        }}
                      >
                        {lng === 'en' ? (
                          <>
                            Those Points Are calculated in checkout for every
                            succefully purchesed products{' '}
                          </>
                        ) : (
                          <>هذه النقاط يتم احتسابها لكل عمليه شراء ناجحه </>
                        )}
                      </Typography>
                    </Popover>
                    <CustomWidthTooltip
                      title={
                        couponAdded?.couponEnter !== ''
                          ? lng === 'en'
                            ? 'You Have To Delete the coupon To Use Your Points'
                            : 'يجب حذف الكوبون حتي تتمكن من استخدام نقاطك'
                          : ''
                      }
                      sx={{
                        background: '#fff !important',
                      }}
                    >
                      <div style={{ width: '100%' }}>
                        {data?.data?.isPointUsed ? null : (
                          <Button
                            disabled={
                              couponAdded?.couponEnter !== '' ||
                              data?.data?.isPointUsed
                            }
                            sx={{
                              m: 1,
                              border: '1px solid #ddd',
                              padding: '10px',
                              height: '40px',
                              margin: '10px auto',
                              background: colors?.buttonBg,
                              color: `${colors?.button} !important`,
                              transition: '0.7s all ease-in-out',
                              width: '100%',
                              '&:hover': {
                                background: colors?.buttonBg,
                                opacity: '0.7',
                              },
                            }}
                            onClick={SubmitPoints}
                          >
                            {lng === 'en'
                              ? 'Use Your  Points '
                              : 'استخدم نقاطك'}
                          </Button>
                        )}

                        <Stack
                          component={'span'}
                          sx={{
                            margin: '3px',
                            textAlign: 'right',
                            color: '#000',
                            fontWeight: '',
                          }}
                        >
                          {data?.data?.isPointUsed ? (
                            <>
                              {lng === 'en'
                                ? 'Your Points Have been Used before '
                                : 'لقد استخدمت نقاطك من قبل '}
                            </>
                          ) : null}
                        </Stack>
                      </div>
                    </CustomWidthTooltip>
                  </Box>
                </Box>
              </Box>
              <Button
                variant="contained"
                fullWidth
                disabled={isError && !isSuccess}
                sx={{
                  color: colors.button,
                  bgcolor: `${colors.buttonBg} !important`,
                }}
                onClick={() => {
                  HandleNavigateToCheckout()
                }}
              >
                {lng === 'en' ? 'Checkout' : 'الدفع'}
              </Button>
            </Box>
          </Grid>
        </>
      ) : (
        !isError && <span className="loader"></span>
      )}
    </Grid>
  )
}
