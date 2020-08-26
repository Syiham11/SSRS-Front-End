import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

class TaskServices {
  getToken = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: token }
    };
  };

  getAll = () => axios.get(`${API_URL}/task/getAll`, this.getToken());

  update = task => axios.post(`${API_URL}/task/update`, task, this.getToken());

  add = task => axios.post(`${API_URL}/task/add`, task, this.getToken());

  delete = id => axios.delete(`${API_URL}/task/delete/${id}`, this.getToken());
}
export default new TaskServices();
