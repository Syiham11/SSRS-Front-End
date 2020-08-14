import React, { Component } from 'react';
import {
  Button,
  withStyles,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as JsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactQuill from 'react-quill';
import * as am4core from '@amcharts/amcharts4/core';
import 'react-quill/dist/quill.bubble.css';
import interact from 'interactjs';
import ListDialog from './ListDialog';
import ReportServices from '../../Services/report';

const styles = theme => ({
  textarea: {
    border: 'none',
    background: 'transparent',
    position: 'absolute',
    borderRadius: '10px'
  },
  imagearea: {
    border: 'none',
    display: 'inline-block',
    background: 'transparent',
    position: 'absolute',
    borderRadius: '10px'
  },
  divSpace: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      '& button': {
        width: '100%',
        margin: 5
      }
    }
  },
  button: {
    background: 'none',
    padding: 0,
    textTransform: 'none',
    transition: 'color ease 0.3s',
    fontWeight: theme.typography.fontWeightRegular,
    height: 40,
    width: '10%',
    margin: theme.spacing(2),
    fontSize: '18px',
    '&:hover': {
      background: 'none',
      color: theme.palette.secondary.main
    }
  }
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    [{ direction: 'rtl' }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['image'],
    ['clean']
  ]
};

const formats = [
  'header',
  'font',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'direction',
  'align',
  'color',
  'background',
  'image'
];

export class ReportEditor extends Component {
  state = {
    elements: [],
    id: 0,
    openDialog: false,
    historyDialogOpen: false,
    dialogType: '',
    clickedItem: 0,
    templates: [],
    selectedElement: -1,
    historyTemplates: []
  };

