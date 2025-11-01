import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loadUser } from '../store/slices/authSlice';
import FullPageLoader from './FullPageLoader';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !isAuthenticated && !loading) {
      dispatch(loadUser());
    }
  }, [token, isAuthenticated, loading, dispatch]);

  if (loading || (token && !isAuthenticated)) {
    return <FullPageLoader />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
