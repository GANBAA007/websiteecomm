// window.addEventListener('load', () => {
//     createSlideOver()
// })

const slide_over = document.getElementById('slide_over')
function openSlideover() {
    slide_over.classList.add('open_slide_over')
    fetchCart();
}

function closeSlideover() {
    slide_over.classList.add('closing_slide_over')

    setTimeout(() => {
        slide_over.classList.remove('open_slide_over')
        slide_over.classList.remove('closing_slide_over')
    }, 500)
}

const loginform = document.getElementById('login_form');

function openLoginform() {
    console.log('Opening login form');
    loginform.classList.add('open_login_form');
}

function closeLoginform() {
    loginform.classList.add('closing_login_form');
    console.log('Closing login form');

    setTimeout(() => {
        loginform.classList.remove('open_login_form');
        loginform.classList.remove('closing_login_form');
    }, 500); // Match this with the CSS transition time
}
// Get the form and the button elements
const loginForm = document.getElementById('loginform');
const checkLoginButton = document.getElementById('check_login');

// Add event listener for the login button
checkLoginButton.addEventListener('click', async function (event) {
    // Prevent the default action (form reload)
    event.preventDefault();

    // Get the input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate input
    if (!email || !password) {
        alert('Please fill in both fields');
        return;
    }

    // Add a loading state
    checkLoginButton.disabled = true; // Disable the button during the request
    checkLoginButton.innerText = 'Logging in...';

    try {
        // Send the login data to the server
        const response = await fetch('http://localhost:8080/ecomm/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // Get the response from the server
        const result = await response.json();

        // Reset the loading state
        checkLoginButton.disabled = false;
        checkLoginButton.innerText = 'Login';

        if (response.ok) {
            alert('Login success: ' + result.token);
            console.log(typeof result.token)
            // If result.token is an array or object, stringify it
            const tokenString = typeof result.token === 'string' ? result.token : JSON.stringify(result.token);
            localStorage.setItem('authToken', tokenString);
            // Store the token in localStorage
            window.location.href = '/products.html'; // Redirect after login
        } else {
            alert('Login failed: ' + result.error);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
        checkLoginButton.disabled = false;
        checkLoginButton.innerText = 'Login';
    }
});

const cors = require('cors');
const corsOptions = {
    origin: 'http://127.0.0.1:5500',  // Allow frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow Authorization header
};
app.use(cors(corsOptions));

async function fetchCart() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No token found');
            alert('You need to be logged in to view your cart.');
            return;
        }

        const response = await fetch('http://localhost:8080/ecomm/cart', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }

        const cartItems = await response.json();

        // Fetch product details for each cart item
        const cartWithProductDetails = await Promise.all(cartItems.map(async (item) => {
            const productResponse = await fetch(`http://localhost:8080/ecomm/getproducts/${item.product_id}`);
            const product = await productResponse.json();
            return {
                ...item,
                product: product, // Add product details to the cart item
            };
        }));

        // Call the updateCartUI function with the cart data including product details
        updateCartUI(cartWithProductDetails);
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}


document.getElementById('checkout-button')?.addEventListener('click', async () => {
    try {
        // Trigger the PlaceOrder function
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('You need to be logged in to place an order.');
            return;
        }

        const response = await fetch('http://localhost:8080/ecomm/PlaceOrder', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            alert('Order placed successfully! Order ID: ' + result.order.id);
            // window.location.href = '/order-confirmation.html'; // Redirect to order confirmation page
        } else {
            const result = await response.json();
            alert('Failed to place order: ' + result.error);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('An error occurred while placing your order. Please try again.');
    }
});

function updateCartUI(cartItems) {
    const cartContainer = document.getElementById('cartItemsContainer');
    cartContainer.innerHTML = ''; // Clear existing content

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    let totalPrice = 0;  // Variable to accumulate total price

    cartItems.forEach(item => {
        const product = item.product;
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');

        // Calculate the price for this item and add it to the total
        const itemTotalPrice = product.Price * item.quantity;
        totalPrice += itemTotalPrice;

        cartItemElement.innerHTML = `
            <div class='outercart'>
                <img src="${product.image}" alt="${product.Name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${product.Name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <p><strong>Price: $${product.Price}</strong></p>
                    <p><strong>Total for this item: $${itemTotalPrice.toFixed(2)}</strong></p>
                </div>
            </div>
        `;

        cartContainer.appendChild(cartItemElement);
    });

    // Display the total price
    const totalElement = document.createElement('div');
    totalElement.classList.add('cart-total');
    totalElement.innerHTML = `<div style ="display:flex; justify-content: space-between;">
                                <h3>Total: $${totalPrice.toFixed(2)}</h3>
                              <button style="margin-right: 1rem;" id="checkout-button"> C H E C K O U T</button>
                              </div>
    `;
    cartContainer.appendChild(totalElement);

    // Reattach event listener for checkout button (in case the cart is dynamically updated)
    document.getElementById('checkout-button')?.addEventListener('click', async () => {
        try {
            // Trigger the PlaceOrder function
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You need to be logged in to place an order.');
                return;
            }

            const response = await fetch('http://localhost:8080/ecomm/PlaceOrder', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                alert('Order placed successfully! Order ID: ' + result.order.id);
                // Optionally, redirect to a confirmation page or clear the cart UI
                // window.location.href = '/order-confirmation.html'; // Redirect to order confirmation page
            } else {
                const result = await response.json();
                alert('Failed to place order: ' + result.error);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing your order. Please try again.');
        }
    });
}

