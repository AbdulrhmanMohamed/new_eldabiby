import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
  Menu,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputBase,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import 'swiper/css'
import { useTranslation } from 'react-i18next'
import { CiSearch } from 'react-icons/ci'
import { useLazyGetAllProductsQuery } from '../../../redux/apis/ProductApis'
import {
  AllProductsGridStyles,
  DepertmentStyles,
  SearchStyles,
} from './subCategories.Styles.jsx'
import Card7 from '../../../components/Cards/Horizontal Rectangle/StrokeCard7/index.jsx'
import Breadcrumbs from '../../../components/BreadCrumbs/BreadCrumbs.jsx'
import { useLazyGetAllAttributesQuery } from '../../../redux/apis/attributeApi.js'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import { colors } from './subCategories.Styles.jsx'
import { filterMenuStyles } from './subCategories.Styles.jsx'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloseIcon from '@mui/icons-material/Close'
import MetaTags from '../../../components/metaTags/MetaTags.jsx'

// ========================================search Filter =================
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
    <Box sx={SearchStyles.BoxSx}>
      <Box
        component={'input'}
        placeholder={language === 'en' ? 'Search' : 'بحث'}
        sx={SearchStyles.BoxInput}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <CiSearch size={24} />
    </Box>
  )
}
// ========================================search Filter =================
// =========================productsGrid=======================================================
function AllProductsGrid ({ cards }) {
  return (
    <Grid
      container
      spacing={AllProductsGridStyles.GridSpace}
      pt={5}
      width={'100%'}
    >
      {cards?.map((card, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={index}
          sx={AllProductsGridStyles.GridItem}
        >
          {card}
        </Grid>
      ))}
    </Grid>
  )
}
// =========================productsGrid=======================================================

// ==========================Hook===========================================
const useFetchProductsByCategoryIdAndSubId = (categoryId, subId, query) => {
  const [products, setProducts] = useState([])
  const [getAllProducts, { data, isLoading }] = useLazyGetAllProductsQuery()
  useEffect(() => {
    if (categoryId && subId) {
      getAllProducts(
        `category=${categoryId}&subCategory=${subId}&limit=1000${
          query ? `&${query}` : ''
        }`
      )
        .unwrap()
        .then(res => {
          setProducts(res.data)
        })
        .catch(() => {
          setProducts([])
        })
    }
  }, [data, subId, categoryId, query])
  return { categoryAndSubProducts: products, isLoading }
}
// ==========================Hook===========================================
// ======================================== Main Component=================================

