import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

class DashboardServices {
  save = dashboard => axios.post(`${API_URL}/dashboard/save&`, dashboard, config);

  getDataByRows = (tableName, rows) => axios.get(
    `${API_URL}/dashboard/data/getbyrows/${tableName}&${rows}`,
    config
  );

  getDataByRange = (tableName, firstLimit, lastLimit) => axios.get(
    `${API_URL}/dashboard/data/getbyrange/${tableName}&${firstLimit}&${lastLimit}`,
    config
  );

  getCharts = () => axios.get(`${API_URL}/dashboard/charts`, config);
}
export default new DashboardServices();
