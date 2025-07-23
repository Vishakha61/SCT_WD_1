// ...existing code...
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initNavigation();
    
    // Menu filtering
    initMenuFiltering();
    
    // Contact form
    initContactForm();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Scroll animations
    initScrollAnimations();
    
    // Cart functionality
    initCart();
    
    // Checkout functionality
    initCheckout();
    
    // Payment method dynamic fields
    window.showPaymentFields = function(type) {
        const paymentFields = document.getElementById('paymentFields');
        if (!paymentFields) return;
        if (type === 'card') {
            paymentFields.innerHTML = `
                <div class="form-group">
                    <input type="text" name="cardNumber" placeholder="Card Number" required maxlength="19" pattern="[0-9 ]{16,19}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" name="cardExpiry" placeholder="MM/YY" required maxlength="5" pattern="(0[1-9]|1[0-2])\/([0-9]{2})">
                    </div>
                    <div class="form-group">
                        <input type="text" name="cardCVV" placeholder="CVV" required maxlength="4" pattern="[0-9]{3,4}">
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" name="cardName" placeholder="Name on Card" required>
                </div>
            `;
        } else if (type === 'upi') {
            paymentFields.innerHTML = `
                <div class="form-group">
                    <label>Select UPI Option:</label>
                    <div class="upi-options" style="display:flex;gap:20px;justify-content:flex-start;align-items:stretch;">
                        <button type="button" class="upi-btn" style="flex:1;display:flex;align-items:center;justify-content:center;min-width:110px;min-height:60px;" onclick="showUPIDetails('qr')">
                            <span style="display:flex;flex-direction:column;align-items:center;font-weight:bold;font-size:1.1em;"><span>QR</span><span>Code</span></span>
                        </button>
                        <button type="button" class="upi-btn" style="flex:1;display:flex;align-items:center;justify-content:center;min-width:110px;min-height:60px;" onclick="showUPIDetails('gpay')">
                            <img src="https://i.pinimg.com/236x/8d/ec/e1/8dece15cc40aaf66ed47f6591b639d06.jpg" alt="GPay" style="width:100%;height:40px;object-fit:cover;display:block;border-radius:8px;">
                        </button>
                        <button type="button" class="upi-btn" style="flex:1;display:flex;align-items:center;justify-content:center;min-width:110px;min-height:60px;" onclick="showUPIDetails('paytm')">
                            <img src="https://assetscdn1.paytm.com/images/catalog/view/310944/1697527183231.png" alt="Paytm" style="width:100%;height:40px;object-fit:cover;display:block;border-radius:8px;">
                        </button>
                    </div>
                </div>
                <div id="upiDetails"></div>
            `;
        } else if (type === 'cash') {
            paymentFields.innerHTML = '<div class="form-group"><span>Pay with cash upon delivery.</span></div>';
        } else {
            paymentFields.innerHTML = '';
        }
    };

    window.showUPIDetails = function(type) {
        const upiDetails = document.getElementById('upiDetails');
        if (!upiDetails) return;
       
        if (type === 'gpay' || type === 'paytm') {
            upiDetails.innerHTML = `
                <div style="text-align:center; margin-bottom:10px;"><strong style="font-size:1.1em; color:#b48a5a;">Enter UPI ID for ${type === 'gpay' ? 'GPay' : 'Paytm'}</strong></div>
                <div class="form-group" style="margin-bottom:5px;">
                    <input type="text" id="upiId" name="upiId" placeholder="Enter UPI ID (e.g., name@${type})" required style="border:2px solid #b48a5a; border-radius:8px; padding:8px;">
                </div>
                <div style="text-align:center; color:#888; font-size:0.95em; margin-bottom:10px;">Enter your UPI ID to make payment</div>
            `;
        } else if (type === 'qr') {
            upiDetails.innerHTML = `
                <div style="text-align:center; margin-bottom:10px;"><strong style="font-size:1.1em; color:#b48a5a;">Scan QR Code to Pay</strong></div>
                <div class="form-group" style="text-align:center;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?data=upi://pay&size=150x150" alt="UPI QR Code" style="margin:10px 0; border:2px solid #b48a5a; border-radius:8px;">
                </div>
            `;
        }
    };
    // Show card fields by default
    window.showPaymentFields('card');
});

