import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

class TaskServices {
  getAll = () => axios.get(`${API_URL}/task/getAll`, config);

  update = task => axios.post(`${API_URL}/task/update`, task, config);

  add = task => axios.post(`${API_URL}/task/add`, task, config);

  delete = task => axios.post(`${API_URL}/task/delete`, task, config);
}
export default new TaskServices();
