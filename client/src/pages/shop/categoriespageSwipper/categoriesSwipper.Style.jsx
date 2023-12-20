import { colors } from '../../../constants/colors.js'
export const DepertmentStyles = lng => ({
  Breadcrumbs: {
    bgcolor: 'transparent',
    primary: colors.darkColor,
    secondary: colors.secondColor,
  },
  Box: {
    my: 5,
    mx: { xs: 1, sm: 1, lg: 3, md: 3 },
    minHeight: '70vh',
    direction: lng === 'en' ? 'ltr' : 'rtl',
    gap: 0,
  },
  Stack: {
    flexDirection: { lg: 'row', xs: 'column' },

    justifyContent: { xs: 'flex-start', md: 'space-around' },
    alignItems: 'center',
  },
  justifyContent: {
    alignItems: 'center',
    width: '100%',
  },
  Search: {
    // primary: props.searchColors.primary,
    // secondary: props.searchColors.secondary,
    // borderColor: props.searchColors.borderColor,
    // bgColor: 'transparent',
  },
  StackDirection: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  Typography: {
    fontWeight: 600,
    mt: 5,
    fontSize: '1.5rem',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'start',
  },
  SwipperBox: {
    sx: {
      justifyContent: 'center',
      alignItems: 'center',
      py: 2,
      px: 1,
      width: '100%',
    },
    Breackpoints: {
      0: {
        slidesPerView: 1.5,
        spaceBetween: 22,
      },
      600: {
        slidesPerView: 1.9,
        spaceBetween: 30,
      },
      900: {
        slidesPerView: 3,
        spaceBetween: 30,
      },

      1200: {
        slidesPerView: 3.5,
        spaceBetween: 40,
      },
      1536: {
        slidesPerView: 4,
        spaceBetween: 60,
      },
    },
  },
})
