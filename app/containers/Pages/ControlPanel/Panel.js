import React, { Component } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  withStyles,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  TextField,
  InputAdornment
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import TablePaginationActions from '../Table/TablePaginationActions';
import styles from '../Import/import-jss';
import EnhancedTableHead from '../Table/EnhancedTableHead';

const apiURL = 'http://localhost:9090';

export class Panel extends Component {
  state = {
    users: [],
    page: 0,
    rowsPerPage: 10,
    order: 'asc',
    orderBy: 'Username',
    filter: ''
  };

  componentDidMount() {
    this.updateUsersList();
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0
    });
  };

  handleRequestSort = (event, property) => {
    const { order, orderBy } = this.state;
    const isAsc = orderBy === property && order === 'asc';
    this.setState({
      order: isAsc ? 'desc' : 'asc',
      orderBy: property
    });
  };

  descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  getComparator = (order, orderBy) => (order === 'desc'
    ? (a, b) => this.descendingComparator(a, b, orderBy)
    : (a, b) => -this.descendingComparator(a, b, orderBy));

  stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  };

  updateUsersList = () => {
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.get(apiURL + '/administration/getAllUser', config).then(response => {
      console.log(response.data);
      this.setState({
        users: response.data
      });
    });
  };

  handleDeleteUser = user => {
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.post(apiURL + '/deleteUser', user, config).then(() => {
      this.updateUsersList();
    });
  };

  handleActivationChange = user => {
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    user.activated = !user.activated;
    Axios.post(apiURL + '/updateUser', user, config).then(() => {
      this.updateUsersList();
    });
  };

  handleRoleChange = (user, e) => {
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.post(
      apiURL + '/administration/updateUserRole/' + e.target.value,
      user,
      config
    ).then(() => {
      this.updateUsersList();
    });
  };

  formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  handleChangeSearch = event => {
    this.setState({ filter: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const {
      users, page, rowsPerPage, order, orderBy, filter
    } = this.state;
    const lowercasedFilter = filter.toLowerCase();
    const filteredData = users.filter(item => Object.keys(item).some(key => JSON.stringify(item[key])
      .toLowerCase()
      .includes(lowercasedFilter)
    )
    );
    const headCells = [
      {
        id: 'username',
        numeric: false,
        disablePadding: false,
        label: 'Username'
      },
      {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Email'
      },
      {
        id: 'state',
        numeric: false,
        disablePadding: false,
        label: 'State'
      },
      {
        id: 'role',
        numeric: false,
        disablePadding: false,
        label: 'Role'
      },
      {
        id: 'creationTime',
        numeric: false,
        disablePadding: false,
        label: 'Creation Time'
      }
    ];
    return (
      <div>
        <TextField
          id="input-with-icon-textfield"
          type="search"
          value={filter}
          onChange={this.handleChangeSearch}
          className={classes.searchBox}
          InputProps={{
            placeholder: 'Search',
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <Table aria-label="Formulas">
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={this.handleRequestSort}
            headCells={headCells}
            emptyCells={1}
          />
          <TableBody>
            {this.stableSort(filteredData, this.getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      required
                    >
                      <Select
                        name="userStatut"
                        value={row.activated ? 'Active' : 'Blocked'}
                        onChange={() => this.handleActivationChange(row)}
                      >
                        <MenuItem key={row.email + 'active'} value="Active">
                          {'Active'}
                        </MenuItem>
                        <MenuItem key={row.email + 'blocked'} value="Blocked">
                          {'Blocked'}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="left">
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      required
                    >
                      <Select
                        name="userStatut"
                        value={row.role.role}
                        onChange={e => this.handleRoleChange(row, e)}
                      >
                        <MenuItem key={row.email + 'admin'} value="ADMIN">
                          {'Admin'}
                        </MenuItem>
                        <MenuItem key={row.email + 'analyst'} value="ANALYST">
                          {'Analyst'}
                        </MenuItem>
                        <MenuItem key={row.email + 'user'} value="USER">
                          {'User'}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="left">
                    {this.formatDate(row.creationTime)}
                  </TableCell>
                  <TableCell align="left">
                    <IconButton
                      aria-label="delete"
                      className={classes.margin}
                      onClick={() => this.handleDeleteUser(row)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </div>
    );
  }
}

Panel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Panel);
