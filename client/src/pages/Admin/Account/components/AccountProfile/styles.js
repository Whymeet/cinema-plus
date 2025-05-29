export default theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  details: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2)
  },
  info: {
    marginRight: 'auto',
    textAlign: 'left'
  },
  nameText: {
    marginBottom: theme.spacing(1)
  },
  emailText: {
    marginBottom: theme.spacing(1)
  },
  dateText: {
    color: theme.palette.text.secondary
  },
  avatar: {
    height: '100px',
    width: '100px',
    marginLeft: theme.spacing(2)
  },
  actions: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  uploadButton: {
    marginBottom: theme.spacing(2)
  },
  toggleButton: {
    width: '100%',
    maxWidth: '300px',
    height: 'auto',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    margin: '0 auto',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  }
});
