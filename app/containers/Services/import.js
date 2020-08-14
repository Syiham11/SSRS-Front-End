import axios from 'axios';
import { API, config, sub } from '../../config/apiUrl';
const API_URL = API;
class ImportServices {
  testConnection = dataSource => axios.post(
    `${API_URL}/import/database/testconnection`,
    dataSource,
    this.config
  );

  getTables = dataSource => axios.post(`${API_URL}/import/database/tables`, dataSource, config);

  getSources = () => axios.get(`${API_URL}/import/database/getsources&${sub}`, config);

  loadData = (data, tableName) => axios.post(`${API_URL}/import/database/load/${tableName}`, data, config);

  getHistoricTables = () => axios.get(`${API_URL}/import/database/gethistoric`, config);

  saveSource = dataSource => axios.post(
    `${API_URL}/import/database/savesource&${sub}`,
    dataSource,
    config
  );

  deleteSource = dataSource => axios.post(`${API_URL}/import/database/deletesource`, dataSource, config);

  getHistoricData = tableName => axios.get(`${API_URL}/import/database/gethistoric/${tableName}`, config);

  getData = (tableName, dataSource) => axios.post(
    `${API_URL}/import/database/tables/${tableName}`,
    dataSource,
    config
  );
}
export default new ImportServices();
