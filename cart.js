class Cart {
    constructor() {
        this.items = [];
        this.overlay = document.querySelector('.cart-overlay');
        this.sidebar = document.querySelector('.cart-sidebar');
        this.cartItems = document.querySelector('.cart-items');
        this.totalElement = document.querySelector('.total');
        this.cartCount = document.querySelector('.cart .count');
        this.closeButton = document.querySelector('.close');
        this.checkoutButton = document.querySelector('.checkout');
        
        // Initialize cart overlay
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
        if (this.sidebar) {
            this.sidebar.style.transform = 'translateX(100%)';
        }
        
        this.initializeCart();
        this.initializeAddToCartButtons();
        this.initializeEventListeners();
        this.loadCart();
    }

    initializeCart() {
        if (!this.overlay || !this.sidebar) {
            console.error('Cart elements not found');
            return;
        }
    }

    initializeAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const item = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseFloat(button.dataset.price),
                    image: this.getImagePath(button.dataset.image),
                    quantity: 1
                };
                this.addItem(item);
            });
        });
    }

    getImagePath(imagePath) {
        // Remove any leading ./ or / from the path
        return imagePath.replace(/^\.?\//, '');
    }

    initializeEventListeners() {
        // Cart icon click
        const cartIcon = document.querySelector('.cart');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.openCart());
        }

        // Close button
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.closeCart());
        }

        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.closeCart();
                }
            });
        }

        // Checkout button
        if (this.checkoutButton) {
            this.checkoutButton.addEventListener('click', () => this.checkout());
        }
    }

    openCart() {
        if (!this.overlay || !this.sidebar) return;
        this.overlay.style.display = 'block';
        this.sidebar.style.transform = 'translateX(0)';
    }

    closeCart() {
        if (!this.overlay || !this.sidebar) return;
        this.overlay.style.display = 'none';
        this.sidebar.style.transform = 'translateX(100%)';
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(item);
        }
        
        this.saveCart();
        this.updateCartUI();
        // Don't open cart automatically when adding items
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(itemId, change) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(itemId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    updateCartUI() {
        if (!this.cartItems || !this.totalElement || !this.cartCount) return;

        // Update cart items
        this.cartItems.innerHTML = '';
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.handleImageError(this)">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="quantity-controls">
                        <button class="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            `;
            this.cartItems.appendChild(itemElement);
        });

        // Update total
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.totalElement.textContent = `Total: ₹${total}`;

        // Update cart count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = totalItems;

        // Add event listeners to new elements
        this.cartItems.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', () => this.updateQuantity(button.dataset.id, -1));
        });

        this.cartItems.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', () => this.updateQuantity(button.dataset.id, 1));
        });

        this.cartItems.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => this.removeItem(button.dataset.id));
        });
    }

    handleImageError(img) {
        // Try different fallback paths
        const fallbackPaths = [
            'images/default-food.jpg',
            'images/menu/default-food.jpg',
            'images/gifts/default-food.jpg'
        ];
        
        let currentIndex = 0;
        const tryNextFallback = () => {
            if (currentIndex < fallbackPaths.length) {
                img.src = fallbackPaths[currentIndex];
                currentIndex++;
            }
        };
        
        img.onerror = tryNextFallback;
        tryNextFallback();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartUI();
        }
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // Here you would typically redirect to a checkout page
        alert('Proceeding to checkout...');
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cart = new Cart();
}); 