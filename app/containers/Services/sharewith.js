import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

class SharewithServices {
  getUsers = (workspaceId) => axios.get(`${API_URL}/sharewith/workspace/users/${workspaceId}`, config);

  shareWorkspace = (workspaceId, shareWith) => axios.post(`${API_URL}/sharewith/${workspaceId}`, shareWith, config);

  getWorkspaceShared = () => axios.get(`${API_URL}/sharewith/workspace`, config);

  getWorkspaceUsers = (workspaceId) => axios.get(`${API_URL}/sharewith/${workspaceId}`, config);

  deleteUserFromSharing = (workspaceId, email) => axios.delete(`${API_URL}/sharewith/delete/user/${workspaceId}/${email}`, config);
}
export default new SharewithServices();
