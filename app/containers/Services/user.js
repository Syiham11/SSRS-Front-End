import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

class UserServices {
  getAll = () => axios.get(`${API_URL}/administration/getAllUser`, config);

  getAllDeactivatedUsers = () => axios.get(`${API_URL}/administration/getAllDeactivatedUsers`, config);

  getUsersByRange = (firstLimit, lastLimit) => axios.get(`${API_URL}/getUsersByRange/${firstLimit}&${lastLimit}`, config);

  getUserData = id => axios.get(`${API_URL}/getuserdata/${id}`, config);

  delete = user => axios.post(`${API_URL}/deleteUser`, user, config);

  update = user => axios.post(`${API_URL}/updateUser`, user, config);

  updateRole = (user, role) => axios.post(
    `${API_URL}/administration/updateUserRole/${role}`,
    user,
    config
  );
}
export default new UserServices();
