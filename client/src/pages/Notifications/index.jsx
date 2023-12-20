import { useParams } from 'react-router'
import { useLazyGetNotificationsByUserIdQuery } from '../../redux/apis/NotificationsApi'
import { Box, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { Container } from '@mui/system'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import NotifyItem from '../../components/Notifications/NotifyItem'
import { useNavigate } from 'react-router-dom'
const NotificationsPage = () => {
  const [, { language: lng }] = useTranslation()
  const [getNots, { isLoading, isError, isSuccess, error }] =
    useLazyGetNotificationsByUserIdQuery()
  const [nots, setNots] = useState([])
  const [selectedNotify, setSelectedNotify] = useState({})
  const notifyId = localStorage.getItem('notifyId')
  const navigate = useNavigate()
    // Find the index of the third "/"
const thirdSlashIndex = selectedNotify.link?.indexOf('/', selectedNotify.link.indexOf('/', selectedNotify.link.indexOf('/') + 1) + 1);
// Slice the URL after the third "/"
const slicedURL = selectedNotify.link?.slice(thirdSlashIndex + 1);
  useEffect(() => {
    getNots()
      .unwrap()
      .then((res) => {
        console.log('res', res)
        setNots(res?.data)
        setSelectedNotify(res?.data?.find((notify) => notify._id === notifyId))
      })
      .catch((err) => {
        console.log('err', err)
      })
  }, [])
  return (
    <Box sx={{ bgcolor: '#f0f2f5', py: 5, minHeight: '100vh' }}>
      <Container>
        {isLoading && <span className="loader"></span>}
        {isError && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '80vh',
            }}
          >
            <Typography
              fontSize={'1.5rem'}
              my={10}
              textAlign={'center'}
              color="error"
            >
              {error?.data && error?.data[`error_${lng}`]}
            </Typography>
          </Box>
        )}
        {isSuccess && (
          <Stack direction={'row'} spacing={6}>
            <Box
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 4,
                p: 3,
                width: { xs: 1, sm: 0.5 },
                maxHeight: 500,
                overflowY: 'auto',
                scrollbarGutter: 'stable',
                '&::-webkit-scrollbar': {
                  width: '12px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#E2E2E2',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#9e9e9e',
                  borderRadius: 4,
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  textAlign: lng === 'ar' ? 'right' : 'left',
                  fontWeight: 'bold',
                  fontSize: '25px',
                  mb: 3,
                  color: 'black',
                }}
              >
                {lng === 'en' ? 'Notifications' : 'الاشعارات'}
              </Typography>
              {nots?.map((notify) => (
                <Stack
                  sx={{ mb: 2, cursor: 'pointer' }}
                  key={notify._id}
                  onClick={() => {
                    // Create a copy of nots
                    const updatedNots = nots.map((n) =>
                      n._id === notify._id ? { ...n, read: true } : n
                    )

                    // Update the state with the modified array
                    setNots(updatedNots)
                    setSelectedNotify({ ...notify, read: true })
                  }}
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <NotifyItem
                      message={notify?.title}
                      createdAt={notify?.createdAt}
                      read={notify?.read}
                      _id={notify?._id}
                    />
                  </Stack>
                </Stack>
              ))}
            </Box>
            <Box
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 4,
                p: 3,
                width: { xs: 1, sm: 0.45 },
                height: { xs: 300, sm: 500 },
              }}
            >
              <Typography mb={2} variant="h5">
                {selectedNotify?.title}
              </Typography>
              <Box>
                <Typography my={1}>{selectedNotify?.message}</Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: '#61616152',
                  }}
                >{`${moment(selectedNotify?.createdAt)
                  .locale(lng)
                  .fromNow()}`}
                  </Typography>
                <Typography
                  onClick={() => {
                    navigate(`/${slicedURL}`);
                  }}
                  sx={{
                    wordBreak: 'break-word',
                    cursor: 'pointer',
                    color: 'white',
                    bgcolor:"#c4a035",
                    width: 'fit-content',
                    p: 1,
                    borderRadius: 2,
                    mt: 2,
                    textAlign: lng === 'ar' ? 'right' : 'left',
                  }}
                >
                  {lng === 'en' ? 'Show Details' : 'عرض التفاصيل بالكامل'}
                </Typography>
              </Box>
            </Box>
          </Stack>
        )}
      </Container>
    </Box>
  )
}

export default NotificationsPage
