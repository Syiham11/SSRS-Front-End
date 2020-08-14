import axios from 'axios';
import { API, config, sub } from '../../config/apiUrl';
const API_URL = API;
class FormulaServices {
  getAll = () => axios.get(`${API_URL}/formula/getAll&${sub}`, config);

  solve = formulaElements => axios.post(`${API_URL}/formula/solve`, formulaElements, config);

  save = formula => axios.post(`${API_URL}/formula/insert&${sub}`, formula, config);

  delete = formula => axios.post(`${API_URL}/formula/delete`, formula, config);
}
export default new FormulaServices();
