import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import {
  Box,
  Button,
  Container,
  Grid,
  Rating,
  Stack,
  Chip,
  Link,
  Typography,
  ButtonGroup,
} from '@mui/material'
import { IconButton, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useParams } from 'react-router-dom'
import {
  useAddRatingMutation,
  useGetSingleProductQuery,
} from '../../../redux/apis/ProductApis.js'
import { useTranslation } from 'react-i18next'
import { imageBaseUrl } from '../../../constants/baseUrl.js'
import {
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useGetAllCartsQuery,
} from '../../../redux/apis/cartApi'
import { toast } from 'react-toastify'
import Popover from '@mui/material/Popover'

import { useSelector } from 'react-redux'
// import Banner from '../../HomePage/Banners/Banner'
import { Nooncolors } from './colors.jsx'
import Breadcrumbs from '../../../components/BreadCrumbs/BreadCrumbs.jsx'
import { NavLink } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import Similarproduct from '../similarproduct/index.jsx'
import ProductComments from '../../../components/productComments/ProductComments.jsx'

// import Banner from '../../../components/Banners/Banner.jsx'
// import { useGetSingleProductQuery } from '../src/APIs/ProductApis'

const BreadcrumbColors = {
  bgcolor: 'red',
  primary: 'white',
  secondary: 'white',
}
// ================================customBreadCumbs=============================
function CustomBreadcrumb ({ data, lng }) {
  console.log(data)
  return (
    <Grid
      item
      xs={12}
      sx={{
        display: 'flex',
        justifyContent: 'end',
        pb: 2,
      }}
    >
      <Breadcrumbs
        colors={BreadcrumbColors}
        dir={lng === 'en' ? 'ltr' : 'rtl'}
        aria-label='breadcrumb'
      >
        <Link component={NavLink} underline='hover' color='inherit' to='/'>
          {lng === 'en' ? 'Home' : 'الرئيسية'}
        </Link>
        {data}

        <Typography color='text.primary'>
          {lng === 'en' ? data.title_en : data.title_ar}
        </Typography>
      </Breadcrumbs>
    </Grid>
  )
}
// ================================customBreadCumbs=============================
function MouseOverPopover ({
  children,
  text,
  cartData,
  setCartData,
  key,
  attr,
  values,
}) {
  console.log(cartData)
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = event => {
    setCartData(prev => {
      const newQualities = prev?.qualities?.filter(
        v => v.key_en !== attr.key_en && v.key_ar !== attr.key_ar
      )
      return {
        ...prev,
        qualities: [
          ...newQualities,
          {
            key_en: attr.key_en,
            key_ar: attr.key_ar,
            value_en: values.value_en,
            value_ar: values.value_ar,
            price: values?.price,
          },
        ],
      }
    })
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setCartData(prev => ({
      ...prev,
      qualities: cartData.qualitiesBefore,
    }))
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup='true'
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {children}
      </Typography>
      <Popover
        id='mouse-over-popover'
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        disablePortal
        disableScrollLock
        transformOrigin={{
          vertical: 'top',
          horizontal: 'top',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 2 }}> {text}</Typography>
      </Popover>
    </div>
  )
}
//   ========================================Attr===============================

