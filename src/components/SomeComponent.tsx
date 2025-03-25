import React from 'react';
import { useTheme } from '@/providers/theme-provider';
import { useSidebar } from '@/hooks/use-sidebar';

const SomeComponent = () => {
  const { theme, setTheme } = useTheme();
  const { isMinimized, toggle } = useSidebar();

  return (
    <div>
      <h1>Current Theme: {theme}</h1>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setTheme('system')}>System Mode</button>
      <button onClick={toggle}>
        {isMinimized ? 'Expand Sidebar' : 'Minimize Sidebar'}
      </button>
    </div>
  );
};

export default SomeComponent; 