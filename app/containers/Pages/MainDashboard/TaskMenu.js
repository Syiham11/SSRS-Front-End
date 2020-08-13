import React, { Component } from 'react';
import {
  withStyles,
  Paper,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button
} from '@material-ui/core';
import Axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import BackspaceIcon from '@material-ui/icons/Backspace';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { green } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import styles from './Dashboard-jss';
import PapperBlock from '../../../components/PapperBlock/PapperBlock';

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600]
    }
  },
  checked: {}
})(props => <Checkbox color="default" {...props} />);

const apiURL = 'http://localhost:9090/task';
const { sub } = JSON.parse(sessionStorage.getItem('user'));
const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

class TaskMenu extends Component {
  state = {
    tasks: [],
    isEditTask: false,
    editableTaskIndex: -1,
    editableTitle: '',
    editableDescription: ''
  };

  componentDidMount() {
    this.updateTasksList();
  }

  updateTasksList = () => {
    Axios.get(apiURL + '/getAll&' + sub, config).then(response => {
      this.setState({
        tasks: response.data
      });
    });
  };

  handleCheckTask = (e, index) => {
    const { tasks } = this.state;
    tasks[index].done = e.target.checked;
    Axios.post(apiURL + '/update', tasks[index], config).then(response => {
      console.log(response.data);
    });
  };

  handleAddTask = () => {
    const task = {
      title: 'task title',
      description: 'task description',
      done: false,
      creationTime: new Date()
    };
    Axios.post(apiURL + '/add&' + sub, task, config).then(response => {
      console.log(response.data);
      this.updateTasksList();
    });
  };

  handleDeleteTask = index => {
    const { tasks } = this.state;
    Axios.post(apiURL + '/delete', tasks[index], config).then(response => {
      console.log(response.data);
      this.updateTasksList();
    });
  };

  handleEditTask = index => {
    const { tasks } = this.state;
    this.setState({
      isEditTask: true,
      editableTaskIndex: index,
      editableTitle: tasks[index].title,
      editableDescription: tasks[index].description
    });
  };

  handleDialogClose = () => {
    this.setState({
      isEditTask: false
    });
  };

  handleDone = () => {
    const {
      tasks,
      editableTaskIndex,
      editableTitle,
      editableDescription
    } = this.state;
    tasks[editableTaskIndex].title = editableTitle;
    tasks[editableTaskIndex].description = editableDescription;
    Axios.post(apiURL + '/update', tasks[editableTaskIndex], config).then(
      response => {
        console.log(response.data);
        this.handleDialogClose();
      }
    );
  };

  handleTitleChange = e => {
    this.setState({
      editableTitle: e.target.value
    });
  };

  handleDescriptionChange = e => {
    this.setState({
      editableDescription: e.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const {
      tasks,
      isEditTask,
      editableTaskIndex,
      editableTitle,
      editableDescription
    } = this.state;
    return (
      <div
        style={{
          height: '100%',
          width: '50%',
          margin: '10px 10px 10px 10px'
        }}
      >
        {editableTaskIndex >= 0 ? (
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="setTaskTitle"
            open={isEditTask}
            classes={{
              paper: classes.paper
            }}
          >
            <DialogTitle id="SaveFormula">Edit Task</DialogTitle>
            <DialogContent>
              <TextField
                id="outlined-basic"
                label="Task title"
                variant="outlined"
                value={editableTitle}
                fullWidth
                className={classes.textField}
                onChange={this.handleTitleChange}
                style={{ marginBottom: 10 }}
              />
              <TextField
                id="outlined-basic"
                label="Task description"
                variant="outlined"
                value={editableDescription}
                fullWidth
                className={classes.textField}
                onChange={this.handleDescriptionChange}
              />
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={this.handleDialogClose}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={this.handleDone} color="primary">
                Done
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <div />
        )}
        <PapperBlock
          title="My Tasks"
          whiteBg
          icon="ios-done-all"
          desc="All Your to do list. Just check it whenever You done."
        >
          <Paper className={classes.taskInnerDiv}>
            {tasks.map((task, index) => (
              <div
                className={classes.divSpace}
                style={{ padding: '10px 10px 10px 10px' }}
              >
                <div className={classes.divInline}>
                  <div>
                    <FormControlLabel
                      control={(
                        <GreenCheckbox
                          checked={task.done}
                          onChange={e => this.handleCheckTask(e, index)}
                          name="taskcheck"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Typography
                      id={'title' + index}
                      variant="body1"
                      gutterBottom
                      style={
                        task.done
                          ? { textDecoration: 'line-through' }
                          : { textDecoration: 'none' }
                      }
                    >
                      {task.title}
                    </Typography>
                    <Typography
                      id={'desc' + index}
                      variant="body2"
                      gutterBottom
                      style={
                        task.done
                          ? { textDecoration: 'line-through' }
                          : { textDecoration: 'none' }
                      }
                    >
                      {task.description}
                    </Typography>
                  </div>
                </div>
                <div>
                  <IconButton
                    aria-label="Edit"
                    onClick={() => this.handleEditTask(index)}
                    size="large"
                  >
                    <EditIcon style={{ fill: 'green' }} />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => this.handleDeleteTask(index)}
                    size="large"
                  >
                    <BackspaceIcon style={{ fill: 'brown' }} />
                  </IconButton>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                aria-label="Add"
                onClick={this.handleAddTask}
                size="large"
                color="primary"
              >
                <AddBoxIcon />
              </IconButton>
            </div>
          </Paper>
        </PapperBlock>
      </div>
    );
  }
}

TaskMenu.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TaskMenu);
