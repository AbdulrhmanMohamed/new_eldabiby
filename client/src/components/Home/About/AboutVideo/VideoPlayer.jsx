import React, { useState, useRef } from 'react'
import { Box, IconButton, VideoPlayerIcon } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'


const VideoPlayer = ({videoPath}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)

  const togglePlay = () => {
    const video = videoRef.current
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: '97%', sm: '95%', md: '100%' },
        marginTop:'10px',
        mx: 'auto',
      }}
    >
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }} //Automatically adjust the height to maintain the aspect ratio
        src={videoPath}
        autoPlay={false}
        muted
        loop
      />
      <IconButton
        onClick={togglePlay}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        {isPlaying ? (
          <PauseIcon fontSize="large" />
        ) : (
          <PlayArrowIcon fontSize="large" />
        )}
      </IconButton>
    </Box>
  )
}

export default VideoPlayer