const Attrs = ({ colors, attr, setCartData, cartData }) => {
  const { attrAciveColors } = colors
  console.log(colors)
  const [, { language: lng }] = useTranslation()
  const handleUpdateQualities = ({ attr, values }) => {
    setCartData(prev => {
      const newQualities = prev.qualities.filter(
        v => v.key_en !== attr.key_en && v.key_ar !== attr.key_ar
      )
      // qualitiesBefore
      const qualitiesBeforeHover = [
        ...newQualities,
        {
          key_en: attr.key_en,
          key_ar: attr.key_ar,
          value_en: values.value_en,
          value_ar: values.value_ar,
          price: values?.price,
        },
      ]

      return {
        ...prev,
        qualities: qualitiesBeforeHover,
        qualitiesBefore: qualitiesBeforeHover,
      }
    })
  }
  const isSelectedAtt = val =>
    val.value_en ===
    cartData?.qualities?.findLast(v => v.key_en === attr.key_en)?.value_en

  return (
    <Box key={attr._id} dir='ltr'>
      <Typography
        sx={{
          color: colors.attrKeyColor,
          fontWeight: 'bold',
          textAlign: lng === 'en' ? 'left' : 'right',
        }}
      >
        {attr[`key_${lng === 'en' ? 'en' : 'ar'}`]}
      </Typography>
      <ButtonGroup
        variant='contained'
        // disabled={
        //   attr.key_en ===
        //   cartData.qualities.find((v) => v.key_en === attr.key_en)?.key_en
        // }
      >
        {attr?.values?.map(val => (
          <Button
            variant={isSelectedAtt(val) ? 'outlined' : 'contained'}
            sx={{
              color: isSelectedAtt(val)
                ? attrAciveColors.ActiveColor
                : colors.attrValueColor,
              bgcolor: isSelectedAtt(val)
                ? attrAciveColors.background
                : `${colors.attrValueBgColor} !important`,
              borderColor: `${colors.attrValueBorderColor} !important`,
              boxShadow: attrAciveColors.boxShadow,
            }}
            key={val.value_en}
            onClick={() =>
              handleUpdateQualities({
                attr,
                values: {
                  value_en: val.value_en,
                  value_ar: val.value_ar,
                  price: val?.price,
                },
              })
            }
          >
            <MouseOverPopover
              text={`${val.price} 
            ${lng === 'en' ? 'SAR' : 'رس'}`}
              setCartData={setCartData}
              cartData={cartData}
              attr={attr}
              values={{
                value_en: val.value_en,
                value_ar: val.value_ar,
                price: val?.price,
              }}
            >
              {val[`value_${lng === 'en' ? 'en' : 'ar'}`]}
            </MouseOverPopover>
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  )
}

//
// ========================================copyButton===========================================
const CopyButton = ({ colors }) => {
  const [, { language: lng }] = useTranslation()
  const [copied, setCopied] = useState(false)
  const product_url = window.location.href
  const handleCopy = text => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
      })
      .catch(error => {
        setCopied(false)
        console.error('Error copying text to clipboard:', error)
      })
  }
  return (
    <Tooltip
      title={
        lng === 'en'
          ? copied
            ? 'Product link has been copied'
            : 'Product Link'
          : copied
          ? 'تم نسخ الرابط'
          : ' نسخ رابط المنتج'
      }
      sx={{
        color: colors.buttonColor,
        bgcolor: colors.buttonBgColor,
        '&:hover': { bgcolor: `${colors.buttonBgColor} !important` },
      }}
    >
      <IconButton onClick={() => handleCopy(product_url)}>
        <ContentCopyIcon />
      </IconButton>
    </Tooltip>
  )
}
// ========================================copyButton===========================================

// =========================================custom Payment Type =====================================
const MAP_TYPE = {
  cash: {
    ar: 'عند الاستلام',
    en: 'cash',
  },
  online: {
    ar: 'الدفع اونلاين',
    en: 'online',
  },
}
// =========================================custom Payment Type =====================================

function CustomPaymentType ({ type, lang }) {
  return (
    <Stack direction={'row'} gap={2}>
      <Typography variant='h6'>
        {lang === 'ar' ? MAP_TYPE[type].ar : MAP_TYPE[type].en}
      </Typography>

      <Typography variant='h6'>
        {' :'} {lang === 'en' ? 'Payment Type' : 'الدفع'}
      </Typography>
    </Stack>
  )
}
// =========================================custom Payment Type =====================================

