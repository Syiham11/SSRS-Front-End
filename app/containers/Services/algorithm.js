import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

class AlgorithmsServices {
  getToken = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: token }
    };
  };

  getAllAlgorithms = () => axios.get(`${API_URL}/algorithms`, this.getToken());

  saveAlgorithm = algorithm => axios.post(`${API_URL}/algorithm`, algorithm, this.getToken());

  deleteAlgorithm = algorithmId => axios.delete(`${API_URL}/algorithm/delete/${algorithmId}`, this.getToken());

  ApplyAlgorithm = (data, result, algoId, variables) => axios.post(
    `${API_URL}/import/database/test/${result}/${algoId}?variables=${variables}`,
    data,
    this.getToken()
  );
}
export default new AlgorithmsServices();
