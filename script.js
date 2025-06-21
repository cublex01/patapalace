// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document ready!');
    
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }
    
    // Initialize modules
    function initializeModules() {
        // Load our JavaScript modules
        loadScript('js/cart/cart.js')
            .then(() => loadScript('js/email/emailHandler.js'))
            .then(() => {
                console.log('All modules loaded successfully');
                // Dark mode has been removed as requested
            })
            .catch(error => {
                console.error('Error loading modules:', error);
            });
    }
    
    // Helper function to load scripts dynamically
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Script load error for ${src}`));
            document.head.appendChild(script);
        });
    }
    
    // Initialize all modules
    initializeModules();
    
    // Bank payment functionality
    // Handle payment method change
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const bankDetailsSection = document.getElementById('bankDetailsSection');
    
    if (paymentRadios && bankDetailsSection) {
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Show/hide bank details section based on selected payment method
                if (this.value === 'bank') {
                    bankDetailsSection.style.display = 'block';
                } else {
                    bankDetailsSection.style.display = 'none';
                }
            });
        });
    }
    
    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Generate random order number
            const orderNumber = Math.floor(10000 + Math.random() * 90000);
            document.getElementById('orderNumber').textContent = orderNumber;
            
            // Get selected payment method
            const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            
            // Get total amount from orderTotal
            const totalAmount = document.getElementById('orderTotal').textContent;
            
            // Show bank details in confirmation if bank transfer selected
            if (selectedPaymentMethod === 'bank') {
                const confirmationBankDetails = document.getElementById('confirmationBankDetails');
                if (confirmationBankDetails) {
                    confirmationBankDetails.style.display = 'block';
                    document.getElementById('bankTransferAmount').textContent = totalAmount;
                    document.getElementById('bankTransferReference').textContent = orderNumber;
                }
            }
            
            // Hide checkout modal and show confirmation modal
            const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
            const confirmationModal = new bootstrap.Modal(document.getElementById('orderConfirmationModal'));
            
            checkoutModal.hide();
            confirmationModal.show();
        });
    }
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
    
    // Product details functionality
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const productCards = document.querySelectorAll('.product-card');
    
    // Product database - simulating product details
    const productDetails = {
        1: {
            name: "Fries",
            image: "https://www.pngarts.com/files/3/Fries-PNG-Photo.png",
            description: "Our delicious, crispy fries are made from carefully selected potatoes. We prepare our fries according to a traditional recipe, resulting in a perfectly crispy exterior and a soft, fluffy interior.",
            ingredients: "Potatoes, vegetable oil, salt",
            price: "€2.50 - €4.50 (depending on size)",
            prepTime: "3-4 minutes"
        },
        2: {
            name: "Dutch Sausage",
            image: "https://www.pngarts.com/files/3/French-Fries-PNG-Image.png",
            description: "Our famous Dutch sausages are made according to a secret recipe. They are perfectly seasoned and always freshly prepared. Ideal to combine with our delicious fries and mayonnaise.",
            ingredients: "Chicken meat, herbs, spices",
            price: "€1.75 each",
            prepTime: "3-5 minutes"
        },
        3: {
            name: "Cheese Soufflé",
            image: "https://www.pngarts.com/files/3/Fries-PNG-Download-Image.png",
            description: "A delicious cheese soufflé with melted cheese inside. Perfect for true cheese lovers. The crispy layer on the outside and the creamy cheese on the inside make this a popular snack.",
            ingredients: "Flour, cheese (48%), vegetable fat, water, salt, herbs",
            price: "€1.90 each",
            prepTime: "4 minutes"
        },
        4: {
            name: "Croquette",
            image: "https://www.pngarts.com/files/3/French-Fries-PNG-Free-Download.png",
            description: "Our croquettes have a crispy exterior and a creamy, flavorful ragout inside. A Dutch classic that is perfectly prepared at our place for the ultimate snack experience.",
            ingredients: "Beef, flour, butter, milk, breadcrumbs, herbs",
            price: "€2.10 each",
            prepTime: "4-5 minutes"
        },
        5: {
            name: "Dutch Meatballs",
            image: "https://www.pngarts.com/files/3/French-Fries-PNG-Image-Background.png",
            description: "Our Dutch meatballs are perfectly round and have a crispy crust with a soft, creamy filling. This classic Dutch snack is perfect with a drink or as part of a larger order.",
            ingredients: "Beef, flour, butter, broth, breadcrumbs, herbs",
            price: "€4.50 (8 pieces)",
            prepTime: "4-5 minutes"
        },
        6: {
            name: "Chicken Nuggets",
            image: "https://www.pngarts.com/files/3/French-Fries-PNG-High-Quality-Image.png",
            description: "Our chicken nuggets are made from pure chicken breast, seasoned and fried to perfection. They are crispy on the outside and juicy on the inside, perfect for chicken lovers.",
            ingredients: "Chicken breast (85%), breadcrumbs, vegetable oil, herbs",
            price: "€4.75 (6 pieces)",
            prepTime: "4-5 minutes"
        }
    };
    
    // Make productDetails available globally
    window.productDetails = productDetails;
    
    // Add click event to each product card
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const product = productDetails[productId];
            
            // Update modal with product details
            document.getElementById('modalProductImage').src = product.image;
            document.getElementById('modalProductTitle').textContent = product.name;
            document.getElementById('modalProductDescription').textContent = product.description;
            document.getElementById('modalProductIngredients').textContent = product.ingredients;
            document.getElementById('modalProductPrice').textContent = product.price;
            document.getElementById('modalProductPrepTime').textContent = product.prepTime;
            
            // Set product ID for the Add to Cart button in the modal
            const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
            modalAddToCartBtn.dataset.productId = productId;
            
            // Show the modal
            productModal.show();
        });
    });
    
    // Initialize all modules
    initializeModules();
});