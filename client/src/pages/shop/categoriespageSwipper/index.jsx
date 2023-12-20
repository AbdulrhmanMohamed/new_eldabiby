import { Box, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import 'swiper/css'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { DepertmentStyles } from './categoriesSwipper.Style.jsx'
import { CiSearch } from 'react-icons/ci'
import Card7 from '../../../components/Cards/Horizontal Rectangle/StrokeCard7/index.jsx'
import Breadcrumbs from '../../../components/BreadCrumbs/BreadCrumbs.jsx'
import { useGetAllProductsByCategoryQuery } from '../../../redux/apis/ProductApis.js'
//===============================|| searchFilter ||===================================
const Search = ({ onChange }) => {
  const [search, setSearch] = useState('')
  const location = useLocation()

  useEffect(() => {
    setSearch('')
  }, [location.pathname])
  const {
    i18n: { language },
  } = useTranslation()
  useEffect(() => {
    const id = setTimeout(() => {
      const s = search.trim()
        ? `keyword[title_en]=${search}&keyword[title_ar]=${search}&keyword[description_en]=${search}&keyword[description_ar]=${search}`
        : ''
      onChange(s)
    }, 500)
    return () => {
      clearTimeout(id)
    }
  }, [search])
  return (
    <Box
      sx={{
        width: '70%',
        borderRadius: '0.5rem',
        display: 'flex',
        border: `1px solid #333`,
        alignItems: 'center',
        padding: '0.5rem',
        justifyContent: 'space-between',
      }}
    >
      <Box
        component={'input'}
        placeholder={language === 'en' ? 'Search' : 'بحث'}
        sx={{
          width: '100%',
          height: '100%',
          border: `none`,
          outline: 'none',
          fontSize: '1rem',
          fontWeight: 'bold',
          zIndex: 2,
        }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <CiSearch size={24} />
    </Box>
  )
}
//===============================|| searchFilter ||===================================

//===============================|| categorySwipper ||===================================

export const CategoriesPageSwipper = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [, { language: lng }] = useTranslation()
  const styles = DepertmentStyles(lng)
  const nav = useNavigate()
  const { data: allProducts, isLoading: allProductsLoading } =
    useGetAllProductsByCategoryQuery(query ? query : '')
  useEffect(() => {
    setData(allProducts?.data)
    setLoading(allProductsLoading)
  }, [allProducts, allProductsLoading, query])

  return (
    <>
      <Breadcrumbs colors={styles.Breadcrumbs} />
      <Box sx={styles.Box}>
        <Stack sx={styles.Stack}>
          <Search onChange={value => setQuery(value)} />
        </Stack>
        <Stack sx={styles.StackDirection}>
          {!loading ? (
            data?.map(
              item =>
                item?.products?.length > 0 && (
                  <>
                    <Typography
                      sx={styles.Typography}
                      onClick={() =>
                        nav(
                          `/departments/${
                            item.category.id
                          }/${item?.category.name_en.replace(/\s/g, '')}`
                        )
                      }
                    >
                      {item.category[`name_${lng === 'en' ? 'en' : 'ar'}`]}
                    </Typography>
                    {
                      <Box
                        component={Swiper}
                        slidesPerView={4}
                        spaceBetween={10}
                        sx={{ ...styles.SwipperBox.sx, direction: 'ltr' }}
                        breakpoints={styles.SwipperBox.Breackpoints}
                      >
                        {item.products.map(pro => {
                          return (
                            <SwiperSlide key={pro._id}>
                              <Card7 data={pro} />
                            </SwiperSlide>
                          )
                        })}
                      </Box>
                    }
                  </>
                )
            )
          ) : (
            <span className='loader'></span>
          )}
          {!loading && (data?.length < 1 || data?.length === undefined) && (
            <Typography color={'error'} sx={{ m: 5, fontSize: '2rem' }}>
              {lng === 'en' ? 'No products found' : 'لا يوجد منتجات'}
            </Typography>
          )}
          {/* not fo */}
        </Stack>
      </Box>
    </>
  )
}
//===============================|| categorySwipper ||===================================
