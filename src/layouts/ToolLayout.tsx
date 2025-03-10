import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

const toolNavItems = [
  {
    title: 'Tools',
    items: [
      { title: 'All Tools', href: '/tool', icon: 'LayoutGrid' },
      { title: 'White Noise', href: '/tool/white-noise', icon: 'Volume2' },
      { title: 'Pomodoro', href: '/tool/pomodoro', icon: 'Timer' },
      { title: 'Sleep Sounds', href: '/tool/sleep-sounds', icon: 'Moon' },
      { title: 'Meditation', href: '/tool/meditation', icon: 'Sparkles' },
      { title: 'Breathwork', href: '/tool/breathwork', icon: 'Wind' },
      { title: 'Journal', href: '/tool/journal', icon: 'BookOpen' },
    ],
  },
];

export default function ToolLayout() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar items={toolNavItems} />
        <div className="flex-1">
          <MobileNav items={toolNavItems} />
          <main className="container mx-auto py-6">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
