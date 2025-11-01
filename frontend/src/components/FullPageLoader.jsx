import { useTheme } from '../context/ThemeContext';

const FullPageLoader = () => {
  const { isDark } = useTheme();

  const backgroundClass = isDark ? 'bg-neutral-900' : 'bg-white';

  return (
    <div className={`min-h-screen ${backgroundClass}`}>
      <div className="fixed top-0 left-0 z-50 h-1 w-full overflow-hidden">
        <div className="loading-bar h-full" />
      </div>
    </div>
  );
};

export default FullPageLoader;
