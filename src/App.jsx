import React, { useState } from 'react';
import { Search, Plus, AlertCircle, Package, Users, FileText, TrendingUp, DollarSign, ShoppingCart, LogOut, Menu, X, Eye, EyeOff } from 'lucide-react';

// Mock data for demo
const mockData = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'salesrep', password: 'sales123', role: 'sales_rep' }
  ]
};

// Main App Component
export default function InventoryManagementApp() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [saleType, setSaleType] = useState(null);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
    setSaleType(null);
  };

  const handleNewSale = (type) => {
    setSaleType(type);
    setCurrentView('new-sale');
  };

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

  const handleLogin = () => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      const foundUser = mockData.users.find(
        u => u.username === username && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 500);
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
          <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Admin:</strong> username: admin, password: admin123</p>
            <p><strong>Sales Rep:</strong> username: salesrep, password: sales123</p>
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
  const stats = {
    todaySales: 12,
    todayAmount: 45280,
    lowStockCount: 8,
    pendingPayments: 15,
    monthlyProfit: 125000,
    totalOutstanding: 89500,
    pendingCommission: 4250
  };

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

        {/* Quick Stats for Sales Rep */}
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

        {/* Low Stock Alert */}
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

        {/* Main Action - Create Sale */}
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

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales Today</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Sale #1234</p>
                <p className="text-sm text-gray-600">Walk-in customer</p>
              </div>
              <span className="font-semibold text-gray-900">₹2,450</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Sale #1233</p>
                <p className="text-sm text-gray-600">Kumar Garage</p>
              </div>
              <span className="font-semibold text-gray-900">₹8,900</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Sale #1232</p>
                <p className="text-sm text-gray-600">Rajesh - Regular Customer</p>
              </div>
              <span className="font-semibold text-gray-900">₹1,200</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard remains detailed
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

      {/* Quick Actions for Admin */}
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-3">This Month</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sales:</span>
                <span className="font-semibold">₹2,45,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expenses:</span>
                <span className="font-semibold">₹1,20,000</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-900 font-medium">Profit:</span>
                <span className="font-bold text-green-600">₹1,25,000</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Pending Actions</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm text-yellow-900">Commission payments</span>
                <span className="text-xs font-semibold text-yellow-700">₹4,250</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                <span className="text-sm text-red-900">Low stock items</span>
                <span className="text-xs font-semibold text-red-700">{stats.lowStockCount}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                <span className="text-sm text-orange-900">Pending collections</span>
                <span className="text-xs font-semibold text-orange-700">₹89,500</span>
              </div>
            </div>
          </div>
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

function NewSale({ saleType, setSaleType, setCurrentView }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">New Sale</h2>
      
      {!saleType ? (
        <div>
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
      ) : (
        <div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <div className="mb-4">
              {saleType === 'quick' && <ShoppingCart className="h-16 w-16 text-blue-600 mx-auto mb-3" />}
              {saleType === 'customer' && <Users className="h-16 w-16 text-green-600 mx-auto mb-3" />}
              {saleType === 'garage' && <FileText className="h-16 w-16 text-purple-600 mx-auto mb-3" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {saleType.charAt(0).toUpperCase() + saleType.slice(1)} Sale
            </h3>
            <p className="text-gray-600 mb-4">
              This interface will be implemented in Phase 1 with full functionality.
            </p>
            <button
              onClick={() => setSaleType(null)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Choose different sale type
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Products() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>
      <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Product management will be implemented in Phase 1</p>
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
        <p className="text-gray-600">Customer management will be implemented in Phase 2</p>
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
        <p className="text-gray-600">Garage management will be implemented in Phase 2</p>
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
        <p className="text-gray-600">Expense tracking will be implemented in Phase 6</p>
      </div>
    </div>
  );
}