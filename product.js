async function fetchProductDetails() {
    const productId = window.location.pathname.split('/').pop();
    const response = await fetch(`http://localhost:8080/getproducts/${productId}`);
    if (!response.ok) {
        document.getElementById('productDetails').innerText = 'Product not found';
        return;
    }
    const product = await response.json();
    document.getElementById('productDetails').innerHTML = `
        <h1>${product.name}</h1>
        <img src="${product.image}" alt="${product.name}">
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
    `;
}
fetchProductDetails();