// Global cart state
let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];

// Cart Functions
function initCart() {
    updateCartDisplay();
    
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            addToCart(name, price, image);
            showCartNotification(`${name} added to cart!`);
        });
    });
    
    // Cart icon click
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    
    cartIcon.addEventListener('click', () => {

        cartSidebar.classList.add('active');

        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeCart.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', closeCartSidebar);
    
    function closeCartSidebar() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartDisplay();
}

function updateQuantity(name, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(name);
        return;
    }
    
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartDisplay();
    }
}

function saveCart() {
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.classList.toggle('hidden', totalItems === 0);
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.image.startsWith('http') 
                        ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">` 
                        : item.image
                    }
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="item-price">₹${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-item" onclick="removeFromCart('${item.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total.toFixed(2)}`;
}

function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        transform: translateX(100%);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 2000);
}

// Checkout Functions
function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const closeCheckout = document.getElementById('closeCheckout');
    const cancelCheckout = document.getElementById('cancelCheckout');
    const placeOrder = document.getElementById('placeOrder');
    
    checkoutBtn.addEventListener('click', openCheckoutModal);
    closeCheckout.addEventListener('click', closeCheckoutModal);
    cancelCheckout.addEventListener('click', closeCheckoutModal);
    checkoutOverlay.addEventListener('click', closeCheckoutModal);
    placeOrder.addEventListener('click', processOrder);
    
    function openCheckoutModal() {
        updateOrderSummary();
        checkoutModal.classList.add('active');
        checkoutOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCheckoutModal() {
        checkoutModal.classList.remove('active');
        checkoutOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function updateOrderSummary() {
        const orderSummary = document.getElementById('orderSummary');
        const checkoutSubtotal = document.getElementById('checkoutSubtotal');
        const deliveryFee = document.getElementById('deliveryFee');
        const taxAmount = document.getElementById('taxAmount');
        const finalTotal = document.getElementById('finalTotal');
        
        // Update order items
        orderSummary.innerHTML = cart.map(item => `
            <div class="summary-item">
                <div class="summary-item-info">
                    <span class="summary-item-emoji">
                        ${item.image.startsWith('http') 
                            ? `<img src="${item.image}" alt="${item.name}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px;">` 
                            : item.image
                        }
                    </span>
                    <span>${item.name} x${item.quantity}</span>
                </div>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
        
        // Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery = 3.99;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + delivery + tax;
        
        checkoutSubtotal.textContent = subtotal.toFixed(2);
        deliveryFee.textContent = delivery.toFixed(2);
        taxAmount.textContent = tax.toFixed(2);
        finalTotal.textContent = total.toFixed(2);
    }
    
    function processOrder() {
        const form = document.getElementById('checkoutForm');
        const formData = new FormData(form);
        
        // Basic validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Simulate order processing
        placeOrder.disabled = true;
        placeOrder.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        setTimeout(() => {
            // Clear cart
            cart = [];
            saveCart();
            updateCartDisplay();
            
            // Close modals
            closeCheckoutModal();
            document.getElementById('cartSidebar').classList.remove('active');
            document.getElementById('cartOverlay').classList.remove('active');
            
            // Show success message
            showOrderSuccessMessage();
            
            // Reset button
            placeOrder.disabled = false;
            placeOrder.innerHTML = '<i class="fas fa-check"></i> Place Order';
            
            // Reset form
            form.reset();
        }, 2000);
    }
}

function showOrderSuccessMessage() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Order Placed Successfully!</h3>
            <p>Thank you for your order. You will receive a confirmation email shortly.</p>
            <p><strong>Estimated delivery time: 30-45 minutes</strong></p>
            <button class="btn btn-primary" onclick="this.closest('.success-modal').remove(); document.body.style.overflow = 'auto';">
                Continue Shopping
            </button>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 12000;
    `;
    
    const successContent = modal.querySelector('.success-content');
    successContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        margin: 20px;
    `;
    
    successContent.querySelector('i').style.cssText = `
        font-size: 4rem;
        color: #28a745;
        margin-bottom: 20px;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Navigation Functions
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navigation with color changes on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Add scrolled class for styling
        if (scrollPosition > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active navigation link based on scroll position
        updateActiveNavLink(scrollPosition);
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbar.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink(scrollPosition) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Account for fixed navbar
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Update active class on navigation links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
    
    // If no section is active (at the very top), make home active
    if (scrollPosition < 100) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#home') {
                link.classList.add('active');
            }
        });
    }
}

