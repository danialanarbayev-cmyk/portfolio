const PRODUCTS = [
  {
    id: 1,
    title: 'Aether Glass X',
    category: 'optics',
    price: 1299,
    rating: 4.9,
    reviews: 48,
    image: 'images/glass.png',
    specs: [
      'Голографический Retina HUD дисплей',
      'Нейро-жестовое управление (Neural gesture control)',
      'Динамическая адаптация к освещению',
      'До 12 часов активной работы батареи'
    ],
    description: 'Очки дополненной реальности нового поколения. Сочетают в себе прозрачный дисплей сетчатки глаза, распознавание жестов силой мысли и интеллектуальную адаптацию к свету для бесшовного слияния с цифровым миром.'
  },
  {
    id: 2,
    title: 'Neural Earbuds Pro',
    category: 'audio',
    price: 349,
    rating: 4.8,
    reviews: 112,
    image: 'images/earbuds.png',
    specs: [
      'Адаптивный нейро-профиль звука',
      'Гибридное активное шумоподавление (ANC)',
      'Пространственное 3D-аудио с отслеживанием головы',
      '48 часов воспроизведения с кейсом'
    ],
    description: 'Аудионоды с поддержкой нейросинхронизации, которые подстраивают частотный диапазон под активность вашего мозга. Кристально чистый звук и полная тишина благодаря гибридному шумоподавлению.'
  },
  {
    id: 3,
    title: 'Chronos Ring',
    category: 'wearables',
    price: 299,
    rating: 4.7,
    reviews: 64,
    image: 'images/ring.png',
    specs: [
      'Корпус из авиационного титана',
      'Постоянный био-мониторинг показателей здоровья',
      'Зашифрованный бесконтактный NFC-ключ',
      'Водонепроницаемость до 50 метров (5 ATM)'
    ],
    description: 'Умное кольцо из титана, которое незаметно отслеживает ваш сон, пульс, уровень кислорода и стресса. Используйте его как безопасный ключ для умного дома и бесконтактных транзакций.'
  },
  {
    id: 4,
    title: 'Nova Projector',
    category: 'smarthome',
    price: 599,
    rating: 4.9,
    reviews: 32,
    image: 'images/projector.png',
    specs: [
      'Голографическая 4K проекция в воздухе',
      'Встроенный объемный звук Dolby Spatial Audio',
      'Режим визуального сна (Ambient modes)',
      'Голосовое управление и синхронизация с умным домом'
    ],
    description: 'Сферический проектор, создающий парящие в воздухе 3D-интерфейсы или расслабляющие космические туманности прямо в комнате. Настоящий кинотеатр будущего в лаконичном корпусе.'
  },
  {
    id: 5,
    title: 'Apex Wristwatch',
    category: 'wearables',
    price: 899,
    rating: 4.9,
    reviews: 79,
    image: 'images/watch.png',
    specs: [
      'Синхронизация с атомными часами по всему миру',
      'Солнечная панель для аварийной подзарядки',
      'Тактические 3D-карты и GPS навигация',
      'Сверхпрочное сапфировое стекло с защитой от царапин'
    ],
    description: 'Шедевр тактической инженерии. Квантово-синхронизированные часы со сверхпрочным титановым корпусом, спутниковой навигацией и бесконечным запасом хода за счет солнечной энергии.'
  },
  {
    id: 6,
    title: 'Vortex Hub',
    category: 'smarthome',
    price: 199,
    rating: 4.6,
    reviews: 95,
    image: 'images/hub.png',
    specs: [
      'Интерактивная подсветка Fluid Ambient RGB',
      'Центральный хаб управления экосистемой дома',
      'Распознавание жестов на расстоянии до 3м',
      'Локальное шифрование данных без облака'
    ],
    description: 'Центральная нервная система вашего умного пространства. Контролируйте освещение, температуру и музыку с помощью простых взмахов рук и голосовых команд в приватном режиме.'
  }
];

