import axios from 'axios';
import { API, config, sub } from '../../config/apiUrl';
const API_URL = API;
class WorkspaceServices {
  getAll = () => axios.get(`${API_URL}/workspace/getAll&${sub}`, config);

  getCharts = id => axios.get(`${API_URL}/workspace/${id}/charts`, config);

  save = workspace => axios.post(`${API_URL}/workspace/save&${sub}`, workspace, config);

  delete = workspace => axios.post(`${API_URL}/workspace/delete`, workspace, config);

  update = workspace => axios.post(`${API_URL}/workspace/update`, workspace, config);

  checkExistance = title => axios.get(`${API_URL}/workspace/checkExistence/${title}&${sub}`, config);
}
export default new WorkspaceServices();
