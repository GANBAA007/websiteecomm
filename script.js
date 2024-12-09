// window.addEventListener('load', () => {
//     createSlideOver()
// })

const slide_over = document.getElementById('slide_over')
function openSlideover() {
    slide_over.classList.add('open_slide_over')
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
checkLoginButton.addEventListener('click', async function(event) {
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
            localStorage.setItem('authToken', result.token); // Store the token in localStorage
            window.location.href = '/dashboard'; // Redirect after login
        } else {
            alert('Login failed: ' + result.error);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
        checkLoginButton.disabled = false;
        checkLoginButton.innerText = 'Login';
    }
});





// function createEl(el, className, id) {
//     const elem = document.createElement(el)
//     if (id) {
//         elem.setAttribute('id', id)
//     }
//     if (className) {
//         elem.classList.add(className)
//     }

//     return elem
// }

// function createSlideOver() {
//     const slide_over_overlay = createEl('div', 'overlay', null)
//     const slide_over_content = createEl('div', 'content', null)
//     const slide_over_content_header = createEl('div', 'header', null)
//     const slide_over_content_body = createEl('div', 'body', null)
//     const slide_over_content_header_title = createEl('p', null, null)

//     slide_over_content_header.appendChild(slide_over_content_header_title).innerHTML = 'Cart'

//     slide_over_content.appendChild(slide_over_content_header)
//     slide_over_content.appendChild(slide_over_content_body)

//     slide_over.appendChild(slide_over_overlay)
//     slide_over.appendChild(slide_over_content)
// }