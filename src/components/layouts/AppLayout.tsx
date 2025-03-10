import { Outlet } from 'react-router-dom';
import { MainNav } from '@/components/shared/MainNav';
import { UserNav } from '@/components/shared/UserNav';
import { MobileNav } from '@/components/shared/MobileNav';
import { Sidebar } from '@/components/shared/Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search will go here */}
            </div>
            <UserNav />
          </div>
        </div>
        <MobileNav />
      </header>

      {/* Main Content */}
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <Sidebar />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