export const SubCategoriePage = () => {
  const { categoryId, subId } = useParams()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [, { language: lng }] = useTranslation()
  const Styles = DepertmentStyles({ lng })
  const { categoryAndSubProducts, isLoading: categAndSubProductsLoading } =
    useFetchProductsByCategoryIdAndSubId(
      categoryId,
      subId,
      `${filterQuery ? `&${query}` : query}${
        query ? `&${filterQuery}` : filterQuery
      }`
    )
  useEffect(() => {
    setData(categoryAndSubProducts)
    setLoading(categAndSubProductsLoading)
  }, [categoryAndSubProducts, categAndSubProductsLoading, query, subId])

  return (
    <>
      <MetaTags id={subId} />
      <Breadcrumbs colors={Styles.Breadcrumbs} />
      <Box sx={Styles.Box}>
        <Stack sx={Styles.Stack}>
          <Search onChange={value => setQuery(value)} />
          <FilterAttributesMenu
            filterQuery={filterQuery}
            setFilterQuery={setFilterQuery}
          />
        </Stack>
        <Stack direction={'column'} sx={Styles.StackDirection}>
          {!categAndSubProductsLoading ? (
            <Stack direction={'column'} sx={Styles.AllProductsGridContainer}>
              {console.log(data, 'datattata')}
              <AllProductsGrid
                cards={data?.map((pro, index) => (
                  <Card7 id={pro.id} data={pro} />
                ))}
              />
            </Stack>
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
// ======================================== Main Component=================================

function FilterAttributesMenu ({ filterQuery, setFilterQuery }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [_, { language: lang }] = useTranslation()
  const { attributesData } = GenerateAttributeData()
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
    formik.resetForm()
    setExpanded(false)
  }
  const [expanded, setExpanded] = useState(false)
  const handleChange = panel => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }
  const manipulateQuery = () => {
    let query = ''
    let selAttsValues = selectedAtts
      .reduce((item, obj) => {
        return item.concat(obj.values)
      }, [])
      .map(({ value_en }) => value_en)
    selAttsValues.map(val => (query += `attributes.values.value_en=${val}&`))
    if (priceState) {
      query += !query ? `` : '&'
      query += `priceBeforeDiscount[gte]=${priceState.from}&priceBeforeDiscount[lte]=${priceState.to}`
    }
    return query
  }

  const [selectedAtts, setSelectedAtts] = useState([])
  const [priceState, setPriceState] = useState()
  const hundleAddAtt = (attribute, selectedValue, event) => {
    const existedAtt = selectedAtts.find(
      item => item.key_en === attribute.key_en
    )
    const { checked, value } = event.target
    if (checked) {
      existedAtt
        ? setSelectedAtts(
            selectedAtts.map(item =>
              item.key_en === attribute.key_en
                ? {
                    key_en: attribute.key_en,
                    key_ar: attribute.key_ar,
                    values: [...existedAtt.values, { ...selectedValue }],
                  }
                : item
            )
          )
        : setSelectedAtts([
            ...selectedAtts,
            {
              key_en: attribute.key_en,
              value_en: attribute.key_ar,
              values: [selectedValue],
            },
          ])
    } else {
      existedAtt?.values?.length > 1
        ? setSelectedAtts(
            selectedAtts.map(item =>
              item.key_en === existedAtt.key_en
                ? {
                    ...existedAtt,
                    values: existedAtt?.values.filter(
                      val => val.value_en !== value
                    ),
                  }
                : item
            )
          )
        : setSelectedAtts(
            selectedAtts.filter(sel => sel.key_en !== existedAtt?.key_en)
          )
    }
  }
  useEffect(() => {
    setFilterQuery(manipulateQuery())
  }, [selectedAtts, priceState])
  const formik = useFormik({
    initialValues: { from: '', to: '' },
    validationSchema: object({
      from: string().required(),
      to: string().required(),
    }),
    onSubmit: (values, { resetForm }) => {
      setPriceState(values)
      let submitQueries = `priceBeforeDiscount[gte]=${values.from}&priceBeforeDiscount[lte]=${values.to}`
      setFilterQuery(query ? `${query}&${submitQueries}` : submitQueries)
      resetForm()
    },
  })
  const refetchAllProducts = () => {
    setFilterQuery('')
    setSelectedAtts([])
    setPriceState()
  }
  const clearPriceFilter = () => {
    let priceQueries = `priceBeforeDiscount[gte]=${priceState.from}&priceBeforeDiscount[lte]=${priceState.to}`
    setFilterQuery(filterQuery.replace(priceQueries, ''))
    setTimeout(() => {
      setPriceState()
    }, 240)
  }
  return (
    <>
      <Box sx={{ width: { xs: '100%', sm: '30%' } }}>
        <Button
          id='demo-positioned-button'
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={
            <FilterAltOutlinedIcon
              sx={{
                color: `${colors.filter.buttonColor} !important`,
              }}
            />
          }
          sx={{
            bgcolor: `${colors.filter.buttonBg} !important`,
          }}
        >
          <Typography sx={filterMenuStyles.menuButton}>
            {lang === 'en' ? 'filter by' : 'تصفية حسب'}
          </Typography>
        </Button>
        <Menu
          id='demo-positioned-menu'
          aria-labelledby='demo-positioned-button'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{
            maxHeight: 600,
            p: 0,
            direction: lang === 'en' ? 'ltr' : 'rtl',
          }}
        >
          {attributesData?.length > 0 &&
            attributesData?.map(attribute => (
              <Accordion
                expanded={expanded === attribute.key_en}
                onChange={handleChange(attribute.key_en)}
                sx={{
                  m: '0 !important',
                }}
              >
                <AccordionSummary
                  aria-controls='panel1bh-content'
                  id='panel1bh-header'
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    {selectedAtts.includes(item =>
                      item.key_en == attribute.key_en ? (
                        <CheckBoxIcon
                          sx={{
                            color: 'blue',
                            fontSize: '20px',
                          }}
                        />
                      ) : undefined
                    )}
                    <Typography sx={filterMenuStyles.checkBoxLabel}>
                      {attribute[`key_${lang}`]}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    overflow: 'hidden',
                  }}
                >
                  {attribute.values?.map(value => (
                    <Stack sx={filterMenuStyles.checkBoxContainer}>
                      <input
                        type='checkbox'
                        id={value.value_en}
                        value={value.value_en}
                        checked={selectedAtts.find(
                          item =>
                            item.key_en === attribute.key_en &&
                            item.values.find(
                              ({ value_en }) => value_en === value.value_en
                            )
                        )}
                        style={{
                          accentColor: 'blue',
                        }}
                        onChange={event =>
                          hundleAddAtt(attribute, value, event)
                        }
                      />
                      <Typography
                        component='label'
                        htmlFor={value.value_en}
                        sx={filterMenuStyles.checkBoxLabel}
                      >
                        {value[`value_${lang}`]}
                      </Typography>
                    </Stack>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          <Accordion
            expanded={expanded === 'price'}
            onChange={handleChange('price')}
            sx={{
              m: '0 !important',
            }}
          >
            <AccordionSummary
              aria-controls='panel1bh-content'
              id='panel1bh-header'
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                justifyContent: 'center',
              }}
            >
              <Typography sx={filterMenuStyles.priceBtn}>
                {lang === 'en' ? 'Price' : 'السعر'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                border: 1,
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              <Box component='form' onSubmit={formik.handleSubmit}>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 200,
                  }}
                >
                  <Box
                    sx={{
                      width: 0.45,
                    }}
                  >
                    <Typography
                      sx={{
                        ...filterMenuStyles.checkBoxLabel,
                        fontSize: '12px',
                      }}
                    >
                      {lang === 'en' ? 'From' : 'من'}
                    </Typography>
                    <InputBase
                      name='from'
                      type='number'
                      value={formik.values.from}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={priceState}
                      sx={{
                        border: `1px solid ${
                          formik.errors.from && formik.touched.from
                            ? 'red'
                            : '#ddd'
                        } `,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 0.45,
                    }}
                  >
                    <Typography
                      sx={{
                        ...filterMenuStyles.checkBoxLabel,
                        fontSize: '12px',
                      }}
                    >
                      {lang === 'en' ? 'To' : 'إلي'}
                    </Typography>
                    <InputBase
                      type='number'
                      name='to'
                      value={formik.values.to}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={priceState}
                      sx={{
                        border: `1px solid ${
                          formik.errors.to && formik.touched.to ? 'red' : '#ddd'
                        } `,
                      }}
                    />
                  </Box>
                </Stack>

                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  mt={2}
                >
                  <Button
                    disabled={priceState}
                    type='submit'
                    sx={filterMenuStyles.formPriceBtn}
                  >
                    {lang === 'en' ? 'Search by price' : 'بحث بالسعر'}
                  </Button>
                  {priceState && (
                    <CloseIcon
                      sx={{ cursor: 'pointer' }}
                      onClick={clearPriceFilter}
                    />
                  )}
                </Stack>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Menu>
      </Box>
      {selectedAtts?.length > 0 || filterQuery ? (
        <RefreshIcon
          sx={{
            color: colors.filter.checkBoxLabel,
            cursor: 'pointer',
          }}
          onClick={refetchAllProducts}
        />
      ) : undefined}
    </>
  )
}

const GenerateAttributeData = () => {
  const [getAllAttributes] = useLazyGetAllAttributesQuery()
  const [attributesData, setAtts] = useState()
  useEffect(() => {
    getAllAttributes()
      .unwrap()
      .then(res => {
        setAtts(res.data)
      })
      .catch(err => {
        setAtts()
      })
  }, [])
  return {
    attributesData,
  }
}
