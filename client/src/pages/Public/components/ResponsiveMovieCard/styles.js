export default theme => ({
  movieCard: {
    position: 'relative',
    height: 400,
    width: 300,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.background.dark,
    borderRadius: 10,
    transition: 'all 0.4s',
    margin: theme.spacing(2),
    '&:hover': {
      transform: 'scale(1.02)',
      transition: 'all 0.4s'
    }
  },
  infoSection: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundBlendMode: 'multiply',
    background: 'linear-gradient(to right, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.5) 100%)',
    zIndex: 2,
    borderRadius: 10,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column'
  },
  movieHeader: {
    position: 'relative',
    padding: theme.spacing(1),
    height: 'auto',
    marginBottom: theme.spacing(1)
  },
  movieTitle: {
    fontSize: '20px',
    fontWeight: 400,
    textTransform: 'capitalize',
    marginBottom: theme.spacing(1),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  director: {
    color: '#9ac7fa',
    fontWeight: '500',
    fontSize: '14px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  country: {
    color: '#9ac7fa',
    fontWeight: '500',
    fontSize: '14px',
    marginBottom: theme.spacing(1)
  },
  duration: {
    display: 'inline-block',
    marginTop: theme.spacing(1),
    padding: theme.spacing(0.5),
    border: '1px solid rgba(255,255,255,0.13)'
  },
  genre: {
    display: 'inline-block',
    color: '#cee4fd',
    marginLeft: theme.spacing(2)
  },
  description: {
    padding: theme.spacing(1),
    marginTop: 'auto',
    height: '80px',
    overflow: 'hidden'
  },
  descriptionText: {
    color: '#cfd6e1',
    fontSize: '14px',
    lineHeight: '1.4',
    display: '-webkit-box',
    '-webkit-line-clamp': 4,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  footer: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    marginTop: 'auto'
  },
  icons: {
    display: 'inline-block',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: theme.spacing(0, 1),
    transition: 'all 0.3s',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.8)',
      transform: 'scale(1.25)',
      transition: 'all 0.3s',
      transitionDelay: '0.15s'
    }
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    height: '100%',
    right: 0,
    backgroundSize: 'cover !important',
    borderRadius: 10,
    width: '100%',
    backgroundPosition: 'center center !important'
  },

  [theme.breakpoints.down('sm')]: {
    movieCard: {
      width: '100%',
      margin: theme.spacing(2),
      height: 350
    },
    blurBackground: {
      width: '100%'
    },
    movieHeader: {
      width: '100%'
    },
    description: {
      width: '100%',
      height: '60px'
    },
    infoSection: {
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 100%)'
    }
  }
});
