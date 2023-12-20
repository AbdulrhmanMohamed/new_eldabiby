import React from 'react'
import {   useGetMostSellingProductsQuery } from '../../../../redux/apis/ProductApis'
import { Box, Stack, Typography, useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Card3 from '../../../Cards/Horizontal Rectangle/StrokeCard3'
import { FixedColors } from './FixedCardColors.js'
import { useTheme } from '@emotion/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow } from 'swiper/modules'

const ErrorSection = ({ isError, error }) => {
  const [, { language: lang }] = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Typography
        fontSize={'1.5rem'}
        my={10}
        textAlign={'center'}
        color='error'
      >
        {isError
          ? error?.data && error?.data[`error_${lang}`]
          : error?.data && error?.data[`error_${lang}`]}
      </Typography>
    </Box>
  )
}

const FixedCardMostSeller = () => {
  const { data, isSuccess, isError, error } = useGetMostSellingProductsQuery()
  const [, { language: lang }] = useTranslation()
  const MostData = data?.data?.slice(0, 3)
  const theme = useTheme()
  const phoneScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Box my={10}>
      {isError && error && <ErrorSection error={error} isError={isError} />}
      {isSuccess && !isError && data?.data?.length > 0?(
        <>
          <Box
            sx={{
              textAlign: 'center',
              mb: 7,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '2.3rem', sm: '2.5rem', lg: '4rem' },
                fontWeight: 'bold',
                color: FixedColors.titleColor || 'black',
              }}
            >
              {lang === 'en' ? 'Most Seller' : 'الاكثر مبيعا'}
            </Typography>
          </Box>

{
  !phoneScreen? <Stack
  direction={{ xs: 'column', md: 'row' }}
  width={'80%'}
  mx={'auto'}
  justifyContent={{ xs: 'center', md: 'space-around' }}
  alignItems={{ xs: 'center', md: 'center' }}
  gap={3}
>
  {MostData?.map((item, index) => (
    <Box
      key={index}
      sx={{
        width: { xs: '300px', sm: '350px', md: '400px' },
      }}
    >
      <Card3 data={item} />
    </Box>
  ))}
</Stack>:null
}
         
        </>
      ):
      <Box
      mx={'auto'}
      // width={{ xs: 1, md: 0.9, xl: 0.8 }}
      mt={5}
      px={{ xs: 3, sm: 0 }}
      py={2}
    >
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3.5}
        loop={true}
        // autoplay={{
        //   delay: 3000,
        //   disableOnInteraction: false,
        // }}
        breakpoints={{
          300: {
            slidesPerView: 1.1,
            spaceBetween: 30,

          },
          370: {
            slidesPerView: 1.4 ,
            spaceBetween: 30,
          },
          460: {
            slidesPerView: 1.6,
            spaceBetween: 30,

          },
          488: {
            slidesPerView: 1.8,
          },
          576: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          719: {
            slidesPerView: 2.6,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 80,
          },
          1200: {
            slidesPerView: 3.5,
            spaceBetween: 80,
          },
          1500: {
            slidesPerView: 3.7,
            spaceBetween: 120,
          },
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 1,
          depth: 100,
          modifier:0.5,
          slideShadows: false,
          
        }}
        modules={[EffectCoverflow, Autoplay]}
        className="mySwiper"
      >
        {data?.map((item, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                width: '100%',
                 
              }}
            >
             <Paper
      sx={{
        ...styles.cardPaper,
        direction: `${lng === 'en' ? 'ltr' : 'rtl'}`,
      }}
      id="cardStyle"
    >
      {/* <FavoriteIconCard
        proInFav={proInFav}
        toFavorite={toFavorite}
        data={props?.data}
        lng={lng}
      /> */}
      {props?.data?.images && props?.data?.images[0] && (
        <CardMedia
          component={'img'}
          src={imageBaseUrl + props?.data?.images[0]}
          onClick={() =>
            nav(
              `/products/${props?.data?._id}/${props?.data?.title_en.replace(
                /\s/g,
                '-'
              )}`
            )
          }
          sx={styles.cardImg}
        />
      )}
         <Stack sx={{
             alignItems: 'center',
             justifyContent: { xs: 'center', md: 'start' },
             width: '100%',
             cursor: 'default',
             height: '35%',
             bgcolor: colors.cardContentBg,
             mx: 0,
             pt: 2,
             mb: 1,
         }}>
    
      <Button
        disabled={productInCart || cardLoad}
        variant={colors.borderColor ? 'outlined' : 'contained'}
        sx={{
          ...styles.Button,
          bgcolor: `${colors.buttonBackgroundColor} !important`,
          color: `${colors.buttonTextColor} !important`,
          mt:'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          addToCart(cartData)
            .unwrap()
            .then((res) =>
              toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
            )
            .catch((e) =>
              toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
            )
        }}
      >
        {productInCart
          ? lng === 'en'
            ? 'Product in cart'
            : 'المنتج في العربة'
          : lng === 'en'
          ? cardLoad
            ? 'Add to cart...'
            : 'Add to cart'
          : cardLoad
          ? 'اضف الي العربة...'
          : 'أضف إلى العربة'}
      </Button>
    </Stack>
    </Paper>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>}
    </Box>
  )
}

export default FixedCardMostSeller
