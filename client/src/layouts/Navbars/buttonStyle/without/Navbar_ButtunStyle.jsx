import {
  AppBar,
  Box,
  CardMedia,
  CssBaseline,
  Grid,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
  Stack,
  Button,
  Badge,
  Menu,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  MenuItem,
  Typography,
  Select,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { store } from '../../../../redux/Store.js'
import {
  LogoStyle,
  MainNavIcons,
  MainStyles,
  NavDrrawerStyles,
  NavLinksStyles,
  NavMenuStyles,
  Navcolors,
  ProfileMenuStyles,
  ProfileSyles,
  iconStyle,
} from './styles.js'
import { useGetAllCategoriesWithSubsQuery } from '../../../../redux/apis/categoriesApi.js'
import { useEffect } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import CategoryIcon from '@mui/icons-material/Category'
import InfoIcon from '@mui/icons-material/Info'
import CallIcon from '@mui/icons-material/Call'
import MapsUgcIcon from '@mui/icons-material/MapsUgc'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import LogoutIcon from '@mui/icons-material/Logout'
import { NavLink } from 'react-router-dom'
import BookIcon from '@mui/icons-material/Book'

import cartApi, {
  useLazyGetAllCartsQuery,
} from '../../../../redux/apis/cartApi.js'
import {
  savedProductsApi,
  useGetAllSavedProductsQuery,
} from '../../../../redux/apis/SavedProductApi.js'
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { useDispatch, useSelector } from 'react-redux'
import Person2Icon from '@mui/icons-material/Person2'
import CloseIcon from '@mui/icons-material/Close'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { toast } from 'react-toastify'
import { useCreateGuestUserMutation } from '../../../../redux/apis/gestUserApi.js'
import { navCategoryMenuStyles } from './styles.js'
import { removeCurrentUser } from '../../../../redux/slices/userSlice.js'
// import { Cart03 } from '../../../../pages/cart/cart3/Cart03.jsx'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Notifications from '../../../../components/Notifications/Notifications.jsx'
import { countries } from '../../../../components/providers/countries.js'
import { useGetCurrencyQuery } from '../../../../redux/apis/currencyApi.js'
import { CurencyActions } from '../../../../redux/slices/currency/currencySlice.js'
import { userApi } from '../../../../redux/apis/UserApis.js'
import { dashboardUrl } from '../../../../constants/baseUrl.js'
import { NotificationsApi } from '../../../../redux/apis/NotificationsApi.js'
// ================================== HELPERS =================================//

const resolvepathname = (pathname) => {
  const pattern = /\/([^\/]+)(\/|$)/
  const result = pathname.match(pattern)
  if (result) {
    return result[1]
  }
}
const excludePages = ['sign-in', 'register', 'thankYou', 'forgetPassword']
export const constants = {
  navlins: [],
  NavData: () => {
    const { categoriesWithSubs } = hooks.useFetchCategoriesWithSubs()
    const nestedLinks =
      categoriesWithSubs.data.length > 0
        ? categoriesWithSubs.data.map((item) => {
            return {
              id: item.category['id'],
              title_en: item.category.name_en,
              title_ar: item.category.name_ar,
              subs: item.subCategories.map((sub) => ({
                id: sub.id,
                title_en: sub.name_en,
                title_ar: sub.name_ar,
              })),
              isLoading: categoriesWithSubs.isLoading,
            }
          })
        : []
    return [
      {
        link_en: 'Home',
        link_ar: 'الرئيسية',
        icon: <HomeIcon />,
        path: '/',
      },
      {
        link_en: 'Categories',
        link_ar: 'الأقسام',
        path: '/departments',
        icon: <CategoryIcon />,
        nestedLinks: nestedLinks,
      },
      {
        link_en: 'About Us',
        link_ar: 'حولنا',
        path: '/aboutUs',
        icon: <InfoIcon />,
      },
      {
        link_en: 'Contact Us',
        link_ar: 'تواصل معنا',
        path: '/contactUs',
        icon: <MapsUgcIcon />,
      },
      {
        link_en: 'Our Blogs',
        link_ar: 'مدوناتنا',
        path: '/blogs',
        icon: <BookIcon />,
      },
    ]
  },
  pagesWithout: (pathname) => excludePages.includes(resolvepathname(pathname)),
  muiIcons: (lng, iconColor) => [
    <HomeIcon
      key="home"
      sx={{
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <CategoryIcon
      key={'category'}
      sx={{
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <InfoIcon
      key={'info'}
      sx={{
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <MapsUgcIcon
      key={'message'}
      sx={{
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <CallIcon
      key={'call'}
      sx={{
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
  ],
  ProfileMenuData: [
    {
      name_en: 'Login',
      name_ar: 'تسجيل الدخول',
      path: 'sign-in',
      icon: <LoginIcon sx={iconStyle} />,
    },
    {
      name_en: 'Register',
      name_ar: 'تسجيل حساب',
      path: 'register',
      icon: <AppRegistrationIcon sx={iconStyle} />,
    },
    {
      name_en: 'Profile',
      name_ar: 'الملف الشخصي',
      path: 'profile',
      icon: <AccountCircleIcon sx={iconStyle} />,
    },
    {
      name_en: 'Logout',
      name_ar: 'تسجيل خروج',
      path: '',
      icon: <LogoutIcon sx={iconStyle} />,
    },
  ],
}
const hooks = {
  useFetchCategoriesWithSubs: () => {
    const { data, error, isLoading } =
      useGetAllCategoriesWithSubsQuery('limit=1000')
    const [_, { language }] = useTranslation()
    const [categoriesWithSubs, setCategories] = useState({
      data: [],
      error: '',
      isLoading,
    })
    useEffect(() => {
      if (data && !error) {
        setCategories({
          data: data.data,
          isLoading,
          error: `${
            language === 'en'
              ? 'Error while fetching categories'
              : 'حدث خطأ أثناء جلب الأقسام'
          }`,
        })
      } else {
        setCategories({
          data: [],
          error: `${
            language === 'en'
              ? 'Error while fetching categories'
              : 'حدث خطأ أثناء جلب الأقسام'
          }`,
        })
      }
    }, [data, error])
    return { categoriesWithSubs }
  },
}
// ======================================|| DRAWER ICON - Navbar ||================================//
function DrawerIcon({ handleDrawerToggle }) {
  return (
    <IconButton
      sx={{ display: { lg: 'none', xs: 'block' } }}
      aria-label="open drawer"
      edge="start"
      onClick={handleDrawerToggle}
    >
      <MenuIcon
        sx={{
          color: '#c4a035',
        }}
      />
    </IconButton>
  )
}
// =================================================================================================//

// ====================================|| LOGO - NAVBAR ||======================================//
function Logo({ imagePath, extraObjectFit, phoneScreen, sx }) {
  const LogoStyles = LogoStyle()
  const navigate = useNavigate()
  return (
    <>
      {!phoneScreen && (
        <Grid item>
          <Box sx={sx}>
            {imagePath && (
              <CardMedia
                component="img"
                onClick={() => navigate('/')}
                sx={{ ...LogoStyles.cardMedia(extraObjectFit) }}
                src={imagePath}
              />
            )}
          </Box>
        </Grid>
      )}
    </>
  )
}
// =====================================================================================//

// ====================================|| Nav Category Menu -  NAVBAR  ||======================================//

function NavCategoryMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const { lng, pathname } = props
  const Styles = NavMenuStyles({ props, lng, pathname })
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const navigate = useNavigate()
  const HandleNavigate = (url) => {
    handleClose()
    navigate(url)
    if (props.handleDrawerToggle) {
      props.handleDrawerToggle()
    }
  }
  return (
    <Box>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ ...navCategoryMenuStyles.categoryMenu(pathname, props.item) }}
      >
        <Stack direction={'row'} alignItems={'center'} gap={'3px'}>
          <span title={props.item[`title_${lng}`]}>
            {props.item[`title_${lng === 'en' ? 'en' : 'ar'}`]}
          </span>
          <ArrowDropDownIcon
            className="ArrowDropDownIcon"
            sx={{
              ...Styles.ArrowDropDownIcon,
              transform: open ? 'rotate(180deg)' : 'rotatex(0)',
            }}
          />
        </Stack>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{ ...Styles.Menu }}
      >
        {props.item.subs.map((sub) => (
          <MenuItem
            key={props.item.id}
            sx={navCategoryMenuStyles.menuItem(
              pathname,
              `/departments/${props.item.id}/${sub.id}/${sub.title_en.replace(
                /\s+/g,
                '-'
              )}`
            )}
            onClick={() =>
              HandleNavigate(
                `/departments/${props.item.id}/${sub.id}/${sub.title_en.replace(
                  /\s+/g,
                  '-'
                )}`
              )
            }
          >
            {' '}
            {sub[`title_${lng}`]}{' '}
          </MenuItem>
        ))}
        {props.item.subs[0] && (
          <MenuItem
            sx={navCategoryMenuStyles.menuItem(
              pathname,
              `/departments/${props.item.id}/${props.item.title_en.replace(
                /\s+/g,
                '-'
              )}`
            )}
            onClick={() =>
              HandleNavigate(
                `/departments/${props.item.id}/${props.item.title_en.replace(
                  /\s+/g,
                  '-'
                )}`
              )
            }
          >
            {' '}
            {lng === 'en' ? 'All Sub categories' : 'جميع الأقسام الفرعية'}
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}
// =========================================================================================//

// ====================================|| NAVLINKS - NAVBAR ||======================================//

function NavLinks(props) {
  const { navLinks, lng } = props
  const [activeButton] = useState(null)
  const navLinksStyles = NavLinksStyles()
  const { pathname } = useLocation()
  return (
    <>
      <Grid item sx={{ ...navLinksStyles.Grid }}>
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'center'}
          flexWrap={'wrap'}
          columnGap={8}
          gap={'20px'}
          py={1}
        >
          {navLinks.map((item, index) =>
            !item.nestedLinks ? (
              <Button
                component={NavLink}
                key={index}
                id={`button${index}`}
                aria-controls={
                  activeButton === `button${index}` ? `menu${index}` : undefined
                }
                aria-haspopup="true"
                aria-expanded={
                  activeButton === `button${index}` ? 'true' : undefined
                }
                to={item?.path}
                sx={{ ...navLinksStyles.ButtonStyle }}
                startIcon={
                  constants.muiIcons.length > 0
                    ? constants.muiIcons(lng)[index]
                    : null
                }
              >
                {lng === 'en' ? item.link_en : item.link_ar}
              </Button>
            ) : (
              <>
                {item.nestedLinks.length > 0 && (
                  <Button
                    component={NavLink}
                    to={`/departments`}
                    sx={{
                      ...navCategoryMenuStyles.btnAll(pathname),
                    }}
                    startIcon={
                      constants.muiIcons.length > 0
                        ? constants.muiIcons(lng)[index]
                        : null
                    }
                  >
                    {lng === 'en' ? 'All departments' : 'جميع الأقسام'}
                  </Button>
                )}
                {item.nestedLinks.map((element, index) =>
                  !element.subs[0] ? (
                    <Button
                      component={NavLink}
                      key={index}
                      id={`button${index}`}
                      aria-controls={
                        activeButton === `button${index}`
                          ? `menu${index}`
                          : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={
                        activeButton === `button${index}` ? 'true' : undefined
                      }
                      to={`/departments/${
                        element.id
                      }/${element.title_en.replace(/\s+/g, '-')}`}
                      sx={{ ...navLinksStyles.ButtonStyle }}
                    >
                      {lng === 'en' ? element.title_en : element.title_ar}
                    </Button>
                  ) : (
                    <NavCategoryMenu
                      {...props}
                      item={element}
                      handleDrawerToggle={props.handleDrawerToggle}
                    />
                  )
                )}
              </>
            )
          )}
        </Stack>
      </Grid>
    </>
  )
}
// ====================================||  MUI ICONS - NAVBAR  ||===============================
function ProfileButton(colors) {
  const { currentUser } = useSelector((state) => state)
  const styles = ProfileSyles(colors)
  const styleProfileMenu = ProfileMenuStyles({ colors })
  const [, { language }] = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [createGuestUser] = useCreateGuestUserMutation()
  const open = Boolean(anchorEl)
  const handleLogout = () => {
    handleClose()
    localStorage.clear()
    store.dispatch(savedProductsApi.util.resetApiState())
    store.dispatch(cartApi.util.resetApiState())
    store.dispatch(NotificationsApi.util.resetApiState())
    store.dispatch(userApi.util.resetApiState())
    toast.success(language === 'en' ? 'You are logged out' : 'تم تسجيل الخروج')
    createGuestUser()
      .unwrap()
      .then((res) => {
        localStorage.setItem('token', res?.token)
      })
    navigate('/')
    dispatch(removeCurrentUser())
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickMenuItem = (item) => {
    item.name_en === 'Logout'
      ? handleLogout()
      : item?.name_en === 'dashboard'
      ? window.open(item.path)
      : navigate(item.path)
    handleClose()
  }
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disableRipple
        sx={{
          ...styles.Button,
          bgcolor: 'transparent !important',
          minWidth: '0 !important',
          maxWidth: '0 !important',
        }}
      >
        {open ? (
          <CloseIcon
            sx={{
              ...styles.CloseIcon,
              color: '#C4A035',
            }}
          />
        ) : (
          <Person2Icon
            sx={{
              ...styles.Person2Icon,
              color: '#C4A035',
            }}
          />
        )}
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={styles.Menu}
        MenuListProps={styles.MenuListProps}
        disableScrollLock={true}
      >
        {constants.ProfileMenuData.filter(({ name_en }) =>
          currentUser?.email || currentUser?.phone
            ? name_en !== 'Login' && name_en !== 'Register'
            : name_en !== 'Profile' && name_en !== 'Logout'
        ).map((item, index) => (
          <Box key={index} onClick={() => handleClickMenuItem(item)}>
            <ProfileMenuItem item={item} colors={colors} />
          </Box>
        ))}
        {currentUser &&
          ['rootAdmin', 'subAdmin', 'adminA', 'adminB', 'adminC'].includes(
            currentUser?.role
          ) && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={styleProfileMenu.Stack}
              onClick={() => {
                window.open(dashboardUrl, '_blank')
                handleClose()
              }}
            >
              <DashboardIcon />
              <Typography sx={styleProfileMenu.Typography}>
                {language === 'en' ? 'Dashboard' : 'لوحة التحكم'}
              </Typography>
            </Stack>
          )}
      </Menu>
    </div>
  )
}
// =======================================================================================

// =============||   CountriesSelect ||========

const CountriesSelect = (props) => {
  const dispatch = useDispatch()
  const { data } = useGetCurrencyQuery()
  const [country, setCountry] = useState(
    JSON.parse(localStorage.getItem('country'))?.value || 'sar'
  ) //when refresh get the value from local storage
  const handleChange = (event) => {
    localStorage.setItem(
      'country',
      JSON.stringify(
        countries.find((country) => country.value === event.target.value)
      )
    )
    setCountry(event.target.value)
  }

  useEffect(() => {
    // to avoid null value and sure localStorage has value
    localStorage.setItem(
      'country',
      JSON.stringify(
        JSON.parse(localStorage.getItem('country')) || {
          label: 'SA - Saudi Riyal (ر.س)',
          value: 'sar',
          currency: data?.data[0]?.rates[`${country.toUpperCase()}`],
        }
      )
    )
    setCountry(JSON.parse(localStorage.getItem('country'))?.value || 'sar')
  }, [])

  const countryData = JSON.parse(localStorage.getItem('country'))

  useEffect(() => {
    dispatch(
      CurencyActions.setCurrency({
        currency: data?.data[0]?.rates[`${country.toUpperCase()}`] || 1,
        label: countryData?.label || 'SAR - Saudi Riyal (ر.س)',
      })
    )
  }, [country, data?.data])

  return (
    <Box sx={{ minWidth: 100 }}>
      <Select
        id="demo-simple-select"
        value={country}
        onChange={handleChange}
        sx={{
          minWidth: '70px',
          height: { xs: '43px', md: '42px' },
          '& > svg': {
            color: '#c4a035',
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: '200px', // Set your custom height here
            },
          },
        }}
      >
        {countries.map((country) => {
          return (
            <MenuItem
              value={country.value}
              key={country.value}
              onClick={(e) =>
                JSON.parse(localStorage.getItem('country'))?.value
              }
              sx={{
                gap: 2,
              }}
            >
              <div
                className={`currency-flag currency-flag-${country.value}`}
              ></div>
              {/* {country.currency} */}
            </MenuItem>
          )
        })}
      </Select>
    </Box>
  )
}

// ======================================|| NavIcons ||================================================
function NavIcons(props) {
  const [, { language: lng, changeLanguage }] = useTranslation()
  const Style = MainNavIcons(props)
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state)
  const theme = useTheme()
  const phoneScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const [getCart, { data: dataCart, error: errorCart }] =
    useLazyGetAllCartsQuery(undefined)
  const { data: favPros, error: errorFav } =
    useGetAllSavedProductsQuery(undefined)
  useEffect(() => getCart(undefined), [currentUser])
  const toggleLanguage = () => {
    lng === 'en' ? changeLanguage('ar') : changeLanguage('en')
  }

  return (
    <Grid item sx={Style.Grid}>
      <Stack
        direction={{
          lg: 'row',
          xs: 'row',
        }}
        alignItems={'center'}
        gap={1}
      >
        <Badge
          badgeContent={
            dataCart && !errorCart ? dataCart.data.totalQuantity : 0
          }
          sx={Style.Badge}
        >
          {!props.isCartDrawer ? (
            <AddShoppingCartOutlinedIcon
              onClick={() => navigate('/cart')}
              sx={Style.AddShoppingCartOutlinedIcon}
            />
          ) : (
            {
              /* <Cart03 cartIconStyle={Style.AddShoppingCartOutlinedIcon} />
               */
            }
          )}
        </Badge>
        <Badge
          badgeContent={
            favPros && !errorFav ? favPros.data.favourite.length : 0
          }
          sx={{
            '.MuiBadge-badge': {
              bgcolor: `transparent !important`,
              color: `${Navcolors.colors.badgeColors.text} !important`,
            },
          }}
        >
          <FavoriteBorderOutlinedIcon
            onClick={() => navigate('/savedProducts')}
            sx={Style.FavoriteBorderOutlinedIcon}
          />
        </Badge>
        <ProfileButton
          menuBgColor={Navcolors.colors.menuBgColor || 'transparent'}
          iconColor={Navcolors.colors.buttonColor || 'black'}
          bgColor={Navcolors.colors.buttonBgColor || 'transparent'}
          textColor={Navcolors.colors.menuItemColor || 'black'}
          menuItemBgColor={Navcolors.colors.menuItemBgColor || 'transparent'}
          activeColor={Navcolors.colors.activeLinkBgColor || 'transparent'}
        />
        <Notifications
          lng={lng}
          iconColor={Navcolors.colors.buttonColor}
          bgColorBtn={Navcolors.colors.buttonBgColor}
        />
        <Button
          onClick={toggleLanguage}
          sx={{
            ...Style.Button,
            bgcolor: 'transparent !important',
            color: '#C4A035',
            border: `1px solid  #C4A035`,
            maxWidth: '50px',
          }}
        >
          {lng === 'en' ? 'Ar' : 'En'}
        </Button>
        {!phoneScreen && <CountriesSelect colors={props.colors} />}
      </Stack>
    </Grid>
  )
}
// =========================================================================================//
// ====================================|| NAVBAR - NAV DRAWER ||======================================//
const NavDrawer = (props) => {
  const {
    navLinks,
    lng,
    pathname,
    mobileOpen,
    handleDrawerToggle,
    logoPath,
    muiIcons,
  } = props
  const Styles = NavDrrawerStyles({ props, lng, pathname })
  const navLinksStyles = NavLinksStyles()
  const [activeButton] = useState(null)
  return (
    <nav>
      <Drawer
        variant="temporary"
        anchor={lng === 'en' ? 'left' : 'right'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ ...Styles.Drawer }}
      >
        <Stack
          sx={{ ...Styles.Stack }}
          direction={'column'}
          alignItems={'center'}
        >
          <Box sx={{ ...Styles.Box }}>
            <Stack direction={'row'} justifyContent={'flex-end'} px={2}>
              <CloseIcon
                sx={{
                  cursor: 'pointer',
                  color: '#c4a035',
                }}
                onClick={handleDrawerToggle}
              />
            </Stack>
            <Box sx={{ height: '90px', mx: 'auto' }}>
              <Logo
                sx={{ height: '80px !important', width: '165px', mx: 'auto' }}
                imagePath={logoPath}
                extraObjectFit={'contain'}
              />
            </Box>

            <List>
              {navLinks.map((item, index) =>
                !item.nestedLinks ? (
                  <ListItem
                    component={NavLink}
                    key={index}
                    to={item?.path}
                    onClick={() => {
                      handleDrawerToggle()
                    }}
                    disablePadding
                    sx={{
                      ...navCategoryMenuStyles.drawerLink(pathname, item.path),
                    }}
                  >
                    <ListItemButton
                      sx={{
                        ...navCategoryMenuStyles.navLink(pathname, item.path),
                      }}
                    >
                      {muiIcons !== undefined && (
                        <ListItemIcon sx={{ ...Styles.ListItemIcon }}>
                          {item.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={lng === 'en' ? item.link_en : item.link_ar}
                        sx={{ ...Styles.ListItemText(item) }}
                      />
                    </ListItemButton>
                  </ListItem>
                ) : (
                  <>
                    {item.nestedLinks.length > 0 && (
                      <Button
                        component={NavLink}
                        key={index}
                        id={`button${index}`}
                        aria-controls={
                          activeButton === `button${index}`
                            ? `menu${index}`
                            : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={
                          activeButton === `button${index}` ? 'true' : undefined
                        }
                        to={item?.path}
                        sx={{
                          ...navCategoryMenuStyles.btnAll(pathname),
                        }}
                        startIcon={
                          constants.muiIcons.length > 0
                            ? constants.muiIcons(lng)[index]
                            : null
                        }
                        onClick={() => {
                          props.handleDrawerToggle()
                        }}
                      >
                        {lng === 'en' ? 'All departments' : 'جميع الأقسام'}
                      </Button>
                    )}
                    {item.nestedLinks.map((element, index) =>
                      !element.subs[0] ? (
                        <Button
                          component={NavLink}
                          key={index}
                          id={`button${index}`}
                          aria-controls={
                            activeButton === `button${index}`
                              ? `menu${index}`
                              : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={
                            activeButton === `button${index}`
                              ? 'true'
                              : undefined
                          }
                          to={`/departments/${
                            element.id
                          }/${element.title_en.replace(/\s+/g, '-')}`}
                          sx={{ ...navLinksStyles.ButtonStyle, width: 0.9 }}
                          onClick={() => {
                            props.handleDrawerToggle()
                          }}
                        >
                          {lng === 'en' ? element.title_en : element.title_ar}
                        </Button>
                      ) : (
                        <NavCategoryMenu {...props} item={element} />
                      )
                    )}
                  </>
                )
              )}
            </List>
          </Box>
          <CountriesSelect colors={props.colors} />
        </Stack>
      </Drawer>
    </nav>
  )
}
// =========================================================================================//
// ====================================|| NAVBAR - PROFILE MENU ITEM ||===========================//
const ProfileMenuItem = ({ item, colors }) => {
  const style = ProfileMenuStyles({ colors })
  const [, { language }] = useTranslation()
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={style.Stack}
    >
      {item.icon}
      <Typography sx={style.Typography}>
        {language === 'en' ? item.name_en : item.name_ar}
      </Typography>
    </Stack>
  )
}
// =========================================================================================//
// ====================================|| NAVBAR ||======================================//
const Navbar_ButtunStyle = (props) => {
  const [, { language: lng }] = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const theme = useTheme()
  const phoneScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const navLinks = constants.NavData()
  const handleDrawerToggle = () => setMobileOpen((prevState) => !prevState)
  const styles = MainStyles({ pathname, lng })
  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <Box sx={{ ...styles.MainBox }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ ...styles.AppBar }}>
        <Toolbar sx={{ height: 'inherit' }}>
          {/* drawerButton */}
          <DrawerIcon handleDrawerToggle={handleDrawerToggle} />
          {/* drawerButton */}
          {/* logo */}
          <Grid container sx={{ ...styles.container }}>
            <Logo
              sx={{ ...styles.Logo }}
              phoneScreen={phoneScreen}
              imagePath={props.logoPath}
              extraObjectFit={'contain'}
            />
            {/* logo */}

            {/* links */}
            {!phoneScreen && (
              <NavLinks
                lng={lng}
                pathname={pathname}
                navLinks={navLinks}
                muiIcons={constants.muiIcons(lng)}
                {...Navcolors}
              />
            )}
            <NavIcons
              {...Navcolors}
              pathname={pathname}
              lng={lng}
              isCartDrawer={props.isCartDrawer}
            />
          </Grid>
        </Toolbar>
      </AppBar>
      <NavDrawer
        {...Navcolors}
        mobileOpen={mobileOpen}
        navLinks={navLinks}
        lng={lng}
        pathname={pathname}
        handleDrawerToggle={handleDrawerToggle}
        muiIcons={constants.muiIcons(lng)}
        logoPath={props.logoPath}
      />
    </Box>
  )
}
export default Navbar_ButtunStyle
//=============================================================================================//
