import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

class ReportServices {
  getAll = () => axios.get(`${API_URL}/report/getAll`, config);

  save = report => axios.post(`${API_URL}/report/save`, report, config);

  delete = report => axios.post(`${API_URL}/report/delete`, report, config);
}
export default new ReportServices();
