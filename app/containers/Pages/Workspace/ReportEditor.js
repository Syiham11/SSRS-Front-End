import React, { Component } from 'react';
import {
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
  TableRow,
  Tooltip,
  IconButton,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as JsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactQuill from 'react-quill';
import * as am4core from '@amcharts/amcharts4/core';
import 'react-quill/dist/quill.bubble.css';
import interact from 'interactjs';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import TableChartIcon from '@material-ui/icons/TableChart';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PostAddIcon from '@material-ui/icons/PostAdd';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ImageIcon from '@material-ui/icons/Image';
import ListDialog from './ListDialog';
import ReportServices from '../../Services/report';

const styles = theme => ({
  textarea: {
    border: 'none',
    background: 'transparent',
    position: 'absolute',
    borderRadius: '10px'
  },
  circularProgress: {
    position: 'fixed',
    top: 'calc(50% - 75px)',
    left: 'calc(50% - 75px)'
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
    alignItems: 'center',
    flexDirection: 'column'
  },
  button: {
    background: 'none',
    padding: 0,
    textTransform: 'none',
    transition: 'color ease 0.3s',
    fontWeight: theme.typography.fontWeightRegular,
    height: 40,
    width: '7%',
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
  'background'
];

export class ReportEditor extends Component {
  state = {
    elements: [],
    id: 0,
    openDialog: false,
    historyDialogOpen: false,
    isGeneratePdf: false,
    isSpinnerShowed: false,
    isLoadTemplate: false,
    dialogType: '',
    clickedItem: 0,
    templates: [],
    selectedElement: -1,
    historyTemplates: [],
    chartImages: [],
    chartTableElements: {
      chartTables: [],
      keys: []
    },
    pages: [0],
    currentPageIndex: 0,
    currentPageNumber: 0
  };

  timeout = 0;

  componentDidMount() {
    this.updateReportData();
    this.updateHistoryList();
    interact('[id^=element]')
      .draggable({
        inertia: true,
        // enable autoScroll
        autoScroll: true,
        restrict: {
          restriction: '#editorSpace',
          drag: document.getElementById('editorSpace'),
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

  /* eslint-disable*/
  componentDidUpdate(PreviousProps) {
    const { chartList } = this.props;
    const { isSpinnerShowed, isLoadTemplate, pages, elements } = this.state;
    console.log(elements);
    if (PreviousProps.chartList !== chartList) {
      setTimeout(() => {
        this.updateReportData();
      }, 500);
    }
    if (isSpinnerShowed) {
      setTimeout(() => {
        this.handleSetSizeAndPosition('previewElement');
      }, 500);
    }
    if (isLoadTemplate) {
      setTimeout(() => {
        this.handleSetSizeAndPosition('element');
      }, 500);
    }
  }
  /* eslint-enable */

  updateReportData = () => {
    const { chartList } = this.props;
    const chartImages = [];
    const chartTables = [];
    const keys = [];
    chartList.forEach(obj => {
      if (obj.settings.choosedChart !== '') {
        const chartKeys = [];
        const chart = am4core.registry.baseSprites[obj.id];
        if (chart) {
          const { data } = chart;
          chartTables.push(data);
          chart.exporting.getImage('png').then(imageData => {
            chartImages.push(imageData);
          });
          chartKeys.push(chart.xAxes.getIndex(0).dataFields.category);
          for (let i = 0; i < chart.series.length; i += 1) {
            chartKeys.push(chart.series.getIndex(i).dataFields.valueY);
          }
          keys.push(chartKeys);
        }
      }
    });
    this.setState({
      chartImages,
      chartTableElements: {
        chartTables,
        keys
      }
    });
  };

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

  openGeneratePdfDialog = () => {
    const { currentPageNumber } = this.state;
    this.handlesaveSizeAndPosition(currentPageNumber);
    this.setState({
      isGeneratePdf: true,
      isSpinnerShowed: true
    });
  };

  /* eslint-disable*/
  generatePDF = () => {
    const { pages } = this.state;
    const pdf = new JsPDF('p', 'mm', 'a4', true);
    let i = 0;
    while (i < pages.length) {
      const input = document.getElementById('divToPrint' + pages[i]);
      html2canvas(input, { scrollY: -window.scrollY, scale: 2 }).then(
        canvas => {
          console.log('page ' + i);
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          if (i < pages.length - 1) {
            console.log('save pdf if');
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, () => {
              pdf.addPage();
              console.log('image added');
              i += 1;
            });
          } else if (i === pages.length - 1) {
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, () => {
              console.log('save pdf else');

              pdf.output('dataurlnewwindow');
              pdf.save('SSMS report.pdf');
              i += 1;
            });
          }
        }
      );
    }
  };
  /* eslint-enable */

  generatePDF2 = () => {
    const { pages } = this.state;
    console.log(pages);
    const pdf = new JsPDF('p', 'mm', 'a4', true);

    const addImageToPDF = id => new Promise(resolve => {
      console.log('id ' + id);
      const input = document.getElementById('divToPrint' + id);
      html2canvas(input, { scrollY: -window.scrollY, scale: 2 }).then(
        canvas => {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          console.log('save pdf if');
          pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
          resolve();
        }
      ); // Math.random returns a random number from 0~1
    });

    const promises = pages.map(async (page, index, array) => {
      // do some operation on ele
      // ex: var result = await some_async_function_that_return_a_promise(ele)
      // In the below I use doublify() to be such an async function
      console.log(array);
      await addImageToPDF(page).then(() => {
        pdf.addPage();
        console.log(
          'index ' + index + ' length ' + array.length,
          ' page ' + page
        );
        console.log('Image added');
      });
    });

    Promise.all(promises).then(() => {
      console.log('exporting pdf');
      const pageCount = pdf.internal.getNumberOfPages();
      pdf.deletePage(pageCount);
      pdf.output('dataurlnewwindow');
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

  handleDialogItemClick = (ind, type) => {
    if (type === 'chart') {
      this.handleChoosedChart(ind);
    } else if (type === 'table') {
      const { elements, clickedItem } = this.state;
      const index = elements.findIndex(el => el.id === clickedItem);
      const list = JSON.parse(JSON.stringify(elements));
      list[index] = {
        ...list[index],
        tableIndex: ind
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
    const { elements, id, currentPageNumber } = this.state;
    if (type === 'text') {
      this.setState({
        elements: elements.concat({
          id,
          type: 'text',
          text: '',
          x: 0,
          y: 0,
          height: 200,
          width: 200,
          page: currentPageNumber
        }),
        id: id + 1
      });
    } else if (type === 'chart') {
      this.setState({
        elements: elements.concat({
          id,
          type: 'chart',
          chartIndex: -1,
          x: 0,
          y: 0,
          height: 200,
          width: 200,
          page: currentPageNumber
        }),
        id: id + 1
      });
    } else if (type === 'image') {
      this.setState({
        elements: elements.concat({
          id,
          type: 'image',
          imageData: '',
          x: 0,
          y: 0,
          height: 200,
          width: 200,
          page: currentPageNumber
        }),
        id: id + 1
      });
    } else {
      this.setState({
        elements: elements.concat({
          id,
          type: 'table',
          tableIndex: -1,
          x: 0,
          y: 0,
          height: 200,
          width: 200,
          page: currentPageNumber
        }),
        id: id + 1
      });
    }
  };

  generateTable = ind => {
    const { chartTableElements } = this.state;
    if (ind >= 0) {
      const data = chartTableElements.chartTables[ind];
      if (data.length > 0) {
        const keys1 = Object.keys(data[0]);
        const keys2 = chartTableElements.keys[ind];
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
      <div>
        Double click
        <br />
        to choose a table data
      </div>
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
    const { currentPageNumber, pages } = this.state;
    const list = this.handlesaveSizeAndPosition(currentPageNumber);
    const list2 = [];
    list.forEach(item => {
      const item1 = {
        id: item.id,
        type: item.type,
        chartIndex: -1,
        tableIndex: -1,
        text: '',
        imageData: '',
        x: item.x,
        y: item.y,
        height: item.height,
        width: item.width,
        page: item.page
      };
      list2.push(item1);
    });
    const obj = {
      templateParam: JSON.stringify({ pages, elements: list2 }),
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
      historyDialogOpen: false,
      isGeneratePdf: false
    });
  };

  handleHistoryTemplateOk = radioChoosedIndex => {
    const { historyTemplates } = this.state;
    console.log(historyTemplates);
    const templateParam = JSON.parse(
      historyTemplates[radioChoosedIndex].templateParam
    );
    const list = templateParam.elements;
    const { pages } = templateParam;
    for (let i = 0; i < list.length; i += 1) {
      list[i].id = i;
    }
    this.setState({
      elements: list,
      pages,
      currentPageIndex: 0,
      currentPageNumber: pages[0],
      id: list.length + 1,
      isLoadTemplate: true
    });
    this.handleClose();
  };

  handleDeleteTemplate = tmp => {
    ReportServices.delete(tmp).then(() => {
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

  handleQuillTextChange = (value, id) => {
    const { elements } = this.state;
    console.log(value);
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const index = elements.findIndex(el => el.id === id);
      const list = JSON.parse(JSON.stringify(elements));
      list[index] = {
        ...list[index],
        text: value
      };
      console.log(list);
      this.setState({
        elements: list
      });
    }, 500);
  };

  handleUploadImage = id => {
    document.getElementById('input' + id).click();
  };

  handleChangeImage = async id => {
    const { elements } = this.state;
    const getImageData = img => new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(img);
    });

    console.log(document.getElementById('input' + id).files[0]);
    const file = document.getElementById('input' + id).files[0];

    await getImageData(file).then(result => {
      const index = elements.findIndex(el => el.id === id);
      const list = JSON.parse(JSON.stringify(elements));
      list[index] = {
        ...list[index],
        imageData: result
      };
      console.log(result);
      console.log(list);
      this.setState({
        elements: list
      });
    });

    Promise.resolve(getImageData);
  };

  renderElement = row => {
    const { classes } = this.props;
    const { chartImages } = this.state;
    if (row.type === 'text') {
      return (
        <button
          type="button"
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
        >
          <ReactQuill
            theme="bubble"
            modules={modules}
            formats={formats}
            style={{
              height: '100%',
              width: '100%'
            }}
            placeholder="Insert text"
            onChange={value => this.handleQuillTextChange(value, row.id)}
            onFocus={() => this.selectElement(row.id)}
          />
        </button>
      );
    }
    if (row.type === 'chart') {
      console.log('element' + row.id);
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
          onDoubleClick={() => this.openDialogChoose(row.id, 'chart')}
        >
          {row.chartIndex >= 0 ? (
            <img
              src={chartImages[row.chartIndex]}
              alt="chart holder"
              style={{
                height: '100%',
                width: '100%'
              }}
            />
          ) : (
            <div>
              Double click
              <br />
              to choose a chart
            </div>
          )}
        </button>
      );
    }
    if (row.type === 'image') {
      console.log('element' + row.id);
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
          onDoubleClick={() => this.handleUploadImage(row.id)}
        >
          <input
            type="file"
            id={'input' + row.id}
            style={{ display: 'none' }}
            onChange={() => this.handleChangeImage(row.id)}
          />
          {row.imageData !== '' ? (
            <img
              src={row.imageData}
              alt="img holder"
              style={{
                height: '100%',
                width: '100%'
              }}
            />
          ) : (
            <div>
              Double click
              <br />
              to choose an image
            </div>
          )}
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
        {this.generateTable(row.tableIndex)}
      </button>
    );
  };

  renderPreviewElement = row => {
    const { classes } = this.props;
    const { chartImages } = this.state;
    if (row.type === 'text') {
      return (
        <ReactQuill
          id={'previewElement' + row.id}
          theme="bubble"
          modules={modules}
          formats={formats}
          placeholder="Insert text"
          className={classes.textarea}
          value={row.text}
          style={{
            fontSize: '20px',
            height: '80px',
            width: '200px',
            position: 'absolute',
            overflow: 'hidden'
          }}
          tabIndex={row.id}
        />
      );
    }
    if (row.type === 'chart') {
      console.log('element' + row.id);
      return (
        <button
          id={'previewElement' + row.id}
          type="button"
          className={classes.imagearea}
          style={{
            height: '200px',
            width: '200px',
            position: 'absolute',
            overflow: 'hidden'
          }}
          tabIndex={row.id}
        >
          {row.chartIndex >= 0 ? (
            <img
              src={row.chartIndex >= 0 ? chartImages[row.chartIndex] : ''}
              alt="chart holder"
              style={{
                height: '100%',
                width: '100%'
              }}
            />
          ) : (
            <div>
              Double click
              <br />
              to choose a chart
            </div>
          )}
        </button>
      );
    }
    if (row.type === 'image') {
      return (
        <button
          type="button"
          id={'previewElement' + row.id}
          className={classes.imagearea}
          style={{
            height: '200px',
            width: '200px',
            position: 'absolute',
            overflow: 'hidden'
          }}
          tabIndex={row.id}
        >
          {row.imageData !== '' ? (
            <img
              src={row.imageData}
              alt="img holder"
              style={{
                height: '100%',
                width: '100%'
              }}
            />
          ) : (
            <div>
              Double click
              <br />
              to choose an image
            </div>
          )}
        </button>
      );
    }
    return (
      <button
        id={'previewElement' + row.id}
        type="button"
        className={classes.imagearea}
        style={{
          height: '200px',
          width: '200px',
          position: 'absolute',
          overflow: 'hidden'
        }}
        tabIndex={row.id}
      >
        {this.generateTable(row.tableIndex)}
      </button>
    );
  };

  handleChoosedChart = ind => {
    const { elements, clickedItem } = this.state;
    const index = elements.findIndex(el => el.id === clickedItem);
    const list = JSON.parse(JSON.stringify(elements));
    list[index] = {
      id: list[index].id,
      type: list[index].type,
      chartIndex: ind,
      x: list[index].x,
      y: list[index].y,
      height: list[index].height,
      width: list[index].width,
      page: list[index].page
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

  handlesaveSizeAndPosition = currentIndex => {
    const { elements } = this.state;
    const list = JSON.parse(JSON.stringify(elements));
    console.log('current: ' + currentIndex);
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].page === currentIndex) {
        list[i] = {
          ...list[i],
          x: document
            .getElementById('element' + list[i].id)
            .getAttribute('data-x'),
          y: document
            .getElementById('element' + list[i].id)
            .getAttribute('data-y'),
          height: document
            .getElementById('element' + list[i].id)
            .getBoundingClientRect().height,
          width: document
            .getElementById('element' + list[i].id)
            .getBoundingClientRect().width
        };
      }
    }
    console.log(list);
    this.setState({
      elements: list
    });
    return list;
  };

  handleSetSizeAndPositionByIndex = newIndex => {
    const { elements } = this.state;
    const elm = elements.filter(element => element.page === newIndex);
    console.log(elm);
    for (let i = 0; i < elm.length; i += 1) {
      console.log('element' + elm[i].id);
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
  };

  handleSetSizeAndPosition = type => {
    const { elements } = this.state;
    const elm = elements;
    console.log(elm);
    for (let i = 0; i < elm.length; i += 1) {
      console.log(document.getElementById(type + '' + elm[i].id));
      if (document.getElementById(type + '' + elm[i].id) !== null) {
        document.getElementById(type + '' + elm[i].id).style.webkitTransform = 'translate(' + elm[i].x + 'px, ' + elm[i].y + 'px)';
        document.getElementById(type + '' + elm[i].id).style.transform = 'translate(' + elm[i].x + 'px, ' + elm[i].y + 'px)';
        document
          .getElementById(type + '' + elm[i].id)
          .setAttribute('data-x', elm[i].x);
        document
          .getElementById(type + '' + elm[i].id)
          .setAttribute('data-y', elm[i].y);
        document.getElementById(type + '' + elm[i].id).style.width = elm[i].width + 'px';
        document.getElementById(type + '' + elm[i].id).style.height = elm[i].height + 'px';
      }
    }
    /* if (isLoadTemplate) {
      this.setState({
        isLoadTemplate: false,
        currentPageIndex: pages.length - 1,
        currentPageNumber: pages[pages.length - 1]
      });
    } else {
      this.setState({
        isSpinnerShowed: false
      });
    } */
    this.setState({
      isLoadTemplate: false,
      isSpinnerShowed: false
    });
  };

  handleNextPage = () => {
    const { currentPageIndex, currentPageNumber, pages } = this.state;
    this.handlesaveSizeAndPosition(currentPageNumber);
    this.setState(
      {
        currentPageIndex: currentPageIndex + 1,
        currentPageNumber: pages[currentPageIndex + 1]
      },
      () => {
        this.handleSetSizeAndPositionByIndex(
          pages[currentPageIndex + 1],
          'element'
        );
      }
    );
  };

  handlePreviousPage = () => {
    const { currentPageIndex, currentPageNumber, pages } = this.state;
    this.handlesaveSizeAndPosition(currentPageNumber);
    this.setState(
      {
        currentPageIndex: currentPageIndex - 1,
        currentPageNumber: pages[currentPageIndex - 1]
      },
      () => {
        this.handleSetSizeAndPositionByIndex(
          pages[currentPageIndex - 1],
          'element'
        );
      }
    );
  };

  addNewPage = () => {
    const { pages, currentPageNumber } = this.state;
    const list = pages;
    list.push(pages[pages.length - 1] + 1);
    console.log(list);
    this.handlesaveSizeAndPosition(currentPageNumber);
    this.setState({
      pages: list,
      currentPageIndex: pages.length - 1,
      currentPageNumber: pages[pages.length - 1]
    });
  };

  deleteCurrentPage = () => {
    const {
      pages, currentPageIndex, currentPageNumber, elements
    } = this.state;
    let newIndex = 0;
    const list = pages;
    list.splice(currentPageIndex, 1);
    if (currentPageIndex === pages.length - 1 && pages.length > 1) {
      newIndex = currentPageIndex - 1;
    }
    this.setState(
      {
        pages: list,
        currentPageIndex: newIndex,
        currentPageNumber: pages[newIndex],
        elements: elements.filter(el => el.page !== currentPageNumber)
      },
      () => {
        this.handleSetSizeAndPositionByIndex(pages[newIndex], 'element');
      }
    );
  };

  render() {
    const { chartList, classes } = this.props;
    const {
      openDialog,
      isGeneratePdf,
      isSpinnerShowed,
      dialogType,
      templates,
      elements,
      historyDialogOpen,
      historyTemplates,
      pages,
      currentPageIndex,
      currentPageNumber
    } = this.state;
    return (
      <div
        style={{
          marginBottom: '10px'
        }}
      >
        <Dialog
          open={isGeneratePdf}
          disableBackdropClick
          disableEscapeKeyDown
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="xl"
        >
          <DialogTitle id="alert-dialog-title">Preview</DialogTitle>
          <DialogContent>
            {isSpinnerShowed ? (
              <img
                src="/images/spinner.gif"
                alt="spinner"
                className={classes.circularProgress}
              />
            ) : (
              <div />
            )}
            <div
              style={
                isSpinnerShowed
                  ? {
                    pointerEvents: 'none',
                    opacity: '0.4',
                    width: '100%',
                    backgroundColor: '#E9EBEC',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px',
                    padding: 20
                  }
                  : {
                    width: '100%',
                    backgroundColor: '#E9EBEC',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px',
                    padding: 20
                  }
              }
            >
              {pages.map(pageIndex => (
                <Paper
                  id={'divToPrint' + pageIndex}
                  style={{
                    width: '315mm',
                    height: '445.5mm',
                    margin: 20,
                    position: 'relative'
                  }}
                  elevation={3}
                  square
                >
                  {elements
                    .filter(element => element.page === pageIndex)
                    .map(row => this.renderPreviewElement(row))}
                </Paper>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.generatePDF2}>
              Generate
            </Button>
          </DialogActions>
        </Dialog>
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
              ? chartList.map((row, index) => (
                <ListItem
                  button
                  onClick={() => this.handleDialogItemClick(index, dialogType)
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
            <Tooltip title="Add text to current page">
              <IconButton
                aria-label="Insert text"
                className={classes.button}
                onClick={() => this.insertElement('text')}
              >
                <div className={classes.divCenter}>
                  <TextFieldsIcon />
                  <Typography variant="subtitle1">Insert text</Typography>
                </div>
              </IconButton>
            </Tooltip>
            <Tooltip title="Add chart to current page">
              <IconButton
                aria-label="Insert chart"
                className={classes.button}
                onClick={() => this.insertElement('chart')}
              >
                <div className={classes.divCenter}>
                  <EqualizerIcon />
                  <Typography variant="subtitle1">Insert chart</Typography>
                </div>
              </IconButton>
            </Tooltip>
            <Tooltip title="Add table data to current page">
              <IconButton
                aria-label="Insert table"
                className={classes.button}
                onClick={() => this.insertElement('table')}
              >
                <div className={classes.divCenter}>
                  <TableChartIcon />
                  <Typography variant="subtitle1">Insert table</Typography>
                </div>
              </IconButton>
            </Tooltip>
            <Tooltip title="Add image to current page">
              <IconButton
                aria-label="Insert image"
                className={classes.button}
                onClick={() => this.insertElement('image')}
              >
                <div className={classes.divCenter}>
                  <ImageIcon />
                  <Typography variant="subtitle1">Insert image</Typography>
                </div>
              </IconButton>
            </Tooltip>
            <Tooltip title="Add new page">
              <IconButton
                aria-label="Add page"
                className={classes.button}
                onClick={this.addNewPage}
              >
                <div className={classes.divCenter}>
                  <PostAddIcon />
                  <Typography variant="subtitle1">Add page</Typography>
                </div>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete current page">
              <IconButton
                aria-label="Remove page"
                onClick={this.deleteCurrentPage}
                lassName={classes.button}
                disabled={pages.length === 1}
              >
                <div className={classes.divCenter}>
                  <DeleteForeverIcon />
                  <Typography variant="subtitle1">Remove page</Typography>
                </div>
              </IconButton>
            </Tooltip>
            <Tooltip title="Save this report as template">
              <IconButton
                aria-label="Save template"
                className={classes.button}
                onClick={this.saveReportTemplate}
              >
                <div className={classes.divCenter}>
                  <SaveIcon />
                  <Typography variant="subtitle1">Save template</Typography>
                </div>
              </IconButton>
            </Tooltip>
            <Tooltip title="Load a saved template">
              <IconButton
                aria-label="Load template"
                className={classes.button}
                onClick={this.openTemplateHistoryDialog}
              >
                <div className={classes.divCenter}>
                  <PublishIcon />
                  <Typography variant="subtitle1">Load template</Typography>
                </div>
              </IconButton>
            </Tooltip>
            <Tooltip title="Generate the pages in PDF file">
              <IconButton
                aria-label="Generate PDF"
                className={classes.button}
                onClick={this.openGeneratePdfDialog}
              >
                <div className={classes.divCenter}>
                  <PictureAsPdfIcon />
                  <Typography variant="subtitle1">Generate PDF</Typography>
                </div>
              </IconButton>
            </Tooltip>
            <Tooltip title="Close the editor">
              <IconButton
                aria-label="Close editor"
                className={classes.button}
                onClick={this.closeEditor}
              >
                <div className={classes.divCenter}>
                  <CancelPresentationIcon />
                  <Typography variant="subtitle1">Close editor</Typography>
                </div>
              </IconButton>
            </Tooltip>
          </Paper>
          <div
            id="editorSpace"
            style={{
              margin: 20
            }}
          >
            {pages
              .filter(page => page === currentPageNumber)
              .map(pageIndex => (
                <Paper
                  style={{
                    width: '315mm',
                    height: '445.5mm'
                  }}
                  elevation={3}
                  square
                >
                  {elements
                    .filter(element => element.page === pageIndex)
                    .map(row => this.renderElement(row))}
                </Paper>
              ))}
          </div>
          <div className={classes.divSpace}>
            <Tooltip title="Previous page">
              <IconButton
                aria-label="Previous page"
                className={classes.button}
                onClick={this.handlePreviousPage}
                disabled={pages.length <= 1 || currentPageIndex === 0}
              >
                <NavigateBeforeIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="subtitle1">
              {`Page ${currentPageIndex + 1}`}
            </Typography>
            <Tooltip title="Next page">
              <IconButton
                aria-label="Next page"
                className={classes.button}
                onClick={this.handleNextPage}
                disabled={
                  pages.length <= 1 || pages.length === currentPageIndex + 1
                }
              >
                <NavigateNextIcon />
              </IconButton>
            </Tooltip>
          </div>
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
