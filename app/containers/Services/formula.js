import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

const { sub } = JSON.parse(sessionStorage.getItem('user'));

class FormulaServices {
  getAll = () => axios.get(`${API_URL}/formula/getAll&${sub}`, config);

  solve = formulaElements => axios.post(`${API_URL}/formula/solve`, formulaElements, config);

  save = formula => axios.post(`${API_URL}/formula/insert&${sub}`, formula, config);

  delete = formula => axios.post(`${API_URL}/formula/delete`, formula, config);
}
export default new FormulaServices();
