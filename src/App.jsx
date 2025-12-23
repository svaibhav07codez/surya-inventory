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
          <h1 className="text-2xl font-bold text-gray-900">Surya Automobiles</h1>
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
            <span className="ml-2 text-xl font-semibold text-gray-900">Surya Automobiles</span>
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
      const today = new Date().toISOString().split('T')[0]; // Just date, no time
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];

      // Fetch today's sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('total, sale_date')
        .gte('sale_date', today)
        .lt('sale_date', tomorrowDate);
      
      console.log('Fetching sales for:', today, 'Found:', salesData);

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

      // Fetch customers with pending payments
      const { data: customersData } = await supabase
        .from('customers')
        .select('credit_balance')
        .gt('credit_balance', 0);

      // Fetch garages with pending credit
      const { data: garagesData } = await supabase
        .from('garages')
        .select('credit_balance')
        .gt('credit_balance', 0);

      const totalCustomerOutstanding = customersData?.reduce((sum, c) => sum + parseFloat(c.credit_balance), 0) || 0;
      const totalGarageOutstanding = garagesData?.reduce((sum, g) => sum + parseFloat(g.credit_balance), 0) || 0;

      setStats({
        todaySales: salesData?.length || 0,
        todayAmount: salesData?.reduce((sum, s) => sum + parseFloat(s.total), 0) || 0,
        lowStockCount: lowStockProducts.length,
        pendingPayments: (customersData?.length || 0) + (garagesData?.length || 0),
        totalOutstanding: totalCustomerOutstanding + totalGarageOutstanding
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
        <PendingPaymentsWidget user={user} />
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
          onClick={() => setCurrentView('new-sale')}
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
      <PendingPaymentsWidget user={user} />
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

// This is the COMPLETE NewSale component with Garage integration
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
  
  // Customer-related states
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  // Garage-related states
  const [garages, setGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [showAddGarage, setShowAddGarage] = useState(false);
  const [garageSearch, setGarageSearch] = useState('');
  const [referredByGarage, setReferredByGarage] = useState(null);
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [isVehicleSpecific, setIsVehicleSpecific] = useState(false);

  useEffect(() => {
    if (saleType) {
      fetchProducts();
      if (saleType === 'customer') {
        fetchCustomers();
      }
      if (saleType === 'garage') {
        fetchGarages();
      }
      // Always fetch garages for referral option
      fetchGarages();
    }
  }, [saleType]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchGarages = async () => {
    try {
      const { data, error } = await supabase
        .from('garages')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setGarages(data || []);
    } catch (error) {
      console.error('Error fetching garages:', error);
    }
  };

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

  const addToCart = async (product) => {
    const { data: freshProduct } = await supabase
      .from('products')
      .select('*')
      .eq('id', product.id)
      .single();

    if (!freshProduct || freshProduct.current_quantity <= 0) {
      alert('This product is out of stock!');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= freshProduct.current_quantity) {
        alert('Cannot add more than available stock!');
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1, current_quantity: freshProduct.current_quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...freshProduct, quantity: 1 }]);
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

    // Calculate commission if referred by garage
    let commission = 0;
    if (referredByGarage) {
      commission = (subtotal * referredByGarage.commission_rate) / 100;
    }

    return {
      subtotal: subtotal.toFixed(2),
      gst: totalGst.toFixed(2),
      total: (subtotal + totalGst).toFixed(2),
      commission: commission.toFixed(2)
    };
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert('Please add products to cart');
      return;
    }

    if (saleType === 'customer' && !selectedCustomer) {
      alert('Please select a customer');
      return;
    }

    if (saleType === 'garage' && !selectedGarage) {
      alert('Please select a garage');
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
      const totalAmount = parseFloat(totals.total);
      const paidAmount = paymentStatus === 'paid' ? totalAmount : parseFloat(amountPaid || 0);
      const creditAmount = totalAmount - paidAmount;
      
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{
          sale_number: saleNumber,
          sale_type: saleType,
          customer_id: selectedCustomer?.id || null,
          garage_id: selectedGarage?.id || null,
          vehicle_name: vehicleName || null,
          vehicle_model: vehicleModel || null,
          referred_by_garage_id: referredByGarage?.id || null,
          commission_amount: parseFloat(totals.commission) || 0,
          subtotal: parseFloat(totals.subtotal),
          gst_amount: parseFloat(totals.gst),
          total: totalAmount,
          payment_mode: paymentMode,
          payment_status: paymentStatus,
          amount_paid: paidAmount
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

      // Update customer credit if applicable
      if (selectedCustomer && creditAmount > 0) {
        const newBalance = parseFloat(selectedCustomer.credit_balance) + creditAmount;
        await supabase
          .from('customers')
          .update({ credit_balance: newBalance })
          .eq('id', selectedCustomer.id);
      }

      // Update garage credit if applicable
      if (selectedGarage && creditAmount > 0) {
        const newBalance = parseFloat(selectedGarage.credit_balance) + creditAmount;
        await supabase
          .from('garages')
          .update({ credit_balance: newBalance })
          .eq('id', selectedGarage.id);
      }

      // Create commission record if referred by garage
      if (referredByGarage && parseFloat(totals.commission) > 0) {
        await supabase
          .from('commissions')
          .insert([{
            garage_id: referredByGarage.id,
            sale_id: sale.id,
            amount: parseFloat(totals.commission),
            status: 'pending'
          }]);

        // Update garage's total commission owed
        const newOwed = parseFloat(referredByGarage.total_commission_owed) + parseFloat(totals.commission);
        await supabase
          .from('garages')
          .update({ total_commission_owed: newOwed })
          .eq('id', referredByGarage.id);
      }

      setSaleData({
        ...sale,
        items: cart,
        totals,
        customer: selectedCustomer,
        garage: selectedGarage,
        referredBy: referredByGarage
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
    setSelectedCustomer(null);
    setSelectedGarage(null);
    setReferredByGarage(null);
    setCustomerSearch('');
    setGarageSearch('');
    setVehicleName('');
    setVehicleModel('');
    setIsVehicleSpecific(false);
    fetchProducts();
    if (saleType === 'customer') fetchCustomers();
    if (saleType === 'garage') fetchGarages();
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
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  );
  const filteredGarages = garages.filter(g =>
    g.name.toLowerCase().includes(garageSearch.toLowerCase()) ||
    g.contact_person.toLowerCase().includes(garageSearch.toLowerCase())
  );

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

      {/* Customer Selection */}
      {saleType === 'customer' && !selectedCustomer && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Customer</h3>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search customer by name or phone..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredCustomers.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No customers found</p>
                <button
                  onClick={() => setShowAddCustomer(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add New Customer
                </button>
              </div>
            ) : (
              <>
                {filteredCustomers.map(customer => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="w-full p-4 hover:bg-gray-50 flex justify-between items-center border-b last:border-b-0"
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.phone}</div>
                    </div>
                    {customer.credit_balance > 0 && (
                      <span className="text-sm text-red-600 font-medium">
                        Due: ₹{parseFloat(customer.credit_balance).toFixed(2)}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => setShowAddCustomer(true)}
                  className="w-full p-4 text-blue-600 hover:bg-blue-50 font-medium border-t"
                >
                  + Add New Customer
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Garage Selection */}
      {saleType === 'garage' && !selectedGarage && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Garage</h3>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={garageSearch}
                onChange={(e) => setGarageSearch(e.target.value)}
                placeholder="Search garage by name..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredGarages.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No garages found</p>
                <button
                  onClick={() => setShowAddGarage(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add New Garage
                </button>
              </div>
            ) : (
              <>
                {filteredGarages.map(garage => (
                  <button
                    key={garage.id}
                    onClick={() => setSelectedGarage(garage)}
                    className="w-full p-4 hover:bg-gray-50 flex justify-between items-center border-b last:border-b-0"
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{garage.name}</div>
                      <div className="text-sm text-gray-600">{garage.contact_person} | {garage.phone}</div>
                    </div>
                    {garage.credit_balance > 0 && (
                      <span className="text-sm text-red-600 font-medium">
                        Due: ₹{parseFloat(garage.credit_balance).toFixed(2)}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => setShowAddGarage(true)}
                  className="w-full p-4 text-blue-600 hover:bg-blue-50 font-medium border-t"
                >
                  + Add New Garage
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Show selected customer/garage info */}
      {selectedCustomer && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Customer: {selectedCustomer.name}</p>
              <p className="text-sm text-gray-600">Phone: {selectedCustomer.phone}</p>
              {selectedCustomer.credit_balance > 0 && (
                <p className="text-sm text-red-600 font-medium mt-1">
                  Outstanding: ₹{parseFloat(selectedCustomer.credit_balance).toFixed(2)}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedCustomer(null)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Change Customer
            </button>
          </div>
        </div>
      )}

      {selectedGarage && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-medium text-gray-900">Garage: {selectedGarage.name}</p>
              <p className="text-sm text-gray-600">Contact: {selectedGarage.contact_person}</p>
              {selectedGarage.credit_balance > 0 && (
                <p className="text-sm text-red-600 font-medium mt-1">
                  Outstanding: ₹{parseFloat(selectedGarage.credit_balance).toFixed(2)}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedGarage(null)}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Change Garage
            </button>
          </div>

          {/* Vehicle Specific Option */}
          <div className="mt-4 border-t border-purple-200 pt-4">
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={isVehicleSpecific}
                onChange={(e) => setIsVehicleSpecific(e.target.checked)}
                className="w-4 h-4 text-purple-600"
              />
              <span className="text-sm font-medium text-gray-700">
                This sale is for a specific vehicle
              </span>
            </label>

            {isVehicleSpecific && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle Name *</label>
                  <input
                    type="text"
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    placeholder="e.g., Maruti Swift"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g., VXI"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Referral by Garage (for Quick Sale and Customer Sale) */}
      {(saleType === 'quick' || saleType === 'customer') && !referredByGarage && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Was this customer referred by a garage?</h3>
            <span className="text-sm text-gray-500">Optional</span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={garageSearch}
              onChange={(e) => setGarageSearch(e.target.value)}
              placeholder="Search garage..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {garageSearch && (
            <div className="mt-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredGarages.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-gray-500 text-sm">No garages found</p>
                </div>
              ) : (
                filteredGarages.map(garage => (
                  <button
                    key={garage.id}
                    onClick={() => {
                      setReferredByGarage(garage);
                      setGarageSearch('');
                    }}
                    className="w-full p-3 hover:bg-gray-50 flex justify-between items-center border-b last:border-b-0"
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{garage.name}</div>
                      <div className="text-sm text-gray-600">{garage.contact_person}</div>
                    </div>
                    <span className="text-sm text-purple-600 font-medium">
                      {garage.commission_rate}% commission
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Show referred garage info */}
      {referredByGarage && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">
                Referred by: {referredByGarage.name}
              </p>
              <p className="text-sm text-gray-600">
                Commission: {referredByGarage.commission_rate}% = ₹{totals.commission}
              </p>
            </div>
            <button
              onClick={() => setReferredByGarage(null)}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              Remove Referral
            </button>
          </div>
        </div>
      )}

      {/* Product Search & Cart (show when ready) */}
      {((saleType === 'quick') || 
        (saleType === 'customer' && selectedCustomer) ||
        (saleType === 'garage' && selectedGarage)) && (
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
                {referredByGarage && (
                  <div className="flex justify-between text-orange-600 text-sm">
                    <span>Commission ({referredByGarage.commission_rate}%):</span>
                    <span>₹{totals.commission}</span>
                  </div>
                )}
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
      )}

      {showAddCustomer && (
        <AddCustomerModal
          onClose={() => setShowAddCustomer(false)}
          onSuccess={() => {
            fetchCustomers();
            setShowAddCustomer(false);
          }}
        />
      )}

      {showAddGarage && (
        <AddGarageModal
          onClose={() => setShowAddGarage(false)}
          onSuccess={() => {
            fetchGarages();
            setShowAddGarage(false);
          }}
        />
      )}
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuickStockModal, setShowQuickStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
                {user.role === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.sku || '-'}</td>
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
                  {user.role === 'admin' && (
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowQuickStockModal(true);
                          }}
                          className="text-green-600 hover:text-green-700"
                          title="Add Stock"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showEditModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            fetchProducts();
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {showQuickStockModal && selectedProduct && (
        <QuickAddStockModal
          product={selectedProduct}
          onClose={() => {
            setShowQuickStockModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            fetchProducts();
            setShowQuickStockModal(false);
            setSelectedProduct(null);
          }}
        />
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
    gst_rate: '0',
    current_quantity: '',
    minimum_quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    if (!formData.name || !formData.category || !formData.purchase_price || 
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
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Optional)</label>
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


function Customers({ user }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No customers found' : 'No customers yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try a different search term'
              : 'Start by adding your first customer!'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {customer.customer_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {customer.credit_balance > 0 ? (
                      <span className="text-red-600 font-semibold">
                        ₹{parseFloat(customer.credit_balance).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-green-600">₹0.00</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <AddCustomerModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            fetchCustomers();
            setShowAddModal(false);
          }}
        />
      )}

      {showDetailsModal && selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedCustomer(null);
            fetchCustomers();
          }}
        />
      )}
    </div>
  );
}

// Add Customer Modal
function AddCustomerModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    customer_type: 'individual'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    if (!formData.name || !formData.phone) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const { error: dbError } = await supabase
        .from('customers')
        .insert([{
          name: formData.name,
          phone: formData.phone,
          customer_type: formData.customer_type,
          credit_balance: 0
        }]);

      if (dbError) throw dbError;
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Customer</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Customer name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="10-digit phone number"
              maxLength="10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
            <select
              value={formData.customer_type}
              onChange={(e) => setFormData({...formData, customer_type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="individual">Individual</option>
              <option value="regular">Regular Customer</option>
            </select>
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
            {loading ? 'Adding...' : 'Add Customer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Customer Details Modal
function CustomerDetailsModal({ customer, onClose }) {
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('sales');

  useEffect(() => {
    fetchCustomerData();
  }, [customer.id]);

  const fetchCustomerData = async () => {
    try {
      // Fetch customer sales
      const { data: salesData } = await supabase
        .from('sales')
        .select('*')
        .eq('customer_id', customer.id)
        .order('sale_date', { ascending: false });

      // Fetch customer payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('payer_type', 'customer')
        .eq('payer_id', customer.id)
        .order('payment_date', { ascending: false });

      setSales(salesData || []);
      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{customer.name}</h3>
              <p className="text-gray-600 mt-1">Phone: {customer.phone}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                {customer.customer_type}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Credit Balance */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Credit Balance</p>
              <p className={`text-2xl font-bold ${
                customer.credit_balance > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                ₹{parseFloat(customer.credit_balance).toFixed(2)}
              </p>
            </div>
            {customer.credit_balance > 0 && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                Record Payment
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'sales'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Sales History ({sales.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'payments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Payment History ({payments.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {activeTab === 'sales' && (
                <div className="space-y-3">
                  {sales.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No sales yet</p>
                  ) : (
                    sales.map(sale => (
                      <div key={sale.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">Sale #{sale.sale_number}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(sale.sale_date).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{parseFloat(sale.total).toFixed(2)}</p>
                            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                              sale.payment_status === 'paid' 
                                ? 'bg-green-100 text-green-800'
                                : sale.payment_status === 'partial'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {sale.payment_status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-3">
                  {payments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No payments yet</p>
                  ) : (
                    payments.map(payment => (
                      <div key={payment.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">₹{parseFloat(payment.amount).toFixed(2)}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(payment.payment_date).toLocaleDateString('en-IN')}
                            </p>
                            <span className="text-xs text-gray-500 capitalize">{payment.payment_mode}</span>
                          </div>
                          {payment.notes && (
                            <p className="text-sm text-gray-600 italic">{payment.notes}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {showPaymentModal && (
          <RecordPaymentModal
            customer={customer}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={() => {
              setShowPaymentModal(false);
              fetchCustomerData();
              onClose(); // Refresh parent
            }}
          />
        )}
      </div>
    </div>
  );
}

// Record Payment Modal
function RecordPaymentModal({ customer, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    const paymentAmount = parseFloat(amount);
    if (!amount || paymentAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (paymentAmount > customer.credit_balance) {
      setError('Payment amount cannot exceed credit balance');
      return;
    }

    setLoading(true);

    try {
      // Record payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          payer_type: 'customer',
          payer_id: customer.id,
          amount: paymentAmount,
          payment_mode: paymentMode,
          notes: notes || null
        }]);

      if (paymentError) throw paymentError;

      // Update customer credit balance
      const newBalance = customer.credit_balance - paymentAmount;
      const { error: updateError } = await supabase
        .from('customers')
        .update({ credit_balance: newBalance })
        .eq('id', customer.id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Record Payment</h3>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Outstanding Balance</p>
          <p className="text-2xl font-bold text-red-600">
            ₹{parseFloat(customer.credit_balance).toFixed(2)}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="2"
              placeholder="Add any notes..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-green-300"
          >
            {loading ? 'Recording...' : 'Record Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Replace the Garages function in App.jsx with this complete version

function Garages({ user }) {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGarages();
  }, []);

  const fetchGarages = async () => {
    try {
      const { data, error } = await supabase
        .from('garages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGarages(data || []);
    } catch (error) {
      console.error('Error fetching garages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGarages = garages.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading garages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Garages</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search garages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Garage
          </button>
        </div>
      </div>

      {filteredGarages.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No garages found' : 'No garages yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try a different search term'
              : 'Start by adding your first garage partner!'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Garage Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Person</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Owed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGarages.map((garage) => (
                <tr key={garage.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{garage.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{garage.contact_person}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{garage.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {garage.commission_rate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {garage.credit_balance > 0 ? (
                      <span className="text-red-600 font-semibold">
                        ₹{parseFloat(garage.credit_balance).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-green-600">₹0.00</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {garage.total_commission_owed > 0 ? (
                      <span className="text-orange-600 font-semibold">
                        ₹{parseFloat(garage.total_commission_owed).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-400">₹0.00</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => {
                        setSelectedGarage(garage);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <AddGarageModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            fetchGarages();
            setShowAddModal(false);
          }}
        />
      )}

      {showDetailsModal && selectedGarage && (
        <GarageDetailsModal
          garage={selectedGarage}
          user={user}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedGarage(null);
            fetchGarages();
          }}
        />
      )}
    </div>
  );
}

// Add Garage Modal
function AddGarageModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    commission_rate: '10'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    if (!formData.name || !formData.contact_person || !formData.phone) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const { error: dbError } = await supabase
        .from('garages')
        .insert([{
          name: formData.name,
          contact_person: formData.contact_person,
          phone: formData.phone,
          commission_rate: parseFloat(formData.commission_rate),
          total_commission_owed: 0,
          total_commission_paid: 0,
          credit_balance: 0
        }]);

      if (dbError) throw dbError;
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add garage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Garage</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Garage Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Kumar Auto Garage"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
            <input
              type="text"
              value={formData.contact_person}
              onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Owner/Manager name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="10-digit phone number"
              maxLength="10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.commission_rate}
              onChange={(e) => setFormData({...formData, commission_rate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="10"
            />
            <p className="text-xs text-gray-500 mt-1">Default: 10% - can be changed anytime</p>
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
            {loading ? 'Adding...' : 'Add Garage'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Garage Details Modal
function GarageDetailsModal({ garage, user, onClose }) {
  const [referralSales, setReferralSales] = useState([]);
  const [directSales, setDirectSales] = useState([]);
  const [payments, setPayments] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('referrals');

  useEffect(() => {
    fetchGarageData();
  }, [garage.id]);

  const fetchGarageData = async () => {
    try {
      // Fetch referral sales (where this garage referred a customer)
      const { data: referrals } = await supabase
        .from('sales')
        .select('*')
        .eq('referred_by_garage_id', garage.id)
        .order('sale_date', { ascending: false });

      // Fetch direct sales (where garage bought directly)
      const { data: direct } = await supabase
        .from('sales')
        .select('*')
        .eq('garage_id', garage.id)
        .order('sale_date', { ascending: false });

      // Fetch payment history
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('payer_type', 'garage')
        .eq('payer_id', garage.id)
        .order('payment_date', { ascending: false });

      // Fetch commission records
      const { data: commissionsData } = await supabase
        .from('commissions')
        .select('*, sales(sale_number, sale_date)')
        .eq('garage_id', garage.id)
        .order('created_at', { ascending: false });

      setReferralSales(referrals || []);
      setDirectSales(direct || []);
      setPayments(paymentsData || []);
      setCommissions(commissionsData || []);
    } catch (error) {
      console.error('Error fetching garage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingCommission = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + parseFloat(c.amount), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{garage.name}</h3>
              <p className="text-gray-600 mt-1">Contact: {garage.contact_person} | {garage.phone}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Commission: {garage.commission_rate}%
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-900">Credit Balance (Direct Purchases)</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{parseFloat(garage.credit_balance).toFixed(2)}
              </p>
              {garage.credit_balance > 0 && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  Record Payment →
                </button>
              )}
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-900">Commission Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                ₹{pendingCommission.toFixed(2)}
              </p>
              {pendingCommission > 0 && user.role === 'admin' && (
                <button
                  onClick={() => setShowCommissionModal(true)}
                  className="mt-2 text-sm text-orange-700 hover:text-orange-800 font-medium"
                >
                  Pay Commission →
                </button>
              )}
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-900">Commission Paid (Total)</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{parseFloat(garage.total_commission_paid).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'referrals'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Referral Sales ({referralSales.length})
            </button>
            <button
              onClick={() => setActiveTab('direct')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'direct'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Direct Purchases ({directSales.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Credit Payments ({payments.length})
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'commissions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Commissions ({commissions.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {activeTab === 'referrals' && (
                <div className="space-y-3">
                  {referralSales.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No referral sales yet</p>
                  ) : (
                    referralSales.map(sale => (
                      <div key={sale.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">Sale #{sale.sale_number}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(sale.sale_date).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{parseFloat(sale.total).toFixed(2)}</p>
                            <p className="text-sm text-orange-600 font-medium">
                              Commission: ₹{parseFloat(sale.commission_amount || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'direct' && (
                <div className="space-y-3">
                  {directSales.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No direct purchases yet</p>
                  ) : (
                    directSales.map(sale => (
                      <div key={sale.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">Sale #{sale.sale_number}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(sale.sale_date).toLocaleDateString('en-IN')}
                            </p>
                            {sale.vehicle_name && (
                              <p className="text-sm text-blue-600 mt-1">
                                Vehicle: {sale.vehicle_name} {sale.vehicle_model}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{parseFloat(sale.total).toFixed(2)}</p>
                            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                              sale.payment_status === 'paid' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {sale.payment_status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-3">
                  {payments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No payments yet</p>
                  ) : (
                    payments.map(payment => (
                      <div key={payment.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">₹{parseFloat(payment.amount).toFixed(2)}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(payment.payment_date).toLocaleDateString('en-IN')}
                            </p>
                            <span className="text-xs text-gray-500 capitalize">{payment.payment_mode}</span>
                          </div>
                          {payment.notes && (
                            <p className="text-sm text-gray-600 italic max-w-xs">{payment.notes}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'commissions' && (
                <div className="space-y-3">
                  {commissions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No commission records yet</p>
                  ) : (
                    commissions.map(comm => (
                      <div key={comm.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              Sale #{comm.sales?.sale_number || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {comm.sales?.sale_date && new Date(comm.sales.sale_date).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-orange-600">₹{parseFloat(comm.amount).toFixed(2)}</p>
                            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                              comm.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {comm.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {showPaymentModal && (
          <RecordGaragePaymentModal
            garage={garage}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={() => {
              setShowPaymentModal(false);
              fetchGarageData();
            }}
          />
        )}

        {showCommissionModal && (
          <PayCommissionModal
            garage={garage}
            pendingCommissions={commissions.filter(c => c.status === 'pending')}
            onClose={() => setShowCommissionModal(false)}
            onSuccess={() => {
              setShowCommissionModal(false);
              fetchGarageData();
            }}
          />
        )}
      </div>
    </div>
  );
}

// Record Garage Payment Modal (for credit purchases)
function RecordGaragePaymentModal({ garage, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    const paymentAmount = parseFloat(amount);
    if (!amount || paymentAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (paymentAmount > garage.credit_balance) {
      setError('Payment amount cannot exceed credit balance');
      return;
    }

    setLoading(true);

    try {
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          payer_type: 'garage',
          payer_id: garage.id,
          amount: paymentAmount,
          payment_mode: paymentMode,
          notes: notes || null
        }]);

      if (paymentError) throw paymentError;

      const newBalance = garage.credit_balance - paymentAmount;
      const { error: updateError } = await supabase
        .from('garages')
        .update({ credit_balance: newBalance })
        .eq('id', garage.id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Record Credit Payment</h3>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Outstanding Credit Balance</p>
          <p className="text-2xl font-bold text-red-600">
            ₹{parseFloat(garage.credit_balance).toFixed(2)}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="2"
              placeholder="Add any notes..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-green-300"
          >
            {loading ? 'Recording...' : 'Record Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Pay Commission Modal
function PayCommissionModal({ garage, pendingCommissions, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPending = pendingCommissions.reduce((sum, c) => sum + parseFloat(c.amount), 0);

  const handleSubmit = async () => {
    setError('');

    const paymentAmount = parseFloat(amount);
    if (!amount || paymentAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (paymentAmount > totalPending) {
      setError('Payment amount cannot exceed pending commission');
      return;
    }

    setLoading(true);

    try {
      let remaining = paymentAmount;
      const paidCommissionIds = [];

      for (const comm of pendingCommissions) {
        if (remaining <= 0) break;

        const commAmount = parseFloat(comm.amount);
        if (remaining >= commAmount) {
          await supabase
            .from('commissions')
            .update({ status: 'paid' })
            .eq('id', comm.id);
          
          paidCommissionIds.push(comm.id);
          remaining -= commAmount;
        }
      }

      const { error: paymentError } = await supabase
        .from('commission_payments')
        .insert([{
          garage_id: garage.id,
          amount: paymentAmount,
          commission_ids: paidCommissionIds,
          notes: notes || null
        }]);

      if (paymentError) throw paymentError;

      const newOwed = garage.total_commission_owed - paymentAmount;
      const newPaid = parseFloat(garage.total_commission_paid) + paymentAmount;

      const { error: updateError } = await supabase
        .from('garages')
        .update({ 
          total_commission_owed: Math.max(0, newOwed),
          total_commission_paid: newPaid
        })
        .eq('id', garage.id);

      if (updateError) throw updateError;

      const { error: expenseError } = await supabase
        .from('expenses')
        .insert([{
          category: 'commission',
          amount: paymentAmount,
          description: `Commission payment to ${garage.name}`,
          expense_date: new Date().toISOString().split('T')[0]
        }]);

      if (expenseError) console.error('Failed to record expense:', expenseError);

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to pay commission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Pay Commission</h3>
        
        <div className="mb-4 p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-900">Total Pending Commission</p>
          <p className="text-2xl font-bold text-orange-600">
            ₹{totalPending.toFixed(2)}
          </p>
          <p className="text-xs text-orange-700 mt-1">
            From {pendingCommissions.length} referral sales
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Pay *</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter amount"
            />
            <p className="text-xs text-gray-500 mt-1">
              Can pay partial amount. Oldest sales will be marked as paid first.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="2"
              placeholder="Add any notes..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:bg-orange-300"
          >
            {loading ? 'Processing...' : 'Pay Commission'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Replace the Reports function in App.jsx with this complete version

function Reports({ user }) {
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of month
    end: new Date().toISOString().split('T')[0] // Today
  });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {  
    if (activeReport) {
      fetchReportData();
    }
  }, [activeReport, dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      switch (activeReport) {
        case 'sales':
          await fetchSalesReport();
          break;
        case 'profit':
          await fetchProfitReport();
          break;
        case 'outstanding':
          await fetchOutstandingReport();
          break;
        case 'products':
          await fetchProductsReport();
          break;
        case 'commission':
          await fetchCommissionReport();
          break;
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

   const fetchSalesReport = async () => {
    const { data: sales, error } = await supabase
      .from('sales')
      .select(`
        *, 
        sale_items(*), 
        customers(name),
        direct_garage:garages!sales_garage_id_fkey(name),
        referral_garage:garages!sales_referred_by_garage_id_fkey(name)
      `)
      .gte('sale_date', dateRange.start)
      .lt('sale_date', (() => {
        const nextDay = new Date(dateRange.end);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString().split('T')[0];
      })())
      .order('sale_date', { ascending: false });

    console.log('Date range:', dateRange);
    console.log('Sales query error:', error);
    console.log('Sales found for reports:', sales);

    const totalSales = sales?.reduce((sum, s) => sum + parseFloat(s.total), 0) || 0;
    const totalGST = sales?.reduce((sum, s) => sum + parseFloat(s.gst_amount), 0) || 0;
    const paidSales = sales?.filter(s => s.payment_status === 'paid').length || 0;
    const creditSales = sales?.filter(s => s.payment_status === 'credit' || s.payment_status === 'partial').length || 0;

    setReportData({
      sales: sales || [],
      summary: {
        totalSales: sales?.length || 0,
        totalAmount: totalSales,
        totalGST: totalGST,
        paidCount: paidSales,
        creditCount: creditSales
      }
    });
  };

  const fetchProfitReport = async () => {
    const startDate = dateRange.start;
    const nextDay = new Date(dateRange.end);
    nextDay.setDate(nextDay.getDate() + 1);
    const endDate = nextDay.toISOString().split('T')[0];

    // Fetch sales
    const { data: sales } = await supabase
      .from('sales')
      .select('total, subtotal, gst_amount')
      .gte('sale_date', startDate)
      .lt('sale_date', endDate);

    // Fetch expenses
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .gte('expense_date', startDate)
      .lt('expense_date', endDate);

    // Fetch stock purchases
    const { data: stockPurchases } = await supabase
      .from('stock_purchases')
      .select('total_cost')
      .gte('purchase_date', startDate)
      .lt('purchase_date', endDate);

    console.log('Profit report - Sales:', sales, 'Expenses:', expenses, 'Stock:', stockPurchases);

    const revenue = sales?.reduce((sum, s) => sum + parseFloat(s.subtotal), 0) || 0;
    const totalExpenses = expenses?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0;
    const totalStockCost = stockPurchases?.reduce((sum, s) => sum + parseFloat(s.total_cost), 0) || 0;
    const totalCost = totalExpenses + totalStockCost;
    const profit = revenue - totalCost;

    setReportData({
      revenue,
      expenses: totalExpenses,
      stockCost: totalStockCost,
      totalCost,
      profit,
      profitMargin: revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0
    });
  };

  const fetchOutstandingReport = async () => {
    const { data: customers } = await supabase
      .from('customers')
      .select('*')
      .gt('credit_balance', 0)
      .order('credit_balance', { ascending: false });

    const { data: garages } = await supabase
      .from('garages')
      .select('*')
      .gt('credit_balance', 0)
      .order('credit_balance', { ascending: false });

    const totalCustomer = customers?.reduce((sum, c) => sum + parseFloat(c.credit_balance), 0) || 0;
    const totalGarage = garages?.reduce((sum, g) => sum + parseFloat(g.credit_balance), 0) || 0;

    setReportData({
      customers: customers || [],
      garages: garages || [],
      totalCustomer,
      totalGarage,
      grandTotal: totalCustomer + totalGarage
    });
  };

  const fetchProductsReport = async () => {
    const startDate = dateRange.start;
    const nextDay = new Date(dateRange.end);
    nextDay.setDate(nextDay.getDate() + 1);
    const endDate = nextDay.toISOString().split('T')[0];

    // Fetch all products
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .order('current_quantity', { ascending: true });

    // Fetch sale items in date range with sales info
    const { data: salesWithItems } = await supabase
      .from('sales')
      .select('id, sale_date, sale_items(product_id, quantity, total)')
      .gte('sale_date', startDate)
      .lt('sale_date', endDate);

    // Flatten sale items
    const saleItems = [];
    salesWithItems?.forEach(sale => {
      sale.sale_items?.forEach(item => {
        saleItems.push(item);
      });
    });

    // Calculate sales per product
    const productSales = {};
    saleItems.forEach(item => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = { quantity: 0, revenue: 0 };
      }
      productSales[item.product_id].quantity += item.quantity;
      productSales[item.product_id].revenue += parseFloat(item.total);
    });

    // Merge with products
    const enrichedProducts = products?.map(p => ({
      ...p,
      soldQuantity: productSales[p.id]?.quantity || 0,
      revenue: productSales[p.id]?.revenue || 0,
      stockValue: p.current_quantity * p.purchase_price
    })) || [];

    // Sort by sold quantity
    const bestSelling = [...enrichedProducts].sort((a, b) => b.soldQuantity - a.soldQuantity);
    const lowStock = enrichedProducts.filter(p => p.current_quantity <= p.minimum_quantity);

    setReportData({
      allProducts: enrichedProducts,
      bestSelling: bestSelling.slice(0, 10),
      lowStock,
      totalStockValue: enrichedProducts.reduce((sum, p) => sum + p.stockValue, 0)
    });
  };

  const fetchCommissionReport = async () => {
    const startDate = dateRange.start;
    const nextDay = new Date(dateRange.end);
    nextDay.setDate(nextDay.getDate() + 1);
    const endDate = nextDay.toISOString().split('T')[0];

    const { data: garages } = await supabase
      .from('garages')
      .select('*')
      .order('total_commission_owed', { ascending: false });

    const { data: commissionsWithSales } = await supabase
      .from('sales')
      .select('id, sale_number, sale_date, subtotal, commissions(id, amount, status, garage_id, garages(name))')
      .gte('sale_date', startDate)
      .lt('sale_date', endDate)
      .not('commissions', 'is', null);

    // Flatten commissions
    const commissions = [];
    commissionsWithSales?.forEach(sale => {
      sale.commissions?.forEach(comm => {
        commissions.push({
          ...comm,
          sales: {
            sale_number: sale.sale_number,
            sale_date: sale.sale_date,
            subtotal: sale.subtotal
          }
        });
      });
    });

    const totalOwed = garages?.reduce((sum, g) => sum + parseFloat(g.total_commission_owed), 0) || 0;
    const totalPaid = garages?.reduce((sum, g) => sum + parseFloat(g.total_commission_paid), 0) || 0;

    setReportData({
      garages: garages || [],
      commissions: commissions || [],
      totalOwed,
      totalPaid,
      totalCommission: totalOwed + totalPaid
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h2>
        
        {/* Report Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <button
            onClick={() => setActiveReport('sales')}
            className={`p-3 rounded-lg border-2 transition-all ${
              activeReport === 'sales'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <ShoppingCart className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs font-medium">Sales Report</p>
          </button>
          <button
            onClick={() => setActiveReport('profit')}
            className={`p-3 rounded-lg border-2 transition-all ${
              activeReport === 'profit'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs font-medium">Profit/Loss</p>
          </button>
          <button
            onClick={() => setActiveReport('outstanding')}
            className={`p-3 rounded-lg border-2 transition-all ${
              activeReport === 'outstanding'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <DollarSign className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs font-medium">Outstanding</p>
          </button>
          <button
            onClick={() => setActiveReport('products')}
            className={`p-3 rounded-lg border-2 transition-all ${
              activeReport === 'products'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Package className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs font-medium">Products</p>
          </button>
          <button
            onClick={() => setActiveReport('commission')}
            className={`p-3 rounded-lg border-2 transition-all ${
              activeReport === 'commission'
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Users className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs font-medium">Commissions</p>
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm text-gray-600 mr-2">From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mr-2">To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={() => {
              const today = new Date();
              setDateRange({
                start: new Date(today.setDate(1)).toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0]
              });
            }}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            This Month
          </button>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating report...</p>
        </div>
      ) : (
        <>
          {activeReport === 'sales' && reportData?.summary && <SalesReportView data={reportData} dateRange={dateRange} />}
          {activeReport === 'profit' && reportData?.revenue !== undefined && <ProfitReportView data={reportData} dateRange={dateRange} />}
          {activeReport === 'outstanding' && reportData?.totalCustomer !== undefined && <OutstandingReportView data={reportData} />}
          {activeReport === 'products' && reportData?.bestSelling && <ProductsReportView data={reportData} dateRange={dateRange} />}
          {activeReport === 'commission' && reportData?.garages && reportData?.commissions && <CommissionReportView data={reportData} dateRange={dateRange} />}
        </>
      )}
    </div>
  );
}

// Sales Report View
function SalesReportView({ data, dateRange }) {
  if (!data || !data.summary) return null;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900">{data.summary.totalSales}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600">₹{data.summary.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Paid Sales</p>
          <p className="text-2xl font-bold text-green-600">{data.summary.paidCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Credit Sales</p>
          <p className="text-2xl font-bold text-red-600">{data.summary.creditCount}</p>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer/Garage</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">GST</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.sales.map(sale => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(sale.sale_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{sale.sale_number}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {sale.sale_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {sale.customers?.name || sale.direct_garage?.name || sale.referral_garage?.name || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">₹{parseFloat(sale.subtotal).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-right">₹{parseFloat(sale.gst_amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">₹{parseFloat(sale.total).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sale.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profit/Loss Report View
function ProfitReportView({ data, dateRange }) {
  if (!data || data.revenue === undefined || data.profit === undefined) {
    return <div className="bg-white rounded-lg shadow p-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profit & Loss Statement</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <span className="font-medium text-green-900">Revenue (excl. GST)</span>
            <span className="text-xl font-bold text-green-600">₹{data.revenue.toFixed(2)}</span>
          </div>

          <div className="border-l-4 border-red-300 pl-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Monthly Expenses</span>
              <span className="font-semibold text-gray-900">₹{data.expenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Stock Purchases</span>
              <span className="font-semibold text-gray-900">₹{data.stockCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium text-red-900">Total Costs</span>
              <span className="text-lg font-bold text-red-600">₹{data.totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className={`flex justify-between items-center p-6 rounded-lg ${
            data.profit >= 0 ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <span className="text-xl font-bold">Net Profit</span>
            <div className="text-right">
              <p className={`text-3xl font-bold ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{data.profit.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Margin: {data.profitMargin}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Period Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Period:</strong> {new Date(dateRange.start).toLocaleDateString('en-IN')} to {new Date(dateRange.end).toLocaleDateString('en-IN')}
        </p>
      </div>
    </div>
  );
}

// Outstanding Payments Report
function OutstandingReportView({ data }) {
  if (!data || data.totalCustomer === undefined || data.totalGarage === undefined) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading outstanding payments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Customer Outstanding</p>
          <p className="text-2xl font-bold text-red-600">₹{data.totalCustomer.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">{data.customers.length} customers</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Garage Outstanding</p>
          <p className="text-2xl font-bold text-orange-600">₹{data.totalGarage.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">{data.garages.length} garages</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Outstanding</p>
          <p className="text-2xl font-bold text-red-600">₹{data.grandTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Customers with Credit */}
      {data.customers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customers with Pending Payments</h3>
          <div className="space-y-2">
            {data.customers.map(customer => (
              <div key={customer.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.phone}</p>
                </div>
                <span className="text-lg font-bold text-red-600">
                  ₹{parseFloat(customer.credit_balance).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Garages with Credit */}
      {data.garages.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Garages with Pending Payments</h3>
          <div className="space-y-2">
            {data.garages.map(garage => (
              <div key={garage.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{garage.name}</p>
                  <p className="text-sm text-gray-600">{garage.contact_person} | {garage.phone}</p>
                </div>
                <span className="text-lg font-bold text-red-600">
                  ₹{parseFloat(garage.credit_balance).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Products Report View
function ProductsReportView({ data, dateRange }) {
  if (!data || !data.bestSelling || !data.lowStock) {
    return <div className="bg-white rounded-lg shadow p-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Total Stock Value</p>
            <p className="text-3xl font-bold text-blue-600">₹{data.totalStockValue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Low Stock Items</p>
            <p className="text-3xl font-bold text-red-600">{data.lowStock.length}</p>
          </div>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Best Selling Products</h3>
        <div className="space-y-2">
          {data.bestSelling.map((product, index) => (
            <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">SKU: {product.sku || 'N/A'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{product.soldQuantity} units</p>
                <p className="text-sm text-green-600">₹{product.revenue.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {data.lowStock.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Low Stock Products</h3>
          <div className="space-y-2">
            {data.lowStock.map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">SKU: {product.sku || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{product.current_quantity} units</p>
                  <p className="text-xs text-gray-500">Min: {product.minimum_quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
   

// Commission Report View
function CommissionReportView({ data, dateRange }) {
  if (!data || !data.garages) return null;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Commission</p>
          <p className="text-2xl font-bold text-purple-600">₹{data.totalCommission.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-orange-600">₹{data.totalOwed.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Paid</p>
          <p className="text-2xl font-bold text-green-600">₹{data.totalPaid.toFixed(2)}</p>
        </div>
      </div>

      {/* Garage-wise Commission */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission by Garage</h3>
        <div className="space-y-3">
          {data.garages.map(garage => (
            <div key={garage.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{garage.name}</p>
                  <p className="text-sm text-gray-600">{garage.contact_person} | Rate: {garage.commission_rate}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-orange-600">Pending: ₹{parseFloat(garage.total_commission_owed).toFixed(2)}</p>
                  <p className="text-sm text-green-600">Paid: ₹{parseFloat(garage.total_commission_paid).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Transactions</h3>
        <div className="space-y-2">
          {data.commissions.map(comm => (
            <div key={comm.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{comm.garages?.name}</p>
                <p className="text-sm text-gray-600">
                  Sale #{comm.sales?.sale_number} | {comm.sales?.sale_date && new Date(comm.sales.sale_date).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-orange-600">₹{parseFloat(comm.amount).toFixed(2)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  comm.status === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {comm.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Replace the Expenses function in App.jsx with this complete version

function Expenses({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [stockPurchases, setStockPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    fetchData();
  }, [filterMonth]);

  const fetchData = async () => {
    try {
      // Fetch expenses for selected month
      const monthStart = `${filterMonth}-01`;
      const monthEnd = new Date(filterMonth + '-01');
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .gte('expense_date', monthStart)
        .lt('expense_date', monthEnd.toISOString().split('T')[0])
        .order('expense_date', { ascending: false });

      // Fetch stock purchases for selected month
      const { data: stockData } = await supabase
        .from('stock_purchases')
        .select('*, products(name, sku)')
        .gte('purchase_date', monthStart)
        .lt('purchase_date', monthEnd.toISOString().split('T')[0])
        .order('purchase_date', { ascending: false });

      setExpenses(expensesData || []);
      setStockPurchases(stockData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const totalStockCost = stockPurchases.reduce((sum, s) => sum + parseFloat(s.total_cost), 0);
  const grandTotal = totalExpenses + totalStockCost;

  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Month Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Expenses & Stock Purchases</h2>
          <div className="flex gap-3 items-center">
            <div>
              <label className="text-sm text-gray-600 mr-2">Filter by Month:</label>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button 
              onClick={() => setShowAddExpenseModal(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
            <button 
              onClick={() => setShowAddStockModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Stock Purchase
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-900">Monthly Expenses</p>
            <p className="text-2xl font-bold text-orange-600">₹{totalExpenses.toFixed(2)}</p>
            <p className="text-xs text-orange-700 mt-1">{expenses.length} transactions</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-900">Stock Purchases</p>
            <p className="text-2xl font-bold text-green-600">₹{totalStockCost.toFixed(2)}</p>
            <p className="text-xs text-green-700 mt-1">{stockPurchases.length} purchases</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-900">Total Outflow</p>
            <p className="text-2xl font-bold text-red-600">₹{grandTotal.toFixed(2)}</p>
            <p className="text-xs text-red-700 mt-1">This month</p>
          </div>
        </div>
      </div>

      {/* Expense Breakdown by Category */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div key={category} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 capitalize">{category.replace('_', ' ')}</p>
                <p className="text-lg font-semibold text-gray-900">₹{amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'expenses'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly Expenses ({expenses.length})
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'stock'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Stock Purchases ({stockPurchases.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'expenses' && (
            <div>
              {expenses.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No expenses recorded for this month</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map(expense => (
                    <div key={expense.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 capitalize">
                              {expense.category.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-gray-600">
                              {new Date(expense.expense_date).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          {expense.description && (
                            <p className="text-sm text-gray-700 mt-2">{expense.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₹{parseFloat(expense.amount).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'stock' && (
            <div>
              {stockPurchases.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No stock purchases recorded for this month</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stockPurchases.map(purchase => (
                    <div key={purchase.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {purchase.products?.name || 'Unknown Product'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            SKU: {purchase.products?.sku} | Quantity: {purchase.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(purchase.purchase_date).toLocaleDateString('en-IN')} | 
                            ₹{parseFloat(purchase.purchase_price).toFixed(2)} per unit
                          </p>
                          {purchase.notes && (
                            <p className="text-sm text-gray-500 mt-1 italic">{purchase.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₹{parseFloat(purchase.total_cost).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Total Cost</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddExpenseModal && (
        <AddExpenseModal
          onClose={() => setShowAddExpenseModal(false)}
          onSuccess={() => {
            fetchData();
            setShowAddExpenseModal(false);
          }}
        />
      )}

      {showAddStockModal && (
        <AddStockPurchaseModal
          onClose={() => setShowAddStockModal(false)}
          onSuccess={() => {
            fetchData();
            setShowAddStockModal(false);
          }}
        />
      )}
    </div>
  );
}

// Add Expense Modal
function AddExpenseModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    category: 'rent',
    amount: '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    if (!formData.amount || !formData.expense_date) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const { error: dbError } = await supabase
        .from('expenses')
        .insert([{
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description || null,
          expense_date: formData.expense_date
        }]);

      if (dbError) throw dbError;
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add Expense</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="rent">Rent</option>
              <option value="electricity">Electricity</option>
              <option value="salary">Salary</option>
              <option value="commission">Commission</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={formData.expense_date}
              onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder="Add details about this expense..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:bg-orange-300"
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Stock Purchase Modal
function AddStockPurchaseModal({ onClose, onSuccess }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    purchase_price: '',
    purchase_date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const selectedProduct = products.find(p => p.id === formData.product_id);
  const totalCost = formData.quantity && formData.purchase_price 
    ? (parseFloat(formData.quantity) * parseFloat(formData.purchase_price)).toFixed(2)
    : '0.00';

  const handleSubmit = async () => {
    setError('');
    
    if (!formData.product_id || !formData.quantity || !formData.purchase_price || !formData.purchase_date) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const quantity = parseInt(formData.quantity);
      const purchasePrice = parseFloat(formData.purchase_price);
      const totalCost = quantity * purchasePrice;

      // Add stock purchase record
      const { error: purchaseError } = await supabase
        .from('stock_purchases')
        .insert([{
          product_id: formData.product_id,
          quantity: quantity,
          purchase_price: purchasePrice,
          total_cost: totalCost,
          purchase_date: formData.purchase_date,
          notes: formData.notes || null
        }]);

      if (purchaseError) throw purchaseError;

      // Update product quantity
      const currentQty = selectedProduct.current_quantity;
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          current_quantity: currentQty + quantity,
          purchase_price: purchasePrice  // Update latest purchase price
        })
        .eq('id', formData.product_id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add stock purchase');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add Stock Purchase</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Product *</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by SKU or name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            {searchTerm && (
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg mb-2">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setFormData({...formData, product_id: product.id});
                      setSearchTerm('');
                    }}
                    className="w-full p-3 hover:bg-gray-50 flex justify-between items-center border-b last:border-b-0 text-left"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">SKU: {product.sku} | Stock: {product.current_quantity}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedProduct && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-900">{selectedProduct.name}</p>
                <p className="text-sm text-blue-700">SKU: {selectedProduct.sku} | Current Stock: {selectedProduct.current_quantity}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter quantity"
                disabled={!formData.product_id}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (per unit) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({...formData, purchase_price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Price per unit"
                disabled={!formData.product_id}
              />
            </div>
          </div>

          {totalCost !== '0.00' && (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-900">Total Cost</p>
              <p className="text-2xl font-bold text-green-600">₹{totalCost}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date *</label>
            <input
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="2"
              placeholder="Supplier, invoice number, etc..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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
            disabled={loading || !formData.product_id}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-green-300"
          >
            {loading ? 'Adding...' : 'Add Stock Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Pending Payments Widget
function PendingPaymentsWidget({ user }) {
  const [customers, setCustomers] = useState([]);
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayer, setSelectedPayer] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .gt('credit_balance', 0)
        .order('credit_balance', { ascending: false });

      const { data: garagesData } = await supabase
        .from('garages')
        .select('*')
        .gt('credit_balance', 0)
        .order('credit_balance', { ascending: false });

      setCustomers(customersData || []);
      setGarages(garagesData || []);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  const totalPending = customers.length + garages.length;

  if (totalPending === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Payments</h3>
        <div className="text-center py-8">
          <p className="text-green-600 font-medium">✓ All payments collected!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Pending Payments ({totalPending})
      </h3>

      {garages.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Garages with Credit</h4>
          <div className="space-y-2">
            {garages.slice(0, 5).map(garage => (
              <div key={garage.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{garage.name}</p>
                  <p className="text-xs text-gray-600">{garage.contact_person}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-red-600">
                    ₹{parseFloat(garage.credit_balance).toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedPayer({ ...garage, type: 'garage' });
                      setShowPaymentModal(true);
                    }}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Collect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {customers.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Customers with Credit</h4>
          <div className="space-y-2">
            {customers.slice(0, 5).map(customer => (
              <div key={customer.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-xs text-gray-600">{customer.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-red-600">
                    ₹{parseFloat(customer.credit_balance).toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedPayer({ ...customer, type: 'customer' });
                      setShowPaymentModal(true);
                    }}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Collect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPaymentModal && selectedPayer && (
        selectedPayer.type === 'garage' ? (
          <RecordGaragePaymentModal
            garage={selectedPayer}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedPayer(null);
            }}
            onSuccess={() => {
              setShowPaymentModal(false);
              setSelectedPayer(null);
              fetchPendingPayments();
            }}
          />
        ) : (
          <RecordPaymentModal
            customer={selectedPayer}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedPayer(null);
            }}
            onSuccess={() => {
              setShowPaymentModal(false);
              setSelectedPayer(null);
              fetchPendingPayments();
            }}
          />
        )
      )}
    </div>
  );
}

// Edit Product Modal
function EditProductModal({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    sku: product.sku || '',
    name: product.name,
    category: product.category,
    purchase_price: product.purchase_price,
    selling_price: product.selling_price,
    gst_rate: product.gst_rate,
    minimum_quantity: product.minimum_quantity
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    if (!formData.name || !formData.category || !formData.purchase_price || 
        !formData.selling_price || !formData.minimum_quantity) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const { error: dbError } = await supabase
        .from('products')
        .update({
          sku: formData.sku || null,
          name: formData.name,
          category: formData.category,
          purchase_price: parseFloat(formData.purchase_price),
          selling_price: parseFloat(formData.selling_price),
          gst_rate: parseFloat(formData.gst_rate),
          minimum_quantity: parseInt(formData.minimum_quantity)
        })
        .eq('id', product.id);

      if (dbError) throw dbError;
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Product</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Optional)</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Quantity *</label>
            <input
              type="number"
              value={formData.minimum_quantity}
              onChange={(e) => setFormData({...formData, minimum_quantity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
            <input
              type="number"
              value={product.current_quantity}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Use "Add Stock" button to update</p>
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
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Quick Add Stock Modal
function QuickAddStockModal({ product, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(product.purchase_price);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalCost = quantity && purchasePrice 
    ? (parseFloat(quantity) * parseFloat(purchasePrice)).toFixed(2)
    : '0.00';

  const handleSubmit = async () => {
    setError('');
    
    if (!quantity || !purchasePrice) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const qty = parseInt(quantity);
      const price = parseFloat(purchasePrice);
      const total = qty * price;

      const { error: purchaseError } = await supabase
        .from('stock_purchases')
        .insert([{
          product_id: product.id,
          quantity: qty,
          purchase_price: price,
          total_cost: total,
          purchase_date: new Date().toISOString().split('T')[0],
          notes: notes || null
        }]);

      if (purchaseError) throw purchaseError;

      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          current_quantity: product.current_quantity + qty,
          purchase_price: price
        })
        .eq('id', product.id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add Stock</h3>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="font-medium text-blue-900">{product.name}</p>
          <p className="text-sm text-blue-700">SKU: {product.sku || 'N/A'} | Current Stock: {product.current_quantity}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add *</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (per unit) *</label>
            <input
              type="number"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Price per unit"
            />
          </div>

          {totalCost !== '0.00' && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-green-900">Total Cost</p>
                  <p className="text-xs text-green-700">New Stock: {product.current_quantity + parseInt(quantity || 0)}</p>
                </div>
                <p className="text-2xl font-bold text-green-600">₹{totalCost}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="2"
              placeholder="Supplier, invoice number, etc..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-green-300"
          >
            {loading ? 'Adding...' : 'Add Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}