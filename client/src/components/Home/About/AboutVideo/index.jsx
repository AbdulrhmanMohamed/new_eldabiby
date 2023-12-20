import { Box, Grid, Typography, Button, useMediaQuery, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import videoPath from '../../../../assets/video/videoAbout.mp4'
import { useGetSectionByTypeQuery } from '../../../../redux/apis/sectionsApi'
import { Colors } from './styles'
import styles from './styles'
import { useNavigate } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'
const ErrorSection = ({ error, lang }) => {
  return (
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
        {error?.data && error?.data[`error_${lang}`]}
      </Typography>
    </Box>
  )
}
const AboutHeader = ({ title, desc }) => {
  const navigate = useNavigate();
  const [,{language:lang}]=useTranslation()
  return (
    <Box
      width={0.9}
      mx={'auto'}
      sx={{
        textAlign: lang==="en"?'left':'right',
      }}
    >
      {/* Main Title */}
      <Typography variant={'h3'} sx={{...styles.aboutSection.typography,
        textAlign: lang==="en"?'left':'right',
      }}>
        {title}
      </Typography>

      {/* subTitle */}
      <Box
        variant="h6"
        sx={{...styles.aboutSection.dangerously,
         fontSize:{xs:'13px',sm:'13px',md:'20px',lg:'25px'} ,
         textAlign: lang==="en"?'left':'right',

        }}
        // i need to make it end "..."
        
        dangerouslySetInnerHTML={{
          __html: desc ? `${desc.slice(0, 350)}....` : '',
        }}
      />
    <Typography
    onClick={()=>{
      navigate('/aboutUs')
    }}
    sx={{
      color:'#fff',
      cursor:'pointer'
    }}>
    {lang==="en"?"More":'المزيد'}
    </Typography>
    </Box>
  )
}
const AboutVideo = () => {
  const [, { language: lang }] = useTranslation();
  const theme = useTheme()

  const phoneScreen = useMediaQuery(theme.breakpoints.down('md'))

  const { data, isSuccess, isError, error, isLoading } =
    useGetSectionByTypeQuery('aboutus')
  const desc = data?.data[0][`description_${lang}`]
  const title = data?.data[0][`title_${lang}`]
  return (
    <Box bgcolor={Colors.bgColor } sx={{
      my: 20, 
    }}>
      {isLoading && <span className="loader"></span>}
      {isError && <ErrorSection error={error} />}
      {!isLoading && !isError && isSuccess && (
        <Grid
          container
          width={'100%'}
          sx={{
            ...styles.gridContainer,
            direction: lang === 'ar' ? 'rtl' : 'ltr',
                flexDirection:phoneScreen?'column-reverse':'row'
          }}
        >
          {/* Description and title */}
          <Grid item xs={12} sm={12} md={6} p={2} sx={styles.aboutSection.flexHeader}>
            <AboutHeader title={title} desc={desc} />
          </Grid>

          {/* video */}
          <Grid item xs={12} md={5.5} sx={{
            margin:'auto'
          }} >
            <Box >
              <VideoPlayer videoPath={videoPath} />
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
export default AboutVideo
