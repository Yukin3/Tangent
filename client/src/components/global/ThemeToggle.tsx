import { IconSun, IconMoon, IconBulb } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('bright');
    } else {
      setTheme('dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-8 w-8"
      onClick={cycleTheme}
    >
      <IconSun 
        className={`h-4 w-4 transition-all ${
          theme === 'bright' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        } absolute`} 
      />
      <IconMoon 
        className={`h-4 w-4 transition-all ${
          theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        } absolute`} 
      />
      <IconBulb 
        className={`h-4 w-4 transition-all ${
          theme === 'light' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        } absolute`} 
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 