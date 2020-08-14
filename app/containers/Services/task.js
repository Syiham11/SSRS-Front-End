import axios from 'axios';
import { API, config, sub } from '../../config/apiUrl';
const API_URL = API;
class TaskServices {
  getAll = () => axios.get(`${API_URL}/task/getAll&${sub}`, config);

  update = task => axios.post(`${API_URL}/task/update`, task, config);

  add = task => axios.post(`${API_URL}/task/add&${sub}`, task, config);

  delete = task => axios.post(`${API_URL}/task/delete`, task, config);
}
export default new TaskServices();
