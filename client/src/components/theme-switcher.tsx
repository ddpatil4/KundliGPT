import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Star, Crown } from 'lucide-react';

type Theme = 'golden' | 'cosmic' | 'royal' | 'traditional';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themes = {
  golden: { name: 'Golden', icon: Sun },
  cosmic: { name: 'Cosmic', icon: Star },
  royal: { name: 'Royal', icon: Crown },
  traditional: { name: 'Traditional', icon: Moon }
};

export default function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const CurrentIcon = themes[currentTheme]?.icon || Sun;

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
          {themes[currentTheme]?.name || 'Golden'}
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