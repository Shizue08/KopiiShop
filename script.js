// Coffee Shop Application - Fixed Version
class CoffeeShopApp {
    constructor() {
        this.products = this.getProducts();
        this.cart = this.getCart();
        this.currentUser = this.getCurrentUser();
        this.initialized = false; // Add initialization flag
    }

    init() {
        if (this.initialized) return; // Prevent double initialization
        
        this.setupEventListeners();
        this.renderPageContent();
        this.updateNavigation();
        this.updateCartUI();
        this.setActiveNavLink(); // Set active nav link on init
        this.initialized = true; // Mark as initialized
    }

    // Set active navigation link based on current page
    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            // Handle index.html specially since it's the homepage
            if (currentPage === 'index.html' && linkHref === 'index.html') {
                link.classList.add('active');
            } 
            // For other pages, check if the link matches the current page
            else if (linkHref === currentPage && currentPage !== 'index.html') {
                link.classList.add('active');
            }
        });
    }

    // Authentication Methods
    getCurrentUser() {
        const userString = localStorage.getItem('currentUser');
        return userString ? JSON.parse(userString) : null;
    }

    saveUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        this.updateNavigation();
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateNavigation();
        window.location.href = 'index.html';
    }

    updateNavigation() {
        const authButtons = document.querySelector('.auth-buttons');
        const loginBtn = document.querySelector('.btn-login');
        const registerBtn = document.querySelector('.btn-register');
        
        if (this.currentUser) {
            if (authButtons) {
                authButtons.innerHTML = `<button class="btn btn-secondary" onclick="app.logout()">Logout</button>`;
            }
            if (loginBtn && registerBtn) {
                loginBtn.style.display = 'none';
                registerBtn.style.display = 'none';
            }
        } else {
            if (authButtons) {
                authButtons.innerHTML = `
                    <button class="btn btn-secondary btn-login">Login</button>
                    <button class="btn btn-primary btn-register">Register</button>
                `;
            }
        }
    }

    // Product Management
    getProducts() {
        return JSON.parse(localStorage.getItem("products")) || [
            {
                id: 1,
                name: 'Classic Americano',
                price: 4.99,
                image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
                description: 'Rich and bold coffee with a smooth finish. Perfect for starting your day.',
                category: 'coffee'
            },
            {
                id: 2,
                name: 'Caramel Macchiato',
                price: 5.99,
                image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=300&fit=crop',
                description: 'Creamy espresso with steamed milk and sweet caramel drizzle.',
                category: 'coffee'
            },
            {
                id: 3,
                name: 'Vanilla Latte',
                price: 5.49,
                image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
                description: 'Smooth espresso combined with steamed milk and vanilla syrup.',
                category: 'coffee'
            },
            {
                id: 4,
                name: 'Mocha Delight',
                price: 6.49,
                image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
                description: 'Rich chocolate and espresso blend topped with whipped cream.',
                category: 'coffee'
            },
            {
                id: 5,
                name: 'Iced Coffee',
                price: 4.49,
                image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
                description: 'Refreshing cold brew served over ice with your choice of milk.',
                category: 'coffee'
            },
            {
                id: 6,
                name: 'Cappuccino',
                price: 4.79,
                image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
                description: 'Perfectly balanced espresso with steamed milk foam.',
                category: 'coffee'
            }
        ];
    }

    saveProducts() {
        localStorage.setItem("products", JSON.stringify(this.products));
    }

    // Cart Management
    getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    addToCart(productId) {
        if (!this.currentUser) {
            this.showAuthenticationAlert();
            return;
        }

        const product = this.products.find(p => p.id === parseInt(productId));
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.updateCartUI();
        this.showSuccessMessage(`${product.name} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== parseInt(productId));
        this.saveCart();
        this.updateCartUI();
        this.showSuccessMessage('Item removed from cart');
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === parseInt(productId));
        if (item) {
            item.quantity = Math.max(1, parseInt(quantity));
            this.saveCart();
            this.updateCartUI();
        }
    }

    increaseQuantity(productId) {
        const item = this.cart.find(item => item.id === parseInt(productId));
        if (item) {
            item.quantity += 1;
            this.saveCart();
            this.updateCartUI();
        }
    }

    decreaseQuantity(productId) {
        const item = this.cart.find(item => item.id === parseInt(productId));
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            this.saveCart();
            this.updateCartUI();
        }
    }

    calculateTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
    }

    // UI Rendering Methods
    renderPageContent() {
        const currentPage = window.location.pathname.split('/').pop();
        
        switch(currentPage) {
            case 'menu.html':
                this.renderMenuProducts();
                break;
            case 'cart.html':
                this.renderCartPage();
                break;
            case 'checkout.html':
                this.renderCheckoutPage();
                break;
            case 'user.html':
                this.renderUserPage();
                break;
            case 'admin.html':
                this.renderAdminPage();
                break;
            case 'index.html':
                this.setupHomePage();
                break;
        }
    }

    renderMenuProducts() {
        const container = document.getElementById("products-container");
        if (!container) return;

        container.innerHTML = '';
        this.products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("menu-item");
            productElement.innerHTML = `
                <div class="menu-item-content">
                    <img src="${product.image}" alt="${product.name}" class="menu-img" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjQzhBMjdBIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCI+${btoa(product.name)}</dGV4dD4KPC9zdmc+'">
                    <div class="menuItem-details">
                        <h4 class="menuItem-topic">${product.name}</h4>
                        <p class="menuItem-des">${product.description}</p>
                        <div class="menuItem-price flex">
                            <span class="discount-price">$${product.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                </div>
            `;
            container.appendChild(productElement);
        });
    }

    renderCartPage() {
        const cartList = document.getElementById("cart-list");
        const totalElement = document.getElementById("total-price");
        const cartContainer = document.querySelector('.cart-container');
        
        if (!cartList) return;

        if (this.cart.length === 0) {
            cartList.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="menu.html" class="browse-menu-btn">Browse Our Menu</a>
                </div>
            `;
            if (cartContainer) cartContainer.style.display = 'block';
        } else {
            cartList.innerHTML = '';
            
            this.cart.forEach(item => {
                const cartItemElement = document.createElement("div");
                cartItemElement.classList.add("cart-item");
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iMTIiIGZpbGw9IiNDOEEyN0EiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIj4${btoa(item.name.substring(0, 15))}</dGV4dD4KPC9zdmc+'">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-description">${item.description}</p>
                        <div class="menu-item-quantity">
                            <div class="quantity-controls">
                                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                                <input type="number" class="item-quantity" value="${item.quantity}" min="1" data-id="${item.id}">
                                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                    <div class="cart-item-price">
                        <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="cart-item-unit">$${item.price.toFixed(2)} each</div>
                    </div>
                `;
                cartList.appendChild(cartItemElement);
            });

            // Add cart summary
            const summaryElement = document.createElement("div");
            summaryElement.classList.add("cart-summary");
            summaryElement.innerHTML = `
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>$${this.calculateTotal().toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>$2.99</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>$${(this.calculateTotal() + 2.99).toFixed(2)}</span>
                </div>
                <div class="cart-actions">
                    <a href="menu.html" class="continue-shopping">Continue Shopping</a>
                    <a href="checkout.html" class="checkout-btn">Proceed to Checkout</a>
                </div>
            `;
            cartList.appendChild(summaryElement);
        }

        if (totalElement) {
            totalElement.textContent = this.calculateTotal().toFixed(2);
        }
    }

    renderCheckoutPage() {
        const cartList = document.getElementById("cart-list");
        const totalElement = document.getElementById("total-price");
        
        if (!cartList) return;

        cartList.innerHTML = '';
        
        if (this.cart.length === 0) {
            cartList.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="menu.html" class="browse-menu-btn">Browse Our Menu</a>
                </div>
            `;
        } else {
            this.cart.forEach(item => {
                const cartItemElement = document.createElement("div");
                cartItemElement.classList.add("cart-item");
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iMTIiIGZpbGw9IiNDOEEyN0EiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIj4${btoa(item.name.substring(0, 15))}</dGV4dD4KPC9zdmc+'">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-description">${item.description}</p>
                        <div class="menu-item-quantity">
                            <span>Quantity: ${item.quantity}</span>
                        </div>
                    </div>
                    <div class="cart-item-price">
                        <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `;
                cartList.appendChild(cartItemElement);
            });

            // Add checkout summary
            const summaryElement = document.createElement("div");
            summaryElement.classList.add("cart-summary");
            summaryElement.innerHTML = `
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>$${this.calculateTotal().toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>$2.99</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>$${(this.calculateTotal() + 2.99).toFixed(2)}</span>
                </div>
            `;
            cartList.appendChild(summaryElement);
        }

        if (totalElement) {
            totalElement.textContent = this.calculateTotal().toFixed(2);
        }
    }

    renderUserPage() {
        this.loadUserProfile();
        this.loadOrderHistory();
    }

    renderAdminPage() {
        this.checkAdminAccess();
    }

    setupHomePage() {
        // Home page specific setup
    }

    // User Profile Methods
    loadUserProfile() {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            document.getElementById('userName').textContent = currentUser.username;
            document.getElementById('userEmail').textContent = currentUser.email;
            
            const avatar = document.getElementById('userAvatar');
            if (avatar) {
                avatar.textContent = currentUser.username.charAt(0).toUpperCase();
            }
            
            this.loadUserStats();
            
            const updateForm = document.getElementById('updateProfileForm');
            if (updateForm) {
                document.getElementById('updateUsername').value = currentUser.username;
                document.getElementById('updateEmail').value = currentUser.email;
            }
        }
    }

    loadUserStats() {
        const ordersCount = document.getElementById('ordersCount');
        const totalSpent = document.getElementById('totalSpent');
        const memberSince = document.getElementById('memberSince');
        
        if (ordersCount) ordersCount.textContent = '12';
        if (totalSpent) totalSpent.textContent = '$245.88';
        if (memberSince) memberSince.textContent = '45';
    }

    loadOrderHistory() {
        const tbody = document.getElementById('orderHistory');
        if (!tbody) return;
        
        const orderHistory = [
            { id: 'ORD-001', date: '2024-01-15', items: '2 items', total: '$38.97', status: 'Delivered' },
            { id: 'ORD-002', date: '2024-01-10', items: '1 item', total: '$22.99', status: 'Delivered' },
            { id: 'ORD-003', date: '2024-01-05', items: '3 items', total: '$64.95', status: 'Processing' }
        ];
        
        tbody.innerHTML = orderHistory.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>${order.items}</td>
                <td>${order.total}</td>
                <td><span class="status-badge" style="background: ${order.status === 'Delivered' ? '#d4edda' : '#fff3cd'}; color: ${order.status === 'Delivered' ? '#155724' : '#856404'};">${order.status}</span></td>
                <td class="action-buttons">
                    <button class="btn btn-view btn-sm">View</button>
                </td>
            </tr>
        `).join('');
    }

    // Admin Methods
    checkAdminAccess() {
        const currentUser = this.getCurrentUser();
        const isAdmin = currentUser && currentUser.email === 'admin@example.com';
        
        const adminLogin = document.getElementById('adminLogin');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (adminLogin && adminDashboard) {
            if (isAdmin) {
                adminLogin.style.display = 'none';
                adminDashboard.style.display = 'block';
                this.loadAdminDashboard();
            } else {
                adminLogin.style.display = 'block';
                adminDashboard.style.display = 'none';
            }
        }
    }

    loadAdminDashboard() {
        this.loadAdminStats();
        this.loadProductManagement();
        this.loadOrderManagement();
    }

    loadAdminStats() {
        const stats = {
            totalSales: '$12,847',
            totalOrders: '1,284',
            totalProducts: this.products.length,
            totalCustomers: '892'
        };
        
        document.getElementById('totalSales').textContent = stats.totalSales;
        document.getElementById('totalOrders').textContent = stats.totalOrders;
        document.getElementById('totalProducts').textContent = stats.totalProducts;
        document.getElementById('totalCustomers').textContent = stats.totalCustomers;
    }

    loadProductManagement() {
        const tbody = document.getElementById('productTable');
        if (!tbody) return;
        
        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.category}</td>
                <td class="action-buttons">
                    <button class="btn btn-edit btn-sm" onclick="app.editProduct(${product.id})">Edit</button>
                    <button class="btn btn-delete btn-sm" onclick="app.deleteProduct(${product.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    loadOrderManagement() {
        const tbody = document.getElementById('orderTable');
        if (!tbody) return;
        
        const orders = [
            { id: 'ORD-001', customer: 'John Doe', date: '2024-01-15', total: '$38.97', status: 'Delivered' },
            { id: 'ORD-002', customer: 'Jane Smith', date: '2024-01-14', total: '$22.99', status: 'Processing' },
            { id: 'ORD-003', customer: 'Bob Johnson', date: '2024-01-13', total: '$64.95', status: 'Pending' }
        ];
        
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${order.total}</td>
                <td>
                    <select class="form-select" onchange="app.updateOrderStatus('${order.id}', this.value)">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td class="action-buttons">
                    <button class="btn btn-view btn-sm">View</button>
                </td>
            </tr>
        `).join('');
    }

    // Event Listeners
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const navMenu = document.querySelector('.nav-menu');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            
            if (navMenu && navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && window.innerWidth > 768) {
                navMenu.classList.remove('active');
            }
        });

        // Authentication modals
        this.setupAuthModals();

        // Cart functionality - Use event delegation with proper binding
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = e.target.getAttribute('data-product-id');
                this.addToCart(productId);
                return; // Prevent multiple executions
            }
            
            if (e.target.classList.contains('remove-item')) {
                const productId = e.target.getAttribute('data-id');
                this.removeFromCart(productId);
                return; // Prevent multiple executions
            }

            // Quantity buttons
            if (e.target.classList.contains('quantity-btn')) {
                const productId = e.target.getAttribute('data-id');
                const action = e.target.getAttribute('data-action');
                
                if (action === 'increase') {
                    this.increaseQuantity(productId);
                } else if (action === 'decrease') {
                    this.decreaseQuantity(productId);
                }
                return; // Prevent multiple executions
            }
        });

        // Quantity changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('item-quantity')) {
                const productId = e.target.getAttribute('data-id');
                const quantity = e.target.value;
                this.updateCartQuantity(productId, quantity);
                return; // Prevent multiple executions
            }
        });

        // Checkout form
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processCheckout();
            });
        }

        // Profile update form
        const updateForm = document.getElementById('updateProfileForm');
        if (updateForm) {
            updateForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }

        // Product management forms
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProduct();
            });
        }

        // Admin login
        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.adminLogin();
            });
        }
    }

    setupAuthModals() {
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        const closeButtons = document.querySelectorAll('.close-btn');
        const switchToRegister = document.getElementById('switchToRegister');
        const switchToLogin = document.getElementById('switchToLogin');

        // Login button - Use event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-login')) {
                this.showLoginModal();
                return;
            }
            if (e.target.classList.contains('btn-register')) {
                this.showRegisterModal();
                return;
            }
        });

        // Close modals
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideAuthModals();
            });
        });

        // Switch between login and register
        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterModal();
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }

        // Close on overlay click
        [loginModal, registerModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideAuthModals();
                    }
                });
            }
        });

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    }

    // Authentication Modal Methods
    showLoginModal() {
        const loginModal = document.getElementById('loginModal');
        const loginForm = document.querySelector('.login-form');
        const registerForm = document.querySelector('.register-form');
        
        if (loginModal) loginModal.classList.add('active');
        if (loginForm) loginForm.classList.add('active');
        if (registerForm) registerForm.classList.remove('active');
    }

    showRegisterModal() {
        const registerModal = document.getElementById('registerModal');
        const loginForm = document.querySelector('.login-form');
        const registerForm = document.querySelector('.register-form');
        
        if (registerModal) registerModal.classList.add('active');
        if (loginForm) loginForm.classList.remove('active');
        if (registerForm) registerForm.classList.add('active');
    }

    hideAuthModals() {
        const modals = document.querySelectorAll('.modal-overlay');
        const forms = document.querySelectorAll('.login-form, .register-form');
        
        modals.forEach(modal => modal.classList.remove('active'));
        forms.forEach(form => form.classList.remove('active'));
    }

    // Authentication Handlers
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showErrorMessage('Please fill in all fields');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.saveUser(user);
            this.hideAuthModals();
            this.showSuccessMessage('Login successful!');
            window.location.reload();
        } else {
            this.showErrorMessage('Invalid email or password');
        }
    }

    handleRegister() {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (!username || !email || !password || !confirmPassword) {
            this.showErrorMessage('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            this.showErrorMessage('Passwords do not match');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.find(u => u.email === email)) {
            this.showErrorMessage('Email already registered');
            return;
        }

        const newUser = { username, email, password, role: 'user' };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        this.saveUser(newUser);
        this.hideAuthModals();
        this.showSuccessMessage('Registration successful!');
        window.location.reload();
    }

    adminLogin() {
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        if (email === 'admin@example.com' && password === 'admin123') {
            const adminUser = { username: 'Admin', email: 'admin@example.com', role: 'admin' };
            this.saveUser(adminUser);
            this.showSuccessMessage('Admin login successful!');
            window.location.reload();
        } else {
            this.showErrorMessage('Invalid admin credentials');
        }
    }

    // Product Management Methods
    addProduct() {
        const name = document.getElementById('productName').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const category = document.getElementById('productCategory').value;
        const description = document.getElementById('productDescription').value;

        if (!name || !price || !category) {
            this.showErrorMessage('Please fill in all required fields');
            return;
        }

        const newProduct = {
            id: Date.now(),
            name,
            price,
            category,
            description,
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop'
        };

        this.products.push(newProduct);
        this.saveProducts();
        this.loadProductManagement();
        document.getElementById('addProductForm').reset();
        this.showSuccessMessage('Product added successfully!');
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productDescription').value = product.description;
            
            // Change form to update mode
            const form = document.getElementById('addProductForm');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Update Product';
            
            form.onsubmit = (e) => {
                e.preventDefault();
                this.updateProduct(productId);
            };
        }
    }

    updateProduct(productId) {
        const name = document.getElementById('productName').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const category = document.getElementById('productCategory').value;
        const description = document.getElementById('productDescription').value;

        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                name,
                price,
                category,
                description
            };
            
            this.saveProducts();
            this.loadProductManagement();
            
            // Reset form to add mode
            const form = document.getElementById('addProductForm');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Add Product';
            
            form.reset();
            form.onsubmit = (e) => {
                e.preventDefault();
                this.addProduct();
            };
            
            this.showSuccessMessage('Product updated successfully!');
        }
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveProducts();
            this.loadProductManagement();
            this.showSuccessMessage('Product deleted successfully!');
        }
    }

    updateOrderStatus(orderId, status) {
        this.showSuccessMessage(`Order ${orderId} status updated to ${status}`);
    }

    // Profile Methods
    updateProfile() {
        const username = document.getElementById('updateUsername').value;
        const email = document.getElementById('updateEmail').value;
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        if (!username || !email) {
            this.showErrorMessage('Please fill in all required fields');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === this.currentUser.email);
        
        if (userIndex !== -1) {
            users[userIndex].username = username;
            users[userIndex].email = email;
            
            if (newPassword) {
                if (!currentPassword) {
                    this.showErrorMessage('Please enter current password to change password');
                    return;
                }
                if (users[userIndex].password !== currentPassword) {
                    this.showErrorMessage('Current password is incorrect');
                    return;
                }
                users[userIndex].password = newPassword;
            }
            
            localStorage.setItem('users', JSON.stringify(users));
            this.saveUser(users[userIndex]);
            this.showSuccessMessage('Profile updated successfully!');
        }
    }

    // Checkout Methods
    processCheckout() {
        if (this.cart.length === 0) {
            this.showErrorMessage('Your cart is empty');
            return;
        }

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zip = document.getElementById('zip').value;
        const paymentMethod = document.getElementById('paymentMethod').value;

        if (!name || !email || !address || !city || !zip || !paymentMethod) {
            this.showErrorMessage('Please fill in all required fields');
            return;
        }

        // Simulate payment processing
        this.showSuccessMessage('Order placed successfully! Thank you for your purchase.');
        this.clearCart();
        
        setTimeout(() => {
            window.location.href = 'user.html';
        }, 2000);
    }

    // UI Update Methods
    updateCartUI() {
        const cartCount = document.querySelectorAll('#cart-count');
        cartCount.forEach(element => {
            if (element) {
                const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
                element.textContent = totalItems;
                element.style.display = totalItems > 0 ? 'inline' : 'none';
            }
        });

        // Update cart page if we're on it
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
        
        // Update checkout page if we're on it
        if (window.location.pathname.includes('checkout.html')) {
            this.renderCheckoutPage();
        }
    }

    // Utility Methods
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            color: white;
            font-weight: 600;
            z-index: 3000;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            box-shadow: var(--shadow);
            animation: slideIn 0.3s ease;
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 3000);
    }

    showAuthenticationAlert() {
        this.showErrorMessage('Please login to add items to cart');
        this.showLoginModal();
    }
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application - Only call init once
const app = new CoffeeShopApp();

// Make app globally available for onclick handlers
window.app = app;

// Initialize on DOM load - This is the only place init should be called
document.addEventListener('DOMContentLoaded', function() {
    app.init();
});