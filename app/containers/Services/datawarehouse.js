import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

class DatawarehouseServices {
  loadData = (tableName, data) => axios.post(`${API_URL}/datawarehouse/load/` + tableName, data, config);

  getTables = () => axios.get(`${API_URL}/datawarehouse/tables`, config);

  getData = tableName => axios.get(`${API_URL}/datawarehouse/data/${tableName}`, config);

  getDataByRows = (tableName, rows) => axios.get(
    `${API_URL}/datawarehouse/data/getbyrows/${tableName}&${rows}`,
    config
  );

  getDataByRange = (tableName, firstLimit, lastLimit) => axios.get(
    `${API_URL}/datawarehouse/data/getbyrange/${tableName}&${firstLimit}&${lastLimit}`,
    config
  );
}
export default new DatawarehouseServices();
