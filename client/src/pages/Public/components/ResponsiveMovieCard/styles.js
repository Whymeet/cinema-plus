export default theme => ({
  movieCard: {
    position: 'relative',
    height: '100%',
    minHeight: 400,
    width: '100%',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.background.dark,
    borderRadius: 10,
    transition: 'all 0.4s',
    overflow: 'hidden',
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
    background: 'linear-gradient(to right, #0d0d0c 50%, transparent 100%)',
    zIndex: 2,
    borderRadius: 10,
    padding: theme.spacing(3)
  },
  movieHeader: {
    position: 'relative',
    padding: theme.spacing(2),
    height: 'auto',
    width: '60%'
  },
  movieTitle: {
    fontSize: '25px',
    fontWeight: 400,
    textTransform: 'capitalize',
    marginBottom: theme.spacing(2)
  },
  director: {
    color: '#9ac7fa',
    fontWeight: '500',
    fontSize: '16px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  country: {
    color: '#9ac7fa',
    fontWeight: '500',
    fontSize: '16px',
    marginBottom: theme.spacing(1)
  },
  duration: {
    display: 'inline-block',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    border: '1px solid rgba(255,255,255,0.13)'
  },
  genre: {
    display: 'inline-block',
    color: '#cee4fd',
    marginLeft: theme.spacing(2)
  },
  description: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    height: 'auto',
    width: '60%'
  },
  descriptionText: {
    color: '#cfd6e1',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  footer: {
    height: 'auto',
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    marginTop: theme.spacing(2)
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
    borderRadius: 11,
    width: '80%',
    backgroundPosition: 'center center !important'
  },

  [theme.breakpoints.down('sm')]: {
    movieCard: {
      width: '100%',
      margin: '0 auto',
      minHeight: 450
    },
    blurBackground: {
      width: '100%',
      backgroundPosition: 'center center !important'
    },
    movieHeader: {
      width: '100%',
      marginTop: theme.spacing(2)
    },
    description: {
      width: '100%'
    },
    infoSection: {
      background: 'linear-gradient(to top, rgb(20, 20, 19) 80%, transparent 100%)',
      zIndex: 2,
      borderRadius: 10
    }
  }
});
