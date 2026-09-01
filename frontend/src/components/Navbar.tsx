import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Generate' },
  { path: '/generations', label: 'My Generations' },
] as const;

export function Navbar() {

  return (
    <nav className="sticky top-0 z-40 w-full bg-background-primary/80 backdrop-blur-lg border-b border-border">
      <div className="container-main">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-text-primary hover:opacity-80 transition-opacity" aria-label="ImagineAI Home">
            <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#0B0D12"/>
              <path d="M8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16Z" stroke="#8B5CF6" strokeWidth="2"/>
              <path d="M16 8V16L21 20" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-semibold tracking-tight">ImagineAI</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-accent-primary bg-accent-primary/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-card'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}