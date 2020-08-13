import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;
class ImportServices {
  config = {
    headers: { Authorization: sessionStorage.getItem('token') }
  };

  testConnection = (dataSource) => axios.post(`${API_URL}/import/database/testconnection`, dataSource, this.config);

  getTables = (dataSource) => axios.post(`${API_URL}/import/database/tables`, dataSource, this.config);

  getSources = () => axios.get(`${API_URL}/import/database/getSources`);

  loadData = (data, tableName) => axios.post(`${API_URL}/import/database/load/${tableName}`, data);

  getHistoricTables = () => axios.get(`${API_URL}/import/database/gethistoric`);

  deleteDataSource = (dataSourceId) => axios.delete(`${API_URL}/datasource/delete/${dataSourceId}`);

  getHistoricData = (tableName) => axios.get(`${API_URL}/import/database/gethistoric/${tableName}`);

  getData = (tableName, dataSource) => axios.post(`${API_URL}/import/database/tables/${tableName}`, dataSource, this.config);
}
export default new ImportServices();