let cartData = [];
let ordersData = [];
try {
  cartData = JSON.parse(localStorage.getItem('aether_cart')) || [];
  ordersData = JSON.parse(localStorage.getItem('aether_orders')) || [];
} catch (e) {
  cartData = [];
  ordersData = [];
}

let state = {
  cart: cartData,
  orders: ordersData,
  selectedCategory: 'all',
  searchQuery: '',
  sortOption: 'popular',
  activeProductModal: null
};

document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  renderProducts();
  updateCartBadge();
  renderCart();
  setupEventListeners();
  setupTrackingListeners();
  setupProfileListeners();
  lucide.createIcons();
}

function setupEventListeners() {
  document.getElementById('logo-btn').addEventListener('click', (e) => {
    e.preventDefault();
    resetFilters();
  });

  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    if (state.searchQuery.length > 0) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
    renderProducts();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    renderProducts();
    searchInput.focus();
  });

  const tabs = document.querySelectorAll('.category-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.selectedCategory = tab.dataset.category;
      renderProducts();
    });
  });

  const sortSelect = document.getElementById('sort-select');
  sortSelect.addEventListener('change', (e) => {
    state.sortOption = e.target.value;
    renderProducts();
  });

  document.getElementById('explore-btn').addEventListener('click', () => {
    document.getElementById('catalog-section').scrollIntoView({ behavior: 'smooth' });
  });

  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');

  const openCart = () => {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  cartToggleBtn.addEventListener('click', openCart);
  cartCloseBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  const productModal = document.getElementById('product-modal');
  const productModalClose = document.getElementById('product-modal-close');
  
  const closeProductModal = () => {
    productModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  productModalClose.addEventListener('click', closeProductModal);
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeProductModal();
  });

  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyInput = document.getElementById('qty-input');

  qtyMinus.addEventListener('click', () => {
    let val = parseInt(qtyInput.value);
    if (val > 1) qtyInput.value = val - 1;
  });

  qtyPlus.addEventListener('click', () => {
    let val = parseInt(qtyInput.value);
    qtyInput.value = val + 1;
  });

  const modalAddToCartBtn = document.getElementById('modal-add-to-cart');
  modalAddToCartBtn.addEventListener('click', () => {
    if (state.activeProductModal) {
      const qty = parseInt(qtyInput.value);
      addToCart(state.activeProductModal.id, qty);
      closeProductModal();
    }
  });

  const checkoutInitBtn = document.getElementById('checkout-init-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutModalClose = document.getElementById('checkout-modal-close');
  
  const closeCheckoutModal = () => {
    checkoutModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  checkoutInitBtn.addEventListener('click', () => {
    if (state.cart.length === 0) {
      showToast('Ваша корзина пуста', 'error');
      return;
    }
    closeCart();
    resetCheckoutWizard();
    checkoutModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  checkoutModalClose.addEventListener('click', closeCheckoutModal);
  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) closeCheckoutModal();
  });

  const shippingForm = document.getElementById('shipping-form');
  const paymentForm = document.getElementById('payment-form');
  
  shippingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    goToCheckoutStep(2);
  });

  document.getElementById('payment-back-btn').addEventListener('click', () => {
    goToCheckoutStep(1);
  });

  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    processCheckoutOrder();
  });

  document.getElementById('checkout-finish-btn').addEventListener('click', () => {
    closeCheckoutModal();
  });

  setupCardMockupListeners();
}

