import React from 'react';
import interact from 'interactjs';
import withStyles from '@material-ui/core/styles/withStyles';
import { PropTypes } from 'prop-types';
import ClearIcon from '@material-ui/icons/Clear';
import { IconButton } from '@material-ui/core';

const styles = (theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        backgroundColor: 'transparent',
        fontFamily: 'sans-serif',
        borderRadius: '8px',
        height: '600px',
    }
});

class InteractTest extends React.Component {
    componentDidMount() {
        const { chart } = this.props;
        interact('#' + chart.props.chartId + 'co')
            .draggable({
                // enable autoScroll
                autoScroll: true,

                listeners: {
                    // call this function on every dragmove event
                    move: this.dragMoveListener,                    
                }
            })
            .resizable({
                edges: {
                    left: true,
                    right: true,
                    bottom: true,
                    top: true
                },

                listeners: {
                    move(event) {
                        const { target } = event;
                        let x = (parseFloat(target.getAttribute('data-x')) || 0);
                        let y = (parseFloat(target.getAttribute('data-y')) || 0);
                        target.style.width = event.rect.width + 'px';
                        target.style.height = event.rect.height + 'px';
                        x += event.deltaRect.left;
                        y += event.deltaRect.top;

                        target.style.webkitTransform = 'translate(' + x + 'px,' + y + 'px)';
                        target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                },
            });
    }

    dragMoveListener = (event) => {
        const { target } = event;
        // keep the dragged position in the data-x/data-y attributes
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        // translate the element
        target.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    };

    selected = () => {
        const { selectedChart, chart } = this.props;
        selectedChart({ chartId: chart.props.chartId });
    };

    handleClick = () => {
        alert('hit it');
    }

    render() {
        const { classes, chart, selectable } = this.props;
        return (
            <div
                role="presentation"
                onClick={this.selected}
            >
                <div
                    className={classes.heading}
                    id={chart.props.chartId + 'co'}
                    style={{
                        border: selectable === chart.props.chartId ? '1px solid #dad5d5' : '1px solid #000',
                    }}
                >
                    <div
                        id={chart.props.chartId}
                        style={{
                            height: '100%',
                        }}
                    >
                        {chart}
                    </div>

                </div>
            </div>
        );
    }
}
InteractTest.propTypes = {
    classes: PropTypes.object.isRequired,
    chart: PropTypes.elementType.isRequired,
    selectable: PropTypes.string.isRequired,
    selectedChart: PropTypes.func.isRequired,
};
export default withStyles(styles)(InteractTest);

import React from 'react';
import interact from 'interactjs';
import withStyles from '@material-ui/core/styles/withStyles';
import { PropTypes } from 'prop-types';
import ClearIcon from '@material-ui/icons/Clear';
import { IconButton } from '@material-ui/core';

const styles = (theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        backgroundColor: 'transparent',
        fontFamily: 'sans-serif',
        borderRadius: '8px',
        height: '600px',
    }
});

class InteractTest extends React.Component {
    componentDidMount() {
        const { chart } = this.props;
        interact('#' + chart.props.chartId + 'co')
            .draggable({
                // enable autoScroll
                autoScroll: true,

                listeners: {
                    // call this function on every dragmove event
                    move: this.dragMoveListener,
                }
            })
            .resizable({
                edges: {
                    left: true,
                    right: true,
                    bottom: true,
                    top: true
                },

                listeners: {
                    move(event) {
                        const { target } = event;
                        let x = (parseFloat(target.getAttribute('data-x')) || 0);
                        let y = (parseFloat(target.getAttribute('data-y')) || 0);
                        target.style.width = event.rect.width + 'px';
                        target.style.height = event.rect.height + 'px';
                        x += event.deltaRect.left;
                        y += event.deltaRect.top;

                        target.style.webkitTransform = 'translate(' + x + 'px,' + y + 'px)';
                        target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                },
            });
    }

    dragMoveListener = (event) => {
        const { target } = event;
        // keep the dragged position in the data-x/data-y attributes
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        // translate the element
        target.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    };

    selected = () => {
        const { selectedChart, chart } = this.props;
        selectedChart({ chartId: chart.props.chartId });
    };

    handleClick = () => {
        alert('hit it');
    }

    render() {
        const { classes, chart, selectable } = this.props;
        return (
            <div
                role="presentation"
                onClick={this.selected}
            >
                <div
                    className={classes.heading}
                    id={chart.props.chartId + 'co'}
                    style={{
                        border: selectable === chart.props.chartId ? '1px solid #dad5d5' : '1px solid #000',
                    }}
                >
                    <div
                        id={chart.props.chartId}
                        style={{
                            height: '100%',
                        }}
                    >
                        {chart}
                    </div>

                </div>
            </div>
        );
    }
}
InteractTest.propTypes = {
    classes: PropTypes.object.isRequired,
    chart: PropTypes.elementType.isRequired,
    selectable: PropTypes.string.isRequired,
    selectedChart: PropTypes.func.isRequired,
};
export default withStyles(styles)(InteractTest);
