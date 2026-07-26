import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerRequestDetailPage from './pages/ManagerRequestDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },

      {
        path: 'login',
        element: <LoginPage />,
      },

      {
        path: 'register',
        element: <RegisterPage />,
      },

      {
        path: 'employee',
        element: (
          <ProtectedRoute allowedRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: 'manager',
        element: (
          <ProtectedRoute allowedRole="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: 'manager/requests/:requestId',
        element: (
          <ProtectedRoute allowedRole="manager">
            <ManagerRequestDetailPage />
          </ProtectedRoute>
        ),
      },

      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);