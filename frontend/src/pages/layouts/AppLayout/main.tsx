import { Outlet, NavLink } from 'react-router-dom';

export const AppLayout = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-800">TODO List</h1>
            <nav className="flex items-center space-x-4">
              <NavLink to="/" className={linkClass} end>
                Home
              </NavLink>
              <NavLink to="/search" className={linkClass}>
                Search
              </NavLink>
              <NavLink to="/settings/notifications" className={linkClass}>
                Settings
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};