export const NoonSingleProduct = () => {
  const { currencyPrice, label } = useSelector(state => state.currency)
  const labelText = label.match(/\(([^)]+)\)/)
  const currencySymbol = labelText ? labelText[1] : ''
  const [categoryId, Setcategoryid] = useState()
  const [cartIn, SetCartIn] = useState(false)
  const colors = Nooncolors
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const { id } = useParams()
  const { data, isLoading, isError } = useGetSingleProductQuery(id)
  const [, { language: lng }] = useTranslation()
  const {
    data: cartItems,
    error,
    isError: IsCartInErorr,
    isSuccess,
  } = useGetAllCartsQuery(undefined)
  const [cartData, setCartData] = useState({
    quantity: 1,
    qualities: [],
    id: id,
  })
  const [addToCart, { isLoading: cardLoad }] = useAddToCartMutation()
  const [rate] = useAddRatingMutation()
  const [DeleteCart, { isLoading: DeleteFromCartLoading }] =
    useDeleteFromCartMutation()
  useEffect(() => {
    !isError && !isLoading && Setcategoryid(data?.data?.category?.id)

    setCartData({
      quantity: 1,
      qualities: [],
      id: id,
      qualityAfterprice: 0,
      qualitiesBefore: [],
    })
  }, [data?.data?.category?.id, data])
  const productInCart =
    !error &&
    cartItems?.data[
      data?.paymentType === 'cash' ? 'cashItems' : 'onlineItems'
    ]?.items?.find(item => item?.product?._id === data?.data?._id)

  // ===========================================quentityUpdate===================================================\\
  const updateQty = method => {
    method === '+'
      ? setCartData({ ...cartData, quantity: cartData.quantity + 1 })
      : cartData.quantity > 1 &&
        setCartData({ ...cartData, quantity: cartData.quantity - 1 })
  }
  // ===========================================quentityUpdate===================================================\\

  const [qImage, setQimages] = useState([])

  const { currentUser } = useSelector(state => state)

  const handleRating = (productId, rating) => {
    if (!currentUser) {
      toast.error(lng === 'en' ? 'Login first' : 'سجل دخول أولاً')
    } else {
      rate({ productId, rating })
        .unwrap()
        .then(res =>
          toast.success(lng === 'en' ? res.success_en : res.success_ar)
        )
        .catch(e =>
          toast.error(lng === 'en' ? e.data.error_en : e.data.error_ar)
        )
    }
  }
  useEffect(() => {
    const images = cartData?.qualities?.map(q => {
      const images = data?.data?.qualitiesImages?.map(qi => {
        const isSelect = qi?.qualities.some(qiq => {
          return qiq?.value_en === q.value_en
        })

        if (isSelect) {
          return qi.image
        }
        return null
      })

      return images.filter(Boolean)
    })
    const images2 = images?.filter(i => i?.length > 0).map(i => i[0])

    setQimages(images2)
    const exteraPrices = cartData?.qualities?.reduce(
      (acc, q) => acc + q.price,
      0
    )

    setCartData({
      ...cartData,
      qualityAfterprice: exteraPrices,
    })
    console.log(cartData)
  }, [cartData?.qualities])

  useEffect(() => {
    const images = cartData.qualities.map(q => {
      const images = data?.data.qualitiesImages.map(qi => {
        const isSelect = qi.qualities.some(qiq => {
          return qiq.value_en === q.value_en
        })

        if (isSelect) {
          return qi.image
        }
        return null
      })

      return images.filter(Boolean)
    })
    const images2 = images.filter(i => i.length > 0).map(i => i[0])
    console.log(images2)

    setQimages(images2)
  }, [cartData])

  const exteraPrice = cartData.qualities
    .map(quality => {
      return data.data.qualities
        .find(Dataq => Dataq.key_en === quality.key_en)
        ?.values.find(v => v.value_en === quality.value_en).price
    })
    .reduce((acc, certin) => acc + certin, 0)

  const extraPrice = cartData.qualities
    .map(q => {
      const price = data?.data.qualities
        .find(p => p.key_en === q.key_en)
        ?.values.find(v => v.value_en === q.value_en)?.price

      return price
    })
    .reduce((a, b) => a + b, 0)
  useEffect(() => {
    if (isSuccess) {
      const cards = [
        ...cartItems?.data?.cashItems?.items,
        ...cartItems?.data?.onlineItems?.items,
      ]
      const InCart = cards.some(item => item.product._id === id)

      console.log(InCart)
      SetCartIn(InCart)
    }
  }, [id, cartItems, location.pathname, cartData])

  const HandleAddToCart = qu => {
    qu.length
      ? addToCart({
          quantity: cartData.quantity,
          id: cartData.id,
          qualities: qu,
        })
          .unwrap()
          .then(res =>
            toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
          )
          .catch(e =>
            toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
          )
      : addToCart({
          quantity: cartData.quantity,
          id: cartData.id,
        })
          .unwrap()
          .then(res =>
            toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
          )
          .catch(e =>
            toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
          )
  }
  const AddToCartFunc = cartData => {
    const qualities =
      cartData.qualities.length > 0 ? { qualities: cartData.qualities } : {}
    if (cartIn && !IsCartInErorr) {
      DeleteCart(cartData.id)
        .unwrap()
        .then(res =>
          toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
        )
        .catch(e => toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`]))
    } else {
      console.log(cartData, 'cartData')
      const qualitiesAfterDeletePrice = cartData.qualities.map(item => {
        delete item.price
        return item
      })
      HandleAddToCart(qualitiesAfterDeletePrice)
    }
    console.log(cartIn)
  }
  const handleDelete = key => {
    const qualitiesAfterDelete = cartData.qualities.filter(
      quality => quality.key_en !== key
    )
    setCartData({
      ...cartData,
      qualities: qualitiesAfterDelete,
      qualitiesBefore: qualitiesAfterDelete,
    })
  }

  return (
    <>
      {isLoading && !data && !isError && (
        <Container sx={{ minHeight: '60vh' }}>
          <span className='loader' />
        </Container>
      )}
      {!isLoading && data && (
        <Grid
          container
          sx={{
            p: { xs: 2, md: 5 },
            direction: lng === 'en' ? 'rtl' : 'ltr',
            mt: 3,
          }}
        >
          <Grid item xs={12} md={0} lg={3} sx={{ textAlign: 'end', px: 5 }}>
            {/* <Banner bannerVertical /> */}
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={4.5}
            sx={{ textAlign: 'end', px: { sm: 0, md: 5 } }}
          >
            <Stack gap={3} alignItems={'end'}>
              <Typography
                sx={{
                  color: colors.titleColor,
                  fontSize: { xs: '0.7rem', sm: '1.4rem' },
                  fontWeight: 'bold',
                }}
              >
                {data.data[`title_${lng === 'en' ? 'en' : 'ar'}`]}
              </Typography>

              <Rating
                value={data.data.rating}
                sx={{ direction: 'ltr' }}
                onChange={(_, newValue) => {
                  // rate({ productId: data.data._id, rating: newValue })
                  handleRating(data.data._id, newValue)
                }}
              />
              <Typography
                sx={{
                  color: colors.priceBeforeColor,
                  textDecoration:
                    data.data.priceAfterDiscount > 0 ? 'line-through' : 'none',
                  fontSize:
                    data.data.priceAfterDiscount > 0 ? '0.7rem' : 'initial',
                }}
              >
                {(
                  (data.data.priceBeforeDiscount + extraPrice) *
                  currencyPrice
                ).toFixed(2)}{' '}
                {currencySymbol}
              </Typography>
              {data.data.priceAfterDiscount > 0 && (
                <Typography sx={{ color: colors.priceAfterColor }}>
                  {(
                    (data.data.priceAfterDiscount + extraPrice) *
                    currencyPrice
                  ).toFixed(2)}{' '}
                  {currencySymbol}
                </Typography>
              )}
              {data.data.qualities.map(quality => (
                <Attrs
                  key={quality._id}
                  colors={{
                    attrKeyColor: colors.attrKeyColor,
                    attrValueColor: colors.attrValueColor,
                    attrValueBgColor: colors.attrValueBgColor,
                    attrValueBorderColor: colors.attrValueBorderColor,
                    attrAciveColors: colors.attrAciveColors,
                  }}
                  attr={quality}
                  setCartData={setCartData}
                  cartData={cartData}
                />
              ))}
              <Stack
                direction='row'
                justifyContent={'flex-end'}
                width={'100%'}
                spacing={2}
                height={50}
              >
                {cartData?.qualities?.map(chip => {
                  return (
                    <Chip
                      label={`${lng === 'en' ? chip.value_en : chip.value_ar}`}
                      key={chip?.key_en}
                      variant='outlined'
                      sx={{
                        margin: '10px !important',
                        padding: 1,
                        visibility: 'visible',
                      }}
                      onDelete={() => handleDelete(chip?.key_en)}
                    />
                  )
                })}
              </Stack>
              <Stack
                direction={{ xs: 'column', md: 'row-reverse' }}
                sx={{ gap: 3, justifyContent: 'start', alignItems: 'center' }}
              >
                <Stack
                  direction={'row'}
                  sx={{
                    border: '1px solid black',
                    borderRadius: 1,
                    alignItems: 'center',
                    my: 1,
                    width: 'fit-content',
                    py: 0.2,
                  }}
                >
                  <Button
                    size='small'
                    onClick={() => updateQty('-')}
                    disabled={cartData.quantity === 1}
                    sx={{
                      color: 'black',
                      minWidth: 40,
                    }}
                  >
                    -
                  </Button>
                  <Typography>{cartData.quantity}</Typography>
                  <Button
                    size='small'
                    onClick={() => updateQty('+')}
                    sx={{ color: 'black !important', minWidth: 45 }}
                  >
                    +
                  </Button>
                </Stack>
                <Stack direction={'row-reverse'} sx={{ gap: 1 }}>
                  {data?.data?.quantity > 0 ? (
                    <Button
                      variant='contained'
                      sx={{
                        width: 'fit-content',
                        px: 2,
                        py: 1,
                        color: `${
                          productInCart ? '#fff' : colors.buttonColor
                        } !important`,
                        bgcolor: `${colors.buttonBgColor} !important`,
                        fontSize: { xs: '11px', md: '12 px', xl: '14px' },
                      }}
                      disabled={cardLoad || DeleteFromCartLoading}
                      onClick={() => AddToCartFunc(cartData)}
                    >
                      {cardLoad || DeleteFromCartLoading ? (
                        <>
                          <Typography>
                            {lng === 'en' ? 'loading' : 'جاري التحميل'}
                          </Typography>
                          <CircularProgress
                            size={20}
                            style={{ marginRight: '4px' }}
                            color='inherit'
                          />
                        </>
                      ) : (
                        <>
                          {cartIn && !IsCartInErorr ? (
                            <>
                              {lng === 'en'
                                ? 'Delete from Cart'
                                : 'حذف من السله'}
                            </>
                          ) : (
                            <>
                              {lng === 'en'
                                ? 'Add to cart'
                                : 'أضف إلى سلة التسوق'}
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant='contained'
                      sx={{
                        width: 'fit-content',
                        px: 2,
                        py: 1,
                        color: colors.buttonColor,
                        bgcolor: `${colors.buttonBgColor} !important`,
                        height: '40px !important',
                      }}
                      disabled
                    >
                      <>{lng === 'en' ? 'Out Of Stock' : 'المنتج غير متوفر'}</>
                    </Button>
                  )}

                  <CopyButton
                    colors={{
                      buttonColor: colors.buttonColor,
                      buttonBgColor: colors.buttonBgColor,
                    }}
                  />
                </Stack>
              </Stack>
              <Box
                sx={{
                  color: colors.descColor,
                  direction: lng === 'en' ? 'ltr' : 'rtl',
                  textAlign: lng === 'en' ? 'left' : 'right',
                  '& ul': {
                    textAlign: `${lng === 'en' ? 'left' : 'right'} !important`,
                  },
                  '& ol': {
                    textAlign: `${lng === 'en' ? 'left' : 'right'} !important`,
                  },
                  fontSize: { xs: '0.8rem', sm: '1.4rem' },
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    data.data[`description_${lng === 'en' ? 'en' : 'ar'}`],
                }}
              />
              <CustomPaymentType type={data.data.paymentType} lang={lng} />
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={4.5}
            sx={{ order: { xs: -1, md: 'unset' } }}
          >
            <Stack direction={'row'}>
              <Box
                component={Swiper}
                sx={{
                  width: '100%',
                  m: 1,
                  height: '50vh',
                  direction: 'ltr',
                  '--swiper-navigation-color': '#fff',
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className='mySwiper2'
              >
                {qImage.length > 0
                  ? qImage.map(img => (
                      <SwiperSlide key={img}>
                        <Box
                          sx={{
                            background: `url("${
                              imageBaseUrl + img
                            }") center center`,
                            backgroundSize: ' contain',
                            backgroundRepeat: 'no-repeat',
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      </SwiperSlide>
                    ))
                  : data?.data?.images.map(img => (
                      <SwiperSlide key={img}>
                        <Box
                          sx={{
                            background: `url("${
                              imageBaseUrl + img
                            }") center center`,
                            backgroundSize: ' contain',
                            backgroundRepeat: 'no-repeat',
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      </SwiperSlide>
                    ))}
              </Box>
              <Box
                component={Swiper}
                direction={'vertical'}
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                sx={{
                  width: '100%',
                  m: 1,
                  height: '50vh',
                  direction: 'ltr',
                  '--swiper-navigation-color': '#fff',
                  maxHeight: '50vh',
                }}
                className='mySwiper'
              >
                {qImage.length > 0
                  ? qImage.map(img => (
                      <SwiperSlide key={img}>
                        <Box
                          component={'img'}
                          sx={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'contain',
                          }}
                          src={imageBaseUrl + img}
                        />
                      </SwiperSlide>
                    ))
                  : data?.data?.images.map(img => (
                      <SwiperSlide key={img}>
                        <Box
                          component={'img'}
                          sx={{
                            width: '120px',
                            height: '100px',
                            objectFit: 'contain',
                          }}
                          src={imageBaseUrl + img}
                        />
                      </SwiperSlide>
                    ))}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      )}
      <ProductComments colors={colors.commentsColors} productId={id} />
      {!isError && !isLoading && (
        <Similarproduct productId={data?.data?.id} id={categoryId} />
      )}
    </>
  )
}
