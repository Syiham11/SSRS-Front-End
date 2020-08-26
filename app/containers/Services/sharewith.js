import axios from 'axios';
import { API } from '../../config/apiUrl';
const API_URL = API;

class SharewithServices {
  getToken = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: token }
    };
  };

  getUsers = workspaceId => axios.get(
    `${API_URL}/sharewith/workspace/users/${workspaceId}`,
    this.getToken()
  );

  shareWorkspace = (workspaceId, shareWith) => axios.post(
    `${API_URL}/sharewith/${workspaceId}`,
    shareWith,
    this.getToken()
  );

  getWorkspaceShared = () => axios.get(`${API_URL}/sharewith/workspace`, this.getToken());

  getWorkspaceUsers = workspaceId => axios.get(`${API_URL}/sharewith/${workspaceId}`, this.getToken());

  deleteUserFromSharing = (workspaceId, email) => axios.delete(
    `${API_URL}/sharewith/delete/user/${workspaceId}/${email}`,
    this.getToken()
  );
}
export default new SharewithServices();
