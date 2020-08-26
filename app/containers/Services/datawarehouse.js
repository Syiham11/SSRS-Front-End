import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

class DatawarehouseServices {
  getToken = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: token }
    };
  };

  loadData = (tableName, data) => axios.post(
    `${API_URL}/datawarehouse/load/` + tableName,
    data,
    this.getToken()
  );

  getTables = () => axios.get(`${API_URL}/datawarehouse/tables`, this.getToken());

  getData = tableName => axios.get(`${API_URL}/datawarehouse/data/${tableName}`, this.getToken());

  getDataByRows = (tableName, rows) => axios.get(
    `${API_URL}/datawarehouse/data/getbyrows/${tableName}&${rows}`,
    this.getToken()
  );

  getDataByRange = (tableName, firstLimit, lastLimit) => axios.get(
    `${API_URL}/datawarehouse/data/getbyrange/${tableName}&${firstLimit}&${lastLimit}`,
    this.getToken()
  );
}
export default new DatawarehouseServices();
