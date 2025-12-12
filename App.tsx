import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList, Image } from 'react-native';

// Tipo para la navegación
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ClientForm: undefined;
  ProductForm: undefined;
  OrderForm: undefined;
  InventoryForm: undefined;
  SupplierForm: undefined;
  SalesReport: undefined;
  InventoryReport: undefined;
  ClientReport: undefined;
  FinancialReport: undefined;
  SupplierReport: undefined;
  Backup: undefined;
  Contact: undefined;
  TechnicalSupport: undefined;
  Warranty: undefined;
  Survey: undefined;
  UserRegister: undefined;
  Cart: undefined;
  InvoiceScreen: { invoiceData: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Context para manejar el tipo de usuario y carrito
const UserContext = React.createContext({
  userType: 'user',
  setUserType: (type: string) => { },
  userName: '',
  setUserName: (name: string) => { },
  cart: [] as CartItem[],
  addToCart: (product: Product) => { },
  removeFromCart: (productId: string) => { },
  updateQuantity: (productId: string, quantity: number) => { },
  clearCart: () => { }
});

// Interfaces para el carrito
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  description?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// Datos de ejemplo
const sampleData = {
  clients: [
    { id: '1', name: 'Juan Pérez', email: 'juan@email.com', phone: '123456789', lastPurchaseDate: '10/12/2023' },
    { id: '2', name: 'María García', email: 'maria@email.com', phone: '987654321', lastPurchaseDate: '09/12/2023' },
  ],
  products: [
    {
      id: '1',
      name: 'Laptop Dell XPS 13',
      price: 1200,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300&h=200&fit=crop',
      category: 'Laptops',
      description: 'Laptop ultradelgada con procesador Intel Core i7'
    },
    {
      id: '2',
      name: 'Mouse Inalámbrico Logitech',
      price: 25,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop',
      category: 'Periféricos',
      description: 'Mouse ergonómico con conexión Bluetooth'
    },
    {
      id: '3',
      name: 'Teclado Mecánico RGB',
      price: 89,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop',
      category: 'Periféricos',
      description: 'Teclado mecánico con retroiluminación RGB'
    },
    {
      id: '4',
      name: 'Monitor 24" Samsung',
      price: 199,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=200&fit=crop',
      category: 'Monitores',
      description: 'Monitor Full HD con tiempo de respuesta 1ms'
    },
    {
      id: '5',
      name: 'Auriculares Gaming',
      price: 75,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=300&h=200&fit=crop',
      category: 'Audio',
      description: 'Auriculares con sonido surround 7.1'
    },
    {
      id: '6',
      name: 'Tablet iPad Air',
      price: 599,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop',
      category: 'Tablets',
      description: 'Tablet con pantalla Retina y chip A14'
    }
  ]
};

// Componente para mostrar la factura
const InvoiceScreen = ({ route, navigation }: any) => {
  const { invoiceData } = route.params;
  return (
    <ScrollView style={styles.invoiceContainer}>
      <View style={styles.invoicePaper}>
        {/* Encabezado de la factura */}
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceTitle}>FACTURA DE COMPRA</Text>
          <Text style={styles.invoiceSubtitle}>TecnoReportes S.A.</Text>
          <Text style={styles.invoiceInfo}>NIT: 123456789-0</Text>
          <Text style={styles.invoiceInfo}>Tel: +57 1 2345678</Text>
        </View>
        <View style={styles.invoiceSeparator} />
        {/* Información del cliente */}
        <View style={styles.invoiceSection}>
          <Text style={styles.sectionTitle}>INFORMACIÓN DEL CLIENTE</Text>
          <Text style={styles.invoiceText}>Nombre: {invoiceData.customerName}</Text>
          <Text style={styles.invoiceText}>Email: {invoiceData.customerEmail}</Text>
          <Text style={styles.invoiceText}>Fecha: {invoiceData.date}</Text>
          <Text style={styles.invoiceText}>Factura No: {invoiceData.invoiceNumber}</Text>
        </View>
        <View style={styles.invoiceSeparator} />
        {/* Detalles de productos */}
        <View style={styles.invoiceSection}>
          <Text style={styles.sectionTitle}>DETALLES DE PRODUCTOS</Text>
          {invoiceData.items.map((item: any, index: number) => (
            <View key={index} style={styles.invoiceItem}>
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemPrice}>${item.price} c/u</Text>
                <Text style={styles.itemTotal}>${item.total}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.invoiceSeparator} />
        {/* Totales */}
        <View style={styles.invoiceSection}>
          <Text style={styles.sectionTitle}>RESUMEN DE PAGO</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${invoiceData.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA (19%):</Text>
            <Text style={styles.totalValue}>${invoiceData.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Envío:</Text>
            <Text style={styles.totalValue}>${invoiceData.shipping.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>TOTAL:</Text>
            <Text style={styles.grandTotalValue}>${invoiceData.grandTotal.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.invoiceSeparator} />
        {/* Pie de página */}
        <View style={styles.invoiceFooter}>
          <Text style={styles.footerText}>¡Gracias por su compra!</Text>
          <Text style={styles.footerText}>soporte@tecnoreportes.com</Text>
        </View>
        {/* Botones */}
        <View style={styles.invoiceButtons}>
          <TouchableOpacity
            style={styles.invoiceButton}
            onPress={() => {
              Alert.alert(
                'Factura Guardada',
                'La factura ha sido guardada',
                [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
              );
            }}
          >
            <Text style={styles.invoiceButtonText}>📥 Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.invoiceButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.invoiceButtonText}>🏠 Inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Pantalla de Login
const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUserType, setUserName } = React.useContext(UserContext);

  const handleLogin = () => {
    if (username && password) {
      const type = username.includes('admin') ? 'admin' : 'user';
      setUserType(type);
      setUserName(username);
      Alert.alert('Éxito', `Bienvenido ${type === 'admin' ? 'Administrador' : 'Usuario'}`);
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TecnoReportes</Text>
      <Text style={styles.subtitle}>Sistema de Gestión</Text>
      <View style={styles.loginForm}>
        <TextInput
          style={styles.input}
          placeholder="Usuario (admin/user)"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => navigation.navigate('UserRegister')}
        >
          <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Pantalla de Registro de Usuario
const UserRegisterScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    Alert.alert('Éxito', 'Usuario registrado correctamente');
    navigation.navigate('Login');
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre Completo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre"
          value={formData.name}
          onChangeText={(value) => updateField('name', value)}
        />
        <Text style={styles.label}>Correo Electrónico *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su email"
          value={formData.email}
          onChangeText={(value) => updateField('email', value)}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su teléfono"
          value={formData.phone}
          onChangeText={(value) => updateField('phone', value)}
          keyboardType="phone-pad"
        />
        <Text style={styles.label}>Contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Cree una contraseña"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => updateField('password', value)}
        />
        <Text style={styles.label}>Confirmar Contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Repita la contraseña"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(value) => updateField('confirmPassword', value)}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Pantalla del Carrito de Compras
const CartScreen = ({ navigation }: any) => {
  const { cart, removeFromCart, updateQuantity, clearCart, userName } = React.useContext(UserContext);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const generateInvoice = () => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.19;
    const shipping = subtotal > 100 ? 0 : 10;
    const grandTotal = subtotal + tax + shipping;
    return {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES'),
      customerName: userName || 'Cliente TecnoReportes',
      customerEmail: userName ? `${userName}@email.com` : 'cliente@email.com',
      items: cart.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity
      })),
      subtotal,
      tax,
      shipping,
      grandTotal,
      paymentMethod: 'Tarjeta de Crédito',
      paymentStatus: 'Pagado'
    };
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos al carrito');
      return;
    }
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.19;
    const shipping = subtotal > 100 ? 0 : 10;
    const grandTotal = subtotal + tax + shipping;
    let confirmMessage = '¿Confirmar compra?\n';
    cart.forEach((item) => {
      confirmMessage += `• ${item.product.name}\n`;
    });
    confirmMessage += `\nTotal: $${grandTotal.toFixed(2)}`;
    Alert.alert(
      'Confirmar Compra',
      confirmMessage,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            const invoiceData = generateInvoice();
            clearCart();
            navigation.navigate('InvoiceScreen', { invoiceData });
          }
        }
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName} numberOfLines={1}>{item.product.name}</Text>
        <Text style={styles.cartItemPrice}>${item.product.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => {
              if (item.quantity > 1) {
                updateQuantity(item.product.id, item.quantity - 1);
              } else {
                removeFromCart(item.product.id);
              }
            }}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => {
              if (item.quantity < item.product.stock) {
                updateQuantity(item.product.id, item.quantity + 1);
              } else {
                Alert.alert('Stock insuficiente', 'No hay más unidades');
              }
            }}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.product.id)}
      >
        <Text style={styles.removeButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito de Compras</Text>
      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>🛒</Text>
          <Text style={styles.emptyCartTitle}>Tu carrito está vacío</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Seguir Comprando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={item => item.product.id}
            style={styles.cartList}
          />
          <View style={styles.cartSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>${getTotalPrice().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>IVA (19%):</Text>
              <Text style={styles.summaryValue}>${(getTotalPrice() * 0.19).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Envío:</Text>
              <Text style={styles.summaryValue}>
                ${getTotalPrice() > 100 ? '0.00' : '10.00'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryTotal}>
                ${(getTotalPrice() * 1.19 + (getTotalPrice() > 100 ? 0 : 10)).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Pagar y Generar Factura</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearCartButton} onPress={clearCart}>
              <Text style={styles.clearCartButtonText}>Vaciar Carrito</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

// Pantalla Principal
const HomeScreen = ({ navigation }: any) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('productos');
  const { userType, cart, addToCart } = React.useContext(UserContext);

  useEffect(() => {
    setFeaturedProducts(sampleData.products);
  }, []);

  const adminMenuItems = [
    { title: 'Clientes', screen: 'ClientForm', icon: '👥', color: '#3498db' },
    { title: 'Productos', screen: 'ProductForm', icon: '📦', color: '#2ecc71' },
    { title: 'Pedidos', screen: 'OrderForm', icon: '📝', color: '#e74c3c' },
    { title: 'Inventario', screen: 'InventoryForm', icon: '📊', color: '#f39c12' },
    { title: 'Proveedores', screen: 'SupplierForm', icon: '🏢', color: '#9b59b6' },
    { title: 'Reporte Ventas', screen: 'SalesReport', icon: '💰', color: '#1abc9c' },
    { title: 'Reporte Inventario', screen: 'InventoryReport', icon: '📈', color: '#34495e' },
    { title: 'Reporte Clientes', screen: 'ClientReport', icon: '👤', color: '#e67e22' },
    { title: 'Reporte Financiero', screen: 'FinancialReport', icon: '💳', color: '#27ae60' },
    { title: 'Reporte Proveedores', screen: 'SupplierReport', icon: '🏭', color: '#8e44ad' },
    { title: 'Respaldo', screen: 'Backup', icon: '💾', color: '#7f8c8d' },
  ];

  const userMenuItems = [
    { title: 'Soporte Técnico', screen: 'TechnicalSupport', icon: '🔧', color: '#e74c3c' },
    { title: 'Garantías', screen: 'Warranty', icon: '🛡️', color: '#f39c12' },
    { title: 'Encuestas', screen: 'Survey', icon: '📋', color: '#9b59b6' },
    { title: 'Contacto', screen: 'Contact', icon: '📞', color: '#3498db' },
  ];

  const menuItems = userType === 'admin' ? adminMenuItems : userMenuItems;

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addToCart(product);
      Alert.alert('¡Agregado!', `${product.name} se agregó al carrito`);
    } else {
      Alert.alert('Stock agotado', 'Este producto no está disponible');
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <Text style={styles.productStock}>
          {item.stock > 0 ? `Stock: ${item.stock}` : 'Agotado'}
        </Text>
        <TouchableOpacity
          style={[
            styles.productButton,
            item.stock === 0 && styles.productButtonDisabled
          ]}
          onPress={() => handleAddToCart(item)}
          disabled={item.stock === 0}
        >
          <Text style={styles.productButtonText}>
            {item.stock > 0 ? '🛒 Agregar' : 'Agotado'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const formItems = menuItems.filter(item =>
    !item.title.includes('Reporte') && item.title !== 'Respaldo'
  );

  const reportItems = menuItems.filter(item =>
    item.title.includes('Reporte') || item.title === 'Respaldo'
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard TecnoReportes</Text>
        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartIconText}>🛒</Text>
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.userTypeBadge}>
        Modo: {userType === 'admin' ? 'Administrador' : 'Usuario'}
      </Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'productos' && styles.tabButtonActive]}
          onPress={() => setActiveTab('productos')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'productos' && styles.tabButtonTextActive]}>
            📦 Productos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'formularios' && styles.tabButtonActive]}
          onPress={() => setActiveTab('formularios')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'formularios' && styles.tabButtonTextActive]}>
            📝 Formularios
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'reportes' && styles.tabButtonActive]}
          onPress={() => setActiveTab('reportes')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'reportes' && styles.tabButtonTextActive]}>
            📊 Reportes
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'productos' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Productos Disponibles</Text>
          <FlatList
            data={featuredProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>
      )}
      {activeTab === 'formularios' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>
            {userType === 'admin' ? 'Formularios de Gestión' : 'Formularios de Servicio'}
          </Text>
          <View style={styles.grid}>
            {formItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { borderLeftColor: item.color }]}
                onPress={() => navigation.navigate(item.screen as any)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {activeTab === 'reportes' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Reportes y Análisis</Text>
          <View style={styles.grid}>
            {reportItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { borderLeftColor: item.color }]}
                onPress={() => navigation.navigate(item.screen as any)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// Componentes básicos restantes
const ClientFormScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const handleSave = () => {
    if (name && email && phone) {
      Alert.alert('Éxito', 'Cliente guardado correctamente');
      setName('');
      setEmail('');
      setPhone('');
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos');
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestión de Clientes</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput style={styles.input} placeholder="Ingrese el nombre" value={name} onChangeText={setName} />
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput style={styles.input} placeholder="Ingrese el email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Text style={styles.label}>Teléfono</Text>
        <TextInput style={styles.input} placeholder="Ingrese el teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar Cliente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ProductFormScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const handleSave = () => {
    if (name && price && stock) {
      Alert.alert('Éxito', 'Producto guardado correctamente');
      setName('');
      setPrice('');
      setStock('');
      setCategory('');
    } else {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestión de Productos</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre del Producto *</Text>
        <TextInput style={styles.input} placeholder="Ingrese el nombre" value={name} onChangeText={setName} />
        <Text style={styles.label}>Precio *</Text>
        <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={price} onChangeText={setPrice} />
        <Text style={styles.label}>Stock *</Text>
        <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={stock} onChangeText={setStock} />
        <Text style={styles.label}>Categoría</Text>
        <TextInput style={styles.input} placeholder="Seleccione categoría" value={category} onChangeText={setCategory} />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar Producto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const handleSend = () => {
    if (name && email && message) {
      Alert.alert('Mensaje enviado', 'Gracias por contactarnos');
      setName('');
      setEmail('');
      setMessage('');
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos');
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Contacto</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} placeholder="Ingrese su nombre" value={name} onChangeText={setName} />
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput style={styles.input} placeholder="Ingrese su email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Text style={styles.label}>Mensaje</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Escriba su mensaje"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Enviar Mensaje</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// === TODAS LAS PANTALLAS COMPLETADAS ===

// Pantalla de Gestión de Pedidos
const OrderFormScreen = () => {
  const [clientId, setClientId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [status, setStatus] = useState('pendiente');
  const [orders, setOrders] = useState<any[]>([]);
  const [editingOrder, setEditingOrder] = useState<any>(null);

  const handleSaveOrder = () => {
    if (!clientId || !productId || !quantity) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const client = sampleData.clients.find(c => c.id === clientId);
    const product = sampleData.products.find(p => p.id === productId);

    if (!client) {
      Alert.alert('Error', 'Cliente no encontrado');
      return;
    }

    if (!product) {
      Alert.alert('Error', 'Producto no encontrado');
      return;
    }

    if (parseInt(quantity) > product.stock) {
      Alert.alert('Error', 'La cantidad excede el stock disponible');
      return;
    }

    if (editingOrder) {
      // Editar pedido existente
      setOrders(prev => prev.map(order =>
        order.id === editingOrder.id
          ? { ...order, clientId, productId, quantity, status, date: new Date().toLocaleDateString() }
          : order
      ));
      setEditingOrder(null);
      Alert.alert('Éxito', 'Pedido actualizado correctamente');
    } else {
      // Crear nuevo pedido
      const newOrder = {
        id: Date.now().toString(),
        clientId,
        productId,
        quantity,
        status,
        date: new Date().toLocaleDateString(),
        clientName: client.name,
        productName: product.name
      };
      setOrders(prev => [...prev, newOrder]);
      Alert.alert('Éxito', 'Pedido creado correctamente');
    }

    // Resetear formulario
    setClientId('');
    setProductId('');
    setQuantity('1');
    setStatus('pendiente');
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setClientId(order.clientId);
    setProductId(order.productId);
    setQuantity(order.quantity.toString());
    setStatus(order.status);
  };

  const handleDeleteOrder = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            setOrders(prev => prev.filter(order => order.id !== id));
            Alert.alert('Éxito', 'Pedido eliminado correctamente');
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestión de Pedidos</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Cliente (ID)</Text>
        <TextInput
          style={styles.input}
          placeholder="1, 2, 3..."
          value={clientId}
          onChangeText={setClientId}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Producto (ID)</Text>
        <TextInput
          style={styles.input}
          placeholder="1, 2, 3..."
          value={productId}
          onChangeText={setProductId}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Cantidad</Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Estado</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            style={styles.pickerOption}
            onPress={() => setStatus('pendiente')}
          >
            <Text style={[styles.pickerText, status === 'pendiente' && styles.pickerSelected]}>Pendiente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pickerOption}
            onPress={() => setStatus('enviado')}
          >
            <Text style={[styles.pickerText, status === 'enviado' && styles.pickerSelected]}>Enviado</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pickerOption}
            onPress={() => setStatus('entregado')}
          >
            <Text style={[styles.pickerText, status === 'entregado' && styles.pickerSelected]}>Entregado</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, editingOrder && styles.updateButton]}
          onPress={handleSaveOrder}
        >
          <Text style={styles.buttonText}>
            {editingOrder ? 'Actualizar Pedido' : 'Crear Pedido'}
          </Text>
        </TouchableOpacity>

        {editingOrder && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setEditingOrder(null);
              setClientId('');
              setProductId('');
              setQuantity('1');
              setStatus('pendiente');
            }}
          >
            <Text style={styles.cancelButtonText}>Cancelar edición</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Pedidos Registrados</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No hay pedidos registrados</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>ID</Text>
            <Text style={styles.tableHeaderText}>Cliente</Text>
            <Text style={styles.tableHeaderText}>Producto</Text>
            <Text style={styles.tableHeaderText}>Cantidad</Text>
            <Text style={styles.tableHeaderText}>Estado</Text>
            <Text style={styles.tableHeaderText}>Acciones</Text>
          </View>

          {orders.map((order) => (
            <View key={order.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{order.id.slice(-4)}</Text>
              <Text style={styles.tableCell} numberOfLines={1}>{order.clientName}</Text>
              <Text style={styles.tableCell} numberOfLines={1}>{order.productName}</Text>
              <Text style={styles.tableCell}>{order.quantity}</Text>
              <Text style={[
                styles.tableCell,
                styles.statusBadge,
                order.status === 'pendiente' && styles.statusPendiente,
                order.status === 'enviado' && styles.statusEnviado,
                order.status === 'entregado' && styles.statusEntregado
              ]}>
                {order.status}
              </Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEditOrder(order)}>
                  <Text style={styles.editButton}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteOrder(order.id)}>
                  <Text style={styles.deleteButton}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Pantalla de Gestión de Inventario
const InventoryFormScreen = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('entrada');
  const [inventoryHistory, setInventoryHistory] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>(sampleData.products);

  const handleAdjustInventory = () => {
    if (!productId || !quantity) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      Alert.alert('Error', 'Producto no encontrado');
      return;
    }

    const amount = parseInt(quantity);
    const currentProduct = products[productIndex];
    let newStock = currentProduct.stock;

    if (adjustmentType === 'entrada') {
      newStock += amount;
    } else if (adjustmentType === 'salida') {
      if (amount > currentProduct.stock) {
        Alert.alert('Error', 'No puedes sacar más unidades de las disponibles');
        return;
      }
      newStock -= amount;
    }

    // Actualizar producto
    const updatedProducts = [...products];
    updatedProducts[productIndex] = {
      ...currentProduct,
      stock: newStock
    };

    setProducts(updatedProducts);

    // Registrar en historial
    const adjustment = {
      id: Date.now().toString(),
      productId,
      productName: currentProduct.name,
      type: adjustmentType,
      quantity: amount,
      newStock,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setInventoryHistory(prev => [adjustment, ...prev]);

    Alert.alert('Éxito', 'Inventario actualizado correctamente');

    // Resetear formulario
    setProductId('');
    setQuantity('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestión de Inventario</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Producto (ID)</Text>
        <TextInput
          style={styles.input}
          placeholder="1, 2, 3..."
          value={productId}
          onChangeText={setProductId}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Cantidad</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Tipo de ajuste</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            style={styles.pickerOption}
            onPress={() => setAdjustmentType('entrada')}
          >
            <Text style={[styles.pickerText, adjustmentType === 'entrada' && styles.pickerSelected]}>Entrada</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pickerOption}
            onPress={() => setAdjustmentType('salida')}
          >
            <Text style={[styles.pickerText, adjustmentType === 'salida' && styles.pickerSelected]}>Salida</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAdjustInventory}>
          <Text style={styles.buttonText}>Actualizar Inventario</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Estado Actual del Inventario</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Producto</Text>
          <Text style={styles.tableHeaderText}>Categoría</Text>
          <Text style={styles.tableHeaderText}>Stock</Text>
          <Text style={styles.tableHeaderText}>Estado</Text>
        </View>

        {products.map((product) => (
          <View key={product.id} style={styles.tableRow}>
            <Text style={styles.tableCell} numberOfLines={1}>{product.name}</Text>
            <Text style={styles.tableCell}>{product.category}</Text>
            <Text style={[
              styles.tableCell,
              product.stock > 10 ? styles.stockHigh :
                product.stock > 5 ? styles.stockMedium : styles.stockLow
            ]}>
              {product.stock}
            </Text>
            <Text style={[
              styles.tableCell,
              product.stock > 10 ? styles.statusBadgeHigh :
                product.stock > 5 ? styles.statusBadgeMedium : styles.statusBadgeLow
            ]}>
              {product.stock > 10 ? 'Óptimo' :
                product.stock > 5 ? 'Moderado' : 'Bajo'}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Historial de Ajustes</Text>

      {inventoryHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Sin ajustes de inventario</Text>
        </View>
      ) : (
        <View style={styles.historyContainer}>
          {inventoryHistory.slice(0, 5).map((entry) => (
            <View key={entry.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>{entry.date} • {entry.time}</Text>
                <Text style={[
                  styles.historyType,
                  entry.type === 'entrada' ? styles.typeEntrada : styles.typeSalida
                ]}>
                  {entry.type === 'entrada' ? '+ Entrada' : '- Salida'}
                </Text>
              </View>
              <Text style={styles.historyProduct}>{entry.productName}</Text>
              <View style={styles.historyDetails}>
                <Text style={styles.historyDetail}>Cantidad: {entry.quantity}</Text>
                <Text style={styles.historyDetail}>Nuevo stock: {entry.newStock}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Pantalla de Gestión de Proveedores
const SupplierFormScreen = () => {
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  const handleSaveSupplier = () => {
    if (!name || !contactName || !phone) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    if (editingSupplier) {
      // Editar proveedor existente
      setSuppliers(prev => prev.map(supplier =>
        supplier.id === editingSupplier.id
          ? { ...supplier, name, contactName, phone, email, address }
          : supplier
      ));
      setEditingSupplier(null);
      Alert.alert('Éxito', 'Proveedor actualizado correctamente');
    } else {
      // Crear nuevo proveedor
      const newSupplier = {
        id: Date.now().toString(),
        name,
        contactName,
        phone,
        email,
        address,
        dateAdded: new Date().toLocaleDateString()
      };
      setSuppliers(prev => [...prev, newSupplier]);
      Alert.alert('Éxito', 'Proveedor creado correctamente');
    }

    // Resetear formulario
    setName('');
    setContactName('');
    setPhone('');
    setEmail('');
    setAddress('');
  };

  const handleEditSupplier = (supplier: any) => {
    setEditingSupplier(supplier);
    setName(supplier.name);
    setContactName(supplier.contactName);
    setPhone(supplier.phone);
    setEmail(supplier.email);
    setAddress(supplier.address);
  };

  const handleDeleteSupplier = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este proveedor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
            Alert.alert('Éxito', 'Proveedor eliminado correctamente');
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestión de Proveedores</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre del Proveedor *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la empresa"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Nombre de Contacto *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del representante"
          value={contactName}
          onChangeText={setContactName}
        />

        <Text style={styles.label}>Teléfono *</Text>
        <TextInput
          style={styles.input}
          placeholder="Teléfono de contacto"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Dirección completa"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={2}
        />

        <TouchableOpacity
          style={[styles.button, editingSupplier && styles.updateButton]}
          onPress={handleSaveSupplier}
        >
          <Text style={styles.buttonText}>
            {editingSupplier ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
          </Text>
        </TouchableOpacity>

        {editingSupplier && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setEditingSupplier(null);
              setName('');
              setContactName('');
              setPhone('');
              setEmail('');
              setAddress('');
            }}
          >
            <Text style={styles.cancelButtonText}>Cancelar edición</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Proveedores Registrados</Text>

      {suppliers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No hay proveedores registrados</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Proveedor</Text>
            <Text style={styles.tableHeaderText}>Contacto</Text>
            <Text style={styles.tableHeaderText}>Teléfono</Text>
            <Text style={styles.tableHeaderText}>Acciones</Text>
          </View>

          {suppliers.map((supplier) => (
            <View key={supplier.id} style={styles.tableRow}>
              <Text style={styles.tableCell} numberOfLines={1}>{supplier.name}</Text>
              <Text style={styles.tableCell} numberOfLines={1}>{supplier.contactName}</Text>
              <Text style={styles.tableCell}>{supplier.phone}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEditSupplier(supplier)}>
                  <Text style={styles.editButton}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteSupplier(supplier.id)}>
                  <Text style={styles.deleteButton}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Pantalla de Reporte de Ventas
const SalesReportScreen = () => {
  const [dateRange, setDateRange] = useState('semana');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Datos de ejemplo para el reporte de ventas
  const sampleSales = [
    { id: '1', date: '10/12/2023', customer: 'Juan Pérez', product: 'Laptop Dell XPS 13', quantity: 1, total: 1200 },
    { id: '2', date: '10/12/2023', customer: 'María García', product: 'Mouse Inalámbrico Logitech', quantity: 2, total: 50 },
    { id: '3', date: '09/12/2023', customer: 'Carlos López', product: 'Monitor 24" Samsung', quantity: 1, total: 199 },
    { id: '4', date: '08/12/2023', customer: 'Ana Martínez', product: 'Teclado Mecánico RGB', quantity: 1, total: 89 },
    { id: '5', date: '07/12/2023', customer: 'Luis Rodríguez', product: 'Auriculares Gaming', quantity: 1, total: 75 },
  ];

  const getTotalSales = () => {
    return sampleSales.reduce((sum, sale) => sum + sale.total, 0);
  };

  const getAverageSale = () => {
    return sampleSales.length > 0 ? getTotalSales() / sampleSales.length : 0;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reporte de Ventas</Text>

      <View style={styles.reportHeader}>
        <Text style={styles.reportPeriod}>Período: {dateRange === 'semana' ? 'Última semana' : 'Personalizado'}</Text>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            style={[styles.dateRangeButton, dateRange === 'semana' && styles.dateRangeActive]}
            onPress={() => setDateRange('semana')}
          >
            <Text style={styles.dateRangeText}>Semana</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dateRangeButton, dateRange === 'personalizado' && styles.dateRangeActive]}
            onPress={() => setDateRange('personalizado')}
          >
            <Text style={styles.dateRangeText}>Personalizado</Text>
          </TouchableOpacity>
        </View>

        {dateRange === 'personalizado' && (
          <View style={styles.dateInputs}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>Desde</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="DD/MM/AAAA"
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>Hasta</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="DD/MM/AAAA"
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Total Ventas</Text>
          <Text style={styles.summaryCardValue}>${getTotalSales().toFixed(2)}</Text>
          <Text style={styles.summaryCardChange}>↑ 12.5% vs período anterior</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Pedidos</Text>
          <Text style={styles.summaryCardValue}>{sampleSales.length}</Text>
          <Text style={styles.summaryCardChange}>↑ 8.3% vs período anterior</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Ticket Promedio</Text>
          <Text style={styles.summaryCardValue}>${getAverageSale().toFixed(2)}</Text>
          <Text style={styles.summaryCardChange}>↑ 3.2% vs período anterior</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Ventas por Día</Text>
        <View style={styles.chartBars}>
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
            <View key={index} style={styles.chartColumn}>
              <View
                style={[
                  styles.chartBar,
                  { height: 30 + (index * 15) % 100, backgroundColor: '#3498db' }
                ]}
              />
              <Text style={styles.chartLabel}>{day}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Ventas Recientes</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Fecha</Text>
          <Text style={styles.tableHeaderText}>Cliente</Text>
          <Text style={styles.tableHeaderText}>Producto</Text>
          <Text style={styles.tableHeaderText}>Cantidad</Text>
          <Text style={styles.tableHeaderText}>Total</Text>
        </View>

        {sampleSales.map((sale) => (
          <View key={sale.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{sale.date}</Text>
            <Text style={styles.tableCell} numberOfLines={1}>{sale.customer}</Text>
            <Text style={styles.tableCell} numberOfLines={1}>{sale.product}</Text>
            <Text style={styles.tableCell}>{sale.quantity}</Text>
            <Text style={[styles.tableCell, styles.salesTotal]}>${sale.total}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportButtonText}>📥 Exportar Reporte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Pantalla de Reporte de Inventario
const InventoryReportScreen = () => {
  const [filterCategory, setFilterCategory] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Calcular totales de inventario
  const totalProducts = sampleData.products.length;
  const totalStock = sampleData.products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockItems = sampleData.products.filter(product => product.stock < 5).length;

  // Categorías únicas
  const categories = [...new Set(sampleData.products.map(product => product.category))];

  // Filtrar productos según los criterios
  const filteredProducts = sampleData.products.filter(product => {
    const matchesCategory = filterCategory === 'todas' || product.category === filterCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reporte de Inventario</Text>

      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Total Productos</Text>
          <Text style={styles.summaryCardValue}>{totalProducts}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Unidades Totales</Text>
          <Text style={styles.summaryCardValue}>{totalStock}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Bajo Stock</Text>
          <Text style={[styles.summaryCardValue, lowStockItems > 0 && styles.warningText]}>
            {lowStockItems}
          </Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Categoría:</Text>
        <View style={styles.categoryFilter}>
          <TouchableOpacity
            style={[styles.filterButton, filterCategory === 'todas' && styles.filterActive]}
            onPress={() => setFilterCategory('todas')}
          >
            <Text style={styles.filterButtonText}>Todas</Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.filterButton, filterCategory === category && styles.filterActive]}
              onPress={() => setFilterCategory(category)}
            >
              <Text style={styles.filterButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar producto..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Inventario Detallado</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Producto</Text>
          <Text style={styles.tableHeaderText}>Categoría</Text>
          <Text style={styles.tableHeaderText}>Stock</Text>
          <Text style={styles.tableHeaderText}>Precio</Text>
          <Text style={styles.tableHeaderText}>Valor</Text>
        </View>

        {filteredProducts.map((product) => {
          const totalValue = product.price * product.stock;
          return (
            <View key={product.id} style={styles.tableRow}>
              <Text style={styles.tableCell} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.tableCell}>{product.category}</Text>
              <Text style={[
                styles.tableCell,
                product.stock < 5 ? styles.stockLow :
                  product.stock < 10 ? styles.stockMedium : styles.stockHigh
              ]}>
                {product.stock}
              </Text>
              <Text style={styles.tableCell}>${product.price}</Text>
              <Text style={[styles.tableCell, styles.inventoryValue]}>
                ${totalValue.toFixed(2)}
              </Text>
            </View>
          );
        })}
      </View>

      {filteredProducts.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No se encontraron productos</Text>
        </View>
      )}

      <View style={styles.reportFooter}>
        <Text style={styles.totalValue}>
          Valor total del inventario: ${filteredProducts.reduce((sum, product) => sum + (product.price * product.stock), 0).toFixed(2)}
        </Text>
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>📥 Exportar Reporte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Pantalla de Reporte de Clientes
const ClientReportScreen = () => {
  const [sortBy, setSortBy] = useState('nombre');
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<any[]>(sampleData.clients);

  // Datos adicionales para el reporte
  const clientStatistics = {
    total: clients.length,
    active: Math.floor(clients.length * 0.85),
    newThisMonth: 3,
    averageSpend: 345.67
  };

  // Ordenar clientes
  const sortedClients = [...clients].sort((a, b) => {
    if (sortBy === 'nombre') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'compras') {
      return (b.totalPurchases || 0) - (a.totalPurchases || 0);
    } else if (sortBy === 'fecha') {
      return new Date(b.registrationDate || '2023-01-01').getTime() -
        new Date(a.registrationDate || '2023-01-01').getTime();
    }
    return 0;
  });

  // Filtrar clientes
  const filteredClients = sortedClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reporte de Clientes</Text>

      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Total Clientes</Text>
          <Text style={styles.summaryCardValue}>{clientStatistics.total}</Text>
          <Text style={styles.summaryCardChange}>↑ 5 nuevos este mes</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Clientes Activos</Text>
          <Text style={styles.summaryCardValue}>{clientStatistics.active}</Text>
          <Text style={styles.summaryCardChange}>85% del total</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Promedio de Gasto</Text>
          <Text style={styles.summaryCardValue}>${clientStatistics.averageSpend}</Text>
        </View>
      </View>

      <View style={styles.clientControls}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Ordenar por:</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'nombre' && styles.sortActive]}
              onPress={() => setSortBy('nombre')}
            >
              <Text style={styles.sortButtonText}>Nombre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'compras' && styles.sortActive]}
              onPress={() => setSortBy('compras')}
            >
              <Text style={styles.sortButtonText}>Compras</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'fecha' && styles.sortActive]}
              onPress={() => setSortBy('fecha')}
            >
              <Text style={styles.sortButtonText}>Fecha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Listado de Clientes</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Nombre</Text>
          <Text style={styles.tableHeaderText}>Email</Text>
          <Text style={styles.tableHeaderText}>Teléfono</Text>
          <Text style={styles.tableHeaderText}>Última Compra</Text>
        </View>

        {filteredClients.map((client) => (
          <View key={client.id} style={styles.tableRow}>
            <Text style={styles.tableCell} numberOfLines={1}>{client.name}</Text>
            <Text style={styles.tableCell} numberOfLines={1}>{client.email}</Text>
            <Text style={styles.tableCell}>{client.phone}</Text>
            <Text style={styles.tableCell}>{client.lastPurchaseDate || 'N/A'}</Text>
          </View>
        ))}
      </View>

      {filteredClients.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No se encontraron clientes</Text>
        </View>
      )}

      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportButtonText}>📥 Exportar Reporte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Pantalla de Reporte Financiero
const FinancialReportScreen = () => {
  const [period, setPeriod] = useState('mensual');
  const [selectedMonth, setSelectedMonth] = useState('diciembre');

  // Datos de ejemplo para el reporte financiero
  const monthlyData = {
    ingresos: 15000,
    costos: 8500,
    gastos: 3200,
    impuestos: 1340,
    utilidadBruta: 6500,
    utilidadNeta: 1960,
    margenBruto: 43.33,
    margenNeto: 13.07
  };

  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reporte Financiero</Text>

      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, period === 'mensual' && styles.periodActive]}
          onPress={() => setPeriod('mensual')}
        >
          <Text style={styles.periodButtonText}>Mensual</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, period === 'trimestral' && styles.periodActive]}
          onPress={() => setPeriod('trimestral')}
        >
          <Text style={styles.periodButtonText}>Trimestral</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, period === 'anual' && styles.periodActive]}
          onPress={() => setPeriod('anual')}
        >
          <Text style={styles.periodButtonText}>Anual</Text>
        </TouchableOpacity>
      </View>

      {period === 'mensual' && (
        <View style={styles.monthSelector}>
          {months.map((month) => (
            <TouchableOpacity
              key={month}
              style={[styles.monthButton, selectedMonth === month && styles.monthActive]}
              onPress={() => setSelectedMonth(month)}
            >
              <Text style={styles.monthButtonText}>{month.charAt(0).toUpperCase() + month.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.financialSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Ingresos Totales</Text>
          <Text style={[styles.summaryValue, styles.positive]}>${monthlyData.ingresos.toLocaleString('es-ES')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Costos de Ventas</Text>
          <Text style={[styles.summaryValue, styles.negative]}>-${monthlyData.costos.toLocaleString('es-ES')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Gastos Operativos</Text>
          <Text style={[styles.summaryValue, styles.negative]}>-${monthlyData.gastos.toLocaleString('es-ES')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Impuestos</Text>
          <Text style={[styles.summaryValue, styles.negative]}>-${monthlyData.impuestos.toLocaleString('es-ES')}</Text>
        </View>
        <View style={[styles.summaryRow, styles.divider]}>
          <Text style={styles.summaryLabel}>Utilidad Bruta</Text>
          <Text style={[styles.summaryValue, styles.positive]}>${monthlyData.utilidadBruta.toLocaleString('es-ES')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Utilidad Neta</Text>
          <Text style={[styles.summaryValue, styles.positive]}>${monthlyData.utilidadNeta.toLocaleString('es-ES')}</Text>
        </View>
      </View>

      <View style={styles.marginsContainer}>
        <View style={styles.marginCard}>
          <Text style={styles.marginTitle}>Margen Bruto</Text>
          <Text style={styles.marginValue}>{monthlyData.margenBruto}%</Text>
          <View style={styles.marginProgress}>
            <View style={[
              styles.marginProgressBar,
              { width: `${monthlyData.margenBruto}%`, backgroundColor: '#27ae60' }
            ]} />
          </View>
        </View>
        <View style={styles.marginCard}>
          <Text style={styles.marginTitle}>Margen Neto</Text>
          <Text style={styles.marginValue}>{monthlyData.margenNeto}%</Text>
          <View style={styles.marginProgress}>
            <View style={[
              styles.marginProgressBar,
              { width: `${monthlyData.margenNeto}%`, backgroundColor: '#2980b9' }
            ]} />
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribución de Gastos</Text>
        <View style={styles.pieChart}>
          <View style={styles.pieSlice} />
          <View style={styles.pieLabelContainer}>
            <View style={styles.pieLabelItem}>
              <View style={[styles.pieLabelColor, { backgroundColor: '#3498db' }]} />
              <Text style={styles.pieLabelText}>Personal (45%)</Text>
            </View>
            <View style={styles.pieLabelItem}>
              <View style={[styles.pieLabelColor, { backgroundColor: '#2ecc71' }]} />
              <Text style={styles.pieLabelText}>Proveedores (30%)</Text>
            </View>
            <View style={styles.pieLabelItem}>
              <View style={[styles.pieLabelColor, { backgroundColor: '#e74c3c' }]} />
              <Text style={styles.pieLabelText}>Marketing (15%)</Text>
            </View>
            <View style={styles.pieLabelItem}>
              <View style={[styles.pieLabelColor, { backgroundColor: '#f39c12' }]} />
              <Text style={styles.pieLabelText}>Otros (10%)</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportButtonText}>📥 Exportar Reporte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Pantalla de Reporte de Proveedores
const SupplierReportScreen = () => {
  const [sortBy, setSortBy] = useState('nombre');
  const [searchQuery, setSearchQuery] = useState('');

  // Datos de ejemplo para proveedores
  const sampleSuppliers = [
    {
      id: '1',
      name: 'TechSupplier S.A.',
      contactName: 'Carlos Rodríguez',
      phone: '310 123 4567',
      email: 'carlos@techsupplier.com',
      rating: 4.8,
      productsCount: 23,
      lastOrderDate: '05/12/2023'
    },
    {
      id: '2',
      name: 'ElectroWorld Ltda.',
      contactName: 'Ana Martínez',
      phone: '315 987 6543',
      email: 'ana@electroworld.com',
      rating: 4.5,
      productsCount: 18,
      lastOrderDate: '01/12/2023'
    },
    {
      id: '3',
      name: 'Componentes Digitales',
      contactName: 'Luis Hernández',
      phone: '320 456 7890',
      email: 'luis@componentesdigitales.com',
      rating: 4.2,
      productsCount: 15,
      lastOrderDate: '28/11/2023'
    },
    {
      id: '4',
      name: 'Global Tech Solutions',
      contactName: 'María Sánchez',
      phone: '311 234 5678',
      email: 'maria@globaltech.com',
      rating: 4.7,
      productsCount: 31,
      lastOrderDate: '10/12/2023'
    }
  ];

  // Ordenar proveedores
  const sortedSuppliers = [...sampleSuppliers].sort((a, b) => {
    if (sortBy === 'nombre') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'calificacion') {
      return b.rating - a.rating;
    } else if (sortBy === 'productos') {
      return b.productsCount - a.productsCount;
    }
    return 0;
  });

  // Filtrar proveedores
  const filteredSuppliers = sortedSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.phone.includes(searchQuery)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reporte de Proveedores</Text>

      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Total Proveedores</Text>
          <Text style={styles.summaryCardValue}>{sampleSuppliers.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Productos Totales</Text>
          <Text style={styles.summaryCardValue}>
            {sampleSuppliers.reduce((sum, supplier) => sum + supplier.productsCount, 0)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Calificación Prom.</Text>
          <Text style={styles.summaryCardValue}>
            {(sampleSuppliers.reduce((sum, supplier) => sum + supplier.rating, 0) / sampleSuppliers.length).toFixed(1)}/5
          </Text>
        </View>
      </View>

      <View style={styles.clientControls}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar proveedor..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Ordenar por:</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'nombre' && styles.sortActive]}
              onPress={() => setSortBy('nombre')}
            >
              <Text style={styles.sortButtonText}>Nombre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'calificacion' && styles.sortActive]}
              onPress={() => setSortBy('calificacion')}
            >
              <Text style={styles.sortButtonText}>Calificación</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'productos' && styles.sortActive]}
              onPress={() => setSortBy('productos')}
            >
              <Text style={styles.sortButtonText}>Productos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Listado de Proveedores</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Proveedor</Text>
          <Text style={styles.tableHeaderText}>Contacto</Text>
          <Text style={styles.tableHeaderText}>Calificación</Text>
          <Text style={styles.tableHeaderText}>Productos</Text>
          <Text style={styles.tableHeaderText}>Último Pedido</Text>
        </View>

        {filteredSuppliers.map((supplier) => (
          <View key={supplier.id} style={styles.tableRow}>
            <Text style={styles.tableCell} numberOfLines={1}>{supplier.name}</Text>
            <Text style={styles.tableCell} numberOfLines={1}>{supplier.contactName}</Text>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <Text key={i} style={styles.starIcon}>
                  {i < Math.floor(supplier.rating) ? '★' : i < supplier.rating ? '☆' : '☆'}
                </Text>
              ))}
              <Text style={styles.ratingText}>{supplier.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.tableCell}>{supplier.productsCount}</Text>
            <Text style={styles.tableCell}>{supplier.lastOrderDate}</Text>
          </View>
        ))}
      </View>

      {filteredSuppliers.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No se encontraron proveedores</Text>
        </View>
      )}

      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportButtonText}>📥 Exportar Reporte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Pantalla de Respaldo de Datos
const BackupScreen = () => {
  const [backupStatus, setBackupStatus] = useState('nunca');
  const [lastBackupDate, setLastBackupDate] = useState('');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [selectedBackupType, setSelectedBackupType] = useState('completo');

  const handleCreateBackup = () => {
    Alert.alert(
      'Crear Respaldo',
      '¿Estás seguro de crear un respaldo ahora?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Confirmar',
          onPress: () => {
            setBackupStatus('exitoso');
            setLastBackupDate(new Date().toLocaleString());
            Alert.alert('Éxito', 'Respaldo creado correctamente');
          }
        }
      ]
    );
  };

  const handleRestoreBackup = () => {
    Alert.alert(
      'Restaurar Respaldo',
      '¿Estás seguro de restaurar el último respaldo? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Restaurar',
          onPress: () => {
            Alert.alert('Éxito', 'Datos restaurados correctamente');
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Respaldo de Datos</Text>

      <View style={styles.backupStatus}>
        <Text style={styles.backupStatusTitle}>Estado del respaldo</Text>
        <View style={[
          styles.statusIndicator,
          backupStatus === 'exitoso' ? styles.statusSuccess :
            backupStatus === 'fallido' ? styles.statusError : styles.statusNever
        ]}>
          <Text style={styles.statusText}>
            {backupStatus === 'exitoso' ? '✅ Respaldo actualizado' :
              backupStatus === 'fallido' ? '❌ Último respaldo fallido' : '⏳ Nunca respaldado'}
          </Text>
        </View>
        {lastBackupDate && (
          <Text style={styles.lastBackupText}>Último respaldo: {lastBackupDate}</Text>
        )}
      </View>

      <View style={styles.backupOptions}>
        <Text style={styles.sectionTitle}>Opciones de Respaldo</Text>

        <View style={styles.backupTypeContainer}>
          <TouchableOpacity
            style={[styles.backupTypeButton, selectedBackupType === 'completo' && styles.backupTypeActive]}
            onPress={() => setSelectedBackupType('completo')}
          >
            <Text style={styles.backupTypeText}>Completo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.backupTypeButton, selectedBackupType === 'clientes' && styles.backupTypeActive]}
            onPress={() => setSelectedBackupType('clientes')}
          >
            <Text style={styles.backupTypeText}>Clientes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.backupTypeButton, selectedBackupType === 'productos' && styles.backupTypeActive]}
            onPress={() => setSelectedBackupType('productos')}
          >
            <Text style={styles.backupTypeText}>Productos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.backupTypeButton, selectedBackupType === 'ventas' && styles.backupTypeActive]}
            onPress={() => setSelectedBackupType('ventas')}
          >
            <Text style={styles.backupTypeText}>Ventas</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.backupTypeDescription}>
          {selectedBackupType === 'completo' && 'Respaldo completo de todos los datos de la aplicación'}
          {selectedBackupType === 'clientes' && 'Respaldo solo de los datos de clientes registrados'}
          {selectedBackupType === 'productos' && 'Respaldo solo del catálogo de productos e inventario'}
          {selectedBackupType === 'ventas' && 'Respaldo solo de las transacciones y reportes de ventas'}
        </Text>
      </View>

      <TouchableOpacity style={styles.backupButton} onPress={handleCreateBackup}>
        <Text style={styles.backupButtonText}>Crear Respaldo Ahora</Text>
      </TouchableOpacity>

      <View style={styles.restoreSection}>
        <Text style={styles.sectionTitle}>Restaurar Datos</Text>
        <Text style={styles.restoreDescription}>
          Permite restaurar los datos desde el último respaldo realizado. Ten en cuenta que los datos actuales se sobrescribirán.
        </Text>
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestoreBackup}>
          <Text style={styles.restoreButtonText}>Restaurar Último Respaldo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.autoBackupSection}>
        <Text style={styles.sectionTitle}>Respaldo Automático</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Habilitar respaldo automático</Text>
          <TouchableOpacity
            style={[styles.switch, autoBackupEnabled && styles.switchOn]}
            onPress={() => setAutoBackupEnabled(!autoBackupEnabled)}
          >
            <View style={[styles.switchKnob, autoBackupEnabled && styles.switchKnobOn]} />
          </TouchableOpacity>
        </View>

        {autoBackupEnabled && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleLabel}>Frecuencia:</Text>
            <View style={styles.scheduleOptions}>
              <TouchableOpacity style={styles.scheduleButton}>
                <Text style={styles.scheduleButtonText}>Diario</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.scheduleButton, styles.scheduleButtonActive]}>
                <Text style={styles.scheduleButtonText}>Semanal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.scheduleButton}>
                <Text style={styles.scheduleButtonText}>Mensual</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.scheduleLabel}>Hora:</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="HH:MM"
              value="02:00"
            />

            <Text style={styles.scheduleInfo}>
              Los respaldos automáticos se realizarán en segundo plano y no afectarán el rendimiento de la aplicación.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Pantalla de Soporte Técnico
