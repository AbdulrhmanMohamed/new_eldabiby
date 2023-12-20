import { Typography, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { useState, useEffect } from 'react'
import { useLazyGetCategoryDetailsQuery } from '../../redux/apis/categoriesApi'
import { useLazyGetSubCategoryByIdQuery } from '../../redux/apis/subcategoriesApi'
export const useFetchCategoryDetails = categoryId => {
  const [state, setState] = useState()
  const [getCategoryDetails] = useLazyGetCategoryDetailsQuery()
  useEffect(() => {
    if (categoryId) {
      getCategoryDetails(categoryId)
        .unwrap()
        .then(res => {
          setState(res.data)
        })
    } else setState(undefined)
  }, [categoryId])
  return { category: state }
}
export const useFetchSubCategoryDetails = subId => {
  const [getSubCategoryById] = useLazyGetSubCategoryByIdQuery()
  const [state, setState] = useState()

  useEffect(() => {
    if (subId) {
      getSubCategoryById(subId)
        .unwrap()
        .then(res => {
          setState(res.data)
        })
    } else setState(undefined)
  }, [subId])
  return { subCategory: state }
}

const Breadcrumbs = props => {
  const { pathname } = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const [, { language: lang }] = useTranslation()
  const { category } = useFetchCategoryDetails(params.categoryId)
  const { subCategory } = useFetchSubCategoryDetails(params.subId)
  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        my: 5,
        px: 3,
        direction: lang === 'en' ? 'ltr' : 'rtl',
        bgcolor: props.colors.bgcolor,
      }}
    >
      <Typography
        variant='h6'
        sx={{
          color: props.colors.primary,
          fontSize: {
            lg: '20px',
            xs: '16px',
          },
          ':hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
          },
          display: 'inline-block',
        }}
        onClick={() => navigate('/')}
      >
        {lang === 'en' ? 'Home' : 'الرئيسية'}
      </Typography>
      <NavigateNextIcon
        fontSize='small'
        sx={{
          transform: `rotateY(${lang === 'ar' ? '180deg' : '0'})`,
          color: props.colors.primary,
        }}
      />
      {pathname === '/savedProducts' ? (
        <Typography
          variant='h6'
          sx={{
            cursor: 'default',
            color: props.colors.secondary,
            fontSize: {
              lg: '20px',
              xs: '16px',
            },
          }}
        >
          {lang === 'en' ? 'Saved products' : 'المنتجات المحفوظة'}
        </Typography>
      ) : (
        <>
          <Typography
            variant='h6'
            sx={{
              cursor: props.type !== 'allProducts' ? 'pointer' : 'default',
              fontSize: {
                lg: '20px',
                xs: '16px',
              },

              ':hover': {
                textDecoration:
                  props.type !== 'allProducts' ? 'underline' : 'none',
              },
              color:
                props.type === 'allProducts'
                  ? props.colors.secondary
                  : props.colors.secondary,
            }}
            onClick={() =>
              props.type !== 'allProducts'
                ? navigate('/departments')
                : undefined
            }
          >
            {lang === 'en' ? 'departments' : 'الأقسام'}
          </Typography>
          {category ? (
            <>
              <NavigateNextIcon
                fontSize='small'
                sx={{
                  transform: `rotateY(${lang === 'ar' ? '180deg' : '0'})`,
                  color: props.colors.secondary,
                }}
              />

              <Typography
                variant='h6'
                sx={{
                  fontSize: {
                    lg: '20px',
                    xs: '16px',
                  },

                  cursor: props.type !== 'category' ? 'pointer' : 'default',
                  ':hover': {
                    textDecoration:
                      props.type !== 'category' ? 'underline' : 'none',
                  },
                  color:
                    props.type === 'category'
                      ? props.colors.secondary
                      : props.colors.primary,
                }}
                onClick={() =>
                  props.type !== 'category'
                    ? navigate(
                        `/departments/${category.id}/${category.name_en.replace(
                          /\s+/g,
                          '-'
                        )}`
                      )
                    : undefined
                }
              >
                {category[`name_${lang}`]}
              </Typography>
            </>
          ) : undefined}
          {subCategory ? (
            <>
              <NavigateNextIcon
                fontSize='small'
                sx={{
                  transform: `rotateY(${lang === 'ar' ? '180deg' : '0'})`,
                  color: props.colors.primary,
                }}
              />

              <Typography
                variant='h6'
                sx={{
                  cursor: 'default',
                  color: props.colors.secondary,
                  fontSize: {
                    lg: '20px',
                    xs: '16px',
                  },
                }}
              >
                {subCategory[`name_${lang}`]}
              </Typography>
            </>
          ) : undefined}
        </>
      )}
    </Stack>
  )
}

export default Breadcrumbs
