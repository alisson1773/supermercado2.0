import React, { createContext, useContext, useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { User, CartItem, Product, Order } from './types';
import { StorageService } from './services/storage';
import { Layout } from './components/Layout';
import { Button, Input, StatusBadge } from './components/UIComponents';
import { CATEGORIES, PRODUCTS } from './services/mockData';
import { ChevronRight, Minus, Plus, ShoppingBag, Trash2, ArrowLeft, Search, MapPin } from 'lucide-react';

// --- CONTEXT DEFINITIONS ---

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

// --- PAGES ---

// 1. LOGIN
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const isAdmin = email.includes('admin');
      const user: User = {
        id: isAdmin ? 'admin1' : 'user1',
        name: isAdmin ? 'Administrador' : 'João da Silva',
        email,
        role: isAdmin ? 'admin' : 'customer',
        address: 'Rua das Flores, 123',
        phone: '(11) 99999-9999'
      };
      
      StorageService.saveUser(user);
      setLoading(false);
      navigate(isAdmin ? '/admin' : '/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-8 max-w-md mx-auto shadow-xl">
      <div className="mb-10 text-center">
        <div className="bg-primary-500 w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <ShoppingBag className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">FreshMarket</h1>
        <p className="text-gray-500 mt-2">Suas compras em minutos</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <Input 
          label="E-mail" 
          type="email" 
          placeholder="seu@email.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <Input 
          label="Senha" 
          type="password" 
          placeholder="********" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <Button type="submit" fullWidth isLoading={loading}>
          Entrar
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Use <strong>admin@freshmarket.com</strong> para acessar o painel.</p>
      </div>
    </div>
  );
};

