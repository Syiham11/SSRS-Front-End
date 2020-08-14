import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

const { sub } = JSON.parse(sessionStorage.getItem('user'));

class TaskServices {
  getAll = () => axios.get(`${API_URL}/task/getAll&${sub}`, config);

  update = task => axios.post(`${API_URL}/task/update`, task, config);

  add = task => axios.post(`${API_URL}/task/add&${sub}`, task, config);

  delete = task => axios.post(`${API_URL}/task/delete`, task, config);
}
export default new TaskServices();
