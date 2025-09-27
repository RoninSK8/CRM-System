import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import TodosPage from './pages/TodosPage';
import ProfilePage from './pages/ProfilePage';

import HomePageLayout from './layout/HomePageLayout';
import Authorization from './layout/Authorization';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegistrationForm/RegistrationForm';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ProtectedRoute from './components/ProtectedRoute';
import UsersPage from './pages/UsersPage';
import RequireRole from './components/RequireRole';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <HomePageLayout />,
        children: [
          {
            index: true,
            loader: async () => redirect('/todos'),
          },
          {
            path: '/todos',
            element: <TodosPage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/users',
            element: <RequireRole />,
            children: [{ index: true, element: <UsersPage /> }],
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <Authorization />,
    children: [
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'register',
        element: <RegisterForm />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
