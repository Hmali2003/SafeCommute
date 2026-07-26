import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export default function ProtectedRoute({ children, allowedRole }) {
  const { session, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (session) {
      api.get('/api/auth/me')
        .then(({ data }) => setRole(data.role))
        .finally(() => setRoleLoading(false));
    } else {
      setRoleLoading(false);
    }
  }, [session]);

  if (loading || roleLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;

  return children;
}