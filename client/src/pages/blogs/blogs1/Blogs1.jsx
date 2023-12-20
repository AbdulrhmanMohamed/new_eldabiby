import { Box, Grid, Typography, Avatar, CardMedia, Stack } from '@mui/material'
import React from 'react'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useGetAllBlogsQuery } from '../../../redux/apis/blogsApi'
import { imageBaseUrl } from '../../../constants/baseUrl'
import moment from 'moment'
const BlogCard = ({ language, item }) => {
  return (
    <Box sx={styles.card}>
      <Box elevation={3}>
        <CardMedia
          component='img'
          src={imageBaseUrl + item.image}
          sx={{
            borderRadius: '10px',
            height: 250,
          }}
        />
        <div>
          <Typography variant='overline' color='textSecondary'>
            {moment(item.createdAt).fromNow()}
          </Typography>
        </div>
        <div>
          <Typography variant='h6' sx={styles.blogTitle}>
            {item.title}
          </Typography>
          <Box
            variant='body2'
            sx={styles.blogDesc}
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </div>
        <Box sx={styles.seeMore}>
          <Link to={`/blogs/${item._id}/${item.title.replace(/\s/g, '-')}`}>
            {language === 'en' ? 'See More' : 'شاهد المزيد'}
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

const Blogs1 = () => {
  const [_, { language }] = useTranslation()
  const {
    data: dataBlogs,
    error: errorBlogs,
    isLoading,
  } = useGetAllBlogsQuery()
  return (
    <Box sx={styles.root}>
      <Box sx={styles.container}>
        <div sx={styles.header}>
          <Typography variant='h3' component='h2' gutterBottom align={'center'}>
            {language === 'en' ? 'Blogs' : 'مدوناتنا'}
          </Typography>
        </div>
        {isLoading ? (
          <Stack sx={styles.wrapper}>
            <div className='loader'></div>
          </Stack>
        ) : dataBlogs && !errorBlogs ? (
          <Stack direction={'row'} justifyContent={'center'} flexWrap={'wrap'}>
            {dataBlogs.data.map(item => (
              <BlogCard language={language} item={item} />
            ))}
          </Stack>
        ) : (
          <Stack sx={styles.wrapper}>
            <Typography
              sx={{
                fontSize: '26px',
                color: 'red',
              }}
            >
              {errorBlogs?.data && errorBlogs.data[`error_${language}`]}
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
export default Blogs1
