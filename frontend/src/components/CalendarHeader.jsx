import { useEffect, useRef, useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Moon,
  Sun,
  ArrowLeft,
  ChevronDown,
  Grid,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CalendarHeader = ({ currentDate, onDateChange, onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  const profileRingStyle = {
    background:
      'conic-gradient(#facc15 0deg 90deg, #ef4444 90deg 180deg, #3b82f6 180deg 270deg, #22c55e 270deg 360deg)',
  };

  const profileAccounts = [
    {
      label: user?.name || 'Primary account',
      email: user?.email,
      avatar: user?.name?.charAt(0).toUpperCase() || 'U',
      color: 'bg-blue-500',
    }
  ];

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePrevMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  const handleProfileToggle = () => {
    setIsProfileOpen((prev) => !prev);
    setIsSearchOpen(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header
      className={`border-b ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-gray-50 border-gray-200'}`}
    >
      {isSearchOpen ? (
        <div className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSearchToggle}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-200'}`}
            >
              <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-neutral-100' : 'text-gray-800'}`} />
            </button>
            <span className={`text-lg font-medium ${isDark ? 'text-neutral-100' : 'text-gray-700'}`}>
              Search
            </span>
          </div>
          <div
            className={`flex items-center space-x-3 rounded-full border px-4 py-2 w-full shadow-sm ${
              isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'
            } sm:max-w-xl`}
          >
            <Search className={`w-5 h-5 ${isDark ? 'text-neutral-400' : 'text-gray-500'}`} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              className={`flex-1 bg-transparent outline-none text-sm ${
                isDark ? 'text-neutral-100 placeholder-neutral-400' : 'text-gray-700 placeholder-gray-500'
              }`}
            />
            <button
              type="button"
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                isDark ? 'bg-neutral-700 text-neutral-200' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button className={`p-2 rounded-full ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-200'}`}>
              <Grid className={`w-5 h-5 ${isDark ? 'text-neutral-300' : 'text-gray-600'}`} />
            </button>
            <div ref={profileRef} className="relative">
              <button
                onClick={handleProfileToggle}
                className="p-[2.5px] rounded-full transition-transform hover:scale-105"
                style={profileRingStyle}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                    isDark ? 'border-neutral-900 bg-neutral-900 text-neutral-100' : 'border-white bg-white text-gray-700'
                  } shadow`}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </button>
              {isProfileOpen && (
                <div
                  className={`absolute right-0 mt-3 w-80 rounded-3xl shadow-xl border overflow-hidden z-50 ${
                    isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div
                    className={`px-6 py-6 text-center ${
                      isDark ? 'bg-neutral-900 text-neutral-100' : 'bg-white text-gray-800'
                    }`}
                  >
                    <div
                      className="mx-auto mb-4 h-20 w-20 rounded-full p-[3px]"
                      style={profileRingStyle}
                    >
                      <div
                        className={`flex h-full w-full items-center justify-center rounded-full text-3xl font-semibold border ${
                          isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-white text-gray-700'
                        }`}
                      >
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="mt-2 text-lg font-semibold">
                      Hi, {user?.name?.split(' ')[0] || 'there'}!
                    </p>
                    {/* <button
                      type="button"
                      className="mt-3 inline-flex items-center justify-center rounded-full border border-blue-400 px-4 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50"
                    >
                      Manage your account
                    </button> */}
                  </div>
                  <div className={isDark ? 'bg-neutral-900 text-neutral-100' : 'bg-white text-gray-800'}>
                    {/* <div className="px-6 py-3 text-left text-sm font-medium">
                      Other accounts
                    </div> */}
                    <div className="space-y-2 px-3 pb-3">
                      {profileAccounts.slice(1).map((account) => (
                        <button
                          key={account.email}
                          type="button"
                          className={`w-full flex items-center space-x-3 rounded-2xl px-3 py-2 text-left transition-colors ${
                            isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white ${account.color}`}
                          >
                            {account.avatar}
                          </span>
                          <span className="flex flex-col">
                            <span className="text-sm font-medium">{account.label}</span>
                            <span className="text-xs text-gray-500 dark:text-neutral-400">
                              {account.email}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                    <div
                      className={`border-t px-6 py-3 space-y-2 ${
                        isDark ? 'border-neutral-800' : 'border-gray-200'
                      }`}
                    >
                      {/* <button
                        type="button"
                        className={`w-full rounded-2xl px-3 py-2 text-sm font-medium text-left ${
                          isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'
                        }`}
                      >
                        Add another account
                      </button> */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={`w-full rounded-2xl px-3 py-2 text-sm font-medium text-left ${
                          isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'
                        }`}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                  <div
                    className={`flex items-center justify-center gap-4 px-6 py-4 text-xs ${
                      isDark ? 'text-neutral-500' : 'text-gray-500'
                    }`}
                  >
                    <button type="button" className="hover:underline">
                      Privacy Policy
                    </button>
                    <span>•</span>
                    <button type="button" className="hover:underline">
                      Terms of Service
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
            {/* Menu and Logo */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleSidebar}
                className={`p-3 rounded-full transition-colors ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}
              >
                <Menu className={`w-6 h-6 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`} />
              </button>
              <div className="hidden md:flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-9 sm:h-9" />
                <span className={`text-lg sm:text-2xl font-light ${isDark ? 'text-neutral-200' : 'text-gray-700'}`}>
                  Calendar
                </span>
              </div>
            </div>

            {/* Today Button */}
            <button
              onClick={handleToday}
              className={`hidden sm:inline-flex px-4 sm:px-6 py-2 border rounded-3xl text-sm font-medium transition-colors ${
                isDark ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-800' : 'border-gray-400 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Today
            </button>

            {/* Navigation */}
            <div className="hidden sm:flex items-center">
              <button
                onClick={handlePrevMonth}
                className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}
                aria-label="Previous month"
              >
                <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={handleNextMonth}
                className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}
                aria-label="Next month"
              >
                <ChevronRight className={`w-5 h-5 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Month and Year */}
            <div className="flex flex-col">
              <h2 className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-neutral-200' : 'text-gray-800'}`}>
              {format(currentDate, 'MMMM yyyy')}
            </h2>
              <div className="flex items-center gap-1 text-xs text-blue-500 sm:hidden">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 rounded-full hover:bg-blue-50 dark:hover:bg-neutral-800"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded-full hover:bg-blue-50 dark:hover:bg-neutral-800"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToday}
                  className="px-2 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-neutral-800"
                >
                  Today
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Icon */}
            <button
              onClick={handleSearchToggle}
              className={`p-3 rounded-full transition-colors ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}
            >
              <Search className={`w-5 h-5 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`} />
            </button>

            {/* Help Icon */}
            <button className={`hidden sm:inline-flex p-3 rounded-full transition-colors ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}>
              <HelpCircle className={`w-5 h-5 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-colors ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-neutral-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Settings Icon */}
            <button className={`hidden sm:inline-flex p-3 rounded-full transition-colors ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}>
              <Settings className={`w-5 h-5 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`} />
            </button>

            {/* User Profile */}
            <div ref={profileRef} className="relative">
              <button
                onClick={handleProfileToggle}
                className="p-[2.5px] rounded-full transition-transform hover:scale-105"
                style={profileRingStyle}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-white text-gray-700'
                  } shadow`}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </button>
              {isProfileOpen && (
                <div
                  className={`absolute right-0 mt-3 w-80 rounded-3xl shadow-xl border overflow-hidden z-50 ${
                    isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div
                    className={`px-6 py-6 text-center ${
                      isDark ? 'bg-neutral-900 text-neutral-100' : 'bg-white text-gray-800'
                    }`}
                  >
                    <div
                      className="mx-auto mb-4 h-20 w-20 rounded-full p-[3px]"
                      style={profileRingStyle}
                    >
                      <div
                        className={`flex h-full w-full items-center justify-center rounded-full text-3xl font-semibold border ${
                          isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-white text-gray-700'
                        }`}
                      >
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="mt-2 text-lg font-semibold">
                      Hi, {user?.name?.split(' ')[0] || 'there'}!
                    </p>
                    {/* <button
                      type="button"
                      className="mt-3 inline-flex items-center justify-center rounded-full border border-blue-400 px-4 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50"
                    >
                      Manage your account
                    </button> */}
                  </div>
                  <div className={isDark ? 'bg-neutral-900 text-neutral-100' : 'bg-white text-gray-800'}>
                    {/* <div className="px-6 py-3 text-left text-sm font-medium">
                      Other accounts
                    </div> */}
                    <div className="space-y-2 px-3 pb-3">
                      {profileAccounts.slice(1).map((account) => (
                        <button
                          key={account.email}
                          type="button"
                          className={`w-full flex items-center space-x-3 rounded-2xl px-3 py-2 text-left transition-colors ${
                            isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white ${account.color}`}
                          >
                            {account.avatar}
                          </span>
                          <span className="flex flex-col">
                            <span className="text-sm font-medium">{account.label}</span>
                            <span className="text-xs text-gray-500 dark:text-neutral-400">
                              {account.email}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                    <div
                      className={`border-t px-6 py-3 space-y-2 ${
                        isDark ? 'border-neutral-800' : 'border-gray-200'
                      }`}
                    >
                      {/* <button
                        type="button"
                        className={`w-full rounded-2xl px-3 py-2 text-sm font-medium text-left ${
                          isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'
                        }`}
                      >
                        Add another account
                      </button> */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={`w-full rounded-2xl px-3 py-2 text-sm font-medium text-left ${
                          isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'
                        }`}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                  <div
                    className={`flex items-center justify-center gap-4 px-6 py-4 text-xs ${
                      isDark ? 'text-neutral-500' : 'text-gray-500'
                    }`}
                  >
                    <button type="button" className="hover:underline">
                      Privacy Policy
                    </button>
                    <span>•</span>
                    <button type="button" className="hover:underline">
                      Terms of Service
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default CalendarHeader;
