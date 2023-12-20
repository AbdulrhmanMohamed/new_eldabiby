import { Box, CardMedia, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import about2 from '../../../assets/png/about2.png'
import about3 from '../../../assets/png/about3.png'
import about4 from '../../../assets/png/about4.png'
import { useGetSectionByTypeQuery } from '../../../redux/apis/sectionsApi'
import { colors } from './about2.style'
import { imageBaseUrl } from '../../../constants/baseUrl'

const About2 = () => {
  const imgs = [about2, about3, about4]
  const [_, { language: lang }] = useTranslation()
  const { data, isLoading, error } = useGetSectionByTypeQuery('aboutus')
  const descLength_en = data && !error && data.data[0].description_en.length
  const descLength_ar = data && !error && data.data[0].description_ar.length
  return (
    <Box
      sx={{
        p: { xs: 1, md: 3 },
        mx: { xs: 1, lg: 10 },
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row-reverse' }}
        // justifyContent={'space-between'}
        spacing={2}
        sx={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}
      >
        <Stack
          direction={'row'}
          flex={1}
          spacing={1}
          justifyContent={{ xs: 'center', lg: 'flex-end' }}
          sx={{ height: '80vh' }}
        >
          <Box sx={{ height: '80vh', flex: 1 }}>
            {[imgs[0], imgs[1]].map((img, index) => (
              <CardMedia
                key={index}
                component={'img'}
                src={img}
                sx={{
                  display: 'block',
                  width: '95%',
                  height: '300px',
                  mb: 1,
                }}
              />
            ))}
          </Box>
          <Box sx={{ alignSelf: 'center', flex: 1 }}>
            {[`${imageBaseUrl}${data?.data[0].image}`, imgs[2]].map(
              (img, index) => (
                <CardMedia
                  key={index}
                  component={'img'}
                  src={img}
                  sx={{
                    display: 'block',
                    width: '95%',
                    height: '300px',
                    mb: 1,
                  }}
                />
              )
            )}
          </Box>
        </Stack>
        <Box
          flex={1}
          sx={{
            lineHeight: 2,
            fontSize: { md: 18, lg: 20, xl: 25 },
            color: colors.descColor,
          }}
          dangerouslySetInnerHTML={{
            __html:
              lang === 'en'
                ? data?.data[0].description_en.slice(0, descLength_en / 2)
                : data?.data[0].description_ar.slice(0, descLength_ar / 2),
          }}
        />
      </Stack>
      <Box
        sx={{
          lineHeight: 2,
          fontSize: { md: 18, lg: 20, xl: 25 },
          color: colors.descColor,
          textAlign: lang == 'en' ? 'left' : 'right',
          mt: 8,
        }}
        dangerouslySetInnerHTML={{
          __html:
            lang === 'en'
              ? data?.data[0].description_en.slice(
                  descLength_en / 2,
                  descLength_en
                )
              : data?.data[0].description_ar.slice(
                  descLength_ar / 2,
                  descLength_ar
                ),
        }}
      />
    </Box>
  )
}

export default About2
