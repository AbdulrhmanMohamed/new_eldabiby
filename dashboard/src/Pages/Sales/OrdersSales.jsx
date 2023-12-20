import {
  Box,
  Stack,
  Table,
  TableCell,
  TableContainer,
  Button,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableBody,
  TextField,
  Container,
  useTheme
} from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import Breadcrumbs from '../../Components/Breadcrumbs'
import {
  useDeleteOrderByIdMutation,
  useGetAllOrdersQuery
} from '../../api/order.api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { ORDER_STATUS, PAYMENT_TYPE } from '../../helper/order-status'
import { allowed } from '../../helper/roles'
import { useSelector } from 'react-redux'
const OrdersSales = () => {
  const { data, isSuccess, isError, isLoading, error } =
    useGetAllOrdersQuery('?limit=1000')
  const { role } = useSelector(state => state.user)
  const [deleteOrderById, { isLoading: deleteOrderByIdLoading }] =
    useDeleteOrderByIdMutation()
  const [UsersDataOrder, setUsersDataOrder] = useState([])
  const { customColors, colors, palette } = useTheme()
  const navigate = useNavigate()
  useEffect(() => {
    {
      isSuccess && setUsersDataOrder(data?.data)
    }
  }, [data])
  const [_, { language: lang }] = useTranslation()
  const handleDelete = order => {
    setUsersDataOrder(UsersDataOrder.filter(item => item.id !== order.id))
    deleteOrderById(order.id)
      .unwrap()
      .then(res => {
        toast.success(res[`success_${lang}`])
      })
      .catch(err => {
        setUsersDataOrder(data?.data)
        toast.error(err?.data[`error_${lang}`])
      })
  }

  // search function
  const handleSearch = value => {
    if (value === '') {
      setUsersDataOrder(data?.data)
    }
    const newData = data?.data.filter(item => {
      return (
        (item.name && item.name.toLowerCase().includes(value.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(value.toLowerCase()))
      )
    })
    setUsersDataOrder(newData)
  }

  return (
    <Box
      sx={{
        p: { xs: 0, sm: 4 },
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minHeight: '100vh'
      }}
    >
      
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            top: '50%',
            left: lang === 'en' ? '55%' : '40%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <CircularProgress
            sx={{
              color: '#00e3d2'
            }}
          />
        </Box>
      )}
     

      {!isLoading &&  (
        <>
          <Breadcrumbs page_en={'Orders'} page_ar={'عمليات الشراء'} />
          <Box
            sx={{
              display: 'flex',

              flexDirection: 'column'
            }}
          >
            {/* search  */}
            <Stack px={2} gap={2}>
              <Stack
                direction={'row'}
                alignItems={'center'}
                px={2}
                sx={{
                  background:
                    ' linear-gradient(90deg,rgba(207, 249, 170, 1) 0%,rgba(117, 219, 209, 1) 100%)',
                  borderRadius: '15px',
                  height: '40px',
                  mr: lang === 'ar' ? { xs: '0', md: '20px' } : undefined,
                  ml: lang === 'en' ? { xs: '0', md: '20px' } : undefined,
                  width: { xs: '50%', md: '30%' }
                }}
              >
                <SearchIcon />
                <TextField
                  sx={{
                    width: 'auto',
                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: 'transparent !important',
                        outline: 'none !important',
                        backgroundColor: 'transparent !important'
                      }
                  }}
                  placeholder={lang === 'en' ? 'Search' : 'ابحث هنا'}
                  name='search'
                  onChange={e => handleSearch(e.target.value)}
                />
              </Stack>
              <Box
                sx={{
                  mr: lang === 'ar' ? { xs: '0', md: '20px' } : undefined,
                  ml: lang === 'en' ? { xs: '0', md: '20px' } : undefined
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '18px', sm: '20px', lg: '25px' }
                  }}
                >
                  {lang === 'en' ? 'Orders' : 'عمليات الشراء'}
                </Typography>
              </Box>
            </Stack>

            {/* table */}
            
            
            
              <Box
                sx={{
                  maxWidth: { md: '100%', sm: '100%', xs: 340 },
                  mx: { xs: 'auto', sm: 'initial' },
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ width: '97%', mx: 'auto' }} mt={2}>
                  {/* head */}
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            bgcolor: customColors.secondary,
                            borderRadius: '10px',
                            boxShadow: '0px 0px 10px 0px #c6d5d3',

                            '&:last-child td, &:last-child th': {
                              border: 0,
                              textAlign: 'center'
                            }
                          }}
                        >
                          <TableCell>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                fontWeight: 'bold'
                              }}
                            >
                              #
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                fontWeight: 'bold'
                              }}
                            >
                              {lang === 'en' ? 'Name' : 'الاسم'}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                fontWeight: 'bold'
                              }}
                            >
                              {lang === 'en' ? 'Email' : 'البريد الالكتروني'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                fontWeight: 'bold'
                              }}
                            >
                              {lang === 'en' ? 'Items' : 'العناصر'}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                fontWeight: 'bold'
                              }}
                            >
                              {lang === 'en' ? 'Price' : 'السعر'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                fontWeight: 'bold'
                              }}
                            >
                              {lang === 'en' ? 'Payment Way' : 'طريقة الدفع'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                fontWeight: 'bold',
                                textAlign: 'center'
                              }}
                            >
                              {lang === 'en' ? 'Statue' : ' الحالة'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                fontWeight: 'bold'
                              }}
                            >
                              {lang === 'en' ? ' Date' : 'التاريخ '}
                            </Typography>
                          </TableCell>

                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      {UsersDataOrder?.length === 0 &&!isError&& (
                        <Box
                        sx={{
                          position: "absolute",
                          top: "60%",
                          left: lang === "en" ? "55%" : "45%",
                          transform:
                            lang === "en" ? "translate(-30%, -50%)" : "translate(-50%, -50%)",
                         }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '20px', sm: '25px', lg: '30px' },
                            color: colors.dangerous
                          }}
                        >
                          {lang === 'en' ? 'No Data' : 'لا يوجد بيانات'}
                        </Typography>
                      </Box>
                      )}
                      {isError ? (
                         <Box
                         sx={{
                          display: "flex",
                          position: "absolute",
                          top: "60%",
                          left: lang === "en" ? "55%" : "45%",
                          transform:
                            lang === "en" ? "translate(-30%, -50%)" : "translate(-50%, -50%)",
                         }}
                       >
                         <Typography
                           sx={{
                             fontWeight: "bold",
                             fontSize: { xs: "20px", sm: "25px", lg: "30px" },
                             color: colors.dangerous,
                             
                             
                           }}
                         >
                           {error?.data[`error_${lang}`]}
                         </Typography>
                       </Box>
                      ):(

                        <TableBody>
                          {UsersDataOrder.map((item, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                bgcolor: customColors.bg,
                                borderRadius: '10px'
                              }}
                            >
                              <TableCell align='center'>{index + 1}</TableCell>
                              <TableCell
                                onClick={() => {
                                  navigate(`/orders/${item._id}`)
                                }}
                                sx={{
                                  cursor: 'pointer',
                                  textDecoration: 'underline'
                                }}
                                align='center'
                              >
                                {item.name}
                              </TableCell>
                              <TableCell align='center'>
                                {item.email ||
                                  (lang === 'en' ? 'No Email' : 'لا يوجد بريد')}
                              </TableCell>
  
                              <TableCell align='center'>
                                {item.onlineItems.items.length +
                                  item.cashItems.items.length}
                              </TableCell>
                              <TableCell align='center'>
                                {lang === 'en'
                                  ? `${item.totalPrice} SAR`
                                  : `${item.totalPrice}ر.س`}
                              </TableCell>
                              <TableCell align='center'>
                                {PAYMENT_TYPE[item.paymentType][lang]}
                              </TableCell>
  
                              <TableCell align='center'>
                                <Typography
                                  sx={{
                                    backgroundColor:
                                      item.status === 'initiated' ||
                                      item.status === 'onGoing' ||
                                      item.status === 'on going'
                                        ? '#f6eadf !important'
                                        : item.status === 'created' ||
                                          item.status === 'completed'
                                        ? '#d4f2ef !important'
                                        : '#f4d8e4 !important',
                                    // width: { xs: "100%", sm: "80%", xl: "100%" },
                                    p: '3px 20px',
                                    color:
                                      item.status === 'initiated' ||
                                      item.status === 'onGoing' ||
                                      item.status === 'on going'
                                        ? '#f7ce70'
                                        : item.status === 'created' ||
                                          item.status === 'completed'
                                        ? '#a5d5d6'
                                        : '#e399b9',
                                    fontWeight: 'bold',
                                    borderRadius: '25px',
                                    textAlign: 'center',
                                    fontSize: {
                                      xs: '12px',
                                      sm: '14px',
                                      lg: '16px'
                                    }
                                  }}
                                >
                                  {ORDER_STATUS[item.status][lang]}
                                </Typography>
                              </TableCell>
  
                              <TableCell align='center'>
                                {item.updatedAt.slice(0, 10)}
                              </TableCell>
  
                              <TableCell align='center'>
                                {allowed({ page: 'orders', role }) ? (
                                  <Button
                                    size='small'
                                    onClick={() => {
                                      handleDelete(item)
                                    }}
                                    disabled={deleteOrderByIdLoading}
                                    sx={{
                                      backgroundColor: 'transparent !important',
  
                                      color: colors.dangerous,
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                ) : (
                                  <> </>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            
          </Box>
        </>
      )}
    </Box>
  )
}

export default OrdersSales
