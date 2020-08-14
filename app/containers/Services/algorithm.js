import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

class AlgorithmsServices {
  getAllAlgorithms = () => axios.get(`${API_URL}/algorithms`, config);

  saveAlgorithm = algorithm => axios.post(`${API_URL}/algorithm`, algorithm, config);

  deleteAlgorithm = algorithmId => axios.delete(`${API_URL}/algorithm/delete/${algorithmId}`, config);

  ApplyAlgorithm = (data, result, algoId, variables) => axios.post(
    `${API_URL}/import/database/test/${result}/${algoId}?variables=${variables}`,
    data,
    config
  );
}
export default new AlgorithmsServices();
