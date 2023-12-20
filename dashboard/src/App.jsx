import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import Home from "./Pages/Home/Home";
import PrivateRoute from "./PrivateRoute";
 import AddProductPage from "./Pages/addProduct/AddProductPage";
// import AddProductPage2 from "./Pages/addProduct/AddProductPage2";
import { useTranslation } from "react-i18next";
import ContactRequests from "./Pages/Support/ContactRequests";
import TechnicalSupport from "./Pages/Support/TechnicalSupport";
import UsersSales from "./Pages/Sales/UsersSales";
import OrdersSales from "./Pages/Sales/OrdersSales";
import Shipping from "./Pages/Sales/Shipping";
import AdminPage from "./Pages/AdminPage/AdminPage";
import SiteContentPage from "./Pages/SiteContent/SiteContentPage";
import CategoriesPage from "./Pages/Categories/CategoriesPage";
import SiteContentPageOperations from "./Pages/SiteContent/SiteContentPageOperations";
import SiteContentPageOperationsLayout from "./Pages/SiteContent/SiteContentPageOperationsLayout";
import SiteContentSelectPage from "./Pages/SiteContent/SiteContentSelectPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShowContentPage from "./Pages/SiteContent/ShowContentPage";
import AccountingPage from "./Pages/accounting/AccountingPage";
import darkBg from "./assets/darkBg.png";
import EditProductPage from "./Pages/editProduct/EditProductPage";
import ProfilePage from "./Pages/profile/ProfilePage";
import ProductsPage from "./Pages/products/ProductsPage";
import OrderPage from "./Pages/order/OrderPage";
import ProductDetailsPage from "./Pages/productDetails/ProductDetailsPage";
import { useDispatch } from "react-redux";
import { setRole } from "./api/slice/user.slice";
import { useGetMeQuery } from "./api/user.api";
import MetaTagsPage from "./Pages/metaTags/MetaTagsPage";
import OffersPage from "./Pages/offers/OffersPage";
import CouponPage from "./Pages/Coupon/CouponPage";
import BlogsPage from "./Pages/blogs/BlogsPage";
import AddBlogPage from "./Pages/addBlog/AddBlogPage";
import EditBlogPage from "./Pages/editBlog/EditBlogPage";
import MarketerPage from "./Pages/Marketer/MarketerPage";
import SingleBlogPage from "./Pages/singleBlog/SingleBlogPage";
import PointsSystem from "./Pages/points/PointsSystem";
import NotificationsPage from "./Pages/Notifications/index";
import MarketMessage from "./Pages/marketmessage/MarketMessage";
import SmsMessages from "./Pages/SmsMessages/smsmessages";
import Tools from "./Pages/ToolsPage/Tools";
import PointsPage from "./Pages/PointsPage";
import AbandonedCarts from "./Pages/Sales/AbandonedCarts";
import ReposPage from "./Pages/respos/reposPage";
import AttributesPage from "./Pages/attributes/AttributesPage";
function App() {
  const { data, isSuccess } = useGetMeQuery();
  const [, { language, changeLanguage }] = useTranslation();
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode"))
  );
  const darkTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    colors: {
      main: "#00D5C5",
      bg_main: darkMode ? "#474747" : "#FAFAFA",
      dangerous: "#C75050",
      light: "#ddd",
      grey: "#7E7E7E",
      snow: "#FAFAFA",
      bg: darkMode ? "#575757" : "#FFFFFF",
      inputBorderColor: darkMode ? "#00D5C5" : "divider",
      text: darkMode ? "#fff" : "#000",
    },
    btnStyle: {
      bgcolor: "#00D5C5 !important",
      color: darkMode ? "#fff !important" : "#000 !important",
      textTransform: "capitalize",
      fontWeight: "bold",
    },
    customColors: {
      main: "#00D5C5",
      secondary: darkMode ? "#3D5A58" : "#D6F3F1",
      container: darkMode ? "#474747" : "#FAFAFA",
      bg: darkMode ? "#575757" : "#FFFFFF",
      card: darkMode ? "#474747" : "#fff",
      cardNotActive: darkMode ? "#202021" : "#f2f1f1",
      cardAddAdmin: darkMode ? "#687877" : "#f2f1f1",
      text: darkMode ? "#fff" : "#000",
      inputBorderColor: darkMode ? "#00D5C5" : "divider",
      dangerous: "#C75050",
      light: "#ddd",
      grey: "#7E7E7E",
      label: darkMode ? "#00D5C5" : "#000",
      inputField: darkMode ? "#00D5C5" : "#575757",
      notify: darkMode ? "#000" : "white",
      notifyBg: darkMode ? "#f0f2f5" : "#000",
    },
    direction: language === "en" ? "ltr" : "rtl",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    if (isSuccess) {
      dispatch(setRole(data?.data.role));
    }
  }, [isSuccess]);
  useEffect(() => {
    if (localStorage.i18nextLng === "en") {
      changeLanguage("ar");
    }
  }, []);

  useEffect(() => {
    document.body.style.direction = language === "en" ? "ltr" : "rtl";
  }, [language]);
  return (
    <div
      style={{
        backgroundImage: `url("${darkMode && darkBg}")`,
        backgroundColor: !darkMode && "#fafafa",
        backgroundSize: "100%",
        backgroundPosition: "start",
        minHeight: "100vh",
        direction: language === "ar" ? "rtl" : "ltr",
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="sign-in" element={<SignIn />} />
            <Route element={<PrivateRoute setDarkMode={setDarkMode} />}>
              <Route index element={<Home />} />
              <Route path="/products/add" element={<AddProductPage />} />
              <Route
                path="/siteContent"
                element={<SiteContentPageOperationsLayout />}
              >
                <Route index element={<SiteContentPage />} />
                <Route path="/siteContent/:id" element={<ShowContentPage />} />
                <Route
                  path="/siteContent/operation"
                  element={<SiteContentSelectPage />}
                />
                <Route
                  path="/siteContent/operation/:type"
                  element={<SiteContentPageOperations />}
                />
              </Route>
              <Route path="/repositories" element={<ReposPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/contactRequests" element={<ContactRequests />} />
              <Route path="/technicalSupport" element={<TechnicalSupport />} />
              <Route path="/users" element={<UsersSales />} />
              <Route path="/orders" element={<OrdersSales />} />
              <Route path="/abandonedCarts" element={<AbandonedCarts />} />
              <Route path="/orders/:id" element={<OrderPage />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/accounting" element={<AccountingPage />} />
              <Route path="/admins" element={<AdminPage />} />
              <Route path="/products/edit/:id" element={<EditProductPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/meta-tags" element={<MetaTagsPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/points" element={<PointsSystem />} />
              <Route path="/pointsMangement" element={<PointsPage />} />
              <Route path="/coupons" element={<CouponPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:blogId" element={<SingleBlogPage />} />
              <Route path="/blogs/add" element={<AddBlogPage />} />
              <Route path="/blogs/edit/:blogId" element={<EditBlogPage />} />
              <Route path="/marketers" element={<MarketerPage />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/EmailMessage" element={<MarketMessage />} />
              <Route path="/SmsMessage" element={<SmsMessages />} />
              <Route path="/attributes" element={<AttributesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
