export default theme => ({
  grid: {
    height: '100%'
  },
  carousel: { marginBottom: theme.spacing(6) },
  infoSection: {
    padding: theme.spacing(4, 0)
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    color: theme.palette.common.white
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    color: theme.palette.common.white,
    fontSize: '1.1rem',
    lineHeight: 1.6
  },
  infoText: {
    color: theme.palette.common.white,
    fontSize: '1.1rem',
    lineHeight: 1.6,
    marginBottom: theme.spacing(2)
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    marginBottom: theme.spacing(2)
  },
   alText: {
    textAlign: 'center',
    color: theme.palette.common.white,
    fontSize: '1.1rem',
    lineHeight: 1.6,
    marginBottom: theme.spacing(2)
  }
});