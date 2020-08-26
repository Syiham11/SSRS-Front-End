import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

class DashboardServices {
  getToken = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: token }
    };
  };

  save = dashboard => axios.post(`${API_URL}/dashboard/save`, dashboard, this.getToken());

  getDataByRows = (tableName, rows) => axios.get(
    `${API_URL}/dashboard/data/getbyrows/${tableName}&${rows}`,
    this.getToken()
  );

  getDataByRange = (tableName, firstLimit, lastLimit) => axios.get(
    `${API_URL}/dashboard/data/getbyrange/${tableName}&${firstLimit}&${lastLimit}`,
    this.getToken()
  );

  getCharts = () => axios.get(`${API_URL}/dashboard/charts`, this.getToken());
}
export default new DashboardServices();