// 2. HOME
const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout title="Olá, João 👋">
      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="O que você procura hoje?" 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div>
          <h2 className="font-bold text-gray-800 mb-3 text-lg">Categorias</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
             <button 
                onClick={() => setSelectedCategory('all')}
                className={`flex-shrink-0 flex flex-col items-center gap-2 w-20 ${selectedCategory === 'all' ? 'opacity-100' : 'opacity-60'}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedCategory === 'all' ? 'bg-primary-100 ring-2 ring-primary-500' : 'bg-gray-100'}`}>
                  <span className="text-xs font-bold">TODOS</span>
                </div>
              </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 w-20 ${selectedCategory === cat.id ? 'opacity-100' : 'opacity-60'}`}
              >
                <img src={cat.image} alt={cat.name} className={`w-16 h-16 rounded-full object-cover ${selectedCategory === cat.id ? 'ring-2 ring-primary-500' : ''}`} />
                <span className="text-xs font-medium truncate w-full text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
           <h2 className="font-bold text-gray-800 mb-3 text-lg">Destaques</h2>
           <div className="grid grid-cols-2 gap-4">
             {filteredProducts.map(product => (
               <ProductCard key={product.id} product={product} />
             ))}
           </div>
        </div>
      </div>
    </Layout>
  );
};

// COMPONENT: Product Card
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col cursor-pointer active:scale-95 transition-transform"
    >
      <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[2.5em]">{product.name}</h3>
      <p className="text-xs text-gray-500 mb-2">{product.description}</p>
      <div className="mt-auto flex items-center justify-between">
        <span className="font-bold text-primary-600">R$ {product.price.toFixed(2)}</span>
        <div className="bg-primary-50 p-1.5 rounded-full text-primary-600">
          <Plus size={16} />
        </div>
      </div>
    </div>
  );
};

// 3. PRODUCT DETAILS
const ProductDetails = () => {
  const { id: productId } = useParams();
  
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | undefined>();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Simulate fetching
    const p = PRODUCTS.find(x => x.id === productId);
    setProduct(p);
  }, [productId]);

  if (!product) return <div className="p-10 text-center">Carregando...</div>;

  const handleAdd = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <Layout showNav={false}>
       <div className="relative h-72">
         <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg z-10">
           <ArrowLeft size={20} />
         </button>
         <img src={product.image} className="w-full h-full object-cover" />
       </div>
       <div className="p-6 -mt-6 bg-white rounded-t-3xl relative z-10 min-h-[50vh]">
         <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
         
         <div className="flex justify-between items-start mb-4">
           <div>
             <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
             <p className="text-gray-500">{product.unit}</p>
           </div>
           <span className="text-2xl font-bold text-primary-600">R$ {product.price.toFixed(2)}</span>
         </div>

         <p className="text-gray-600 leading-relaxed mb-8">
           {product.longDescription}
         </p>

         <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-xl">
           <span className="font-medium text-gray-700">Quantidade</span>
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setQuantity(Math.max(1, quantity - 1))}
               className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600"
             >
               <Minus size={16} />
             </button>
             <span className="text-lg font-bold w-4 text-center">{quantity}</span>
             <button 
               onClick={() => setQuantity(quantity + 1)}
               className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200"
             >
               <Plus size={16} />
             </button>
           </div>
         </div>

         <Button fullWidth onClick={handleAdd}>
           Adicionar R$ {(product.price * quantity).toFixed(2)}
         </Button>
       </div>
    </Layout>
  );
};

// 4. CART
const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <Layout title="Meu Carrinho">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
             <ShoppingBag className="text-gray-400 w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-6">Parece que você ainda não escolheu seus produtos.</p>
          <Button variant="outline" onClick={() => navigate('/')}>Começar a comprar</Button>
        </div>
      ) : (
        <div className="p-4 pb-32">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <img src={item.image} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1 flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                     <h3 className="font-medium text-gray-800 line-clamp-1">{item.name}</h3>
                     <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                       <Trash2 size={16} />
                     </button>
                   </div>
                   <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)} / {item.unit}</p>
                   <div className="flex justify-between items-center mt-2">
                     <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 bg-gray-100 rounded text-gray-600"><Minus size={14} /></button>
                        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 bg-gray-100 rounded text-gray-600"><Plus size={14} /></button>
                     </div>
                     <span className="font-bold text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-100">
             <div className="flex justify-between items-center mb-4">
               <span className="text-gray-500">Total</span>
               <span className="text-2xl font-bold text-gray-900">R$ {cartTotal.toFixed(2)}</span>
             </div>
             <Button fullWidth onClick={() => navigate('/checkout')}>Finalizar Pedido</Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

// 5. CHECKOUT
const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const user = StorageService.getUser();
  
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if(!user) return;
    setLoading(true);

    const order: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        image: item.image
      })),
      total: cartTotal,
      status: 'received',
      createdAt: new Date().toISOString(),
      shippingAddress: {
        address,
        phone
      }
    };

    await StorageService.createOrder(order);
    clearCart();
    setLoading(false);
    navigate('/orders');
  };

  return (
    <Layout title="Finalizar Pedido" showNav={false}>
      <div className="p-4 space-y-6">
        {/* Address Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-primary-600">
            <MapPin size={20} />
            <h2 className="font-bold">Endereço de Entrega</h2>
          </div>
          <div className="space-y-4">
            <Input label="Endereço Completo" value={address} onChange={e => setAddress(e.target.value)} />
            <Input label="Telefone para contato" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>

        {/* Payment Mock */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <h2 className="font-bold mb-4 text-gray-800">Forma de Pagamento</h2>
           <div className="p-3 border border-primary-200 bg-primary-50 rounded-lg flex items-center justify-between">
             <span className="font-medium text-primary-900">Pagamento na entrega</span>
             <div className="w-4 h-4 rounded-full bg-primary-600 border-2 border-white ring-2 ring-primary-200"></div>
           </div>
           <p className="text-xs text-gray-500 mt-2">Aceitamos dinheiro ou cartão.</p>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 rounded-xl">
           <h3 className="font-bold text-gray-700 mb-3">Resumo</h3>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between text-gray-600">
               <span>Subtotal ({cart.length} itens)</span>
               <span>R$ {cartTotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-gray-600">
               <span>Taxa de entrega</span>
               <span>Grátis</span>
             </div>
             <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg text-gray-900">
               <span>Total</span>
               <span>R$ {cartTotal.toFixed(2)}</span>
             </div>
           </div>
        </div>

        <Button fullWidth onClick={handleFinish} isLoading={loading}>
          Confirmar Pedido
        </Button>
      </div>
    </Layout>
  );
};

// 6. ORDERS LIST (Customer)
const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const user = StorageService.getUser();

  useEffect(() => {
    const fetchOrders = async () => {
      const all = await StorageService.getOrders();
      setOrders(all.filter(o => o.userId === user?.id));
    };
    fetchOrders();
  }, [user]);

  return (
    <Layout title="Meus Pedidos">
      <div className="p-4 space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Nenhum pedido realizado ainda.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">Pedido #{order.id}</h3>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="border-t border-b border-gray-50 py-3 my-3 space-y-2">
                 {order.items.map((item, idx) => (
                   <div key={idx} className="flex justify-between text-sm text-gray-600">
                     <span>{item.quantity}x {item.name}</span>
                     <span>R$ {item.subtotal.toFixed(2)}</span>
                   </div>
                 ))}
              </div>
              <div className="flex justify-between items-center font-bold text-gray-900">
                <span>Total</span>
                <span>R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

// 7. ADMIN DASHBOARD
const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const all = await StorageService.getOrders();
    setOrders(all);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await StorageService.updateOrderStatus(orderId, newStatus as any);
    await fetchOrders();
  };

  return (
    <Layout title="Painel Administrativo" showNav={true}>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pedidos Recentes</h2>
        {orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-xl shadow border border-gray-200">
             <div className="flex justify-between mb-2">
               <span className="font-bold text-lg">#{order.id}</span>
               <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</span>
             </div>
             <p className="text-sm text-gray-600 mb-1"><strong>Cliente:</strong> {order.userName}</p>
             <p className="text-sm text-gray-600 mb-3"><strong>Endereço:</strong> {order.shippingAddress.address}</p>
             
             <div className="bg-gray-50 p-3 rounded-lg mb-3">
               <p className="text-xs font-bold text-gray-500 uppercase mb-2">Itens</p>
               {order.items.map((item, i) => (
                 <p key={i} className="text-sm flex justify-between">
                   <span>{item.quantity}x {item.name}</span>
                   <span>R$ {item.subtotal.toFixed(2)}</span>
                 </p>
               ))}
               <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                 <span>Total</span>
                 <span>R$ {order.total.toFixed(2)}</span>
               </div>
             </div>

             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Atualizar Status</label>
               <select 
                 value={order.status}
                 onChange={(e) => handleStatusChange(order.id, e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm"
               >
                 <option value="received">Recebido</option>
                 <option value="picking">Em Separação</option>
                 <option value="shipping">A Caminho</option>
                 <option value="delivered">Entregue</option>
               </select>
             </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

// --- APP ROOT ---

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('freshmarket_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('freshmarket_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const user = StorageService.getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </CartProvider>
  );
}