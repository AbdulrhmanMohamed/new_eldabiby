import { constants } from './Navbar_ButtunStyle'
import { colors } from '../../../../constants/colors'
export const Navcolors = {
  colors: {
    borderColor: colors.mainColor,
    activeBorderColor: colors.mainColor,
    linkTextColor: colors.mainColor,
    linkTextBgColor: 'black',
    activeLinkColor: 'white',
    activeLinkBgColor: colors.mainColor,
    drawerColor: colors.mainColor,
    activeDrawerColor: '#fff',
    buttonBgColor: colors.mainColor,
    buttonColor: '#fff',
    backgroundColor: colors.blackColor,
    iconColor: colors.mainColor,
    activeIconColor: colors.whiteColor,
    menuBgColor: colors.mainColor,
    menuItemBgColor: colors.mainColor,
    menuItemColor: colors.whiteColor,
    activeMenuItemColor: 'white',
    activeMenuItemBgColor: colors.darkColor,
    drawerBg: colors.blackColor,
    badgeColors: {
      text: '#eee',
      bg: colors.mainColor,
    },
  },
}
export const MainStyles = ({ pathname, lng }) => ({
  MainBox: {
    display: constants.pagesWithout(pathname) ? 'none' : 'flex',
    direction: lng === 'en' ? 'ltr' : 'rtl',
    flexDirection: 'row',
    position: 'relative',
    zIndex: 0,
    width: {
      lg: '100%',
      xs: '100%',
    },
    height: { lg: 'inherit', xs: 'inherit' },
    top: 0,
    left: lng === 'en' ? 0 : 'auto',
    right: lng === 'ar' ? 0 : 'auto',
  },
  AppBar: {
    bgcolor: Navcolors.colors.backgroundColor,
    position: 'relative',
    boxShadow: 'none',
    height: 'inherit',
  },
  container: {
    height: 'inherit',
    justifyContent: {
      xs: 'flex-end',
      lg: 'space-between',
    },
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  IconButton: {
    mr: 2,
    display: { lg: 'none' },
    color: '',
  },
  Logo: {
    height: '80px',
    width: '165px',
    mx: 'auto',
  },
})
export const NavLinksStyles = () => ({
  Grid: {
    display: { xs: 'none', sm: 'block' },
    mx: 'vertical',
  },
  ButtonStyle: {
    width: {
      md: 170,
      xs: 0.86,
    },
    height: {
      md: 'auto',
      xs: '40px',
    },
    mb: 1,
    position: 'relative',
    color: Navcolors.colors.linkTextColor,
    bgcolor: `${Navcolors.colors.linkTextBgColor} !important`,
    fontSize: { xs: '1rem', md: '1rem', lg: '1.2rem' },
    textTransform: 'capitalize',
    p: { xs: '0px 0px', sm: '8px 10px', lg: '8px 10px', md: '8px 10px' },
    borderRadius: 6,
    border: `1px solid ${Navcolors.colors.borderColor}`,
    '&:hover': {
      background: `${Navcolors.colors.activeLinkBgColor} !important`,
      color: `${Navcolors.colors.activeLinkColor} !important`,
    },
    '&.active': {
      color: Navcolors.colors.activeLinkColor,
      bgcolor: `${Navcolors.colors.activeLinkBgColor} !important`,
    },
  },
})
export const LogoStyle = () => ({
  cardMedia: extraObjectFit => ({
    height: '100%',
    width: '100%',
    objectFit: extraObjectFit ? extraObjectFit : 'cover',
    cursor: 'pointer',
  }),
})

export const MainNavIcons = props => ({
  Grid: { flexDirection: { xs: 'row-reverse' } },
  Badge: {
    '.MuiBadge-badge': {
      bgcolor: `${props.colors.badgeColors.bg} !important`,
      color: `${props.colors.badgeColors.text} !important`,
    },
  },
  AddShoppingCartOutlinedIcon: {
    color: props.pathname.includes('/cart')
      ? props.colors.activeIconColor
      : props.colors.iconColor,
    cursor: 'pointer',
    fontSize: {
      xs: '1.5rem',
      sm: '1.8rem',
      md: '2.2rem',
      lg: '2.3rem',
    },
  },
  FavoriteBorderOutlinedIcon: {
    color: props.pathname.includes('/savedProducts')
      ? props.colors.activeIconColor
      : props.colors.iconColor,
    cursor: 'pointer',
    fontSize: {
      xs: '1.5rem',
      sm: '1.8rem',
      md: '2.2rem',
      lg: '2.3rem',
    },
    badge: {
      bgcolor: 'red',
    },
  },

  Button: {
    minWidth: 0,
    width: {
      md: 50,
      xs: 40,
    },
    height: {
      md: 40,
      xs: 30,
    },
    color: Navcolors.colors.buttonColor,
    bgcolor: `${Navcolors.colors.buttonBgColor} !important`,
    fontWeight: 'bold',
  },
})
export const ProfileSyles = colors => ({
  Button: {
    width: {
      md: 50,
      xs: 40,
    },
    height: {
      md: 40,
      xs: 30,
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
    borderRadius: 1,
    bgcolor: `${colors.bgColor} !important`,
  },
  CloseIcon: {
    fontSize: {
      lg: '30px',
      xs: '25',
    },
    color: colors.iconColor,
  },
  Person2Icon: {
    fontSize: {
      lg: '30px',
      xs: '25px',
    },
    color: colors.iconColor,
  },
  Menu: {
    width: '100%',
    '.MuiPaper-root': {
      bgcolor: colors.menuBgColor,
    },
  },
  MenuListProps: {
    'aria-labelledby': 'basic-button',
  },
})
export const iconStyle = {
  color: '#363636 !important',
  fontSize: '20px',
}
export const ProfileMenuStyles = () => ({
  Stack: {
    cursor: 'pointer',
    gap: '10px',
    p: '10px',
    bgcolor: `${Navcolors.colors.menuItemBgColor} !important`,
    svg: {
      color: `${Navcolors.colors.menuItemColor} !important`,
    },
  },
  Typography: {
    fontWeight: 'bold',
    color: `${Navcolors.colors.menuItemColor} !important`,
    textTransform: 'capitalize',
  },
})
export const NavDrrawerStyles = ({ props, lng, pathname }) => ({
  Drawer: {
    display: { xs: 'block', lg: 'none' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: 240,
      pt: '60px',
      pb: '10px',
      bgcolor: Navcolors.colors.drawerBg,
    },
  },
  Stack: {
    textAlign: 'center',
    height: '100%',
    direction: lng === 'en' ? 'ltr' : 'rtl',
  },
  Box: {
    flex: 1,
    mb: 2,
    width: '100%',
  },
  CloseIcon: {
    display: 'block',
    cursor: 'pointer',
    color: Navcolors.colors.iconColor,
    transform: `rotate(${lng === 'ar' ? '180deg' : '0deg'})`,
  },
  NotListedLink: {
    width: '90%',
    px: '2px',
    span: { color: `${Navcolors.colors.drawerColor} !important` },
    // svg: { color: `${Navcolors.colors.drawerColor} !important` },
    mx: 'auto',
    mb: '10px',
    '&.active': {
      borderLeft:
        lng === 'en'
          ? `4px solid ${Navcolors.colors.activeDrawerColor}`
          : `1px solid transparent`,
      borderRight:
        lng === 'ar'
          ? `4px solid ${Navcolors.colors.activeDrawerColor}`
          : `1px solid transparent`,
      span: {
        color: `${Navcolors.colors.activeDrawerColor} !important`,
      },
      svg: {
        color: `${Navcolors.colors.activeDrawerColor} !important`,
      },

      borderRadius: 6,
    },
  },

  ListItemIcon: item => ({
    minWidth: 0,
    '&:hover': {
      color: `${Navcolors.colors.activeLinkColor} !important`,
    },
  }),
  ListItemText: item => ({
    color:
      pathname === item.path
        ? Navcolors.colors.activeDrawerColor
        : Navcolors.colors.linkTextColor,
    '.MuiListItemText-primary': {
      fontSize: '1.1rem',
      py: 1,
    },
    '&:hover': {
      color: `${Navcolors.colors.activeLinkColor} !important`,
    },
    span: {
      textAlign: 'center',
    },
    width: 1,
  }),
  NestedLinkBox: {
    mb: props.blockStyle ? 0 : '10px',
    pr: { lg: 0, xs: lng === 'ar' ? '2px' : undefined },
    pl: {
      lg: 0,
      xs: lng === 'en' ? '2px' : undefined,
    },
    borderLeft: {
      lg: 0,
      xs:
        lng === 'en'
          ? pathname === `/departments`
            ? `4px solid ${Navcolors.colors.activeDrawerColor}`
            : `1px solid transparent`
          : `1px solid transparent`,
    },
    borderRight: {
      lg: 0,
      xs:
        lng === 'ar'
          ? pathname === `/departments`
            ? `4px solid ${Navcolors.colors.activeDrawerColor}`
            : `1px solid transparent`
          : `1px solid transparent`,
    },
  },
  NestedLink: {
    width: 1,
    border: `1px solid ${Navcolors.colors.borderColor}`,
    borderTop: {
      lg: `1px solid ${Navcolors.colors.borderColor}`,

      xs: `1px solid ${Navcolors.colors.borderColor}`,
    },
    borderBottom: {
      lg: `1px solid ${Navcolors.colors.borderColor}`,
      xs: `1px solid ${Navcolors.colors.borderColor}`,
    },
    color: {
      lg:
        pathname === `/departments`
          ? Navcolors.colors.activeLinkColor
          : Navcolors.colors.linkTextColor,
      xs:
        pathname === `/departments`
          ? Navcolors.colors.activeDrawerColor
          : Navcolors.colors.drawerColor,
    },
    bgcolor: `${Navcolors.colors.linkTextBgColor} !important`,
    cursor: 'pointer',
    fontSize: {
      xs: '1rem',
      md: '1rem',
      lg: '1.2rem',
    },
    textTransform: 'capitalize',
    borderRadius: 6,
    p: '10px',

    justifyContent: 'center',
  },
  NotSubCategory: element => ({
    width: 0.9,
    mx: 'auto',
    mb: '10px',
    pr: { lg: 0, xs: lng === 'ar' ? '2px' : undefined },
    pl: { lg: 0, xs: lng === 'en' ? '2px' : undefined },
    borderLeft: {
      lg: 0,
      xs:
        lng === 'en'
          ? pathname.includes(`/departments/${element.id}`)
            ? `4px solid ${Navcolors.colors.activeDrawerColor}`
            : `1px solid transparent`
          : `1px solid transparent`,
    },
    borderRight: {
      lg: 0,
      xs:
        lng === 'ar'
          ? pathname.includes(`/departments/${element.id}`)
            ? `4px solid ${Navcolors.colors.activeDrawerColor}`
            : `1px solid transparent`
          : `1px solid transparent`,
    },
  }),
  NotSubCategoryButton: element => ({
    width: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',

    border: `1px solid ${Navcolors.colors.borderColor}`,

    color: {
      lg:
        pathname === `/departments/${element.id}`
          ? Navcolors.colors.activeLinkColor
          : Navcolors.colors.linkTextColor,
      xs:
        pathname === `/departments/${element.id}`
          ? Navcolors.colors.activeDrawerColor
          : Navcolors.colors.drawerColor,
    },
    bgcolor: `${Navcolors.colors.linkTextBgColor} !important`,
    cursor: 'pointer',
    fontSize: '18px',
    textTransform: 'capitalize',
    borderRadius: 6,
    p: '10px',

    justifyContent: 'center',
  }),
})
export const NavMenuStyles = ({ props, lng, pathname }) => ({
  Stack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: {
      lg: 'auto',
      xs: 0.55,
    },
  },
  Grid: { display: { xs: 'none', sm: 'block' }, mx: 'vertical' },
  MainBox: {
    width: {
      lg: 170,
      xs: 0.9,
    },
    mx: {
      lg: 0,
      xs: 'auto',
    },
    mb: {
      lg: '7px',
      xs: '10px',
    },
    pr: {
      lg: 0,
      xs: lng === 'ar' ? '2px' : undefined,
    },
    pl: {
      lg: 0,
      xs: lng === 'en' ? '2px' : undefined,
    },
    borderLeft: {
      lg: 0,
      xs:
        lng === 'en'
          ? pathname.includes('/departments')
            ? `4px solid ${Navcolors.colors.activeDrawerColor}`
            : `1px solid transparent`
          : `1px solid transparent`,
    },
    borderRight: {
      lg: 0,
      xs:
        lng === 'ar'
          ? pathname.includes('/departments')
            ? `4px solid ${Navcolors.colors.activeDrawerColor}`
            : `1px solid transparent`
          : `1px solid transparent`,
    },
  },
  Button: {
    mx: {
      lg: 0,
      xs: 'auto',
    },

    width: 1,
    display: 'flex',
    justifyContent: {
      lg: 'center',
      xs: 'space-between',
    },
    border: `1px solid ${Navcolors.colors.borderColor}`,
    color: {
      lg: pathname.includes('/departments')
        ? Navcolors.colors.activeLinkColor
        : Navcolors.colors.linkTextColor,
      xs: pathname.includes('/departments')
        ? Navcolors.colors.activeDrawerColor
        : Navcolors.colors.drawerColor,
    },
    bgcolor: {
      lg: `${
        pathname.includes('/departments')
          ? Navcolors.colors.activeLinkBgColor
          : Navcolors.colors.linkTextBgColor
      } !important`,
      xs: `${Navcolors.colors.linkTextBgColor} !important`,
    },
    cursor: 'pointer',
    fontSize: {
      xs: '1rem',
      md: '1rem',
      lg: '1.2rem',
    },
    textTransform: 'capitalize',
    borderRadius: 6,

    p: '8px 10px',
    gap: '7px',
    '&:hover': {
      color: `${Navcolors.colors.activeLinkColor} !important`,
      background: `${Navcolors.colors.activeLinkBgColor} !important`,
    },
  },
  ArrowDropDownIcon: {
    transition: 'all 0.4s',
    color: {
      lg: props.buttonStyle
        ? pathname.includes('/departments')
          ? Navcolors.colors.activeLinkColor
          : Navcolors.colors.linkTextColor
        : pathname.includes('/departments')
        ? Navcolors.colors.activeLinkColor
        : Navcolors.colors.linkTextColor,
      xs: pathname.includes('/departments')
        ? Navcolors.colors.activeDrawerColor
        : Navcolors.colors.drawerColor,
    },
  },
  Menu: {
    '.MuiList-root': {
      width: {
        lg: '100% !important',
        xs: '225px !important',
      },
      '.MuiButtonBase-root': {
        justifyContent: 'center',
      },
      p: '2px',
    },
    '.MuiPaper-root': {
      bgcolor: Navcolors.colors.menuBgColor,
    },
  },
  Menuitem: {
    bgcolor: `${
      pathname === `/departments`
        ? Navcolors.colors.activeMenuItemBgColor
        : Navcolors.colors.menuItemBgColor
    } !important`,
    p: '10px',
    color:
      pathname === `/departments`
        ? Navcolors.colors.activeMenuItemColor
        : Navcolors.colors.menuItemColor,
  },
  NestedLinksMenuitem: item => ({
    mb: '5px',
    p: '10px',
    bgcolor: `${
      pathname.includes(`/departments/${item.id}`)
        ? Navcolors.colors.activeMenuItemBgColor
        : Navcolors.colors.menuItemBgColor
    } !important`,
    color: pathname.includes(`/departments/${item.id}`)
      ? Navcolors.colors.activeMenuItemColor
      : Navcolors.colors.menuItemColor,
  }),
})

export const NestedCategoryStyles = ({ props, pathname, lng }) => ({
  Box: {
    width: {
      lg: 'auto',
      xs: 1,
    },
    direction: lng === 'en' ? 'ltr' : 'rtl',
  },

  stack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 1,
  },
  Button: {
    mx: {
      lg: 0,
      xs: 'auto',
    },
    width: {
      lg: 170,
      xs: 1,
    },
    display: 'flex',
    justifyContent: {
      lg: 'center',
      xs: 'space-between',
    },
    bgcolor: `${
      pathname.includes(`/departments/${props.item.id}`)
        ? Navcolors.colors.activeMenuItemBgColor
        : Navcolors.colors.menuItemBgColor
    } !important`,
    color: pathname.includes(`/departments/${props.item.id}`)
      ? Navcolors.colors.activeMenuItemColor
      : Navcolors.colors.menuItemColor,
    cursor: 'pointer',

    textTransform: 'capitalize',
    p: '8px 10px',
    gap: '7px',
    mb: '5px',
    '&:hover': {
      background: `${Navcolors.colors.activeLinkBgColor} !important`,
    },
  },
  ArrowDropDownIcon: {
    transition: 'all 0.4s',
    color: pathname.includes(`/departments/${props.item.id}`)
      ? Navcolors.colors.activeMenuItemColor
      : Navcolors.colors.menuItemColor,
    transform: open
      ? `rotate(${lng === 'en' ? '-90deg' : '90deg'})`
      : 'rotatex(0)',
  },
  Menu: {
    '.MuiList-root': {
      width: 190,
      p: '3px',
    },
    '.MuiPaper-root': {
      bgcolor: Navcolors.colors.menuBgColor,
    },
  },
  MenuItemSub: ({ sub }) => ({
    MenuItem: {
      bgcolor: `${
        pathname.includes(`/departments/${props.item.id}/${sub.id}`)
          ? Navcolors.colors.activeMenuItemBgColor
          : Navcolors.colors.menuItemBgColor
      } !important`,
      color: pathname.includes(`/departments/${props.item.id}/${sub.id}`)
        ? Navcolors.colors.activeMenuItemColor
        : Navcolors.colors.menuItemColor,
      mb: '5px',
      textAlign: 'center !important',
      justifyContent: lng === 'en' ? 'flex-start' : 'flex-end',
    },
    '&:hover': {
      bgcolor: `${Navcolors.colors.activeMenuItemBgColor} !important`,
      color: Navcolors.colors.activeMenuItemColor,
    },
  }),
  MenuItem: {
    bgcolor: `${
      pathname === `/departments/${props.item.id}`
        ? Navcolors.colors.activeMenuItemBgColor
        : Navcolors.colors.menuItemBgColor
    } !important`,
    color:
      pathname === `/departments/${props.item.id}`
        ? Navcolors.colors.activeMenuItemColor
        : Navcolors.colors.menuItemColor,
    justifyContent: lng === 'en' ? 'flex-start' : 'flex-end',
  },
})

