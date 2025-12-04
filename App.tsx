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
  setUserType: (type: string) => {},
  userName: '',
  setUserName: (name: string) => {},
  cart: [] as CartItem[],
  addToCart: (product: Product) => {},
  removeFromCart: (productId: string) => {},
  updateQuantity: (productId: string, quantity: number) => {},
  clearCart: () => {}
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
    { id: '1', name: 'Juan Pérez', email: 'juan@email.com', phone: '123456789' },
    { id: '2', name: 'María García', email: 'maria@email.com', phone: '987654321' },
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
    
    let confirmMessage = '¿Confirmar compra?\n\n';
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

// Screens básicos
const OrderFormScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Gestión de Pedidos</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

const InventoryFormScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Gestión de Inventario</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

const SupplierFormScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Gestión de Proveedores</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

const SalesReportScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Reporte de Ventas</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

const InventoryReportScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Reporte de Inventario</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

const ClientReportScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Reporte de Clientes</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

const FinancialReportScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Reporte Financiero</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

const SupplierReportScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Reporte de Proveedores</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

const BackupScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Respaldo de Datos</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

const TechnicalSupportScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Soporte Técnico</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

const WarrantyScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Gestión de Garantías</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

const SurveyScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Encuestas</Text>
    <Text style={styles.subtitle}>Funcionalidad en desarrollo</Text>
  </View>
);

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
    height: 90, // Imágenes pequeñas
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
});