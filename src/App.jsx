import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Plus, AlertCircle, Package, Users, FileText, TrendingUp, DollarSign, ShoppingCart, LogOut, Menu, X, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  'https://jgvniuntknkumupzubbt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impndm5pdW50a25rdW11cHp1YmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NDE3MjEsImV4cCI6MjA4MTExNzcyMX0.jXu6kaYMmLGXztrelEMrrinwqCSHZTaH_ybdWfnsf_M'
);

// Main App Component
export default function InventoryManagementApp() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [saleType, setSaleType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('dashboard');
    setSaleType(null);
  };

  const handleNewSale = (type) => {
    setSaleType(type);
    setCurrentView('new-sale');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage setUser={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        user={user} 
        currentView={currentView} 
        setCurrentView={(view) => {
          setCurrentView(view);
          if (view !== 'new-sale') setSaleType(null);
        }}
        handleLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ViewRenderer 
          view={currentView} 
          user={user}
          setCurrentView={setCurrentView}
          saleType={saleType}
          setSaleType={setSaleType}
          handleNewSale={handleNewSale}
        />
      </main>
    </div>
  );
}

// Login Page Component
function LoginPage({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (dbError || !data) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      if (data.password_hash === password) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Package className="h-12 w-12 text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">Surya's Auto Parts</h1>
          <p className="text-gray-600 mt-1">Inventory Management System</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-10"
                placeholder="Enter password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !username || !password}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-2">Default Admin Credentials:</p>
          <div className="text-xs text-blue-700">
            <p>Username: <strong>admin</strong></p>
            <p>Password: <strong>admin123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Component
function Navigation({ user, currentView, setCurrentView, handleLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, roles: ['admin', 'sales_rep'] },
    { id: 'new-sale', label: 'New Sale', icon: ShoppingCart, roles: ['admin', 'sales_rep'] },
    { id: 'products', label: 'Products', icon: Package, roles: ['admin', 'sales_rep'] },
    { id: 'customers', label: 'Customers', icon: Users, roles: ['admin', 'sales_rep'] },
    { id: 'garages', label: 'Garages', icon: FileText, roles: ['admin', 'sales_rep'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin'] },
    { id: 'expenses', label: 'Expenses', icon: DollarSign, roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Surya's Auto Parts</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {filteredMenu.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {user.username} ({user.role === 'admin' ? 'Admin' : 'Sales Rep'})
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {filteredMenu.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="px-4 py-2 text-sm text-gray-600">
                {user.username} ({user.role === 'admin' ? 'Admin' : 'Sales Rep'})
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// View Renderer Component
function ViewRenderer({ view, user, setCurrentView, saleType, setSaleType, handleNewSale }) {
  switch (view) {
    case 'dashboard':
      return <Dashboard user={user} setCurrentView={setCurrentView} handleNewSale={handleNewSale} />;
    case 'new-sale':
      return <NewSale saleType={saleType} setSaleType={setSaleType} setCurrentView={setCurrentView} />;
    case 'products':
      return <Products user={user} />;
    case 'customers':
      return <Customers user={user} />;
    case 'garages':
      return <Garages user={user} />;
    case 'reports':
      return <Reports user={user} />;
    case 'expenses':
      return <Expenses user={user} />;
    default:
      return <Dashboard user={user} setCurrentView={setCurrentView} handleNewSale={handleNewSale} />;
  }
}

// Dashboard Component
function Dashboard({ user, setCurrentView, handleNewSale }) {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayAmount: 0,
    lowStockCount: 0,
    pendingPayments: 0,
    totalOutstanding: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Fetch today's sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('total, sale_date')
        .gte('sale_date', todayISO);

      if (salesError) {
        console.error('Sales error:', salesError);
      }

      // Fetch ALL products to check stock levels
      const { data: allProducts, error: productsError } = await supabase
        .from('products')
        .select('id, current_quantity, minimum_quantity');

      if (productsError) {
        console.error('Products error:', productsError);
      }

      // Filter low stock products in JavaScript
      const lowStockProducts = allProducts?.filter(p => 
        p.current_quantity <= p.minimum_quantity
      ) || [];

      console.log('Today sales:', salesData);
      console.log('Low stock products:', lowStockProducts);

      setStats({
        todaySales: salesData?.length || 0,
        todayAmount: salesData?.reduce((sum, s) => sum + parseFloat(s.total), 0) || 0,
        lowStockCount: lowStockProducts.length,
        pendingPayments: 0,
        totalOutstanding: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Sales Rep focused dashboard
  if (user.role === 'sales_rep') {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
            <p className="text-gray-600 mt-1">Ready to make some sales today?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Today's Sales"
            value={stats.todaySales}
            subtitle={`₹${stats.todayAmount.toLocaleString('en-IN')}`}
            icon={ShoppingCart}
            color="blue"
          />
          <StatCard
            title="Low Stock Alerts"
            value={stats.lowStockCount}
            subtitle="Items need reorder"
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            title="Pending Payments"
            value={stats.pendingPayments}
            subtitle="To collect"
            icon={DollarSign}
            color="yellow"
          />
        </div>

        {stats.lowStockCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
                <p className="text-sm text-red-700">
                  {stats.lowStockCount} products are running low. Check with admin for reordering.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <ShoppingCart className="h-16 w-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Create New Sale</h2>
            <p className="text-blue-100">Choose the type of sale to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleNewSale('quick')}
              className="bg-white hover:bg-gray-50 rounded-lg p-6 transition-all transform hover:scale-105 shadow-md"
            >
              <ShoppingCart className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Quick Sale</h3>
              <p className="text-sm text-gray-600">Walk-in customer</p>
            </button>
            <button
              onClick={() => handleNewSale('customer')}
              className="bg-white hover:bg-gray-50 rounded-lg p-6 transition-all transform hover:scale-105 shadow-md"
            >
              <Users className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Customer Sale</h3>
              <p className="text-sm text-gray-600">Regular customer</p>
            </button>
            <button
              onClick={() => handleNewSale('garage')}
              className="bg-white hover:bg-gray-50 rounded-lg p-6 transition-all transform hover:scale-105 shadow-md"
            >
              <FileText className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Garage Sale</h3>
              <p className="text-sm text-gray-600">Direct to garage</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome back, {user.username}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Sales"
          value={stats.todaySales}
          subtitle={`₹${stats.todayAmount.toLocaleString('en-IN')}`}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockCount}
          subtitle="Items need reorder"
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          subtitle="Customers/Garages"
          icon={DollarSign}
          color="yellow"
        />
        <StatCard
          title="Total Outstanding"
          value={`₹${stats.totalOutstanding.toLocaleString('en-IN')}`}
          subtitle="Pending collections"
          icon={TrendingUp}
          color="green"
        />
      </div>

      {stats.lowStockCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
              <p className="text-sm text-red-700">
                {stats.lowStockCount} products are running low on stock. Please reorder soon.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <button
          onClick={() => handleNewSale('quick')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:shadow-lg transition-all"
        >
          <ShoppingCart className="h-10 w-10 mb-3" />
          <h3 className="font-bold text-lg mb-1">New Sale</h3>
          <p className="text-sm text-blue-100">Create a new transaction</p>
        </button>
        <button
          onClick={() => setCurrentView('products')}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 hover:shadow-lg transition-all"
        >
          <Package className="h-10 w-10 mb-3" />
          <h3 className="font-bold text-lg mb-1">Manage Products</h3>
          <p className="text-sm text-green-100">Add or update inventory</p>
        </button>
        <button
          onClick={() => setCurrentView('reports')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:shadow-lg transition-all"
        >
          <TrendingUp className="h-10 w-10 mb-3" />
          <h3 className="font-bold text-lg mb-1">View Reports</h3>
          <p className="text-sm text-purple-100">Analyze business data</p>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🎉 Sales System Now Live!</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-green-900 font-medium">✓ Product Management</span>
            <span className="text-xs text-green-700">Working</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-green-900 font-medium">✓ Sales System</span>
            <span className="text-xs text-green-700">New!</span>
          </div>
          <p className="text-sm text-gray-600 pt-3">
            Create sales, generate bills, and manage inventory in real-time!
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{subtitle}</div>
    </div>
  );
}

// NewSale Component with full functionality
function NewSale({ saleType, setSaleType, setCurrentView }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMode, setPaymentMode] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [amountPaid, setAmountPaid] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [saleData, setSaleData] = useState(null);

  useEffect(() => {
    if (saleType) {
      fetchProducts();
    }
  }, [saleType]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('current_quantity', 0)
        .order('name');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const filtered = products.filter(p => 
        p.sku.toLowerCase().includes(term.toLowerCase()) ||
        p.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.current_quantity) {
        alert('Cannot add more than available stock!');
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = cart.find(item => item.id === productId);
    if (newQuantity > product.current_quantity) {
      alert('Cannot exceed available stock!');
      return;
    }
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalGst = 0;

    cart.forEach(item => {
      const itemTotal = item.selling_price * item.quantity;
      const itemGst = (itemTotal * item.gst_rate) / 100;
      subtotal += itemTotal;
      totalGst += itemGst;
    });

    return {
      subtotal: subtotal.toFixed(2),
      gst: totalGst.toFixed(2),
      total: (subtotal + totalGst).toFixed(2)
    };
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert('Please add products to cart');
      return;
    }

    if ((paymentStatus === 'partial' || paymentStatus === 'credit') && !amountPaid) {
      alert('Please enter amount paid');
      return;
    }

    setLoading(true);
    try {
      const totals = calculateTotals();
      const saleNumber = `SALE${Date.now()}`;
      
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{
          sale_number: saleNumber,
          sale_type: saleType,
          subtotal: parseFloat(totals.subtotal),
          gst_amount: parseFloat(totals.gst),
          total: parseFloat(totals.total),
          payment_mode: paymentMode,
          payment_status: paymentStatus,
          amount_paid: paymentStatus === 'paid' ? parseFloat(totals.total) : parseFloat(amountPaid || 0)
        }])
        .select()
        .single();

      if (saleError) throw saleError;

      const saleItems = cart.map(item => ({
        sale_id: sale.id,
        product_id: item.id,
        product_sku: item.sku,
        product_name: item.name,
        quantity: item.quantity,
        price: item.selling_price,
        gst_rate: item.gst_rate,
        gst_amount: ((item.selling_price * item.quantity * item.gst_rate) / 100),
        total: item.selling_price * item.quantity * (1 + item.gst_rate / 100)
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      for (const item of cart) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            current_quantity: item.current_quantity - item.quantity 
          })
          .eq('id', item.id);

        if (updateError) throw updateError;
      }

      setSaleData({
        ...sale,
        items: cart,
        totals
      });
      setShowBill(true);
      
    } catch (error) {
      console.error('Error completing sale:', error);
      alert('Failed to complete sale: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSale = () => {
    setCart([]);
    setSearchTerm('');
    setSearchResults([]);
    setPaymentMode('cash');
    setPaymentStatus('paid');
    setAmountPaid('');
    setShowBill(false);
    setSaleData(null);
    fetchProducts();
  };

  if (!saleType) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">New Sale</h2>
        <p className="text-gray-600 mb-6">Select the type of sale you want to create:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSaleType('quick')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <ShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Quick Sale</h3>
            <p className="text-sm text-gray-600">Walk-in customer, no profile needed</p>
          </button>
          <button
            onClick={() => setSaleType('customer')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Customer Sale</h3>
            <p className="text-sm text-gray-600">Regular customer with profile</p>
          </button>
          <button
            onClick={() => setSaleType('garage')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <FileText className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Garage Sale</h3>
            <p className="text-sm text-gray-600">Direct sale to garage</p>
          </button>
        </div>
      </div>
    );
  }

  if (showBill && saleData) {
    return <BillView saleData={saleData} onClose={() => setCurrentView('dashboard')} onNewSale={() => {
      resetSale();
      setSaleType(saleType);
    }} />;
  }

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {saleType === 'quick' && 'Quick Sale'}
              {saleType === 'customer' && 'Customer Sale'}
              {saleType === 'garage' && 'Garage Sale'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {saleType === 'quick' && 'Walk-in customer - no profile needed'}
              {saleType === 'customer' && 'Sale to registered customer'}
              {saleType === 'garage' && 'Direct sale to garage'}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Products</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by SKU or product name..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {searchResults.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="w-full p-3 hover:bg-gray-50 flex justify-between items-center border-b last:border-b-0"
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">SKU: {product.sku} | Stock: {product.current_quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">₹{product.selling_price}</div>
                      <div className="text-xs text-gray-500">GST: {product.gst_rate}%</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart ({cart.length} items)</h3>
            
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No items in cart. Search and add products above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => {
                  const itemTotal = item.selling_price * item.quantity;
                  const itemGst = (itemTotal * item.gst_rate) / 100;
                  return (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.current_quantity}
                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                          <span className="text-sm text-gray-500">
                            (Max: {item.current_quantity})
                          </span>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ₹{(itemTotal + itemGst).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Base: ₹{itemTotal.toFixed(2)} + GST: ₹{itemGst.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>₹{totals.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>GST:</span>
                <span>₹{totals.gst}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>₹{totals.total}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI/Google Pay</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="paid">Paid</option>
                  <option value="partial">Partial Payment</option>
                  <option value="credit">Credit (Pay Later)</option>
                </select>
              </div>

              {(paymentStatus === 'partial' || paymentStatus === 'credit') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="Enter amount paid"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {amountPaid && (
                    <p className="mt-1 text-sm text-gray-600">
                      Remaining: ₹{(parseFloat(totals.total) - parseFloat(amountPaid || 0)).toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleCompleteSale}
              disabled={loading || cart.length === 0}
              className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Complete Sale & Print Bill'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bill View Component
function BillView({ saleData, onClose, onNewSale }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #bill, #bill * {
            visibility: visible;
          }
          #bill {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="bg-white rounded-lg shadow-lg p-8" id="bill">
        <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Surya's Auto Parts</h1>
          <p className="text-gray-600 mt-1">Automobile Spare Parts</p>
          <p className="text-sm text-gray-500 mt-2">
            Invoice #: {saleData.sale_number} | Date: {new Date(saleData.sale_date).toLocaleString('en-IN')}
          </p>
        </div>

        <table className="w-full mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-center">Qty</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-right">GST</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {saleData.items.map((item, index) => {
              const itemTotal = item.selling_price * item.quantity;
              const itemGst = (itemTotal * item.gst_rate) / 100;
              return (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">SKU: {item.sku}</div>
                  </td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">₹{item.selling_price}</td>
                  <td className="px-4 py-3 text-right">₹{itemGst.toFixed(2)} ({item.gst_rate}%)</td>
                  <td className="px-4 py-3 text-right font-medium">₹{(itemTotal + itemGst).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>₹{saleData.totals.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>GST:</span>
              <span>₹{saleData.totals.gst}</span>
            </div>
            <div className="border-t-2 pt-2 flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>₹{saleData.totals.total}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-green-600 font-medium">
              <span>Paid:</span>
              <span>₹{saleData.amount_paid.toFixed(2)}</span>
            </div>
            {saleData.amount_paid < parseFloat(saleData.totals.total) && (
              <div className="flex justify-between text-red-600 font-medium">
                <span>Balance Due:</span>
                <span>₹{(parseFloat(saleData.totals.total) - saleData.amount_paid).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Payment Mode:</span>
              <span className="ml-2 font-medium capitalize">{saleData.payment_mode.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-gray-600">Payment Status:</span>
              <span className={`ml-2 font-medium capitalize ${
                saleData.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {saleData.payment_status}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 border-t pt-4">
          <p>Thank you for your business!</p>
        </div>
      </div>

      <div className="flex gap-4 mt-6 print-hide">
        <button
          onClick={handlePrint}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Print Bill
        </button>
        <button
          onClick={onNewSale}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-semibold"
        >
          New Sale
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {user.role === 'admin' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try a different search term'
              : user.role === 'admin' 
                ? 'Start by adding your first product!'
                : 'Ask admin to add products to get started.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{product.selling_price}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.current_quantity <= product.minimum_quantity
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.current_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.gst_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <AddProductModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            fetchProducts();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddProductModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    purchase_price: '',
    selling_price: '',
    gst_rate: '18',
    current_quantity: '',
    minimum_quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    if (!formData.sku || !formData.name || !formData.category || !formData.purchase_price || 
        !formData.selling_price || !formData.current_quantity || !formData.minimum_quantity) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const { error: dbError } = await supabase
        .from('products')
        .insert([{
          ...formData,
          purchase_price: parseFloat(formData.purchase_price),
          selling_price: parseFloat(formData.selling_price),
          gst_rate: parseFloat(formData.gst_rate),
          current_quantity: parseInt(formData.current_quantity),
          minimum_quantity: parseInt(formData.minimum_quantity)
        }]);

      if (dbError) throw dbError;
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Product</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., BAT001"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Exide Battery 12V"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Batteries"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
            <input
              type="number"
              step="0.01"
              value={formData.purchase_price}
              onChange={(e) => setFormData({...formData, purchase_price: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="3500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
            <input
              type="number"
              step="0.01"
              value={formData.selling_price}
              onChange={(e) => setFormData({...formData, selling_price: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="4200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%) *</label>
            <select
              value={formData.gst_rate}
              onChange={(e) => setFormData({...formData, gst_rate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Quantity *</label>
            <input
              type="number"
              value={formData.current_quantity}
              onChange={(e) => setFormData({...formData, current_quantity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Quantity *</label>
            <input
              type="number"
              value={formData.minimum_quantity}
              onChange={(e) => setFormData({...formData, minimum_quantity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="10"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-300"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Customers() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Customer
        </button>
      </div>
      <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Customer management coming in Phase 2</p>
      </div>
    </div>
  );
}

function Garages() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Garages</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Garage
        </button>
      </div>
      <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Garage management coming in Phase 2</p>
      </div>
    </div>
  );
}

function Reports() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h2>
      <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Reports will be implemented in Phase 7</p>
      </div>
    </div>
  );
}

function Expenses() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>
      <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Expense tracking coming in Phase 6</p>
      </div>
    </div>
  );
}