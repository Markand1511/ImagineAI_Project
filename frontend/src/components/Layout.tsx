import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <footer className="border-t border-border py-8">
        <div className="container-main">
          <p className="text-center text-text-muted text-sm">
            ImagineAI - Create images from your ideas
          </p>
        </div>
      </footer>
    </div>
  );
}