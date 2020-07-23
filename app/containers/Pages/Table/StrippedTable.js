import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import styles from 'dan-components/Tables/tableStyle-jss';
import TablePaginationActions from './TablePaginationActions';

function StrippedTable(props) {
  const { classes, tableData } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (tableData.length > 0) {
    const keys = Object.keys(tableData[0]);
    return (
      <div>
        <Fragment>
          <div className={classes.rootTable} style={{ overflow: 'auto' }}>
            <Table className={classNames(classes.table, classes.stripped)}>
              <TableHead>
                <TableRow>
                  {keys.map(key => (
                    <TableCell align="left">{key}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => [
                    <TableRow key={n.id}>
                      {keys.map(key => (
                        <TableCell align="left">{n[key]}</TableCell>
                      ))}
                    </TableRow>
                  ])}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </div>
        </Fragment>
      </div>
    );
  }
  return <div />;
}

StrippedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired
};

export default withStyles(styles)(StrippedTable);
