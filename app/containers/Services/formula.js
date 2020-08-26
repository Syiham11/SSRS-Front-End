import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

class FormulaServices {
  getToken = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: token }
    };
  };

  getAll = () => axios.get(`${API_URL}/formula/getAll`, this.getToken());

  solve = formulaElements => axios.post(`${API_URL}/formula/solve`, formulaElements, this.getToken());

  save = formula => axios.post(`${API_URL}/formula/insert`, formula, this.getToken());

  delete = id => axios.delete(`${API_URL}/formula/delete/id=${id}`, this.getToken());
}
export default new FormulaServices();