function renderProducts() {
  const container = document.getElementById('products-container');
  const noProductsMsg = document.getElementById('no-products-msg');
  
  let filtered = PRODUCTS.filter(prod => {
    const matchesCategory = state.selectedCategory === 'all' || prod.category === state.selectedCategory;
    const matchesSearch = prod.title.toLowerCase().includes(state.searchQuery) || 
                          prod.description.toLowerCase().includes(state.searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (state.sortOption === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortOption === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => b.reviews - a.reviews);
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    noProductsMsg.classList.remove('hidden');
    return;
  } else {
    noProductsMsg.classList.add('hidden');
  }

  container.innerHTML = filtered.map(product => {
    return `
      <article class="product-card glassmorphism" data-id="${product.id}">
        <div class="card-img-wrapper">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="card-info">
          <span class="category">${product.category === 'smarthome' ? 'Умный дом' : 
                                    product.category === 'wearables' ? 'Носимые' : 
                                    product.category === 'audio' ? 'Аудио' : 'Оптика'}</span>
          <h3>${product.title}</h3>
          
          <div class="product-rating">
            <i data-lucide="star" class="star-icon fill"></i>
            <span>${product.rating}</span>
            <span class="rating-reviews">(${product.reviews} отзывов)</span>
          </div>

          <div class="card-footer-row">
            <div class="card-price">$${product.price.toLocaleString()}</div>
            <div class="card-actions">
              <button class="icon-btn view-details-btn" title="Подробнее">
                <i data-lucide="eye"></i>
              </button>
              <button class="icon-btn add-to-cart-btn btn-primary" title="В корзину">
                <i data-lucide="shopping-cart"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  lucide.createIcons();

  container.querySelectorAll('.product-card').forEach(card => {
    const productId = parseInt(card.dataset.id);
    
    card.addEventListener('click', (e) => {
      if (e.target.closest('.add-to-cart-btn')) return;
      openProductModal(productId);
    });

    card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(productId, 1);
    });
  });
}

function resetFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('clear-search').classList.add('hidden');
  state.searchQuery = '';
  state.selectedCategory = 'all';
  state.sortOption = 'popular';
  
  document.getElementById('sort-select').value = 'popular';
  
  const tabs = document.querySelectorAll('.category-tab');
  tabs.forEach(t => {
    if (t.dataset.category === 'all') t.classList.add('active');
    else t.classList.remove('active');
  });

  renderProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  state.activeProductModal = product;

  document.getElementById('modal-product-img').src = product.image;
  document.getElementById('modal-product-img').alt = product.title;
  
  document.getElementById('modal-product-category').textContent = 
    product.category === 'smarthome' ? 'Умный дом' : 
    product.category === 'wearables' ? 'Носимое устройство' : 
    product.category === 'audio' ? 'Аудио' : 'Оптика';

  document.getElementById('modal-product-title').textContent = product.title;
  document.getElementById('modal-product-rating').textContent = product.rating;
  document.getElementById('modal-product-reviews').textContent = `(${product.reviews} отзывов)`;
  document.getElementById('modal-product-price').textContent = `$${product.price.toLocaleString()}`;
  document.getElementById('modal-product-desc').textContent = product.description;

  const specsUl = document.getElementById('modal-product-specs');
  specsUl.innerHTML = product.specs.map(spec => `<li>${spec}</li>`).join('');

  document.getElementById('qty-input').value = 1;

  const modal = document.getElementById('product-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  lucide.createIcons();
}

function addToCart(productId, quantity) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = state.cart.find(item => item.product.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({ product, quantity });
  }

  saveCart();
  updateCartBadge();
  renderCart();
  showToast(`Добавлено в корзину: ${product.title} (${quantity} шт.)`, 'success');
}

function updateCartQuantity(productId, delta) {
  const item = state.cart.find(item => item.product.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartBadge();
  renderCart();
}

function removeFromCart(productId) {
  const index = state.cart.findIndex(item => item.product.id === productId);
  if (index === -1) return;

  const productName = state.cart[index].product.title;
  state.cart.splice(index, 1);

  saveCart();
  updateCartBadge();
  renderCart();
  showToast(`Удалено из корзины: ${productName}`, 'error');
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalPriceText = document.getElementById('cart-total-price');

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-msg">
        <i data-lucide="shopping-bag"></i>
        <p>Ваша корзина пуста</p>
      </div>
    `;
    totalPriceText.textContent = '$0';
    lucide.createIcons();
    return;
  }

  let total = 0;
  container.innerHTML = state.cart.map(item => {
    const itemTotal = item.product.price * item.quantity;
    total += itemTotal;
    
    return `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${item.product.image}" alt="${item.product.title}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.product.title}</h4>
          <span class="cart-item-price">$${item.product.price.toLocaleString()}</span>
          
          <div class="cart-item-actions">
            <div class="qty-control">
              <button onclick="updateCartQuantity(${item.product.id}, -1)">-</button>
              <span>${item.quantity}</span>
              <button onclick="updateCartQuantity(${item.product.id}, 1)">+</button>
            </div>
            <button onclick="removeFromCart(${item.product.id})" class="remove-item-btn" title="Удалить">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  totalPriceText.textContent = `$${total.toLocaleString()}`;
  lucide.createIcons();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge-count');
  const totalQty = state.cart.reduce((acc, item) => acc + item.quantity, 0);
  badge.textContent = totalQty;
  
  badge.classList.remove('pulse-animation');
  void badge.offsetWidth;
  badge.classList.add('pulse-animation');
}

function saveCart() {
  try {
    localStorage.setItem('aether_cart', JSON.stringify(state.cart));
  } catch (e) {}
}

window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} glassmorphism`;
  
  const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3500);
}

function resetCheckoutWizard() {
  document.getElementById('shipping-form').reset();
  document.getElementById('payment-form').reset();
  
  document.getElementById('card-number-preview').textContent = '•••• •••• •••• ••••';
  document.getElementById('card-holder-preview').textContent = 'CARDHOLDER NAME';
  document.getElementById('card-expiry-preview').textContent = 'MM/YY';

  goToCheckoutStep(1);
}

function goToCheckoutStep(stepNumber) {
  document.getElementById('checkout-step-1').classList.add('hidden');
  document.getElementById('checkout-step-2').classList.add('hidden');
  document.getElementById('checkout-step-3').classList.add('hidden');

  const steps = [1, 2, 3];
  steps.forEach(num => {
    const tab = document.getElementById(`step-${num}-tab`);
    tab.classList.remove('active', 'completed');
    if (num < stepNumber) {
      tab.classList.add('completed');
    } else if (num === stepNumber) {
      tab.classList.add('active');
    }
  });

  document.getElementById(`checkout-step-${stepNumber}`).classList.remove('hidden');
}

function setupCardMockupListeners() {
  const cardNumberInput = document.getElementById('card-number');
  const cardExpiryInput = document.getElementById('card-expiry');
  const cardNameInput = document.getElementById('checkout-name');

  cardNumberInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += val[i];
    }
    e.target.value = formatted;
    document.getElementById('card-number-preview').textContent = formatted || '•••• •••• •••• ••••';
  });

  cardExpiryInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    e.target.value = val;
    document.getElementById('card-expiry-preview').textContent = val || 'MM/YY';
  });

  cardNameInput.addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase();
    document.getElementById('card-holder-preview').textContent = val || 'CARDHOLDER NAME';
  });
}