const TechnicalSupportScreen = () => {
  const [issueType, setIssueType] = useState('hardware');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [tickets, setTickets] = useState<any[]>([]);
  const [showNewTicket, setShowNewTicket] = useState(true);

  const handleCreateTicket = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Por favor describe el problema');
      return;
    }

    const newTicket = {
      id: Date.now().toString(),
      issueType,
      description: description.trim(),
      priority,
      status: 'abierto',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTickets(prev => [newTicket, ...prev]);
    setDescription('');
    setShowNewTicket(false);

    Alert.alert('Éxito', 'Ticket de soporte creado correctamente');
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setTickets(prev => prev.map(ticket =>
      ticket.id === id ? { ...ticket, status: newStatus } : ticket
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Soporte Técnico</Text>

      {showNewTicket && (
        <View style={styles.form}>
          <Text style={styles.label}>Tipo de Problema</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => setIssueType('hardware')}
            >
              <Text style={[styles.pickerText, issueType === 'hardware' && styles.pickerSelected]}>Hardware</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => setIssueType('software')}
            >
              <Text style={[styles.pickerText, issueType === 'software' && styles.pickerSelected]}>Software</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => setIssueType('redes')}
            >
              <Text style={[styles.pickerText, issueType === 'redes' && styles.pickerSelected]}>Redes</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Descripción del Problema *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe detalladamente el problema que estás experimentando"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => setPriority('baja')}
            >
              <Text style={[styles.pickerText, priority === 'baja' && styles.priorityLow]}>Baja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => setPriority('media')}
            >
              <Text style={[styles.pickerText, priority === 'media' && styles.priorityMedium]}>Media</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => setPriority('alta')}
            >
              <Text style={[styles.pickerText, priority === 'alta' && styles.priorityHigh]}>Alta</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCreateTicket}>
            <Text style={styles.buttonText}>Crear Ticket de Soporte</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Tickets de Soporte</Text>

      {tickets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No hay tickets de soporte</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowNewTicket(true)}
          >
            <Text style={styles.buttonText}>Crear Primer Ticket</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.ticketsContainer}>
          {tickets.map((ticket) => (
            <View key={ticket.id} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketTitle}>Ticket #{ticket.id.slice(-4)}</Text>
                  <Text style={styles.ticketDate}>{ticket.date} • {ticket.time}</Text>
                </View>
                <View style={[
                  styles.ticketStatus,
                  ticket.status === 'abierto' && styles.statusAbierto,
                  ticket.status === 'en_progreso' && styles.statusEnProgreso,
                  ticket.status === 'resuelto' && styles.statusResuelto
                ]}>
                  <Text style={styles.statusText}>
                    {ticket.status === 'abierto' ? 'Abierto' :
                      ticket.status === 'en_progreso' ? 'En progreso' : 'Resuelto'}
                  </Text>
                </View>
              </View>

              <View style={styles.ticketTypeContainer}>
                <Text style={[
                  styles.ticketType,
                  ticket.issueType === 'hardware' ? styles.typeHardware :
                    ticket.issueType === 'software' ? styles.typeSoftware : styles.typeRedes
                ]}>
                  {ticket.issueType === 'hardware' ? '💻 Hardware' :
                    ticket.issueType === 'software' ? '⚙️ Software' : '🌐 Redes'}
                </Text>
                <Text style={[
                  styles.ticketPriority,
                  ticket.priority === 'baja' ? styles.priorityLow :
                    ticket.priority === 'media' ? styles.priorityMedium : styles.priorityHigh
                ]}>
                  {ticket.priority === 'baja' ? '🟡 Prioridad Baja' :
                    ticket.priority === 'media' ? '🟠 Prioridad Media' : '🔴 Prioridad Alta'}
                </Text>
              </View>

              <Text style={styles.ticketDescription}>{ticket.description}</Text>

              {ticket.status !== 'resuelto' && (
                <View style={styles.ticketActions}>
                  {ticket.status === 'abierto' && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleUpdateStatus(ticket.id, 'en_progreso')}
                    >
                      <Text style={styles.actionButtonText}>🔄 Iniciar Atención</Text>
                    </TouchableOpacity>
                  )}
                  {ticket.status === 'en_progreso' && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleUpdateStatus(ticket.id, 'resuelto')}
                    >
                      <Text style={styles.actionButtonText}>✅ Marcar como Resuelto</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Pantalla de Gestión de Garantías
const WarrantyScreen = () => {
  const [productId, setProductId] = useState('');
  const [clientId, setClientId] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('12');
  const [description, setDescription] = useState('');
  const [warranties, setWarranties] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('todas');

  const handleRegisterWarranty = () => {
    if (!productId || !clientId || !description) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const product = sampleData.products.find(p => p.id === productId);
    const client = sampleData.clients.find(c => c.id === clientId);

    if (!product) {
      Alert.alert('Error', 'Producto no encontrado');
      return;
    }

    if (!client) {
      Alert.alert('Error', 'Cliente no encontrado');
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(warrantyMonths));

    const newWarranty = {
      id: Date.now().toString(),
      productId,
      clientId,
      productName: product.name,
      clientName: client.name,
      warrantyMonths: parseInt(warrantyMonths),
      description: description.trim(),
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
      status: 'activa',
      registrationDate: new Date().toLocaleDateString()
    };

    setWarranties(prev => [...prev, newWarranty]);

    // Resetear formulario
    setProductId('');
    setClientId('');
    setWarrantyMonths('12');
    setDescription('');

    Alert.alert('Éxito', 'Garantía registrada correctamente');
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setWarranties(prev => prev.map(warranty =>
      warranty.id === id ? { ...warranty, status: newStatus } : warranty
    ));
  };

  const filteredWarranties = warranties.filter(warranty =>
    filterStatus === 'todas' || warranty.status === filterStatus
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestión de Garantías</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Producto (ID) *</Text>
        <TextInput
          style={styles.input}
          placeholder="ID del producto (1, 2, 3...)"
          value={productId}
          onChangeText={setProductId}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Cliente (ID) *</Text>
        <TextInput
          style={styles.input}
          placeholder="ID del cliente (1, 2, 3...)"
          value={clientId}
          onChangeText={setClientId}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Duración de la Garantía</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            style={styles.pickerOption}
            onPress={() => setWarrantyMonths('6')}
          >
            <Text style={[styles.pickerText, warrantyMonths === '6' && styles.pickerSelected]}>6 meses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pickerOption}
            onPress={() => setWarrantyMonths('12')}
          >
            <Text style={[styles.pickerText, warrantyMonths === '12' && styles.pickerSelected]}>12 meses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pickerOption}
            onPress={() => setWarrantyMonths('24')}
          >
            <Text style={[styles.pickerText, warrantyMonths === '24' && styles.pickerSelected]}>24 meses</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Descripción del Producto *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Especificaciones, modelo, número de serie, etc."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegisterWarranty}>
          <Text style={styles.buttonText}>Registrar Garantía</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por estado:</Text>
        <View style={styles.categoryFilter}>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'todas' && styles.filterActive]}
            onPress={() => setFilterStatus('todas')}
          >
            <Text style={styles.filterButtonText}>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'activa' && styles.filterActive]}
            onPress={() => setFilterStatus('activa')}
          >
            <Text style={styles.filterButtonText}>Activas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'vencida' && styles.filterActive]}
            onPress={() => setFilterStatus('vencida')}
          >
            <Text style={styles.filterButtonText}>Vencidas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'reclamada' && styles.filterActive]}
            onPress={() => setFilterStatus('reclamada')}
          >
            <Text style={styles.filterButtonText}>Reclamadas</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Garantías Registradas</Text>

      {filteredWarranties.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No hay garantías registradas</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Producto</Text>
            <Text style={styles.tableHeaderText}>Cliente</Text>
            <Text style={styles.tableHeaderText}>Vence</Text>
            <Text style={styles.tableHeaderText}>Estado</Text>
            <Text style={styles.tableHeaderText}>Acciones</Text>
          </View>

          {filteredWarranties.map((warranty) => (
            <View key={warranty.id} style={styles.tableRow}>
              <Text style={styles.tableCell} numberOfLines={1}>{warranty.productName}</Text>
              <Text style={styles.tableCell} numberOfLines={1}>{warranty.clientName}</Text>
              <Text style={styles.tableCell}>{warranty.endDate}</Text>
              <Text style={[
                styles.tableCell,
                styles.statusBadge,
                warranty.status === 'activa' && styles.statusActiva,
                warranty.status === 'vencida' && styles.statusVencida,
                warranty.status === 'reclamada' && styles.statusReclamada
              ]}>
                {warranty.status.charAt(0).toUpperCase() + warranty.status.slice(1)}
              </Text>
              <View style={styles.actionButtons}>
                {warranty.status === 'activa' && (
                  <TouchableOpacity onPress={() => handleUpdateStatus(warranty.id, 'reclamada')}>
                    <Text style={styles.claimButton}>📝</Text>
                  </TouchableOpacity>
                )}
                {warranty.status === 'vencida' && (
                  <TouchableOpacity onPress={() => handleUpdateStatus(warranty.id, 'activa')}>
                    <Text style={styles.renewButton}>🔄</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Pantalla de Encuestas
const SurveyScreen = () => {
  const [surveyType, setSurveyType] = useState('satisfaccion');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [contactPermission, setContactPermission] = useState(false);
  const [submittedSurveys, setSubmittedSurveys] = useState<any[]>([]);
  const [showSurveyForm, setShowSurveyForm] = useState(true);

  const handleSubmitSurvey = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Por favor selecciona una calificación');
      return;
    }

    const newSurvey = {
      id: Date.now().toString(),
      type: surveyType,
      rating,
      feedback: feedback.trim(),
      contactPermission,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSubmittedSurveys(prev => [newSurvey, ...prev]);
    setRating(0);
    setFeedback('');
    setContactPermission(false);
    setShowSurveyForm(false);

    Alert.alert('Éxito', '¡Gracias por tu opinión! Tu encuesta ha sido enviada.');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Encuestas de Satisfacción</Text>

      {showSurveyForm ? (
        <View style={styles.form}>
          <Text style={styles.label}>Tipo de Encuesta</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => setSurveyType('satisfaccion')}
            >
              <Text style={[styles.pickerText, surveyType === 'satisfaccion' && styles.pickerSelected]}>Satisfacción</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => setSurveyType('producto')}
            >
              <Text style={[styles.pickerText, surveyType === 'producto' && styles.pickerSelected]}>Producto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => setSurveyType('servicio')}
            >
              <Text style={[styles.pickerText, surveyType === 'servicio' && styles.pickerSelected]}>Servicio</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>
            {surveyType === 'satisfaccion' && '¿Cómo calificarías tu experiencia general?'}
            {surveyType === 'producto' && '¿Cómo calificarías nuestro producto?'}
            {surveyType === 'servicio' && '¿Cómo calificarías nuestro servicio?'}
          </Text>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >
                <Text style={[
                  styles.starIconLarge,
                  rating >= star ? styles.starSelected : styles.starUnselected
                ]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Comentarios Adicionales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Cuéntanos más sobre tu experiencia..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
          />

          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setContactPermission(!contactPermission)}>
              <View style={[styles.checkbox, contactPermission && styles.checkboxChecked]}>
                {contactPermission && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              ¿Nos permites contactarte para más detalles sobre tu encuesta?
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmitSurvey}>
            <Text style={styles.buttonText}>Enviar Encuesta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>¡Gracias por participar!</Text>
          <Text style={styles.emptyStateSubtitle}>
            Tu opinión es muy importante para nosotros y nos ayuda a mejorar nuestros servicios.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowSurveyForm(true)}
          >
            <Text style={styles.buttonText}>Responder Otra Encuesta</Text>
          </TouchableOpacity>
        </View>
      )}

      {submittedSurveys.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Encuestas Enviadas</Text>

          <View style={styles.surveysContainer}>
            {submittedSurveys.slice(0, 3).map((survey) => (
              <View key={survey.id} style={styles.surveyCard}>
                <View style={styles.surveyHeader}>
                  <Text style={styles.surveyType}>
                    {survey.type === 'satisfaccion' ? '📊 Satisfacción' :
                      survey.type === 'producto' ? '📦 Producto' : '⚙️ Servicio'}
                  </Text>
                  <Text style={styles.surveyDate}>{survey.date}</Text>
                </View>

                <View style={styles.ratingDisplay}>
                  {[...Array(5)].map((_, i) => (
                    <Text key={i} style={[
                      styles.starIcon,
                      i < survey.rating ? styles.starSelected : styles.starUnselected
                    ]}>
                      ★
                    </Text>
                  ))}
                </View>

                {survey.feedback && (
                  <Text style={styles.surveyFeedback}>{survey.feedback}</Text>
                )}

                {survey.contactPermission && (
                  <View style={styles.permissionBadge}>
                    <Text style={styles.permissionText}>✅ Contacto permitido</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default function App() {
  const [userType, setUserType] = useState('user');
  const [userName, setUserName] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <UserContext.Provider value={{
      userType,
      setUserType,
      userName,
      setUserName,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2c3e50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'TecnoReportes - Login' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard Principal' }} />
          <Stack.Screen name="UserRegister" component={UserRegisterScreen} options={{ title: 'Registro de Usuario' }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Carrito de Compras' }} />
          <Stack.Screen
            name="InvoiceScreen"
            component={InvoiceScreen}
            options={{
              title: 'Factura de Compra',
              headerStyle: {
                backgroundColor: '#27ae60',
              },
            }}
          />
          <Stack.Screen name="ClientForm" component={ClientFormScreen} options={{ title: 'Gestión de Clientes' }} />
          <Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ title: 'Gestión de Productos' }} />
          <Stack.Screen name="OrderForm" component={OrderFormScreen} options={{ title: 'Gestión de Pedidos' }} />
          <Stack.Screen name="InventoryForm" component={InventoryFormScreen} options={{ title: 'Gestión de Inventario' }} />
          <Stack.Screen name="SupplierForm" component={SupplierFormScreen} options={{ title: 'Gestión de Proveedores' }} />
          <Stack.Screen name="SalesReport" component={SalesReportScreen} options={{ title: 'Reporte de Ventas' }} />
          <Stack.Screen name="InventoryReport" component={InventoryReportScreen} options={{ title: 'Reporte de Inventario' }} />
          <Stack.Screen name="ClientReport" component={ClientReportScreen} options={{ title: 'Reporte de Clientes' }} />
          <Stack.Screen name="FinancialReport" component={FinancialReportScreen} options={{ title: 'Reporte Financiero' }} />
          <Stack.Screen name="SupplierReport" component={SupplierReportScreen} options={{ title: 'Reporte de Proveedores' }} />
          <Stack.Screen name="Backup" component={BackupScreen} options={{ title: 'Respaldo de Datos' }} />
          <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contacto' }} />
          <Stack.Screen name="TechnicalSupport" component={TechnicalSupportScreen} options={{ title: 'Soporte Técnico' }} />
          <Stack.Screen name="Warranty" component={WarrantyScreen} options={{ title: 'Garantías' }} />
          <Stack.Screen name="Survey" component={SurveyScreen} options={{ title: 'Encuestas' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  cartIcon: {
    padding: 8,
    position: 'relative',
  },
  cartIconText: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#7f8c8d',
  },
  loginForm: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  registerBtn: {
    alignItems: 'center',
    padding: 12,
  },
  registerText: {
    color: '#3498db',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  menuIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  menuText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2c3e50',
  },
  productsGrid: {
    paddingVertical: 4,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 4,
    width: '48%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  productImage: {
    width: '100%',
    height: 90,
  },
  productInfo: {
    padding: 8,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    color: '#2c3e50',
  },
  productCategory: {
    fontSize: 10,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 2,
  },
  productStock: {
    fontSize: 10,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  productButton: {
    backgroundColor: '#3498db',
    padding: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  productButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  productButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  form: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  userTypeBadge: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#3498db',
    marginBottom: 12,
    padding: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  tabButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#3498db',
  },
  tabButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  tabButtonTextActive: {
    color: 'white',
  },
  tabContent: {
    marginBottom: 16,
  },
  // Estilos para el carrito
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  cartItemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  },
  cartItemPrice: {
    fontSize: 11,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginVertical: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  quantityButton: {
    backgroundColor: '#ecf0f1',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    padding: 6,
  },
  removeButtonText: {
    fontSize: 16,
  },
  cartSummary: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  checkoutButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearCartButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  clearCartButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyCartText: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyCartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  // Estilos para la factura
  invoiceContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  invoicePaper: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  invoiceHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  invoiceSubtitle: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 4,
  },
  invoiceInfo: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  invoiceSeparator: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 12,
  },
  invoiceSection: {
    marginBottom: 12,
  },
  invoiceText: {
    fontSize: 12,
    color: '#34495e',
    marginBottom: 4,
  },
  invoiceItem: {
    marginBottom: 8,
    paddingBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemName: {
    fontSize: 12,
    color: '#2c3e50',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  itemPrice: {
    fontSize: 10,
    color: '#95a5a6',
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27ae60',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  },
  grandTotalRow: {
    borderTopWidth: 2,
    borderTopColor: '#ecf0f1',
    marginTop: 4,
    paddingTop: 8,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  invoiceFooter: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  footerText: {
    fontSize: 10,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 2,
  },
  invoiceButtons: {
    marginTop: 16,
  },
  invoiceButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButton: {
    backgroundColor: '#7f8c8d',
  },
  invoiceButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Nuevos estilos para las pantallas completadas
  pickerContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  pickerOption: {
    flex: 1,
    padding: 8,
    marginHorizontal: 2,
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  pickerSelected: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#34495e',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  editButton: {
    fontSize: 16,
    marginRight: 10,
    color: '#3498db',
  },
  deleteButton: {
    fontSize: 16,
    color: '#e74c3c',
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginVertical: 10,
  },
  updateButton: {
    backgroundColor: '#27ae60',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    padding: 2,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  statusPendiente: {
    backgroundColor: '#f39c12',
    color: 'white',
  },
  statusEnviado: {
    backgroundColor: '#3498db',
    color: 'white',
  },
  statusEntregado: {
    backgroundColor: '#27ae60',
    color: 'white',
  },
  // Estilos para InventoryFormScreen
  stockHigh: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  stockMedium: {
    color: '#f39c12',
    fontWeight: 'bold',
  },
  stockLow: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  statusBadgeHigh: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: 2,
    borderRadius: 4,
    textAlign: 'center',
  },
  statusBadgeMedium: {
    backgroundColor: '#f39c12',
    color: 'white',
    padding: 2,
    borderRadius: 4,
    textAlign: 'center',
  },
  statusBadgeLow: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: 2,
    borderRadius: 4,
    textAlign: 'center',
  },
  historyContainer: {
    marginTop: 10,
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  historyType: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  typeEntrada: {
    color: '#27ae60',
  },
  typeSalida: {
    color: '#e74c3c',
  },
  historyProduct: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyDetail: {
    fontSize: 11,
    color: '#7f8c8d',
  },
  // Estilos para SalesReportScreen
  reportHeader: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  reportPeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  datePickerContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dateRangeButton: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 2,
  },
  dateRangeActive: {
    backgroundColor: '#3498db',
  },
  dateRangeText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: 2,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 6,
    fontSize: 12,
    backgroundColor: '#f8f9fa',
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '31%',
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryCardTitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  summaryCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  summaryCardChange: {
    fontSize: 10,
    color: '#27ae60',
    marginTop: 2,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chartColumn: {
    alignItems: 'center',
    marginHorizontal: 2,
  },
  chartBar: {
    width: 25,
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: '#7f8c8d',
    marginTop: 4,
  },
  salesTotal: {
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  exportButton: {
    backgroundColor: '#2c3e50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Estilos para InventoryReportScreen
  filterContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  categoryFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#ecf0f1',
    margin: 3,
  },
  filterActive: {
    backgroundColor: '#3498db',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  searchContainer: {
    marginTop: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#f8f9fa',
  },
  inventoryValue: {
    fontWeight: 'bold',
    color: '#27ae60',
  },
  reportFooter: {
    marginTop: 12,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  warningText: {
    color: '#e74c3c',
  },
  // Estilos para ClientReportScreen
  clientControls: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sortContainer: {
    marginTop: 8,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortButton: {
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#ecf0f1',
    margin: 3,
  },
  sortActive: {
    backgroundColor: '#3498db',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  // Estilos para FinancialReportScreen
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  periodButton: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },
  periodActive: {
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  periodButtonText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  monthSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  monthButton: {
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#ecf0f1',
    margin: 3,
  },
  monthActive: {
    backgroundColor: '#3498db',
  },
  monthButtonText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  financialSummary: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  positive: {
    color: '#27ae60',
  },
  negative: {
    color: '#e74c3c',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 8,
    marginTop: 8,
  },
  marginsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  marginCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '48%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  marginTitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  marginValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  marginProgress: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  marginProgressBar: {
    height: '100%',
    borderRadius: 4,
  },
  pieChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieSlice: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#3498db',
    position: 'relative',
  },
  pieLabelContainer: {
    marginTop: 16,
  },
  pieLabelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  pieLabelColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  pieLabelText: {
    fontSize: 12,
    color: '#2c3e50',
  },
  // Estilos para SupplierReportScreen
  ratingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 10,
    marginHorizontal: 1,
  },
  starUnselected: {
    color: '#bdc3c7',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  // Estilos para BackupScreen
  backupStatus: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  backupStatusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  statusIndicator: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusSuccess: {
    backgroundColor: '#d5f5e3',
  },
  statusError: {
    backgroundColor: '#fadbd8',
  },
  statusNever: {
    backgroundColor: '#ebf5fb',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lastBackupText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  backupOptions: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  backupTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  backupTypeButton: {
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#ecf0f1',
    margin: 4,
  },
  backupTypeActive: {
    backgroundColor: '#3498db',
  },
  backupTypeText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  backupTypeDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 8,
    fontStyle: 'italic',
  },
  backupButton: {
    backgroundColor: '#27ae60',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  backupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restoreSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  restoreDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginVertical: 8,
  },
  restoreButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  restoreButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  autoBackupSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#2c3e50',
  },
  switch: {
    width: 50,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#bdc3c7',
    padding: 2,
  },
  switchOn: {
    backgroundColor: '#27ae60',
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  switchKnobOn: {
    marginLeft: 26,
  },
  scheduleContainer: {
    marginTop: 12,
  },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginVertical: 8,
  },
  scheduleOptions: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  scheduleButton: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 4,
  },
  scheduleButtonActive: {
    backgroundColor: '#3498db',
  },
  scheduleButtonText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
  },
  scheduleInfo: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 8,
  },
  // Estilos para TechnicalSupportScreen
  ticketsContainer: {
    marginBottom: 16,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  ticketDate: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  ticketStatus: {
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusAbierto: {
    backgroundColor: '#fef9e7',
  },
  statusEnProgreso: {
    backgroundColor: '#ebf5fb',
  },
  statusResuelto: {
    backgroundColor: '#eafaf1',
  },
  ticketTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketType: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeHardware: {
    color: '#3498db',
  },
  typeSoftware: {
    color: '#2ecc71',
  },
  typeRedes: {
    color: '#9b59b6',
  },
  ticketPriority: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  priorityLow: {
    color: '#f39c12',
  },
  priorityMedium: {
    color: '#e67e22',
  },
  priorityHigh: {
    color: '#e74c3c',
  },
  ticketDescription: {
    fontSize: 13,
    color: '#34495e',
    marginBottom: 12,
    lineHeight: 18,
  },
  ticketActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Estilos para WarrantyScreen
  warrantyTypeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  warrantyTypeButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 2,
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
  },
  warrantyTypeActive: {
    backgroundColor: '#3498db',
  },
  warrantyTypeText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statusActiva: {
    backgroundColor: '#27ae60',
    color: 'white',
  },
  statusVencida: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
  statusReclamada: {
    backgroundColor: '#f39c12',
    color: 'white',
  },
  claimButton: {
    fontSize: 16,
    color: '#3498db',
  },
  renewButton: {
    fontSize: 16,
    color: '#27ae60',
  },
  // Estilos para SurveyScreen
  surveysContainer: {
    marginBottom: 16,
  },
  surveyCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  surveyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  surveyType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3498db',
  },
  surveyDate: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  ratingDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 6,
  },
  surveyFeedback: {
    fontSize: 13,
    color: '#34495e',
    fontStyle: 'italic',
    marginVertical: 8,
  },
  permissionBadge: {
    backgroundColor: '#d5f5e3',
    padding: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  permissionText: {
    fontSize: 11,
    color: '#27ae60',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  starIconLarge: {
    fontSize: 40,
    marginHorizontal: 2,
  },
  starSelected: {
    color: '#f39c12',
  },
  starUnselected: {
    color: '#bdc3c7',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 4,
  },
  checkboxChecked: {
    backgroundColor: '#3498db',
  },
  checkboxTick: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
});