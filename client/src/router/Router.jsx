import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/home/Index'
import backgroundAuth from '../assets/png/signIn.png'
import backgroundContact from '../assets/png/contactUs.png'
import AuthLogo from '../assets/svg/الشعار مع الاسم التجاري.svg'
import Profile2 from '../pages/profile_2/profile2/Profile2'
import { CategoryPage } from './../pages/shop/Category/index'
import { SubCategoriePage } from '../pages/shop/subcategory'
import ContactNoon2 from '../pages/ContactUs/Noon2/ContactNoon2'
import Register2 from '../pages/Register/Register2/Register2.jsx'
import Login2 from '../pages/Login/Login2/Login2'
import ForgetPassword from './../pages/ForgetPassword/ForgetPassword'
import Google from '../components/google/Google'
import { SavedProductsPage } from './../pages/savedProducts/index'

import { NoonSingleProduct } from '../pages/singleProductPages/noon1/index.jsx'
import PaymentMoyasar from '../pages/PaymentMoyasar/PaymentMoyasar.jsx'
import ThanksPage from '../pages/ThanksPage/ThanksPage.jsx'
import { CategoriesPageSwipper } from '../pages/shop/categoriespageSwipper/index.jsx'
import { NoImage } from './../pages/privacies/NoImage/index'
import CheckOutJariri from '../pages/PaymentPage/Jariri/CheckOutJariri.jsx'
import { useSelector } from 'react-redux'
import ProtectedRoutes from './ProtectedRoutes'

import { Cart02 } from '../pages/cart/cart2/Cart02.jsx'
import NotificationsPage from '../pages/Notifications/index.jsx'
import BlogsPage from '../pages/blogs/blogs1/Blogs1.jsx'
import SingleBlog1 from '../pages/singleBlog/singleBlog1/SingleBlog1.jsx'
import About2 from '../pages/about/about2/About2.jsx'

const AppRoutes = ({ isCartDrawer }) => {
  const { currentUser } = useSelector(state => state)
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/products/:id/:name' element={<NoonSingleProduct />} />

      <Route
        element={
          <ProtectedRoutes
            condition={
              !currentUser ||
              (typeof currentUser === 'object' &&
                Object.keys(currentUser).length === 0)
            }
          />
        }
      >
        <Route
          path='/sign-in'
          element={<Login2 backgroundImage={backgroundAuth} logo={AuthLogo} />}
        />
        <Route
          path='/register'
          element={
            <Register2 backgroundImage={backgroundAuth} logo={AuthLogo} />
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoutes
            condition={currentUser && Object.keys(currentUser).length > 0}
          />
        }
      >
        <Route path='/profile' element={<Profile2 />} />
        <Route path='/checkout' element={<CheckOutJariri />} />
      </Route>
      <Route
        path='/contactUs'
        element={<ContactNoon2 backgroundImag={backgroundContact} />}
      />
      <Route path='/aboutus' element={<About2 />} />
      <Route path='/notifications' element={<NotificationsPage />} />
      <Route path='/forgetPassword' element={<ForgetPassword />} />
      <Route path='/departments' element={<CategoriesPageSwipper />} />
      <Route path='/departments/:categoryId/:name' element={<CategoryPage />} />
      <Route path='/auth/google/callback' element={<Google />} />
      {!isCartDrawer && <Route path='/cart' element={<Cart02 />} />}
      <Route
        path='/departments/:categoryId/:subId/:name'
        element={<SubCategoriePage />}
      />
      <Route path='/savedProducts' element={<SavedProductsPage />} />
      <Route path='/payment-order' element={<PaymentMoyasar />} />
      <Route path='/thankYou' element={<ThanksPage />} />
      <Route path='/policies/:policyType' element={<NoImage />} />
      <Route path='/blogs' element={<BlogsPage />} />
      <Route path='blogs/:blogId/:blogName' element={<SingleBlog1 />} />

      <Route path='*' element={<Navigate to='/notfound' replace />} />
    </Routes>
  )
}

export default AppRoutes
