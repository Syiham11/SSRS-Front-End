import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;
class AlgorithmsServices {
  getAllAlgorithms = () => axios.get(`${API_URL}/algorithms`);

  saveAlgorithm = (algorithm) => axios.post(`${API_URL}/algorithm`, algorithm);

  deleteAlgorithm = (algorithmId) => axios.delete(`${API_URL}/algorithm/delete/${algorithmId}`);

  ApplyAlgorithm = (data, result, algoId, variables) => axios.post(`${API_URL}/import/database/test/${result}/${algoId}?variables=${variables}`, data);
}
export default new AlgorithmsServices();
