export default theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  info: {
    paddingRight: theme.spacing(3)
  },
  nameText: {
    fontSize: '2rem',
    fontWeight: 500,
    marginBottom: theme.spacing(2)
  },
  emailText: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '1.25rem'
  },
  dateText: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '1.1rem'
  },
  avatar: {
    marginLeft: 'auto',
    height: '130px',
    width: '130px',
    flexShrink: 0,
    flexGrow: 0
  },
  progressWrapper: {
    marginTop: theme.spacing(2)
  },
  input: { display: 'none' },
  uploadButton: {
    marginRight: theme.spacing(2),
    fontSize: '1.1rem'
  }
});