function processCheckoutOrder() {
  const orderNum = 'AE-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('order-number-val').textContent = `#${orderNum}`;

  const address = document.getElementById('checkout-address').value || 'г. Москва, ул. Ленина, д. 1';
  const status = 'transit';

  const orderSnapshot = {
    id: orderNum,
    address,
    status,
    date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    items: state.cart.map(i => ({ title: i.product.title, quantity: i.quantity, price: i.product.price, image: i.product.image })),
    eta: Math.floor(15 + Math.random() * 45) + ' минут'
  };
  state.orders.push(orderSnapshot);
  saveOrders();

  goToCheckoutStep(3);

  state.cart = [];
  saveCart();
  updateCartBadge();
  renderCart();

  showToast(`Заказ #${orderNum} оформлен!`, 'success');
}

function saveOrders() {
  try {
    localStorage.setItem('aether_orders', JSON.stringify(state.orders));
  } catch (e) {}
}

const MOCK_PRODUCTS_NAMES = [
  'Aether Glass X', 'Neural Earbuds Pro', 'Chronos Ring',
  'Nova Projector', 'Apex Wristwatch', 'Vortex Hub'
];
const MOCK_ADDRESSES = [
  'г. Москва, ул. Арбат, д. 12, кв. 4',
  'г. Санкт-Петербург, Невский проспект, д. 88',
  'г. Алматы, ул. Абая, д. 55, кв. 10',
  'г. Новосибирск, ул. Ленина, д. 3, кв. 7',
];
const STATUS_STEPS = ['placed', 'processing', 'transit', 'delivered'];

