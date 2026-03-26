const searchBtn = document.getElementById('btn');
const searchInput = document.getElementById('input');
const navSearch = document.querySelector('.nav-search');
const menuItems = document.querySelectorAll('.cake-cntent');
const menuSection = document.getElementById('menu');
const isMobile = window.matchMedia('(max-width: 768px)');
const cartBtns = document.querySelectorAll('.cart-btn');
const cartCountEl = document.querySelector('.cart-count');
const cartNavBtn = document.getElementById('cart-btn');
const orderForm = document.getElementById('order-form');

// Business contact details
const BUSINESS_PHONE = '+234 9067 949 416';
const BUSINESS_EMAIL = 'khadijatraji403@gmail.com';

// Format price with commas for readability (e.g., 1000.00 becomes 1,000.00)
function formatPrice(price) {
    return parseFloat(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Mobile menu state
let showAllItems = false;

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();
displayCartItems();
updateFormCartDisplay();

// Initialize mobile menu display
initializeMobileMenu();

// Prevent form submission and handle search
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch();
});

// Search on input (real-time filtering)
searchInput.addEventListener('input', (e) => {
    performSearch();
});

// Search on Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
    }
});

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let hasResults = false;

    menuItems.forEach(item => {
        const itemName = item.getAttribute('data-item').toLowerCase();
        
        if (searchTerm === '' || itemName.includes(searchTerm)) {
            item.classList.remove('hidden');
            item.classList.add('filtered');
            hasResults = true;
        } else {
            item.classList.add('hidden');
            item.classList.remove('filtered');
        }
    });

    // Reset showAllItems when searching
    showAllItems = false;
    updateMobileMenuDisplay();

    // Scroll to menu section
    if (searchTerm !== '') {
        setTimeout(() => {
            menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
}

// Initialize mobile menu display
function initializeMobileMenu() {
    updateMobileMenuDisplay();
    window.addEventListener('resize', updateMobileMenuDisplay);
}

// Toggle show more
function toggleShowMore() {
    showAllItems = !showAllItems;
    updateMobileMenuDisplay();
}

// Update mobile menu display based on screen size
function updateMobileMenuDisplay() {
    const isMobileView = window.innerWidth <= 768;
    const seeMoreBtn = document.getElementById('see-more-btn');
    const seeMoreContainer = document.getElementById('see-more-container');
    const allItems = document.querySelectorAll('.cake-cntent:not(.hidden)');
    
    if (isMobileView) {
        // On mobile, show limited items
        allItems.forEach((item, index) => {
            if (index >= 4) {
                item.classList.add('hidden-mobile');
            } else {
                item.classList.remove('hidden-mobile');
            }
        });
        
        if (showAllItems) {
            // Show all items
            allItems.forEach(item => {
                item.classList.remove('hidden-mobile');
            });
            if (seeMoreBtn) seeMoreBtn.textContent = 'Show Less';
        } else {
            // Show limited items
            allItems.forEach((item, index) => {
                if (index >= 4) {
                    item.classList.add('hidden-mobile');
                }
            });
            if (seeMoreBtn) seeMoreBtn.textContent = 'See More Items';
        }
        
        // Show button only if there are more than 4 items
        if (seeMoreContainer && allItems.length > 4) {
            seeMoreContainer.style.display = 'block';
        }
    } else {
        // On desktop, show all items
        allItems.forEach(item => {
            item.classList.remove('hidden-mobile');
        });
        
        if (seeMoreContainer) {
            seeMoreContainer.style.display = 'none';
        }
    }
}

// Toggle search on mobile
if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
        if (isMobile.matches && searchInput.value === '') {
            e.preventDefault();
            navSearch.classList.toggle('search-open');
            searchInput.focus();
        }
    });
}

// Add to cart functionality
cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const itemContainer = btn.closest('.cake-cntent');
        const itemName = itemContainer.getAttribute('data-item');
        const itemPrice = parseFloat(itemContainer.getAttribute('data-price'));
        const quantitySelect = itemContainer.querySelector('.quantity');
        const quantity = parseInt(quantitySelect.value);

        // Add to cart
        addToCart(itemName, itemPrice, quantity);

        // Show feedback
        showAddToCartFeedback(btn);
    });
});

function addToCart(name, price, quantity) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: quantity
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    updateFormCartDisplay();
}

function updateCartCount() {
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    cartCountEl.textContent = totalItems;
    
    // Pulse animation when count updates
    cartCountEl.classList.add('active');
    setTimeout(() => {
        cartCountEl.classList.remove('active');
    }, 500);
}

