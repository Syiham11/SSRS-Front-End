import Loadable from 'react-loadable';
import Loading from 'dan-components/Loading';

export const MainDashboard = Loadable({
  loader: () => import('./Pages/MainDashboard'),
  loading: Loading,
});
export const Profile = Loadable({
  loader: () => import('./Pages/MyProfile'),
  loading: Loading,
});
export const ControlPanel = Loadable({
  loader: () => import('./Pages/ControlPanel'),
  loading: Loading,
});
export const Import = Loadable({
  loader: () => import('./Pages/Import'),
  loading: Loading,
});
export const WorkspacePage = Loadable({
  loader: () => import('./Pages/Workspace'),
  loading: Loading,
});
export const Form = Loadable({
  loader: () => import('./Pages/Forms/ReduxForm'),
  loading: Loading,
});
export const Table = Loadable({
  loader: () => import('./Pages/Table/BasicTable'),
  loading: Loading,
});
export const Login = Loadable({
  loader: () => import('./Pages/Users/Login'),
  loading: Loading,
});
export const LoginDedicated = Loadable({
  loader: () => import('./Pages/Standalone/LoginDedicated'),
  loading: Loading,
});
export const Register = Loadable({
  loader: () => import('./Pages/Users/Register'),
  loading: Loading,
});
export const ResetPassword = Loadable({
  loader: () => import('./Pages/Users/ResetPassword'),
  loading: Loading,
});
export const NotFound = Loadable({
  loader: () => import('./NotFound/NotFound'),
  loading: Loading,
});
export const NotFoundDedicated = Loadable({
  loader: () => import('./Pages/Standalone/NotFoundDedicated'),
  loading: Loading,
});
export const Error = Loadable({
  loader: () => import('./Pages/Error'),
  loading: Loading,
});
export const Maintenance = Loadable({
  loader: () => import('./Pages/Maintenance'),
  loading: Loading,
});
export const ComingSoon = Loadable({
  loader: () => import('./Pages/ComingSoon'),
  loading: Loading,
});
export const Parent = Loadable({
  loader: () => import('./Parent'),
  loading: Loading,
});
