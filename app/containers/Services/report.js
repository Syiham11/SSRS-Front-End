import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

class ReportServices {
  getToken = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: token }
    };
  };

  getAll = () => axios.get(`${API_URL}/report/getAll`, this.getToken());

  save = report => axios.post(`${API_URL}/report/save`, report, this.getToken());

  delete = id => axios.delete(`${API_URL}/report/delete/${id}`, this.getToken());
}
export default new ReportServices();
