import React from 'react'
import {
  Typography,
  Box,
  Button,
  Grid,
  CardMedia,
  Container,
} from '@mui/material'
import { useGetSectionByTypeQuery } from '../../../../../../redux/apis/sectionsApi'
import { useTranslation } from 'react-i18next'
import { imageBaseUrl } from '../../../../../../constants/baseUrl'
import { SwiperSlide, Swiper } from 'swiper/react'
import { useNavigate } from 'react-router-dom'
import { Autoplay } from 'swiper/modules'
import { Hero4Style } from './Hero4Style'

const Hero4Normal = () => {
  const navigate = useNavigate()
  const [_, { language: lang }] = useTranslation()
  const { data, isError, isLoading, error } = useGetSectionByTypeQuery('slider')
  const dataHero = data?.data.length - 1 //last item in array

  return (
    <Box minHeight={{ xs: '70vh', md: '100vh' }}>
      {isLoading && <span className="loader"></span>}
      {isError && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Typography
            fontSize={'1.5rem'}
            my={10}
            textAlign={'center'}
            color="error"
          >
            {error?.data && error?.data[`error_${lang}`]}
          </Typography>
        </Box>
      )}
      {!isLoading && !isError && (
        <Box
          sx={{
            height: { xs: '70vh', md: '100vh' },
            width: '100%',
            backgroundImage: `url(${imageBaseUrl}${data?.data[dataHero].image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'fill',
            backgroundPosition: 'center',
            objectFit: 'cover',
          }}
        >
          <Grid
            container
            sx={{
              width: '100%',
              height: '100%',
              direction: lang === 'en' ? 'ltr' : 'rtl',
            }}
          >
            <Grid
              xs={12}
              md={12}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'start',
                //  px:1,
                mt: { xs: 10, md: 22 },
              }}
            >
              {/* Title and SubTitle */}
              <Box
                width={{ xs: 0.9, sm: 0.7, md: 0.9 }}
                sx={{
                  direction: lang === 'en' ? 'ltr' : 'rtl',
                }}
              >
                {/* Title */}
                <Typography
                  variant="h1"
                  sx={{
                    mb: 2,
                    color: Hero4Style.color?.titleColor
                      ? `${Hero4Style.color.titleColor}`
                      : `gray`,
                    fontWeight: 'bold',
                    fontSize: {
                      xs: '2rem',
                      sm: '2.3rem',
                      md: '2.5rem',
                      lg: '3.2rem',
                      xl: '4rem',
                    },
                    wordBreak: 'break-word',
                    textShadow: '1px 1px 2px #000000',
                  }}
                >
                  {data?.data[dataHero][`title_${lang}`]}
                </Typography>

                {/* Description */}
                <Typography
                  variant="h6"
                  width={{ xs: 0.9, md: 0.7 }}
                  sx={{
                    color: Hero4Style.color?.subTitleColor
                      ? `${Hero4Style.color.subTitleColor}`
                      : `gray`,
                    fontSize: {
                      xs: '1.2rem',
                      sm: '1.5rem',
                      md: '2.2rem',
                    },

                    wordBreak: 'break-word',
                  }}
                >
                  {data?.data[dataHero][`description_${lang}`]}
                </Typography>

                {/* Button */}

                <Button
                  variant="contained"
                  onClick={() => navigate('/aboutUs')}
                  sx={{
                    mt: 2,
                    color: Hero4Style.Btn?.colorBtn
                      ? `${Hero4Style.Btn?.colorBtn} !important`
                      : `white !important`,
                    backgroundColor: Hero4Style.Btn?.backgroundColorBtn
                      ? `${Hero4Style.Btn?.backgroundColorBtn} !important`
                      : `black !important`,
                    p: '12px 40px',
                    borderRadius: '50px',
                    outline: 'none',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: '16px',
                        sm: '18px',
                        md: '20px',
                      },
                      textTransform: 'capitalize',
                    }}
                  >
                    {lang === 'en' ? 'More' : 'المزيد'}
                  </Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  )
}

export default Hero4Normal
