import { createBrowserRouter, redirect, RouterProvider } from 'react-router';
import TodosPage from './pages/TodosPage';
import ProfilePage from './pages/ProfilePage';

import HomePageLayout from './layout/HomePageLayout';
import Authorization from './layout/Authorization';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegistrationForm/RegistrationForm';

const router = createBrowserRouter([
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
  return <RouterProvider router={router} />;
}

export default App;
