import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@/store/themeSlice'; // Import the setTheme action
import { RootState } from '@/store/store';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme); // Get theme from Redux

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    dispatch(setTheme(newTheme)); // Dispatch action to update theme
  };

  return (
    <div>
      {children}
      {/* You can add a button or toggle to change the theme */}
      <button onClick={() => changeTheme('light')}>Light Mode</button>
      <button onClick={() => changeTheme('dark')}>Dark Mode</button>
      <button onClick={() => changeTheme('system')}>System Mode</button>
    </div>
  );
}

// Define and export the useTheme hook
export const useTheme = () => {
  const context = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();

  const setThemeValue = (theme: Theme) => {
    dispatch(setTheme(theme));
  };

  return { theme: context, setTheme: setThemeValue };
};
