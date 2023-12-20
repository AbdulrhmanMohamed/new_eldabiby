import {colors} from "../../../../constants/colors"
export const Colors = {
  bgColor: colors.mainColor,
  titleColor: colors.whiteColor,
  descColor: colors.whiteColor,
  subTitleColor: colors.whiteColor,
  buttonTextColor: '#fff',
  buttonBgColor: '#BF9FEA',
}

export default {
  gridContainer: {
    backgroundColor: Colors.bgColor,
    py: 2,
  },
  aboutSection: {
    typography: {
      fontSize: { xs: '27px', sm: '30px', lg: '40px' },
      fontWeight: 'bold',
      textAlign: 'center',
      color: Colors.titleColor, textTransform: 'capitalize',
    },
    dangerously: {
      mt: 2,
      fontSize: { xs: '18px', md: '22px', lg: '25px' },
      color: Colors.subTitleColor,
    },
    flexHeader: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
}