function showAddToCartFeedback(btn) {
    // Create and show notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: rgb(255, 132, 0);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 9999;
        animation: slideInRight 0.5s ease-in-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    notification.textContent = 'Added to cart! ✓';
    document.body.appendChild(notification);

    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-in-out';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

// Display cart items on cart page
function displayCartItems() {
    const cartDisplay = document.getElementById('cart-items-display');
    
    if (cart.length === 0) {
        cartDisplay.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Your cart is empty</p>';
        document.getElementById('checkout-btn').disabled = true;
        document.getElementById('checkout-btn').style.opacity = '0.5';
        return;
    }

    document.getElementById('checkout-btn').disabled = false;
    document.getElementById('checkout-btn').style.opacity = '1';

    let html = '';
    cart.forEach((item, index) => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₦${formatPrice(item.price)} × ${item.quantity} = ₦${formatPrice(itemTotal)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="decrementQty(${index})">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="incrementQty(${index})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    });
    cartDisplay.innerHTML = html;
    updateCartTotals();
}

// Update cart totals
function updateCartTotals() {
    let subtotal = 0;
    let totalItems = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        totalItems += item.quantity;
    });

    document.getElementById('subtotal-display').textContent = formatPrice(subtotal);
    document.getElementById('total-display').textContent = formatPrice(subtotal);
    document.getElementById('items-count-display').textContent = totalItems;

    updateFormCartDisplay();
}

// Increment quantity
window.incrementQty = function(index) {
    if (cart[index].quantity < 9) {
        cart[index].quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    }
};

// Decrement quantity
window.decrementQty = function(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    }
};

// Remove from cart
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
};

// Update cart display in form
function updateFormCartDisplay() {
    const cartItemsForm = document.getElementById('cart-items-form');
    const totalForm = document.getElementById('total-form');

    if (cart.length === 0) {
        cartItemsForm.innerHTML = '<p style="color: #999;">No items in cart</p>';
        totalForm.textContent = '0.00';
        return;
    }

    let html = '';
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px;">
                <strong>${item.name}</strong> - ₦${formatPrice(item.price)} × ${item.quantity} = <strong>₦${formatPrice(itemTotal)}</strong>
            </div>
        `;
    });
    cartItemsForm.innerHTML = html;
    totalForm.textContent = formatPrice(subtotal);
}

// Continue shopping button
document.getElementById('continue-shopping-btn').addEventListener('click', () => {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Checkout button functionality
document.getElementById('checkout-btn').addEventListener('click', () => {
    document.getElementById('order').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Form submission
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (cart.length === 0) {
        showNotification('Please add items to your cart before submitting an order.', 'error');
        return;
    }

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const memail = "khadijatraji403@gmail.com";
    const notes = document.getElementById('textarea').value.trim();

    if (!name || !phone || !email) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Generate order message
    const orderMessage = generateOrderMessage(name, phone, email, notes);

    // Send to WhatsApp
    sendToWhatsApp(orderMessage);

    // Send to Email (automatically open email client)
    sendToEmail(orderMessage, memail);

    // Clear form
    orderForm.reset();
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    displayCartItems();
    updateFormCartDisplay();

    showNotification('Order submitted successfully! ✓', 'success');
});

function generateOrderMessage(name, phone, email, notes) {
    let message = `📋 *NEW ORDER FOR KHADIJA CAKES*\n\n`;
    message += `👤 *My Details:*\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Email: ${email}\n\n`;
    message += `🛒 *Order Items:*\n`;
    
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `• ${item.name} - ₦${formatPrice(item.price)} × ${item.quantity} = ₦${formatPrice(itemTotal)}\n`;
    });

    message += `\n💰 *Total: ₦${formatPrice(subtotal)}*\n`;
    
    if (notes) {
        message += `\n📝 *Additional Notes:*\n${notes}\n`;
    }

    message += `\nPlease confirm this order. Thank you! 😊`;
    
    return message;
}

function sendToWhatsApp(message) {
    const whatsappApiUrl = `https://wa.me/${BUSINESS_PHONE.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappApiUrl, '_blank');
}

function sendToEmail(message, email) {
    const cleanMessage = message
        .replace(/\*/g, '')
        .replace(/\n/g, '%0A');

    const emailSubject = encodeURIComponent('New Order for Khadija Cakes');
    const emailBody = encodeURIComponent(`Hi Khadija,\n\n${message}\n\nBest regards`);
    const emailLink = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;
    
    // Automatically open email client by creating temporary link
    const a = document.createElement('a');
    a.href = emailLink;
    a.click();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'rgb(40, 167, 69)' : type === 'error' ? '#ff4444' : 'rgb(255, 132, 0)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 9999;
        animation: slideInRight 0.5s ease-in-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-in-out';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Policy Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    const modals = document.querySelectorAll('.policy-modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});

// Close modal with Escape key
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.policy-modal.show');
        modals.forEach(modal => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
});

// Add animations to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);