export const navCategoryMenuStyles = {
  btnAll: pathname => ({
    bgcolor:
      pathname === '/departments'
        ? `${Navcolors.colors.activeLinkBgColor} !important`
        : `${Navcolors.colors.linkTextBgColor} !important`,
    color:
      pathname === '/departments'
        ? `${Navcolors.colors.activeLinkColor} !important`
        : `${Navcolors.colors.linkTextColor} !important`,
    cursor: 'pointer',
    fontSize: {
      xs: '1rem',
      md: '1rem',
      lg: '1.2rem',
    },
    textTransform: 'capitalize',
    // gap: 5.5,
    borderRadius: 6,
    border: `1px solid ${Navcolors.colors.borderColor} !important`,
    width: {
      lg: 'auto',
      xs: 0.9,
    },
    mb: {
      lg: 0,
      xs: '10px',
    },
    p: '10px',
    '&:hover': {
      bgcolor: `${Navcolors.colors.activeLinkBgColor} !important`,
      color: `${Navcolors.colors.activeLinkColor} !important`,
    },
  }),
  categoryMenu: (pathname, item) => ({
    bgcolor: pathname.includes(`/departments/${item.id}`)
      ? `${Navcolors.colors.activeLinkBgColor} !important`
      : `${Navcolors.colors.linkTextBgColor} !important`,
    color: pathname.includes(`/departments/${item.id}`)
      ? `${Navcolors.colors.activeLinkColor} !important`
      : `${Navcolors.colors.linkTextColor} !important`,
    cursor: 'pointer',
    fontSize: {
      xs: '1rem',
      md: '1rem',
      lg: '1.2rem',
    },
    textTransform: 'capitalize',
    borderRadius: 6,
    border: `1px solid ${Navcolors.colors.borderColor} !important`,
    // '&:hover': {
    //   bgcolor: `${Navcolors.colors.activeLinkBgColor} !important`,
    //   color: `${Navcolors.colors.activeLinkColor} !important`,
    // },
    '&:hover .ArrowDropDownIcon': {
      color: `${Navcolors.colors.activeLinkColor} !important`,
    },
    p: '10px',
    width: {
      lg: 'auto',
      xs: 0.9,
    },
    mb: {
      lg: 0,
      xs: '10px',
    },
  }),
  menuItem: (pathname, itemLink) => ({
    color:
      pathname === itemLink
        ? Navcolors.colors.activeMenuItemColor
        : Navcolors.colors.menuItemColor,
    bgcolor: `${
      pathname === itemLink
        ? Navcolors.colors.activeMenuItemBgColor
        : Navcolors.colors.menuBgColor
    } !important`,
  }),
  drawerLink: (pathname, linkPath) => ({
    width: 0.9,
    mx: 'auto',
    mb: '10px',
    svg: {
      color: `${Navcolors.colors.linkTextColor} !important`,
    },
    border: `1px solid ${Navcolors.colors.borderColor}`,
    borderRadius: 6,
    color: `${
      pathname === linkPath
        ? `${Navcolors.colors.activeLinkColor}`
        : `${Navcolors.colors.linkTextColor}`
    } !important`,
    '&:hover': {
      bgcolor: `${Navcolors.colors.activeLinkBgColor} !important`,
      color: `blue !important`,
    },
  }),
  navLink: (pathname, itemPath) => ({
    bgcolor: `${
      pathname === itemPath
        ? `${Navcolors.colors.activeLinkBgColor}`
        : `${Navcolors.colors.linkTextBgColor}`
    } !important`,
    color: `${
      pathname === itemPath
        ? `${Navcolors.colors.activeLinkColor}`
        : `${Navcolors.colors.linkTextColor}`
    } !important`,
    '&:hover': {
      bgcolor: `${Navcolors.colors.activeLinkBgColor} !important`,
      color: `${Navcolors.colors.activeLinkBgColor} !important`,
    },
    borderRadius: 6,
    py: 0,
    width: '100%',
    flex: 'flex-end !important',
  }),
}
