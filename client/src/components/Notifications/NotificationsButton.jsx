import { Badge, IconButton, Tooltip } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
const NotificationsButton = ({
  unreadNots,
  handleClick,
  lng,
  iconColor,
  bgColorBtn,
}) => {
  return (
    <IconButton
      aria-label="more"
      id="long-button"
      aria-controls={open ? 'long-menu' : undefined}
      aria-expanded={open ? 'true' : undefined}
      aria-haspopup="true"
      onClick={handleClick}
      sx={{
        width: {
          md: 50,
          xs: 40,
        },
        height: {
          md: 40,
          xs: 30,
        },
      }}
    >
      <Tooltip
        title={lng === 'en' ? 'Notifications' : 'الإشعارات'}
        sx={{
          cursor: 'pointer',
          bgcolor: 'transparent !important',
          py: { xs: 0.5, md: 0.8 },
          px: { xs: 1, md: 1.5 },
          borderRadius: 1,
        }}
      >
        <Badge
          badgeContent={unreadNots?.length}
          color="primary"
          overlap="circular"
        >
          <NotificationsIcon
            color="action"
            sx={{
              fontSize: {
                lg: '28px',
                xs: '22px',
              },
              color: '#C4A035',
            }}
          />
        </Badge>
      </Tooltip>
    </IconButton>
  )
}

export default NotificationsButton
