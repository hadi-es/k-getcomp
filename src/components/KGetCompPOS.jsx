import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Monitor,
  MapPin,
  Smartphone,
  Printer,
  Search,
  Plus,
  Minus,
  Trash2,
  Calculator,
  Receipt,
  Database,
  BarChart3,
  Package,
  FileText,
  Download,
  Edit,
  Save,
  X,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";

const KGetCompPOS = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("pos");
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Database simulation using localStorage
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCartItem, setEditingCartItem] = useState(null);
  const [showReceipt, setShowReceipt] = useState(null);
  const receiptRef = useRef();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Login credentials (in real app, this would be from backend)
  const validCredentials = {
    username: "kget",
    password: "kget321",
  };

  // Initial inventory data
  const initialInventory = [
    // Services
    { id: 1, name: "Servis Laptop - Pembersihan Internal", category: "laptop", price: 75000, type: "service", stock: null, sold: 0, description: "Pembersihan menyeluruh bagian dalam laptop", icon: Monitor },
    { id: 2, name: "Servis Laptop - Ganti LCD", category: "laptop", price: 350000, type: "service", stock: null, sold: 0, description: "Penggantian layar LCD laptop rusak", icon: Monitor },
    { id: 3, name: "Servis Laptop - Ganti Keyboard", category: "laptop", price: 150000, type: "service", stock: null, sold: 0, description: "Penggantian keyboard laptop yang rusak", icon: Monitor },
    { id: 4, name: "Servis Laptop - Install Ulang OS", category: "laptop", price: 100000, type: "service", stock: null, sold: 0, description: "Install ulang sistem operasi Windows/Linux", icon: Monitor },
    { id: 5, name: "Servis Laptop - Upgrade RAM", category: "laptop", price: 50000, type: "service", stock: null, sold: 0, description: "Layanan upgrade RAM laptop", icon: Monitor },

    // CPU Services
    { id: 6, name: "Servis CPU - Pembersihan Internal", category: "cpu", price: 50000, type: "service", stock: null, sold: 0, description: "Pembersihan debu dan kotoran dalam CPU", icon: MapPin },
    { id: 7, name: "Servis CPU - Ganti Power Supply", category: "cpu", price: 75000, type: "service", stock: null, sold: 0, description: "Penggantian PSU yang rusak", icon: MapPin },
    { id: 8, name: "Servis CPU - Install Ulang Windows", category: "cpu", price: 80000, type: "service", stock: null, sold: 0, description: "Install ulang Windows lengkap dengan driver", icon: MapPin },
    { id: 9, name: "Servis CPU - Upgrade Hardware", category: "cpu", price: 100000, type: "service", stock: null, sold: 0, description: "Layanan upgrade komponen hardware", icon: MapPin },

    // Smartphone Services
    { id: 10, name: "Servis HP - Ganti LCD", category: "phone", price: 200000, type: "service", stock: null, sold: 0, description: "Penggantian layar smartphone yang pecah", icon: Smartphone },
    { id: 11, name: "Servis HP - Ganti Baterai", category: "phone", price: 120000, type: "service", stock: null, sold: 0, description: "Penggantian baterai smartphone", icon: Smartphone },
    { id: 12, name: "Servis HP - Flash/Root", category: "phone", price: 75000, type: "service", stock: null, sold: 0, description: "Flash firmware atau root smartphone", icon: Smartphone },
    { id: 13, name: "Servis HP - Ganti Kamera", category: "phone", price: 150000, type: "service", stock: null, sold: 0, description: "Penggantian kamera belakang/depan", icon: Smartphone },

    // Printer Services
    { id: 14, name: "Servis Printer - Head Cleaning", category: "printer", price: 50000, type: "service", stock: null, sold: 0, description: "Pembersihan head printer untuk hasil cetak optimal", icon: Printer },
    { id: 15, name: "Servis Printer - Ganti Cartridge", category: "printer", price: 25000, type: "service", stock: null, sold: 0, description: "Layanan penggantian cartridge printer", icon: Printer },
    { id: 16, name: "Servis Printer - Perbaikan Mekanik", category: "printer", price: 100000, type: "service", stock: null, sold: 0, description: "Perbaikan masalah mekanik printer", icon: Printer },

    // Products
    { id: 17, name: "RAM DDR4 8GB", category: "laptop", price: 450000, type: "product", stock: 10, sold: 0, minStock: 2, description: "Memory RAM DDR4 8GB 2400MHz" },
    { id: 18, name: "SSD 256GB", category: "laptop", price: 650000, type: "product", stock: 5, sold: 0, minStock: 1, description: "SSD SATA 256GB untuk upgrade storage" },
    { id: 19, name: "Keyboard Laptop Universal", category: "laptop", price: 75000, type: "product", stock: 3, sold: 0, minStock: 1, description: "Keyboard replacement universal laptop" },
    { id: 20, name: "Power Supply 500W", category: "cpu", price: 350000, type: "product", stock: 2, sold: 0, minStock: 1, description: "PSU 500W 80+ Bronze certified" },
    { id: 21, name: "LCD iPhone 12", category: "phone", price: 800000, type: "product", stock: 1, sold: 0, minStock: 1, description: "LCD replacement iPhone 12 original quality" },
    { id: 22, name: "Cartridge Canon 810", category: "printer", price: 150000, type: "product", stock: 8, sold: 0, minStock: 2, description: "Cartridge tinta Canon PG-810 original" },
  ];

  // Check login status on component mount
  useEffect(() => {
    const savedLogin = localStorage.getItem("kget-login");
    if (savedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    if (isLoggedIn) {
      const savedTransactions = localStorage.getItem("kget-transactions");
      const savedInventory = localStorage.getItem("kget-inventory");

      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }

      if (savedInventory) {
        setInventory(JSON.parse(savedInventory));
      } else {
        setInventory(initialInventory);
        localStorage.setItem("kget-inventory", JSON.stringify(initialInventory));
      }
    }
  }, [isLoggedIn]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("kget-transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (inventory.length > 0) {
      localStorage.setItem("kget-inventory", JSON.stringify(inventory));
    }
  }, [inventory]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (loginForm.username === validCredentials.username && loginForm.password === validCredentials.password) {
      setIsLoggedIn(true);
      localStorage.setItem("kget-login", "true");
      setLoginForm({ username: "", password: "" });
    } else {
      setLoginError("Username atau password salah!");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("kget-login");
    setActiveTab("pos");
    setCart([]);
    setCustomerInfo({ name: "", phone: "", email: "" });
  };

  const filteredItems = inventory.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const addToCart = (item) => {
    if (item.type === "product" && item.stock === 0) return;

    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)));
    } else {
      setCart([...cart, { ...item, quantity: 1, customPrice: item.price, customDescription: item.description || "" }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      const item = inventory.find((inv) => inv.id === id);
      if (item && item.type === "product" && newQuantity > item.stock) return;

      setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
    }
  };

  const updateCartItem = (id, field, value) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.customPrice || item.price) * item.quantity, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      alert("Mohon lengkapi data pelanggan!");
      return;
    }

    const receipt = {
      id: Date.now(),
      customer: customerInfo,
      items: cart.map((item) => ({
        ...item,
        finalPrice: item.customPrice || item.price,
        finalDescription: item.customDescription || item.description || "",
      })),
      total: getTotal(),
      date: new Date().toISOString(),
      invoiceNo: "KGC-" + Date.now(),
    };

    // Update inventory
    const updatedInventory = inventory.map((item) => {
      const cartItem = cart.find((c) => c.id === item.id);
      if (cartItem) {
        return {
          ...item,
          stock: item.type === "product" ? item.stock - cartItem.quantity : item.stock,
          sold: item.sold + cartItem.quantity,
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    setTransactions([receipt, ...transactions]);
    setShowReceipt(receipt);

    // Reset form
    setCart([]);
    setCustomerInfo({ name: "", phone: "", email: "" });
  };

  const printReceipt = () => {
    const printWindow = window.open("", "_blank");

    const receiptHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt - ${showReceipt.invoiceNo}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial Narrow', Arial, sans-serif;
            font-weight: bold; /* Tambahkan bold global */
          }
          body {
            width: 80mm;
            padding: 1mm 2mm; /* Margin kanan-kiri 2mm */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header {
            text-align: center;
            margin-bottom: 3mm;
            padding-bottom: 2mm;
            border-bottom: 1px dashed #000;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            margin: 1mm 0;
            font-size: 13pt; /* Diperbesar dari 12pt */
            line-height: 1.3;
          }
          .item-desc {
            font-size: 12pt; /* Diperbesar dari 11pt */
            color: #555;
            margin-left: 4mm;
            margin-bottom: 1mm;
            font-weight: normal; /* Deskripsi tidak bold */
          }
          .total-row {
            border-top: 1px dashed #000;
            padding-top: 2mm;
            margin-top: 2mm;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 3mm;
            font-size: 12pt; /* Diperbesar dari 11pt */
          }
        </style>
      </head>
      <body>
        <div id="receipt-content">
          <div class="header">
            <h2 style="font-size:18pt;margin-bottom:1mm;">K-Get Comp</h2> <!-- Diperbesar dari 16pt -->
            <p style="font-size:13pt;margin:1mm 0;">Servis Laptop & Elektronik</p> <!-- Diperbesar dari 12pt -->
            <p style="font-size:13pt;margin:1mm 0;">${showReceipt.invoiceNo}</p> <!-- Diperbesar dari 12pt -->
            <p style="font-size:13pt;">${new Date(showReceipt.date).toLocaleDateString("id-ID")} ${new Date(showReceipt.date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p> <!-- Diperbesar dari 12pt -->
          </div>
          
          <div style="margin-bottom:2mm;">
            <p style="font-size:13pt;"><strong>Pelanggan: ${showReceipt.customer.name}</strong></p> <!-- Diperbesar dari 12pt -->
            <p style="font-size:13pt;"><strong>Telepon:</strong> ${showReceipt.customer.phone}</p> <!-- Diperbesar dari 12pt -->
          </div>
          
          ${showReceipt.items
            .map(
              (item) => `
            <div class="item-row">
              <span>${item.name} x${item.quantity}</span>
              <span>${formatPrice((item.finalPrice || item.customPrice || item.price) * item.quantity)}</span>
            </div>
            ${item.finalDescription ? `<div class="item-desc">${item.finalDescription}</div>` : ""}
          `
            )
            .join("")}
          
          <div class="total-row item-row">
            <span>TOTAL:</span>
            <span>${formatPrice(showReceipt.total)}</span>
          </div>
          
          <div class="footer">
            <p>Terima kasih atas kepercayaan Anda</p>
          </div>
        </div>

        <script>
          (function() {
            const content = document.getElementById('receipt-content');
            const contentHeight = content.scrollHeight;
            document.body.style.height = (contentHeight * 0.264583) + 'mm';
            
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 100);
            }, 50);
          })();
        </script>
      </body>
    </html>
  `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  const updateInventoryItem = (updatedItem) => {
    setInventory(inventory.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    setEditingItem(null);
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      name: "Item Baru",
      category: "laptop",
      price: 0,
      type: "product",
      stock: 0,
      sold: 0,
      minStock: 1,
      description: "Deskripsi item baru",
    };
    setInventory([...inventory, newItem]);
    setEditingItem(newItem);
  };

  const deleteItem = (id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    setInventory(inventory.filter((item) => item.id !== itemToDelete));
    setShowConfirmModal(false);
  };

  const getSalesReport = () => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    const todayTransactions = transactions.filter((t) => new Date(t.date).toDateString() === today.toDateString());
    const monthTransactions = transactions.filter((t) => new Date(t.date) >= thisMonth);
    const yearTransactions = transactions.filter((t) => new Date(t.date) >= thisYear);

    return {
      today: {
        sales: todayTransactions.reduce((sum, t) => sum + t.total, 0),
        transactions: todayTransactions.length,
      },
      month: {
        sales: monthTransactions.reduce((sum, t) => sum + t.total, 0),
        transactions: monthTransactions.length,
      },
      year: {
        sales: yearTransactions.reduce((sum, t) => sum + t.total, 0),
        transactions: yearTransactions.length,
      },
    };
  };
  const handleEditTransaction = (transaction) => {
    // Set transaction data to form for editing
    setCustomerInfo(transaction.customer);
    setCart(
      transaction.items.map((item) => ({
        ...item,
        quantity: item.quantity,
        customPrice: item.finalPrice,
        customDescription: item.finalDescription,
      }))
    );

    // Switch to POS tab for editing
    setActiveTab("pos");

    // Scroll to top
    window.scrollTo(0, 0);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
      // Also update localStorage if you're using it
      const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
      localStorage.setItem("kget-transactions", JSON.stringify(updatedTransactions));
    }
  };

  const CategoryIcon = ({ category }) => {
    switch (category) {
      case "laptop":
        return <Monitor className="w-5 h-5" />;
      case "cpu":
        return <MapPin className="w-5 h-5" />;
      case "phone":
        return <Smartphone className="w-5 h-5" />;
      case "printer":
        return <Printer className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black opacity-20"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-5 rounded-full animate-ping"></div>
        </div>

        <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-500 hover:scale-105">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl mx-auto w-fit mb-4 shadow-lg">
              <Monitor className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">K-Get Comp</h1>
            <p className="text-gray-600 mt-2">Sistem Point of Sale</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {loginError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl animate-shake">{loginError}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memuat...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>{/* Demo: username: <strong>admin</strong>, password: <strong>admin123</strong> */}</p>
          </div>
        </div>
      </div>
    );
  }

  const salesReport = getSalesReport();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-blue-600 p-2 rounded-lg shadow-lg transform transition-transform hover:scale-110">
              <Monitor className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">K-Get Comp</h1>
              <p className="text-blue-200">Sistem Point of Sale</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {activeTab === "pos" && (
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
                <ShoppingCart className="w-6 h-6" />
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-sm animate-pulse">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
            )}
            <button onClick={handleLogout} className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-2 transition-all duration-300 transform hover:scale-105">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex space-x-1 p-2">
          {[
            { id: "pos", label: "Point of Sale", icon: ShoppingCart, color: "blue" },
            { id: "inventory", label: "Manajemen Inventory", icon: Package, color: "green" },
            { id: "reports", label: "Laporan Penjualan", icon: BarChart3, color: "purple" },
            { id: "transactions", label: "Riwayat Transaksi", icon: Database, color: "indigo" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id ? `bg-${tab.color}-100 text-${tab.color}-600 border border-${tab.color}-200 shadow-md` : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Point of Sale Tab */}
      {activeTab === "pos" && (
        <div className="flex h-screen">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari layanan atau produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                />
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
                        <CategoryIcon category={item.category} />
                      </div>
                      <div className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">{item.category}</div>
                    </div>
                    {item.type === "product" && (
                      <div className={`text-xs px-2 py-1 rounded-full animate-pulse ${item.stock === 0 ? "bg-red-100 text-red-600" : item.stock <= item.minStock ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}`}>
                        Stok: {item.stock}
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>

                  {item.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>}

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{formatPrice(item.price)}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className={`px-3 py-1 rounded-lg transition-all duration-300 flex items-center space-x-1 transform hover:scale-110 ${
                        item.type === "product" && item.stock === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                      }`}
                      disabled={item.type === "product" && item.stock === 0}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="w-96 bg-white shadow-lg p-6 overflow-y-auto border-l">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Keranjang Belanja
            </h2>

            {/* Customer Info */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-2">Data Pelanggan</h3>
              <input
                type="text"
                placeholder="Nama Pelanggan *"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full mb-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <input
                type="tel"
                placeholder="No. Telepon *"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full mb-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <input
                type="email"
                placeholder="Email (opsional)"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Keranjang masih kosong</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={item.id} className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border transition-all duration-300 hover:shadow-md" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm line-clamp-2 flex-1">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 ml-2 p-1 rounded transition-all duration-300 hover:bg-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Editable Description */}
                    {editingCartItem === item.id ? (
                      <div className="mb-2 space-y-2">
                        <textarea
                          value={item.customDescription || ""}
                          onChange={(e) => updateCartItem(item.id, "customDescription", e.target.value)}
                          placeholder="Deskripsi/catatan..."
                          className="w-full p-2 border rounded text-xs resize-none"
                          rows="2"
                        />
                        <input
                          type="number"
                          value={item.customPrice || item.price}
                          onChange={(e) => updateCartItem(item.id, "customPrice", parseInt(e.target.value) || 0)}
                          className="w-full p-2 border rounded text-sm"
                          placeholder="Harga custom"
                        />
                        <div className="flex space-x-2">
                          <button onClick={() => setEditingCartItem(null)} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition-all duration-300">
                            <Save className="w-3 h-3 inline mr-1" />
                            Simpan
                          </button>
                          <button onClick={() => setEditingCartItem(null)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-all duration-300">
                            <X className="w-3 h-3 inline mr-1" />
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-2">
                        {item.customDescription && <p className="text-xs text-gray-600 mb-1">{item.customDescription}</p>}
                        <button onClick={() => setEditingCartItem(item.id)} className="text-xs text-blue-600 hover:text-blue-800 flex items-center transition-all duration-300">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit harga/deskripsi
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">{formatPrice((item.customPrice || item.price) * item.quantity)}</div>
                        {item.customPrice && item.customPrice !== item.price && <div className="text-xs text-gray-500 line-through">{formatPrice(item.price * item.quantity)}</div>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            {cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{formatPrice(getTotal())}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Proses Transaksi</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inventory Management Tab */}
      {activeTab === "inventory" && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Manajemen Inventory</h2>
            <button
              onClick={addNewItem}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Item</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tipe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Harga</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stok</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Terjual</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Deskripsi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-all duration-300" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem?.id === item.id ? (
                          <input
                            type="text"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                            className="w-full p-1 border rounded focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          />
                        ) : (
                          <div className="font-medium text-gray-900">{item.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem?.id === item.id ? (
                          <select value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} className="p-1 border rounded focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                            <option value="laptop">Laptop</option>
                            <option value="cpu">CPU</option>
                            <option value="phone">Phone</option>
                            <option value="printer">Printer</option>
                          </select>
                        ) : (
                          <span className="capitalize">{item.category}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem?.id === item.id ? (
                          <select value={editingItem.type} onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })} className="p-1 border rounded focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                            <option value="service">Service</option>
                            <option value="product">Product</option>
                          </select>
                        ) : (
                          <span className="capitalize">{item.type}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem?.id === item.id ? (
                          <input
                            type="number"
                            value={editingItem.price}
                            onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })}
                            className="w-24 p-1 border rounded focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          />
                        ) : (
                          formatPrice(item.price)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.type === "service" ? (
                          "-"
                        ) : editingItem?.id === item.id ? (
                          <input
                            type="number"
                            value={editingItem.stock}
                            onChange={(e) => setEditingItem({ ...editingItem, stock: parseInt(e.target.value) || 0 })}
                            className="w-16 p-1 border rounded focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          />
                        ) : (
                          item.stock
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-green-600">{item.sold}</span>
                      </td>
                      <td className="px-6 py-4">
                        {editingItem?.id === item.id ? (
                          <textarea
                            value={editingItem.description || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            className="w-full p-1 border rounded focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                            rows="2"
                          />
                        ) : (
                          <div className="text-sm text-gray-600 max-w-xs line-clamp-2">{item.description || "-"}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.type === "service" ? (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full animate-pulse">Aktif</span>
                        ) : item.stock === 0 ? (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full animate-bounce">Habis</span>
                        ) : item.stock <= item.minStock ? (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full animate-pulse">Stok Rendah</span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Tersedia</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingItem?.id === item.id ? (
                          <div className="flex space-x-2">
                            <button onClick={() => updateInventoryItem(editingItem)} className="text-green-600 hover:text-green-900 p-1 rounded transition-all duration-300 hover:bg-green-100 transform hover:scale-110">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingItem(null)} className="text-gray-600 hover:text-gray-900 p-1 rounded transition-all duration-300 hover:bg-gray-100 transform hover:scale-110">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:text-blue-900 p-1 rounded transition-all duration-300 hover:bg-blue-100 transform hover:scale-110">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteItem(item.id)} className="text-red-600 hover:text-red-900 p-1 rounded transition-all duration-300 hover:bg-red-100 transform hover:scale-110">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sales Reports Tab */}
      {activeTab === "reports" && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Laporan Penjualan</h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Hari Ini</p>
                  <p className="text-2xl font-bold">{formatPrice(salesReport.today.sales)}</p>
                  <p className="text-blue-200">{salesReport.today.transactions} transaksi</p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Bulan Ini</p>
                  <p className="text-2xl font-bold">{formatPrice(salesReport.month.sales)}</p>
                  <p className="text-green-200">{salesReport.month.transactions} transaksi</p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Tahun Ini</p>
                  <p className="text-2xl font-bold">{formatPrice(salesReport.year.sales)}</p>
                  <p className="text-purple-200">{salesReport.year.transactions} transaksi</p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Item Terlaris
            </h3>
            <div className="space-y-3">
              {inventory
                .filter((item) => item.sold > 0)
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 10)
                .map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border transition-all duration-300 hover:shadow-md hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
                        <CategoryIcon category={item.category} />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {item.category} - {item.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{item.sold} terjual</p>
                      <p className="text-sm text-gray-600">{formatPrice(item.price * item.sold)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Tab */}
      {activeTab === "transactions" && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Riwayat Transaksi</h2>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Pelanggan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-all duration-300" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{transaction.invoiceNo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{new Date(transaction.date).toLocaleDateString("id-ID")}</div>
                        <div className="text-sm text-gray-500">{new Date(transaction.date).toLocaleTimeString("id-ID")}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{transaction.customer.name}</div>
                        <div className="text-sm text-gray-500">{transaction.customer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.items.length} item(s)</div>
                        <div className="text-xs text-gray-500">{transaction.items.reduce((sum, item) => sum + item.quantity, 0)} qty</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-green-600">{formatPrice(transaction.total)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => setShowReceipt(transaction)} className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 p-2 rounded transition-all duration-300 hover:bg-blue-100 transform hover:scale-110">
                            <Receipt className="w-4 h-4" />
                            <span>Detail</span>
                          </button>
                          <button
                            onClick={() => handleEditTransaction(transaction)}
                            className="text-yellow-600 hover:text-yellow-900 flex items-center space-x-1 p-2 rounded transition-all duration-300 hover:bg-yellow-100 transform hover:scale-110"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-900 flex items-center space-x-1 p-2 rounded transition-all duration-300 hover:bg-red-100 transform hover:scale-110"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {transactions.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Belum ada transaksi</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-90vh overflow-y-auto transform transition-all duration-300 animate-slideUp">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Detail Transaksi</h3>
                <button onClick={() => setShowReceipt(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded transition-all duration-300 hover:bg-gray-100 transform hover:scale-110">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div ref={receiptRef} className="space-y-4">
                {/* Header */}
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">K-Get Comp</h2>
                  <p className="text-sm text-gray-600">Servis Laptop, CPU, HP & Printer</p>
                  <p className="text-sm font-mono mt-2 bg-gray-100 px-2 py-1 rounded">Invoice: {showReceipt.invoiceNo}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(showReceipt.date).toLocaleDateString("id-ID")} -{new Date(showReceipt.date).toLocaleTimeString("id-ID")}
                  </p>
                </div>

                {/* Customer Info */}
                <div className="border-b pb-4 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                  <h4 className="font-semibold mb-2">Data Pelanggan</h4>
                  <p>
                    <strong>Nama:</strong> {showReceipt.customer.name}
                  </p>
                  <p>
                    <strong>Telepon:</strong> {showReceipt.customer.phone}
                  </p>
                  {showReceipt.customer.email && (
                    <p>
                      <strong>Email:</strong> {showReceipt.customer.email}
                    </p>
                  )}
                </div>

                {/* Items */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2">Detail Pembelian</h4>
                  <div className="space-y-2">
                    {showReceipt.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">
                            {item.name} x{item.quantity}
                          </p>
                          {item.finalDescription && <p className="text-xs text-gray-600 italic">{item.finalDescription}</p>}
                          <p className="text-gray-500">
                            {formatPrice(item.finalPrice || item.customPrice || item.price)} x {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">{formatPrice((item.finalPrice || item.customPrice || item.price) * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>TOTAL:</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{formatPrice(showReceipt.total)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Terima kasih atas kepercayaan Anda!</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={printReceipt}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button onClick={() => setShowReceipt(null)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6 animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Konfirmasi Hapus</h3>
              <button onClick={() => setShowConfirmModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="mb-6">Yakin ingin menghapus item ini?</p>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors">
                Batal
              </button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KGetCompPOS;