// Menu Filtering Functions
function initMenuFiltering() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items with animation
            filterMenuItems(menuItems, category);
        });
    });
}

function filterMenuItems(menuItems, category) {
    menuItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            // Staggered animation
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        } else {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Contact Form Functions
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Basic form validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 350px;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Smooth Scrolling Functions
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animation for about section elements
                if (entry.target.classList.contains('about-text') || 
                    entry.target.classList.contains('about-image')) {
                    entry.target.classList.add('animate');
                }
                
                // Animate features with staggered delay
                if (entry.target.classList.contains('about-features')) {
                    const features = entry.target.querySelectorAll('.feature');
                    features.forEach((feature, index) => {
                        setTimeout(() => {
                            feature.classList.add('animate');
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.menu-item, .service-item, .feature, .contact-item, .about-text, .about-image, .about-features');
    animateElements.forEach(el => {
        // Don't set initial styles for about elements as they have custom animations
        if (!el.classList.contains('about-text') && 
            !el.classList.contains('about-image') && 
            !el.classList.contains('about-features')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
        }
        observer.observe(el);
    });
    
    // Add smooth scroll behavior for section transitions
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.transition = 'all 0.8s ease';
        sectionObserver.observe(section);
    });
}

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Additional Interactive Features

// Hero section parallax effect
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation to page
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Menu item hover effects
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Service items animation on hover
document.addEventListener('DOMContentLoaded', function() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        const icon = item.querySelector('i');
        
        item.addEventListener('mouseenter', function() {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Add scroll-to-top button
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.3)';
    });
}

// Initialize scroll-to-top button
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// Add scroll progress indicator
function createScrollProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-indicator';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Enhanced scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for menu items
                if (entry.target.classList.contains('menu-item')) {
                    const menuItems = document.querySelectorAll('.menu-item');
                    menuItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animationDelay = `${index * 0.1}s`;
                            item.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.menu-item, .service-item, .feature, .contact-item, .about-text, .about-image');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Enhanced menu item interactions
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Add click animation to add-to-cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    });
});

// Typing effect for hero text
function createTypingEffect() {
    const heroTitle = document.querySelector('.hero-content h1');
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let index = 0;
    function typeText() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 100);
        }
    }
    
    // Start typing effect after a delay
    setTimeout(typeText, 500);
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero) {
        // Background parallax
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        
        // Content parallax (slower movement)
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    }
});

// Enhanced cart notification system
function showEnhancedNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `enhanced-notification ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 10002;
        max-width: 350px;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    document.body.appendChild(notification);
    
    // Show animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 400);
    }, duration);
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll progress indicator
    createScrollProgressIndicator();
    
    // Create typing effect (uncomment if desired)
    // createTypingEffect();
    
    // Add floating elements animation
    createFloatingElements();
    
    // Initialize theme switcher (if needed)
    // initThemeSwitcher();
});

// Floating background elements
function createFloatingElements() {
    const hero = document.querySelector('.hero');
    
    // Create floating food emojis
    const floatingEmojis = ['🍕', '🍔', '🍝', '🥗', '🍰', '🍷', '☕'];
    
    floatingEmojis.forEach((emoji, index) => {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = emoji;
        element.style.cssText = `
            position: absolute;
            font-size: 2rem;
            opacity: 0.1;
            animation: float ${3 + index}s ease-in-out infinite;
            animation-delay: ${index * 0.5}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            z-index: 1;
        `;
        hero.appendChild(element);
    });
}

// Global functions for cart operations (needed for HTML onclick handlers)
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
