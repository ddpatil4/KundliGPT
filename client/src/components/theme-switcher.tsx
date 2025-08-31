import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themes = {
  light: { name: 'Light', icon: Sun },
  dark: { name: 'Dark', icon: Moon },
  system: { name: 'System', icon: Monitor }
};

export default function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const CurrentIcon = themes[currentTheme].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          data-testid="theme-switcher"
        >
          <CurrentIcon className="h-4 w-4" />
          {themes[currentTheme].name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(themes).map(([key, theme]) => {
          const Icon = theme.icon;
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => onThemeChange(key as Theme)}
              className={`gap-2 ${currentTheme === key ? 'bg-accent' : ''}`}
              data-testid={`theme-${key}`}
            >
              <Icon className="h-4 w-4" />
              {theme.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}