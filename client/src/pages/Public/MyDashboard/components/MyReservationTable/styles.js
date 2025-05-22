export default theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.3s',
    '&:hover': {
      boxShadow: theme.shadows[6]
    }
  },
  qrCode: {
    width: 100,
    height: 100,
    borderRadius: theme.shape.borderRadius,
    objectFit: 'contain'
  },
  cancelButton: {
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  }

  
});




/*
export default theme => ({
  root: {},
  tableRow: {
    height: '64px'
  },
  tableCell: {
    whiteSpace: 'nowrap'
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    width: '36px'
  },
  nameText: {
    display: 'inline-block',
    marginLeft: theme.spacing(2),
    fontWeight: 500,
    cursor: 'pointer'
  }
});
//*/
