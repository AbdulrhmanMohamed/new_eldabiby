import { store } from '../../../../redux/Store.js'
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
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import { useCreateGuestUserMutation } from '../../../../redux/apis/gestUserApi.js'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LogoStyle,
  MainNavIcons,
  MainStyles,
  NavDrrawerStyles,
  NavLinksStyles,
  NavMenuStyles,
  Navcolors,
  NestedCategoryStyles,
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
import cartApi, { useGetAllCartsQuery } from '../../../../redux/apis/cartApi.js'
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
import { removeCurrentUser } from '../../../../redux/slices/userSlice.js'
import { allSubsBtn } from './styles.js'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { countries } from '../../../../components/providers/countries.js'
import { useGetCurrencyQuery } from '../../../../redux/apis/currencyApi.js'
import { CurencyActions } from '../../../../redux/slices/currency/currencySlice.js'
import { NotificationsApi } from '../../../../redux/apis/NotificationsApi.js'
import Notifications from '../../../../components/Notifications/Notifications.jsx'
import BookIcon from '@mui/icons-material/Book'
import { userApi } from '../../../../redux/apis/UserApis.js'
import { dashboardUrl } from '../../../../constants/baseUrl.js'
// ================================== HELPERS =================================//
const resolvepathname = pathname => {
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
        ? categoriesWithSubs.data.map(item => {
            return {
              id: item.category['id'],
              title_en: item.category.name_en,
              title_ar: item.category.name_ar,
              subs: item.subCategories.map(sub => ({
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

  pagesWithout: pathname => excludePages.includes(resolvepathname(pathname)),
  muiIcons: lng => [
    <HomeIcon
      key='home'
      sx={{
        color: 'A3A3A3',
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <CategoryIcon
      key={'category'}
      sx={{
        color: 'A3A3A3',
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <InfoIcon
      key={'info'}
      sx={{
        color: 'A3A3A3',
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <MapsUgcIcon
      key={'message'}
      sx={{
        color: 'A3A3A3',
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <CallIcon
      key={'call'}
      sx={{
        color: 'A3A3A3',
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
    {
      name_en: 'dashboard',
      name_ar: 'لوحة التحكم',
      path: '',
      icon: <DashboardIcon sx={iconStyle} />,
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

// countries select

// ======================================|| DRAWER ICON - Navbar ||================================//
function DrawerIcon ({ handleDrawerToggle }) {
  return (
    <IconButton
      sx={{ display: { lg: 'none', xs: 'block' } }}
      aria-label='open drawer'
      edge='start'
      onClick={handleDrawerToggle}
    >
      {' '}
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
function Logo ({ imagePath, extraObjectFit, phoneScreen, sx }) {
  const LogoStyles = LogoStyle()
  const navigate = useNavigate()
  return (
    <>
      {!phoneScreen && (
        <Grid item>
          <Box sx={sx}>
            {imagePath && (
              <CardMedia
                component='img'
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

// ====================================|| NavNestedCategoryMenu - NAVBAR  ||======================================//
function NavNestedCategoryMenu (props) {
  const { lng, pathname } = props
  const Styles = NestedCategoryStyles({ props, pathname, lng })
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickCategMenu = event => setAnchorEl(event.currentTarget)
  const navigate = useNavigate()
  const handleCloseCategMenu = () => {
    setAnchorEl(null)
  }
  const handleNestedLinks = url => {
    navigate(url)
    props.handleDrawerToggle && props.handleDrawerToggle()
    props.handleClose && props.handleClose()
    handleCloseCategMenu()
  }
  return (
    <Box sx={{ ...Styles.Box }}>
      <Button
        sx={{ ...Styles.Button }}
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickCategMenu}
      >
        <Stack sx={{ ...Styles.stack }}>
          <span>{props.item[`title_${lng === 'en' ? 'en' : 'ar'}`]}</span>
          <ArrowDropDownIcon
            className='ArrowDropDownIcon'
            sx={{
              ...Styles.ArrowDropDownIcon,
              transform: open
                ? `rotate(${lng === 'en' ? '-90deg' : '90deg'})`
                : 'rotatex(0)',
            }}
          />
        </Stack>
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseCategMenu}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        anchorOrigin={{
          horizontal: lng !== 'en' ? 'left' : 'right',
          vertical: 'center',
        }}
        transformOrigin={{
          horizontal: lng === 'en' ? 'left' : 'right',
          vertical: 'top',
        }}
        sx={{ ...Styles.Menu }}
      >
        {props.item.subs.map(sub => (
          <MenuItem
            key={sub.id}
            sx={{ ...Styles.MenuItemSub({ sub, pathname }).MenuItem }}
            onClick={() =>
              handleNestedLinks(
                `/departments/${props.item.id}/${sub.id}/${sub.title_en.replace(
                  /\s+/g,
                  '-'
                )}`
              )
            }
          >
            {sub[`title_${lng}`]}
          </MenuItem>
        ))}
        {props.item.subs.length ? (
          <MenuItem
            sx={{
              ...allSubsBtn(
                pathname,
                `/departments/${props?.item.id}/${props?.item.title_en.replace(
                  /\s+/g,
                  '-'
                )}`
              ),
            }}
            onClick={() =>
              handleNestedLinks(
                `/departments/${props?.item.id}/${props?.item.title_en.replace(
                  /\s+/g,
                  '-'
                )}`
              )
            }
          >
            {lng === 'en' ? 'All sub categories' : 'جميع الأقسام الفرعية'}
          </MenuItem>
        ) : null}
      </Menu>
    </Box>
  )
}
// =====================================================================================//

// ====================================|| NavMenu -  NAVBAR  ||======================================//

function NavMenu (props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const { lng, pathname } = props
  const Styles = NavMenuStyles({ props, lng, pathname })
  const open = Boolean(anchorEl)
  const handleClick = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const navigate = useNavigate()
  const HandleNavigate = url => {
    handleClose()
    navigate(url)
    props.handleDrawerToggle && props.handleDrawerToggle()
  }
  return (
    <Box sx={{ ...Styles.MainBox }}>
      <Button
        sx={{ ...Styles.Button }}
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {props.item.icon}
        <Stack sx={{ ...Styles.Stack }}>
          <span>{props.item[`link_${lng === 'en' ? 'en' : 'ar'}`]}</span>
          <ArrowDropDownIcon
            sx={{
              ...Styles.ArrowDropDownIcon,
              transform: !open ? `rotate(0)` : `rotate(180deg)`,
            }}
          />
        </Stack>
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{ ...Styles.Menu }}
      >
        {props.item.nestedLinks.map(item =>
          item.subs?.length > 0 ? (
            <NavNestedCategoryMenu
              {...props}
              item={item}
              handleClose={handleClose}
            />
          ) : (
            <MenuItem
              key={item.id}
              sx={{
                ...allSubsBtn(
                  pathname,
                  `/departments/${item.id}/${item.title_en.replace(
                    /\s+/g,
                    '-'
                  )}`
                ),
                mb: '6px',
                '&:hover': {
                  bgcolor: `${Navcolors.colors.menuItemBgColorHover} !important`,
                },
              }}
              onClick={() =>
                HandleNavigate(
                  `/departments/${item.id}/${item.title_en.replace(
                    /\s+/g,
                    '-'
                  )}`
                )
              }
            >
              {' '}
              {item[`title_${lng}`]}{' '}
            </MenuItem>
          )
        )}
        {props.item.nestedLinks.length > 1 && (
          <MenuItem
            sx={{
              ...Styles.Menuitem,
              ':hover': {
                bgcolor: `${Navcolors.colors.activeMenuItemBgColor} !important`,
                color: `${Navcolors.colors.activeMenuItemColor} !important`,
              },
            }}
            onClick={() => HandleNavigate(props.item.path)}
          >
            {' '}
            {lng === 'en' ? 'All categories' : 'جميع الأقسام'}{' '}
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}

// =========================================================================================//

// ====================================|| NAVLINKS - NAVBAR ||======================================//

function NavLinks (props) {
  const { navLinks, lng } = props
  const [activeButton] = useState(null)
  const navLinksStyles = NavLinksStyles()
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
                aria-haspopup='true'
                aria-expanded={
                  activeButton === `button${index}` ? 'true' : undefined
                }
                to={item?.path}
                sx={{
                  ...navLinksStyles.ButtonStyle,
                }}
                startIcon={
                  constants.muiIcons.length > 0
                    ? constants.muiIcons(lng)[index]
                    : null
                }
              >
                {lng === 'en' ? item.link_en : item.link_ar}
              </Button>
            ) : (
              <NavMenu {...props} item={item} />
            )
          )}
        </Stack>
      </Grid>
    </>
  )
}
// ====================================||  MUI ICONS - NAVBAR  ||===============================
function ProfileButton (colors) {
  const { currentUser } = useSelector(state => state)
  const styles = ProfileSyles(colors)
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
      .then(res => {
        localStorage.setItem('token', res?.token)
      })
    navigate('/')
    dispatch(removeCurrentUser())
  }
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickMenuItem = item => {
    item.name_en === 'Logout'
      ? handleLogout()
      : item?.name_en === 'dashboard'
      ? window.open(item.path)
      : navigate(item.path)
    handleClose()
  }
  const dashboardRole = constants.ProfileMenuData.find(
    item => item.name_en === 'dashboard'
  )

  return (
    <div>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disableRipple
        sx={styles.Button}
      >
        {open ? (
          <CloseIcon sx={styles.CloseIcon} />
        ) : (
          <Person2Icon sx={styles.Person2Icon} />
        )}
      </Button>

      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={styles.Menu}
        MenuListProps={styles.MenuListProps}
      >
        {constants.ProfileMenuData.filter(({ name_en }) =>
          (currentUser && currentUser?.email) ||
          (currentUser?.phone && currentUser?.role !== 'guest')
            ? name_en !== 'Login' && name_en !== 'Register'
            : name_en !== 'Profile' && name_en !== 'Logout'
        ).map(
          (item, index) =>
            item?.name_en !== 'dashboard' && (
              <Box key={index} onClick={() => handleClickMenuItem(item)}>
                <ProfileMenuItem item={item} colors={colors} />
              </Box>
            )
        )}
        {currentUser &&
          ['rootAdmin', 'subAdmin', 'adminA', 'adminB', 'adminC'].includes(
            currentUser?.role
          ) && (
            <Box
              onClick={() => {
                window.open(dashboardUrl, '_blank')
                handleClose()
              }}
            >
              <ProfileMenuItem item={dashboardRole} colors={colors} />
            </Box>
          )}
      </Menu>
    </div>
  )
}
// =======================================================================================
function NavIcons (props) {
  const [, { language: lng, changeLanguage }] = useTranslation()
  const Style = MainNavIcons(props)
  const navigate = useNavigate()
  const theme = useTheme()
  const phoneScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const { data: dataCart, error: errorCart } = useGetAllCartsQuery(undefined)
  const { data: favPros, error: errorFav } =
    useGetAllSavedProductsQuery(undefined)
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
        gap={2}
      >
        <Badge
          badgeContent={
            dataCart && !errorCart ? dataCart.data.totalQuantity : 0
          }
          sx={Style.Badge}
        >
          <AddShoppingCartOutlinedIcon
            onClick={() => navigate('/cart')}
            sx={Style.AddShoppingCartOutlinedIcon}
          />
        </Badge>
        <Badge
          badgeContent={
            favPros && !errorFav ? favPros.data.favourite.length : 0
          }
          sx={{
            '.MuiBadge-badge': {
              bgcolor: `${props.colors.badgeColors.bg} !important`,
              color: `${props.colors.badgeColors.text} !important`,
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
        <Button onClick={toggleLanguage} sx={Style.Button}>
          {lng === 'en' ? 'Ar' : 'En'}
        </Button>

        {!phoneScreen && <CountriesSelect colors={props.colors} />}
      </Stack>
    </Grid>
  )
}
// =========================================================================================//
// ====================================|| NAVBAR - NAV DRAWER ||======================================//
const NavDrawer = props => {
  const {
    navLinks,
    lng,
    pathname,
    mobileOpen,
    handleDrawerToggle,
    logoPath,
    muiIcons,
  } = props
  const theme = useTheme()
  const phoneScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const Styles = NavDrrawerStyles({ props, lng, pathname })
  const navigate = useNavigate()
  return (
    <nav>
      <Drawer
        variant='temporary'
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
                onClick={handleDrawerToggle}
                sx={{
                  cursor: 'pointer',
                  color: '#c4a035',
                }}
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
              {navLinks?.map((item, index) =>
                !item.nestedLinks ? (
                  <Button
                    sx={{ ...Styles.buttonLink(item) }}
                    id='basic-button'
                    onClick={() => {
                      navigate(item.path)
                      handleDrawerToggle()
                    }}
                  >
                    {item.icon}
                    <Stack sx={{ ...Styles.Stack }}>
                      <Typography
                        sx={{
                          position: 'absolute',
                          left: '40%',
                          transform: 'translateX(-50%)',
                          top: '20%',
                        }}
                      >
                        {item[`link_${lng === 'en' ? 'en' : 'ar'}`]}
                      </Typography>
                    </Stack>
                  </Button>
                ) : (
                  <NavMenu {...props} item={item} />
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
      direction='row'
      alignItems='center'
      justifyContent='space-between'
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
const CountriesSelect = props => {
  const dispatch = useDispatch()
  const [countryData, setCountryData] = useState({})
  const { data } = useGetCurrencyQuery()
  const [country, setCountry] = useState('sar')
  const handleChange = event => {
    setCountry(event.target.value)
  }

  useEffect(() => {
    dispatch(
      CurencyActions.setCurrency({
        currency: data?.data[0]?.rates[`${country.toUpperCase()}`] || 1,
        label: countryData.label || 'SAR - Saudi Riyal (ر.س)',
      })
    )
  }, [country])

  return (
    <Box sx={{ minWidth: 100 }}>
      <Select
        id='demo-simple-select'
        value={country}
        onChange={handleChange}
        sx={{
          minWidth: '70px',
          height: { xs: '35px', md: '45px' },
          // border:"1px solid gray",
          borderRadius: '5px',
          backgroundColor: props.colors.badgeColors.bg,
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: '200px', // Set your custom height here
            },
          },
        }}
      >
        {countries.map(country => {
          return (
            <MenuItem
              value={country.value}
              key={country.value}
              onClick={e => setCountryData(country)}
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

const Navbar_ButtunStyle_menu = props => {
  const theme = useTheme()
  const [, { language: lng }] = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const phoneScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const navLinks = constants.NavData()
  const handleDrawerToggle = () => setMobileOpen(prevState => !prevState)
  const styles = MainStyles({ pathname, lng })
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return (
    <Box sx={styles.MainBox}>
      <CssBaseline />
      <AppBar component='nav' sx={{ ...styles.AppBar }}>
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
            {/* links */}
            {/* leftnavicons */}
            <NavIcons {...Navcolors} pathname={pathname} lng={lng} />

            {/* leftnavicons */}
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
export default Navbar_ButtunStyle_menu
//=============================================================================================//
