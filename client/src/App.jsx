import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './router/Router'
import logoPath from './assets/svg/whiteLogo.svg'
import { useTranslation } from 'react-i18next'
import { useLazyGetMeQuery } from './redux/apis/UserApis.js'

// import Navbar_ButtunStyle_menu from './layouts/Navbars/buttonStyle/with_menu/Navbar_ButtunStyle_mnu.jsx'

import { useSelector } from 'react-redux'
import { useCreateGuestUserMutation } from './redux/apis/gestUserApi.js'
import JarirTextEarea from './components/Footers/jarir/jarirTextErea/index.jsx'
import Navbar_ButtunStyle from './layouts/Navbars/buttonStyle/without/Navbar_ButtunStyle.jsx'
function App () {
  const [getMe] = useLazyGetMeQuery()
  const [, { _, changeLanguage }] = useTranslation()
  const user = useSelector(state => state.currentUser)
  const [createGuestUser] = useCreateGuestUserMutation()

  useEffect(() => {
    changeLanguage('ar')
  }, [])
  useEffect(() => {
    if (localStorage.token) {
      getMe()
    }
  }, [])

  useEffect(() => {
    if (!localStorage.token) {
      createGuestUser()
        .unwrap()
        .then(res => {
          localStorage.setItem('token', res.token)
        })
    }
  }, [])

  return (
    <BrowserRouter>
      {/* <Navbar_ButtunStyle_menu logoPath={logoPath} /> */}
      <Navbar_ButtunStyle logoPath={logoPath} />
      <AppRoutes />
      <JarirTextEarea logo={logoPath} />
      {/* </ErrorBoundary> */}
    </BrowserRouter>
  )
}
export default App
