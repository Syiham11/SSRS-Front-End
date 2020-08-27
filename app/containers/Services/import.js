import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

class ImportServices {
  getToken = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: token }
    };
  };

  testConnection = dataSource => axios.post(
    `${API_URL}/import/database/testConnection`,
    dataSource,
    this.getToken()
  );

  getTables = dataSource => axios.post(
    `${API_URL}/import/database/tables`,
    dataSource,
    this.getToken()
  );

  getSources = () => axios.get(`${API_URL}/import/database/getSources`, this.getToken());

  loadData = (data, tableName) => axios.post(
    `${API_URL}/import/database/load/${tableName}`,
    data,
    this.getToken()
  );

  getHistoricTables = () => axios.get(`${API_URL}/import/database/gethistoric`, this.getToken());

  saveSource = dataSource => axios.post(
    `${API_URL}/import/database/saveSource`,
    dataSource,
    this.getToken()
  );

  deleteSource = id => axios.delete(
    `${API_URL}/import/database/deleteSource/${id}`,
    this.getToken()
  );

  getHistoricData = tableName => axios.get(
    `${API_URL}/import/database/gethistoric/${tableName}`,
    this.getToken()
  );

  getData = (tableName, dataSource) => axios.post(
    `${API_URL}/import/database/tables/${tableName}`,
    dataSource,
    this.getToken()
  );

  extractExcelData = (file, sheetNumber, conf) => axios.post(`${API_URL}/import/file/excel&sheet=${sheetNumber}`, file, conf);

  extractCsvData = (file, csvHeaderState, conf) => axios.post(
    `${API_URL}/import/file/csv&header=${csvHeaderState}`,
    file,
    conf
  );

  extractXmlData = (file, conf) => axios.post(`${API_URL}/import/file/xml`, file, conf);

  extractTxtData = (file, txtHeaderState, separator, conf) => axios.post(
    `${API_URL}/import/file/txt&header=${txtHeaderState}&separator=${separator}`,
    file,
    conf
  );

  extractDwgData = (file, conf) => axios.post(`${API_URL}/import/file/dwg`, file, conf);

  webServiceTest = dataSource => axios.post(`${API_URL}/import/webservice/testConnection`, dataSource, config);
}

export default new ImportServices();