function setupTrackingListeners() {
  const trackToggleBtn = document.getElementById('track-toggle-btn');
  const trackingModal  = document.getElementById('tracking-modal');
  const trackingClose  = document.getElementById('tracking-modal-close');
  const trackingForm   = document.getElementById('tracking-search-form');

  const openTracking = () => {
    if (state.orders.length > 0) {
      const last = state.orders[state.orders.length - 1];
      document.getElementById('tracking-input').value = `#${last.id}`;
    }
    trackingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('tracking-results').classList.add('hidden');
    document.getElementById('tracking-error').classList.add('hidden');
    lucide.createIcons();
  };

  const closeTracking = () => {
    trackingModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  trackToggleBtn.addEventListener('click', openTracking);
  trackingClose.addEventListener('click', closeTracking);
  trackingModal.addEventListener('click', e => { if (e.target === trackingModal) closeTracking(); });

  trackingForm.addEventListener('submit', e => {
    e.preventDefault();
    const raw = document.getElementById('tracking-input').value.trim();
    const query = raw.replace(/^#/, '').toUpperCase();
    searchOrder(query);
  });
}

function searchOrder(query) {
  const real = state.orders.find(o => o.id.toUpperCase() === query || query === o.id);
  const looksValid = /^AE-\d{6,}$/i.test(query) || /^\d{6,}$/.test(query);

  if (!real && !looksValid) {
    document.getElementById('tracking-results').classList.add('hidden');
    document.getElementById('tracking-error').classList.remove('hidden');
    return;
  }

  const order = real || generateDemoOrder(query);

  document.getElementById('tracking-error').classList.add('hidden');
  renderTrackingResults(order);
}

function generateDemoOrder(query) {
  const seed = [...query].reduce((a, c) => a + c.charCodeAt(0), 0);
  const pick = (arr) => arr[seed % arr.length];
  const status = pick(STATUS_STEPS);
  const numItems = 1 + (seed % 3);
  const items = [];
  for (let i = 0; i < numItems; i++) {
    const prod = MOCK_PRODUCTS_NAMES[(seed + i) % MOCK_PRODUCTS_NAMES.length];
    const price = PRODUCTS.find(p => p.title === prod)?.price || 299;
    items.push({ title: prod, quantity: 1, price });
  }
  return {
    id: query.startsWith('AE-') ? query : `AE-${query}`,
    address: pick(MOCK_ADDRESSES),
    status,
    items,
    eta: (15 + (seed % 45)) + ' минут'
  };
}

function renderTrackingResults(order) {
  document.getElementById('track-order-id').textContent = `#${order.id}`;
  document.getElementById('track-eta').textContent =
    order.status === 'delivered' ? 'Доставлен ✓' : `~${order.eta}`;
  document.getElementById('track-address-text').textContent = order.address;

  const itemsList = document.getElementById('track-items-list');
  itemsList.innerHTML = order.items.map(item => `
    <div class="track-item-row">
      <span>${item.title} × ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join('');

  const stepOrder = ['placed', 'processing', 'transit', 'delivered'];
  const currentIdx = stepOrder.indexOf(order.status);

  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`track-step-${i}`);
    el.classList.remove('completed', 'active');
    const stepIdx = i - 1;
    if (stepIdx < currentIdx) {
      el.classList.add('completed');
    } else if (stepIdx === currentIdx) {
      el.classList.add('active');
    }
  }

  animateDrone(order.status);

  document.getElementById('tracking-results').classList.remove('hidden');
  lucide.createIcons();
}

function animateDrone(status) {
  const drone = document.getElementById('radar-drone');
  if (!drone) return;

  const positions = {
    placed:     { top: '80%', left: '15%' },
    processing: { top: '70%', left: '25%' },
    transit:    { top: '45%', left: '50%' },
    delivered:  { top: '25%', left: '75%' }
  };

  const pos = positions[status] || positions.placed;
  drone.style.top  = pos.top;
  drone.style.left = pos.left;
}

function setupProfileListeners() {
  const profileToggleBtn = document.getElementById('profile-toggle-btn');
  const profileModal = document.getElementById('profile-modal');
  const profileModalClose = document.getElementById('profile-modal-close');
  const profileGoShopBtn = document.getElementById('profile-go-shop-btn');

  const openProfile = () => {
    renderProfileOrders();
    profileModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
  };

  const closeProfile = () => {
    profileModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  profileToggleBtn.addEventListener('click', openProfile);
  profileModalClose.addEventListener('click', closeProfile);
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeProfile();
  });

  if (profileGoShopBtn) {
    profileGoShopBtn.addEventListener('click', () => {
      closeProfile();
      document.getElementById('catalog-section').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function getStatusLabel(status) {
  const labels = {
    placed: { text: 'Размещён', color: 'status-placed' },
    processing: { text: 'Обработка', color: 'status-processing' },
    transit: { text: 'В пути', color: 'status-transit' },
    delivered: { text: 'Доставлен', color: 'status-delivered' }
  };
  return labels[status] || { text: status, color: 'status-placed' };
}

function getStatusIcon(status) {
  const icons = {
    placed: 'clock',
    processing: 'settings',
    transit: 'navigation',
    delivered: 'check-circle-2'
  };
  return icons[status] || 'clock';
}

function renderProfileOrders() {
  const emptyState = document.getElementById('profile-empty-state');
  const ordersList = document.getElementById('profile-orders-list');

  if (state.orders.length === 0) {
    emptyState.classList.remove('hidden');
    ordersList.innerHTML = '';
    return;
  }

  emptyState.classList.add('hidden');

  const reversedOrders = [...state.orders].reverse();

  ordersList.innerHTML = reversedOrders.map((order, idx) => {
    const statusInfo = getStatusLabel(order.status);
    const statusIcon = getStatusIcon(order.status);
    const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const isTransit = order.status === 'transit';

    return `
      <div class="profile-order-card glassmorphism">
        <div class="profile-order-header">
          <div class="profile-order-meta">
            <span class="profile-order-id">#${order.id}</span>
            ${order.date ? `<span class="profile-order-date">${order.date}</span>` : ''}
          </div>
          <div class="profile-order-status ${statusInfo.color}">
            <i data-lucide="${statusIcon}"></i>
            <span>${statusInfo.text}</span>
          </div>
        </div>

        <div class="profile-order-items">
          ${order.items.map(item => `
            <div class="profile-order-item-row">
              <span class="profile-item-name">${item.title}</span>
              <span class="profile-item-qty">× ${item.quantity}</span>
              <span class="profile-item-price">$${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
        </div>

        <div class="profile-order-footer">
          <div class="profile-order-total">
            <span>Итого:</span>
            <span class="profile-total-price">$${total.toLocaleString()}</span>
          </div>
          <div class="profile-order-actions">
            ${isTransit ? `
              <div class="profile-transit-badge">
                <i data-lucide="plane"></i>
                <span>Дрон летит — ~${order.eta}</span>
              </div>
            ` : ''}
            <button class="btn btn-secondary profile-track-btn" onclick="trackOrderFromProfile('${order.id}')">
              <i data-lucide="radar" class="btn-icon"></i> Отследить
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function trackOrderFromProfile(orderId) {
  const profileModal = document.getElementById('profile-modal');
  const trackingModal = document.getElementById('tracking-modal');

  profileModal.classList.remove('open');

  document.getElementById('tracking-input').value = `#${orderId}`;
  document.getElementById('tracking-results').classList.add('hidden');
  document.getElementById('tracking-error').classList.add('hidden');

  trackingModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();

  searchOrder(orderId);
}

window.trackOrderFromProfile = trackOrderFromProfile;
