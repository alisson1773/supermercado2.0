import React from 'react';
import { Home, ShoppingCart, User as UserIcon, List, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context'; 
import { StorageService } from '../services/storage';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  title?: string;
  showBack?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const user = StorageService.getUser();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path ? 'text-primary-600' : 'text-gray-400';

  const handleLogout = () => {
    StorageService.logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="max-w-md w-full mx-auto h-full bg-white shadow-2xl relative flex flex-col">
        {/* Header */}
        <header className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
            <h1 className="text-lg font-bold text-gray-800 truncate">{title || 'FreshMarket'}</h1>
            {user && (
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
                <LogOut size={20} />
              </button>
            )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth no-scrollbar pb-20">
          {children}
        </main>

        {/* Bottom Nav */}
        {showNav && user?.role === 'customer' && (
          <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-20">
            <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/')}`}>
              <Home size={24} />
              <span className="text-[10px] font-medium">Início</span>
            </Link>
            
            <Link to="/orders" className={`flex flex-col items-center gap-1 ${isActive('/orders')}`}>
              <List size={24} />
              <span className="text-[10px] font-medium">Pedidos</span>
            </Link>

            <Link to="/cart" className={`flex flex-col items-center gap-1 relative ${isActive('/cart')}`}>
              <div className="relative">
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">Carrinho</span>
            </Link>
          </nav>
        )}

        {showNav && user?.role === 'admin' && (
           <nav className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-800 px-6 py-3 flex justify-around items-center z-20">
             <span className="text-sm font-bold">Painel Administrativo</span>
             <Link to="/admin" className="bg-gray-800 px-4 py-1 rounded-full text-xs">Atualizar</Link>
           </nav>
        )}
      </div>
    </div>
  );
};