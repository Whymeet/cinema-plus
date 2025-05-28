export default theme => ({
  root: {},
  field: {
    margin: theme.spacing(3)
  },
  textField: {
    width: '420px',
    maxWidth: '100%',
    marginRight: theme.spacing(3),
    '& .MuiInputLabel-root': {
      fontSize: '1.1rem'
    },
    '& .MuiInputBase-input': {
      fontSize: '1.1rem'
    },
    '& .MuiFormHelperText-root': {
      fontSize: '0.9rem'
    }
  },
  portletFooter: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  buttonFooter: {
    fontSize: '1.1rem'
  }
});
