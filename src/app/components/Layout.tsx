import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext.tsx';

export function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, isStaff, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Переиспользуемый блок навигации
  const NavItems = ({ mobile = false }) => (
      <div className={mobile ? 'flex flex-col gap-2' : 'flex items-center gap-8'}>
        <Link
            to="/#about"
            className="text-foreground hover:text-primary transition-colors py-2 px-1 -mx-1 rounded-md hover:bg-gray-50"
            onClick={closeMenu}
        >
          О клинике
        </Link>
        <Link
            to="/specialists"
            className="text-foreground hover:text-primary transition-colors py-2 px-1 -mx-1 rounded-md hover:bg-gray-50"
            onClick={closeMenu}
        >
          Специалисты
        </Link>

        {isAuthenticated ? (
            <>
              <Link
                  to={isStaff ? '/staff-profile' : '/profile'}
                  className="text-foreground hover:text-primary transition-colors py-2 px-1 -mx-1 rounded-md hover:bg-gray-50"
                  onClick={closeMenu}
              >
                {isStaff ? 'Панель специалиста' : 'Личный кабинет'}
              </Link>
              <button
                  onClick={handleLogout}
                  className="text-foreground hover:text-primary transition-colors py-2 px-1 -mx-1 rounded-md hover:bg-gray-50 text-left w-fit"
              >
                Выход
              </button>
            </>
        ) : (
            <Link
                to="/login"
                className="text-foreground hover:text-primary transition-colors py-2 px-1 -mx-1 rounded-md hover:bg-gray-50"
                onClick={closeMenu}
            >
              Вход
            </Link>
        )}

        {!isStaff && (
            <Link
                to="/join-team"
                className="text-foreground hover:text-primary transition-colors py-2 px-1 -mx-1 rounded-md hover:bg-gray-50"
                onClick={closeMenu}
            >
              Для психологов
            </Link>
        )}
      </div>
  );

  return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-border sticky top-0 z-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
            <Link to="/" className="text-foreground hover:text-primary transition-colors" onClick={closeMenu}>
              <h1 className="text-2xl sm:text-[32px] font-semibold">Клиника</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <NavItems />
            </nav>

            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMenuOpen && (
              <nav className="md:hidden border-t border-border px-4 sm:px-8 py-4 bg-white">
                <NavItems mobile />
              </nav>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
  );
}