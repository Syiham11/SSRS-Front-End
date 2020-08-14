import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;
class AlgorithmsServices {
  config = {
    headers: { Authorization: sessionStorage.getItem('token') }
  };

  getAllAlgorithms = () => axios.get(`${API_URL}/algorithms`, this.config);

  saveAlgorithm = (algorithm) => axios.post(`${API_URL}/algorithm`, algorithm, this.config);

  deleteAlgorithm = (algorithmId) => axios.delete(`${API_URL}/algorithm/delete/${algorithmId}`, this.config);

  ApplyAlgorithm = (data, result, algoId, variables) => axios.post(`${API_URL}/import/database/test/${result}/${algoId}?variables=${variables}`, data, this.config);
}
export default new AlgorithmsServices();
