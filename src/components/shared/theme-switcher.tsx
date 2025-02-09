'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="w-[1.2rem] h-[1.2rem] text-yellow-600 rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
      <Moon className="absolute w-[1.2rem] h-[1.2rem] text-blue-600 rotate-0 scale-1000 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
    </Button>
  );
};

export default ThemeButton;
