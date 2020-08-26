import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

class WorkspaceServices {
  getToken = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: token }
    };
  };

  getAll = () => axios.get(`${API_URL}/workspace/getAll`, this.getToken());

  getCharts = id => axios.get(`${API_URL}/workspace/${id}/charts`, this.getToken());

  save = workspace => axios.post(`${API_URL}/workspace/save`, workspace, this.getToken());

  delete = id => axios.delete(`${API_URL}/workspace/delete/${id}`, this.getToken());

  update = workspace => axios.post(`${API_URL}/workspace/update`, workspace, this.getToken());

  checkExistance = title => axios.get(`${API_URL}/workspace/checkExistence/${title}`, this.getToken());
}
export default new WorkspaceServices();
