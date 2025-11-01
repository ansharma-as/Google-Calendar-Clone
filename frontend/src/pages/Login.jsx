import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../store/slices/authSlice';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const { isDark } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/calendar');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.type === 'auth/login/fulfilled') {
      navigate('/calendar');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <div
        className={`max-w-md w-full space-y-8 p-8 rounded-lg shadow-md ${
          isDark ? 'bg-neutral-800 border border-neutral-700 text-neutral-100' : 'bg-white text-gray-900'
        }`}
      >
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDark ? 'text-neutral-100' : 'text-gray-900'}`}>
            Sign in to Calendar
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className={`rounded-md p-4 ${
                isDark ? 'bg-red-900/30 border border-red-800/60 text-red-300' : 'bg-red-50 text-red-700'
              }`}
            >
              <div className="text-sm">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                  isDark
                    ? 'border-neutral-600 bg-neutral-900 text-neutral-100 placeholder-neutral-500'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                  isDark
                    ? 'border-neutral-600 bg-neutral-900 text-neutral-100 placeholder-neutral-500'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark ? 'focus:ring-offset-2 focus:ring-offset-neutral-900' : 'focus:ring-offset-2 focus:ring-offset-gray-50'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className={`font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
