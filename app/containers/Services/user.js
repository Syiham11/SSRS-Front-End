import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

class UserServices {
  getToken = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: token }
    };
  };

  getAll = () => axios.get(`${API_URL}/administration/getAllUser`, this.getToken());

  getAllDeactivatedUsers = () => axios.get(
    `${API_URL}/administration/getAllDeactivatedUsers`,
    this.getToken()
  );

  getUsersByRange = (firstLimit, lastLimit) => axios.get(
    `${API_URL}/getUsersByRange/${firstLimit}&${lastLimit}`,
    this.getToken()
  );

  getUserData = id => axios.get(`${API_URL}/getuserdata/${id}`, this.getToken());

  delete = id => axios.delete(`${API_URL}/deleteUser/${id}`, this.getToken());

  update = user => axios.post(`${API_URL}/updateUser`, user, this.getToken());

  updateRole = (user, role) => axios.post(
    `${API_URL}/administration/updateUserRole/${role}`,
    user,
    this.getToken()
  );
}
export default new UserServices();
