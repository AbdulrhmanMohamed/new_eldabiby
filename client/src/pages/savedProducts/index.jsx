import { Box, Grid, Stack, Typography } from '@mui/material'
import 'swiper/css'
import { useTranslation } from 'react-i18next'
import {
  AllProductsGridStyles,
  SavedProductsStyles,
} from './SavedProducts.style.jsx'
import { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { useGetAllSavedProductsQuery } from '../../redux/apis/SavedProductApi.js'
import Card7 from '../../components/Cards/Horizontal Rectangle/StrokeCard7/index.jsx'
import Breadcrumbs from '../../components/BreadCrumbs/BreadCrumbs.jsx'
const Search = ({ onChange, extraWidth }) => {
  const [search, setSearch] = useState('')
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
        width: '100%',
        borderRadius: '0.5rem',
        display: 'flex',
        border: `1px solid #333`,
        alignItems: 'center',
        padding: '0.5rem',
        mb: 5,
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
        onChange={(e) => setSearch(e.target.value)}
      />
      <CiSearch size={24} />
    </Box>
  )
}
function AllProductsGrid({ cards }) {
  return (
    <>
      {cards?.map((card, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
          }}
        >
          {card}
        </Grid>
      ))}
    </>
  )
}
export const SavedProductsPage = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [filterQuery, setFilterQuery] = useState('')

  const [, { language: lng }] = useTranslation()
  //custom hook
  const { data: favPros, isLoading: favLoading } =
    useGetAllSavedProductsQuery(query)
  const Styles = SavedProductsStyles({ props, lng })
  //custom hook
  useEffect(() => {
    setData(favPros?.data?.favourite)
    setLoading(favLoading)
  }, [favPros, favLoading])

  return (
    <>
      <Box sx={Styles.Box} direction={'column'}>
        <Stack sx={Styles.Stack} direction={'row'}>
          <Search
            extraWidth={{
              lg: 0.5,
              xs: 1,
            }}
            onChange={(value) => {
              setQuery(value)
            }}
          />
        </Stack>

        <Stack direction={'column'} sx={Styles.StackDirection}>
          {!favLoading ? (
            <Grid
              container
              mt={10}
              spacing={AllProductsGridStyles.ContainerSpacing}
            >
              <AllProductsGrid
                cards={data?.map((pro) => (
                  <Card7 data={pro} key={pro.id} />
                ))}
              />
            </Grid>
          ) : (
            <span className="loader"></span>
          )}
          {!loading && (data?.length < 1 || data?.length === undefined) && (
            <Typography color={'error'} sx={{ m: 20, fontSize: '2rem' }}>
              {lng === 'en' ? 'No products found' : 'لا يوجد منتجات'}
            </Typography>
          )}
          {/* not fo */}
        </Stack>
      </Box>
    </>
  )
}
