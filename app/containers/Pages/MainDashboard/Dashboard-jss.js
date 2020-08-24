const styles = theme => ({
  cardContainer: {
    backgroundColor: theme.palette.secondary.dark,
    margin: '20px 10px 10px 10px',
    height: '170px',
    borderRadius: '10px',
    padding: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  taskContainer: {
    backgroundColor: theme.palette.secondary.dark,
    margin: '20px 10px 10px 10px',
    height: '400px',
    borderRadius: '10px',
    padding: 10
  },
  taskInnerDiv: {
    backgroundColor: theme.palette.primary.light,
    padding: 10,
    margin: '20px 20px 20px 20px',
    height: '500px',
    overflowX: 'auto'
  },
  divColumn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardImage: {
    width: '25%',
    height: '50%'
  },
  chartGrid: {
    height: '300px',
    width: '500px',
    minWidth: '200px',
    minHeight: '60px',
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    margin: '10px 10px 10px 10px'
  },
  divSpace: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      '& button': {
        width: '100%',
        margin: 5
      }
    }
  },
  divCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    '& svg': {
      width: '70%',
      height: '70%',
      verticalAlign: 'middle'
    }
  },
  divInline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  paperColor: {
    backgroundColor: '#FAFAFA'
  },
  searchBox: {
    font: 'inherit',
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    margin: 0, // Reset for Safari
    color: 'inherit',
    '& > div': {
      border: 'none',
      '&:after': {
        display: 'none'
      }
    },
    '& input': {
      border: '1px solid ' + theme.palette.grey[200],
      borderRadius: '20px',
      transition: theme.transitions.create('width'),
      padding: 10,
      color: theme.palette.text.secondary,
      height: 20,
      width: 100,
      background: theme.palette.grey[200],
      '&:focus': {
        width: 250,
        textIndent: 0,
        outline: 0
      }
    }
  },
  buttonLink: {
    background: 'none',
    transition: 'color ease 0.3s',
    '&:hover': {
      background: 'none',
      color: theme.palette.secondary.main
    }
  }
});

export default styles;