  componentDidMount() {
    this.updateHistoryList();
    interact('[id^=element]')
      .draggable({
        inertia: true,
        // enable autoScroll
        autoScroll: true,
        restrict: {
          restriction: '#divToPrint',
          drag: document.getElementById('divToPrint'),
          endOnly: true,
          elementRect: {
            top: 0,
            left: 0,
            bottom: 1,
            right: 1
          }
        },
        listeners: {
          // call this function on every dragmove event
          move: this.dragMoveListener
          // call this function on every dragend event
          // end(event) {}
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
            let x = parseFloat(target.getAttribute('data-x')) || 0;
            let y = parseFloat(target.getAttribute('data-y')) || 0;
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = 'translate(' + x + 'px,' + y + 'px)';
            target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          }
        }
      });
  }

  dragMoveListener = event => {
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

  generatePDF = () => {
    const input = document.getElementById('divToPrint');
    html2canvas(input, { scrollY: -window.scrollY, scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new JsPDF('p', 'mm', 'a4', true);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      // pdf.output('dataurlnewwindow');
      pdf.save('SSMS report.pdf');
    });
  };

  generateImageURL = id => {
    /* const input = document.getElementById('chart' + id);
    console.log(id);
    let imgURL = null;
    html2canvas(input, { scrollY: -window.scrollY, scale: 3 }).then(canvas => {
      console.log(canvas.toDataURL('image/jpeg', 1.0));
      imgURL = canvas.toDataURL('image/jpeg', 1.0);
      this.handleChoosedChart(imgURL);
    }); */
    const chart = am4core.registry.baseSprites[id];
    chart.exporting.getImage('png').then(data => {
      this.handleChoosedChart(data);
    });
  };

  handleDialogItemClick = (id, type) => {
    if (type === 'chart') {
      this.generateImageURL(id);
    } else if (type === 'table') {
      const { elements, clickedItem } = this.state;
      const index = elements.findIndex(el => el.id === clickedItem);
      const list = JSON.parse(JSON.stringify(elements));
      list[index] = {
        id: list[index].id,
        type: list[index].type,
        chartURL: list[index].chartURL,
        tableId: id,
        x: list[index].x,
        y: list[index].y,
        height: list[index].height,
        width: list[index].width
      };
      this.setState({
        elements: list
      });
    }
    this.closeDialogChoose();
  };

  updateHistoryList = () => {
    ReportServices.getAll().then(response => {
      this.setState({
        historyTemplates: response.data
      });
    });
  };

  insertElement = type => {
    const { elements, id } = this.state;
    if (type === 'text') {
      this.setState({
        elements: elements.concat({
          id,
          type: 'text',
          chartURL: '',
          tableId: -1,
          x: 0,
          y: 0,
          height: 200,
          width: 200
        }),
        id: id + 1
      });
    } else if (type === 'chart') {
      this.setState({
        elements: elements.concat({
          id,
          type: 'chart',
          chartURL: '',
          tableId: -1,
          x: 0,
          y: 0,
          height: 200,
          width: 200
        }),
        id: id + 1
      });
    } else {
      this.setState({
        elements: elements.concat({
          id,
          type: 'table',
          chartURL: '',
          tableId: -1,
          x: 0,
          y: 0,
          height: 200,
          width: 200
        }),
        id: id + 1
      });
    }
  };

  generateTable = id => {
    if (id >= 0) {
      const chart = am4core.registry.baseSprites[id];
      const data = JSON.parse(JSON.stringify(chart.data));
      if (data.length > 0) {
        const keys1 = Object.keys(data[0]);
        const keys2 = [];
        keys2.push(chart.xAxes.getIndex(0).dataFields.category);
        for (let i = 0; i < chart.series.length; i += 1) {
          keys2.push(chart.series.getIndex(i).dataFields.valueY);
        }
        const diff = keys1.filter(k => !keys2.includes(k));
        for (let i = 0; i < diff.length; i += 1) {
          data.forEach(k => delete k[diff[i]]);
        }
      }
      const keys = Object.keys(data[0]);
      return (
        <Table
          style={{
            height: '100%',
            width: '100%',
            overflow: 'auto'
          }}
        >
          <TableHead>
            <TableRow>
              {keys.map(row => (
                <TableCell padding="default">{row}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => [
              <TableRow key={n.id}>
                {keys.map(row => (
                  <TableCell padding="default">{n[row]}</TableCell>
                ))}
              </TableRow>
            ])}
          </TableBody>
        </Table>
      );
    }
    return (
      <img
        src=""
        alt="table holder"
        style={{
          height: '100%',
          width: '100%'
        }}
      />
    );
  };

  handleRemoveItem = (e, id) => {
    const { elements, selectedElement } = this.state;
    if (e.keyCode === 46 && id === selectedElement) {
      let list;
      list = JSON.parse(JSON.stringify(elements));
      list = list.filter(item => item.id !== selectedElement);
      this.setState({
        elements: list
      });
    }
  };

  selectElement = id => {
    this.setState(
      {
        selectedElement: id
      },
      () => {
        document.getElementById('element' + id).style.border = 'solid 1px #000000';
      }
    );
  };

  unselectElement = id => {
    document.getElementById('element' + id).style.border = 'none';
  };

  saveReportTemplate = () => {
    const { elements } = this.state;
    const list = [];
    elements.forEach(item => {
      const item1 = {
        id: item.id,
        type: item.type,
        chartURL: '',
        x: document.getElementById('element' + item.id).getAttribute('data-x'),
        y: document.getElementById('element' + item.id).getAttribute('data-y'),
        height: document
          .getElementById('element' + item.id)
          .getBoundingClientRect().height,
        width: document
          .getElementById('element' + item.id)
          .getBoundingClientRect().width
      };
      list.push(item1);
    });
    const obj = {
      templateParam: JSON.stringify(list),
      creationTime: new Date()
    };
    ReportServices.save(obj)
      .then(() => {
        this.updateHistoryList();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  loadDialogOpen = () => {
    this.setState({
      openDialog: true,
      dialogType: 'template'
    });
  };

  openTemplateHistoryDialog = () => {
    this.setState({
      historyDialogOpen: true
    });
  };

  handleClose = () => {
    this.setState({
      historyDialogOpen: false
    });
  };

  handleHistoryTemplateOk = radioChoosedIndex => {
    const { historyTemplates } = this.state;
    const list = JSON.parse(historyTemplates[radioChoosedIndex].templateParam);
    for (let i = 0; i < list.length; i += 1) {
      list[i].id = i;
    }
    this.setState(
      {
        elements: list,
        id: list.length + 1
      },
      () => {
        for (let i = 0; i < list.length; i += 1) {
          document.getElementById(
            'element' + list[i].id
          ).style.webkitTransform = 'translate(' + list[i].x + 'px, ' + list[i].y + 'px)';
          document.getElementById('element' + list[i].id).style.transform = 'translate(' + list[i].x + 'px, ' + list[i].y + 'px)';
          document
            .getElementById('element' + list[i].id)
            .setAttribute('data-x', list[i].x);
          document
            .getElementById('element' + list[i].id)
            .setAttribute('data-y', list[i].y);
          document.getElementById('element' + list[i].id).style.width = list[i].width + 'px';
          document.getElementById('element' + list[i].id).style.height = list[i].height + 'px';
        }
      }
    );
    this.handleClose();
  };

  handleDeleteTemplate = tmp => {
    ReportServices.delete(tmp).then(response => {
      console.log(response.data);
      this.updateHistoryList();
    });
  };

  loadReportTemplate = id => {
    const { templates } = this.state;
    const index = templates.findIndex(pl => pl.id === id);
    const list = JSON.parse(JSON.stringify(templates));
    const elm = list[index].template;
    this.setState(
      {
        elements: elm
      },
      () => {
        for (let i = 0; i < elm.length; i += 1) {
          document.getElementById('element' + elm[i].id).style.webkitTransform = 'translate(' + elm[i].x + 'px, ' + elm[i].y + 'px)';
          document.getElementById('element' + elm[i].id).style.transform = 'translate(' + elm[i].x + 'px, ' + elm[i].y + 'px)';
          document
            .getElementById('element' + elm[i].id)
            .setAttribute('data-x', elm[i].x);
          document
            .getElementById('element' + elm[i].id)
            .setAttribute('data-y', elm[i].y);
          document.getElementById('element' + elm[i].id).style.width = elm[i].width + 'px';
          document.getElementById('element' + elm[i].id).style.height = elm[i].height + 'px';
        }
      }
    );
  };

  renderElement = row => {
    const { classes } = this.props;
    if (row.type === 'text') {
      return (
        <ReactQuill
          theme="bubble"
          modules={modules}
          formats={formats}
          placeholder="Insert text"
          onFocus={() => this.selectElement(row.id)}
          id={'element' + row.id}
          className={classes.textarea}
          style={{
            fontSize: '20px',
            height: '80px',
            width: '200px',
            position: 'absolute'
          }}
          onMouseDown={() => this.selectElement(row.id)}
          tabIndex={row.id}
          onKeyDown={e => this.handleRemoveItem(e, row.id)}
          onBlur={() => this.unselectElement(row.id)}
        />
      );
    }
    if (row.type === 'chart') {
      return (
        <button
          type="button"
          id={'element' + row.id}
          className={classes.imagearea}
          onMouseDown={() => this.selectElement(row.id)}
          style={{
            height: '200px',
            width: '200px',
            position: 'absolute'
          }}
          tabIndex={row.id}
          onBlur={() => this.unselectElement(row.id)}
          onKeyDown={e => this.handleRemoveItem(e, row.id)}
          onDoubleClick={() => this.openDialogChoose(row.id, 'chart')}
        >
          <img
            src={row.chartURL}
            alt="chart holder"
            style={{
              height: '100%',
              width: '100%'
            }}
          />
        </button>
      );
    }
    return (
      <button
        type="button"
        id={'element' + row.id}
        className={classes.imagearea}
        onMouseDown={() => this.selectElement(row.id)}
        style={{
          height: '200px',
          width: '200px',
          position: 'absolute',
          overflow: 'hidden'
        }}
        tabIndex={row.id}
        onBlur={() => this.unselectElement(row.id)}
        onKeyDown={e => this.handleRemoveItem(e, row.id)}
        onDoubleClick={() => this.openDialogChoose(row.id, 'table')}
      >
        {this.generateTable(row.tableId)}
      </button>
    );
  };

  handleChoosedChart = url => {
    const { elements, clickedItem } = this.state;
    const index = elements.findIndex(el => el.id === clickedItem);
    const list = JSON.parse(JSON.stringify(elements));
    list[index] = {
      id: list[index].id,
      type: list[index].type,
      chartURL: url,
      tableId: list[index].tableId,
      x: list[index].x,
      y: list[index].y,
      height: list[index].height,
      width: list[index].width
    };
    this.setState({
      elements: list
    });
  };

  openDialogChoose = (id, table) => {
    this.setState({
      openDialog: true,
      dialogType: table,
      clickedItem: id
    });
  };

  closeDialogChoose = () => {
    this.setState({
      openDialog: false
    });
  };

  closeEditor = () => {
    const { handleSetType } = this.props;
    handleSetType('visualize');
  };

  render() {
    const { chartList, classes } = this.props;
    const {
      openDialog,
      dialogType,
      templates,
      elements,
      historyDialogOpen,
      historyTemplates
    } = this.state;
    return (
      <div
        style={{
          marginBottom: '10px'
        }}
      >
        <ListDialog
          keepMounted
          open={historyDialogOpen}
          onClose={this.handleClose}
          historyData={historyTemplates}
          handleDialogOk={this.handleHistoryTemplateOk}
          handleDeleteTemplate={this.handleDeleteTemplate}
        />
        <Dialog
          aria-labelledby="simple-dialog-title"
          open={openDialog}
          onClose={this.closeDialogChoose}
        >
          <DialogTitle id="simple-dialog-title">
            {dialogType === 'chart' || dialogType === 'table'
              ? 'Choose chart'
              : 'Choose template'}
          </DialogTitle>
          <List component="nav" aria-label="main mailbox folders">
            {dialogType === 'chart' || dialogType === 'table'
              ? chartList.map(row => (
                <ListItem
                  button
                  onClick={() => this.handleDialogItemClick(row.id, dialogType)
                  }
                >
                  <ListItemText primary={'chart ' + (row.id + 1)} />
                </ListItem>
              ))
              : templates.map(row => (
                <ListItem
                  button
                  onClick={() => this.loadReportTemplate(row.id)}
                >
                  <ListItemText primary={'template ' + (row.id + 1)} />
                </ListItem>
              ))}
          </List>
        </Dialog>
        <div
          style={{
            width: '100%',
            height: '520mm',
            backgroundColor: '#E9EBEC',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px'
          }}
        >
          <Paper
            className={classes.divSpace}
            style={{
              width: '315mm',
              height: '30mm',
              marginBottom: '2%',
              alignItems: 'center'
            }}
            elevation={3}
          >
            <Button
              className={classes.button}
              onClick={() => this.insertElement('text')}
            >
              insert text
            </Button>
            <Button
              className={classes.button}
              onClick={() => this.insertElement('chart')}
            >
              insert chart
            </Button>
            <Button
              className={classes.button}
              onClick={() => this.insertElement('table')}
            >
              insert table
            </Button>
            <Button
              className={classes.button}
              onClick={this.saveReportTemplate}
            >
              save as template
            </Button>
            <Button
              className={classes.button}
              onClick={this.openTemplateHistoryDialog}
            >
              load a template
            </Button>
            <Button className={classes.button} onClick={this.generatePDF}>
              Generate
            </Button>
            <Button className={classes.button} onClick={this.closeEditor}>
              Close editor
            </Button>
          </Paper>
          <Paper
            id="divToPrint"
            style={{
              width: '315mm',
              height: '445.5mm',
              padding: 20
            }}
            elevation={3}
            square
          >
            {elements.map(row => this.renderElement(row))}
          </Paper>
        </div>
      </div>
    );
  }
}

ReportEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  chartList: PropTypes.array.isRequired,
  handleSetType: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  chartList: state.get('workspace').toJS().charts
});

const ReportEditorMapped = connect(mapStateToProps)(ReportEditor);

export default withStyles(styles)(ReportEditorMapped);
