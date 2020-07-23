import React, { Component } from 'react';
import {
  withStyles,
  Paper,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import BackspaceIcon from '@material-ui/icons/Backspace';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { green } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import styles from './Dashboard-jss';
import PapperBlock from '../../../components/PapperBlock/PapperBlock';

const tasks = [
  { title: 'task title 1', description: 'task description 1', done: true },
  { title: 'task title 2', description: 'task description 2', done: false },
  { title: 'task title 3', description: 'task description 3', done: false },
  { title: 'task title 4', description: 'task description 4', done: true },
  { title: 'task title 5', description: 'task description 5', done: true },
  { title: 'task title 6', description: 'task description 6', done: false }
];

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600]
    }
  },
  checked: {}
})(props => <Checkbox color="default" {...props} />);

class TaskMenu extends Component {
  handleCheckTask = (e, index) => {
    tasks[index].done = e.target.checked;
  };

  render() {
    const { classes } = this.props;
    return (
      <div
        style={{
          height: '100%',
          width: '50%',
          margin: '10px 10px 10px 10px'
        }}
      >
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
                    onClick={this.handleEditTask}
                    size="large"
                  >
                    <EditIcon style={{ fill: 'green' }} />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={this.handleEditTask}
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
