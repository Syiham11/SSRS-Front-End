import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

class WorkspaceServices {
  getAll = () => axios.get(`${API_URL}/workspace/getAll`, config);

  getCharts = id => axios.get(`${API_URL}/workspace/${id}/charts`, config);

  save = workspace => axios.post(`${API_URL}/workspace/save`, workspace, config);

  delete = workspace => axios.post(`${API_URL}/workspace/delete`, workspace, config);

  update = workspace => axios.post(`${API_URL}/workspace/update`, workspace, config);

  checkExistance = title => axios.get(`${API_URL}/workspace/checkExistence/${title}`, config);
}
export default new WorkspaceServices();
