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
  }
});

export default styles;
