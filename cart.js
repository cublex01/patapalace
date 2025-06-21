/**
 * Shopping Cart Module for Patat Palace
 * Handles all cart functionality including:
 * - Adding products to cart
 * - Updating cart quantities
 * - Displaying cart in modal
 * - Checkout process
 */
class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        
        // Initialize the cart
        this.init();
    }
    
    init() {
        console.log('Initializing cart module...');
        
        // Add event listeners to all "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering parent card click
                const productId = button.dataset.productId;
                this.addToCart(productId, 1);
            });
        });
        
        // Add event listener to modal "Add to Cart" button
        const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
        if (modalAddToCartBtn) {
            modalAddToCartBtn.addEventListener('click', () => {
                const productId = modalAddToCartBtn.dataset.productId;
                const quantity = parseInt(document.getElementById('modalProductQuantity').value) || 1;
                this.addToCart(productId, quantity);
                
                // Close the product modal
                const productModal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
                if (productModal) {
                    productModal.hide();
                }
            });
        }
        
        // Initialize checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.showCheckoutModal();
            });
        }
        
        // Initialize checkout form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }
        
        // Load cart from localStorage if available
        this.loadCart();
        
        // Update cart UI
        this.updateCartUI();
    }
    
    addToCart(productId, quantity) {
        // Get product details from global productDetails object
        const product = window.productDetails[productId];
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }
        
        // Check if product already exists in cart
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            // Update quantity if product already exists
            existingItem.quantity += quantity;
        } else {
            // Add new item to cart
            this.items.push({
                id: productId,
                name: product.name,
                price: this.extractPrice(product.price),
                quantity: quantity,
                image: product.image
            });
        }
        
        // Update total and save cart
        this.updateTotal();
        this.saveCart();
        
        // Show notification
        this.showNotification(`${product.name} toegevoegd aan bestelling.`);
        
        // Update cart UI
        this.updateCartUI();
    }
    
    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.updateTotal();
                this.saveCart();
                this.updateCartUI();
            }
        }
    }
    
    updateTotal() {
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }
    
    saveCart() {
        localStorage.setItem('patatCart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    }
    
    loadCart() {
        const savedCart = localStorage.getItem('patatCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            this.items = cartData.items || [];
            this.total = cartData.total || 0;
        }
    }
    
    clearCart() {
        this.items = [];
        this.total = 0;
        this.saveCart();
        this.updateCartUI();
    }
    
    updateCartUI() {
        const cartModalBody = document.getElementById('cartModalBody');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartModalBody) {
            // Clear existing content
            cartModalBody.innerHTML = '';
            
            if (this.items.length === 0) {
                cartModalBody.innerHTML = '<p class="text-center">Uw bestelling is leeg.</p>';
            } else {
                // Create cart items list
                const cartList = document.createElement('ul');
                cartList.className = 'list-group mb-3';
                
                this.items.forEach(item => {
                    const cartItem = document.createElement('li');
                    cartItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                    
                    const itemContent = `
                        <div>
                            <h6 class="my-0">${item.name}</h6>
                            <small class="text-muted">€${item.price.toFixed(2)} per stuk</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <div class="input-group input-group-sm" style="width: 100px;">
                                <button class="btn btn-outline-secondary decrease-quantity" data-product-id="${item.id}" type="button">-</button>
                                <input type="number" class="form-control text-center cart-quantity" value="${item.quantity}" min="1" data-product-id="${item.id}">
                                <button class="btn btn-outline-secondary increase-quantity" data-product-id="${item.id}" type="button">+</button>
                            </div>
                            <span class="ms-3">€${(item.price * item.quantity).toFixed(2)}</span>
                            <button class="btn btn-sm ms-2 remove-item" data-product-id="${item.id}">
                                <i class="bx bx-trash"></i>
                            </button>
                        </div>
                    `;
                    
                    cartItem.innerHTML = itemContent;
                    cartList.appendChild(cartItem);
                });
                
                cartModalBody.appendChild(cartList);
                
                // Add event listeners to cart item buttons
                this.addCartItemEventListeners();
            }
        }
        
        // Update total display
        if (cartTotal) {
            cartTotal.textContent = `€${this.total.toFixed(2)}`;
        }
    }
    
    addCartItemEventListeners() {
        // Event listeners for quantity controls
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.productId;
                const item = this.items.find(item => item.id === productId);
                if (item && item.quantity > 1) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.productId;
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });
        
        document.querySelectorAll('.cart-quantity').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = input.dataset.productId;
                const newQuantity = parseInt(e.target.value) || 1;
                this.updateQuantity(productId, newQuantity);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.productId;
                this.removeFromCart(productId);
            });
        });
    }
    
    showCheckoutModal() {
        // Hide cart modal
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (cartModal) {
            cartModal.hide();
        }
        
        // Update order summary in checkout modal
        const orderSummary = document.getElementById('orderSummary');
        if (orderSummary) {
            orderSummary.innerHTML = '';
            
            const orderList = document.createElement('ul');
            orderList.className = 'list-group';
            
            this.items.forEach(item => {
                const orderItem = document.createElement('li');
                orderItem.className = 'list-group-item d-flex justify-content-between lh-sm';
                orderItem.innerHTML = `
                    <div>
                        <h6 class="my-0">${item.name}</h6>
                        <small class="text-muted">${item.quantity} x €${item.price.toFixed(2)}</small>
                    </div>
                    <span>€${(item.price * item.quantity).toFixed(2)}</span>
                `;
                orderList.appendChild(orderItem);
            });
            
            orderSummary.appendChild(orderList);
        }
        
        // Update order total
        const orderTotal = document.getElementById('orderTotal');
        if (orderTotal) {
            orderTotal.textContent = `€${this.total.toFixed(2)}`;
        }
        
        // Show checkout modal
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
    }
    
    processOrder() {
        // Generate random order number
        const orderNumber = Math.floor(100000 + Math.random() * 900000);
        
        // Hide checkout modal
        const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        if (checkoutModal) {
            checkoutModal.hide();
        }
        
        // Set order number in confirmation modal
        const orderNumberElement = document.getElementById('orderNumber');
        if (orderNumberElement) {
            orderNumberElement.textContent = orderNumber;
        }
        
        // Show confirmation modal
        const confirmationModal = new bootstrap.Modal(document.getElementById('orderConfirmationModal'));
        confirmationModal.show();
        
        // Clear cart after successful order
        this.clearCart();
        
        // Reset form
        document.getElementById('checkoutForm').reset();
    }
    
    showNotification(message) {
        const notification = document.getElementById('cartNotification');
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
    
    // Helper function to extract numeric price from price string (e.g. "€2,50 - €4,50" -> 2.50)
    extractPrice(priceString) {
        // Extract first price if range is provided
        const match = priceString.match(/€(\d+)[,.](\d+)/);
        if (match) {
            return parseFloat(`${match[1]}.${match[2]}`);
        }
        return 0;
    }
}

// Initialize cart when script is loaded
window.patatCart = new Cart();