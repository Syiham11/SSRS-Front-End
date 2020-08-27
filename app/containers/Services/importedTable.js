import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

class ImportedTableServices {
  getToken = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: token }
    };
  };

  getUserTables = () => axios.get(`${API_URL}/importedTable/getUserTables`, this.getToken());

  getAll = () => axios.get(`${API_URL}/importedTable/getAll`, this.getToken());

  save = importedTable => axios.post(`${API_URL}/importedTable/save`, importedTable, this.getToken());

  delete = id => axios.delete(`${API_URL}/importedTable/delete/${id}`, this.getToken());
}
export default new ImportedTableServices();
