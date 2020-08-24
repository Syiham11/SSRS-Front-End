import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

class ImportServices {
  testConnection = dataSource => axios.post(`${API_URL}/import/database/testconnection`, dataSource, config);

  getTables = dataSource => axios.post(`${API_URL}/import/database/tables`, dataSource, config);

  getSources = () => axios.get(`${API_URL}/import/database/getsources`, config);

  loadData = (data, tableName) => axios.post(`${API_URL}/import/database/load/${tableName}`, data, config);

  getHistoricTables = () => axios.get(`${API_URL}/import/database/gethistoric`, config);

  saveSource = dataSource => axios.post(`${API_URL}/import/database/savesource`, dataSource, config);

  deleteSource = dataSource => axios.post(`${API_URL}/import/database/deletesource`, dataSource, config);

  getHistoricData = tableName => axios.get(`${API_URL}/import/database/gethistoric/${tableName}`, config);

  getData = (tableName, dataSource) => axios.post(
    `${API_URL}/import/database/tables/${tableName}`,
    dataSource,
    config
  );

  extractExcelData = (file, sheetNumber, conf) => axios.post(`${API_URL}/import/file/excel&sheet=${sheetNumber}`, file, conf);

  extractCsvData = (file, csvHeaderState, conf) => axios.post(
    `${API_URL}/import/file/csv&header=${csvHeaderState}`,
    file,
    conf
  );
}

export default new ImportServices();
