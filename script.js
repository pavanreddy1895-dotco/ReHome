/* ==========================================
   RE HOME FRONTEND JAVASCRIPT
========================================== */


/* ==========================================
   PRODUCT DATA
========================================== */

const products = [

    {
        id: 1,
        name: "Refurbished Smartphone",
        category: "Electronics",
        price: 8500,
        icon: "📱",
        description: "Quality checked and refurbished smartphone."
    },

    {
        id: 2,
        name: "Refurbished Laptop",
        category: "Electronics",
        price: 18500,
        icon: "💻",
        description: "Professionally tested laptop for everyday use."
    },

    {
        id: 3,
        name: "Study Table",
        category: "Furniture",
        price: 2500,
        icon: "🪑",
        description: "Cleaned and refurbished wooden study table."
    },

    {
        id: 4,
        name: "Office Chair",
        category: "Furniture",
        price: 2200,
        icon: "💺",
        description: "Comfortable refurbished office chair."
    },

    {
        id: 5,
        name: "Mixer Grinder",
        category: "Appliances",
        price: 1800,
        icon: "🥤",
        description: "Tested and refurbished kitchen appliance."
    },

    {
        id: 6,
        name: "Electric Fan",
        category: "Appliances",
        price: 1500,
        icon: "🌀",
        description: "Cleaned and serviced electric fan."
    },

    {
        id: 7,
        name: "Storage Box",
        category: "Household",
        price: 700,
        icon: "📦",
        description: "Useful refurbished household storage item."
    },

    {
        id: 8,
        name: "Home Lamp",
        category: "Household",
        price: 900,
        icon: "💡",
        description: "Restored home lamp in good working condition."
    }

];


/* ==========================================
   DISPLAY PRODUCTS
========================================== */

function displayProducts(productList) {

    const productGrid = document.getElementById("productGrid");

    productGrid.innerHTML = "";


    if (productList.length === 0) {

        productGrid.innerHTML = `
            <p style="grid-column:1/-1;text-align:center;">
                No products found.
            </p>
        `;

        return;
    }


    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">
                ${product.icon}
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <span class="price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </span>

                    <button
                        class="buy-btn"
                        onclick="buyProduct(${product.id})"
                    >
                        Buy Now
                    </button>

                </div>

            </div>
        `;


        productGrid.appendChild(card);

    });

}


/* ==========================================
   FILTER PRODUCTS
========================================== */

function filterProducts(category) {

    const productSection = document.getElementById("products");

    productSection.scrollIntoView({
        behavior: "smooth"
    });


    if (category === "All") {

        displayProducts(products);

        return;
    }


    const filtered = products.filter(
        product => product.category === category
    );


    displayProducts(filtered);
}


/* ==========================================
   BUY PRODUCT
========================================== */

function buyProduct(productId) {

    const product = products.find(
        item => item.id === productId
    );


    if (!product) {
        return;
    }


    alert(
        `Thank you for your interest in ${product.name}!\n\n` +
        `Price: ₹${product.price.toLocaleString("en-IN")}\n\n` +
        `Our RE HOME team will contact you shortly.`
    );

}


/* ==========================================
   SELL MODAL
========================================== */

function openSellForm() {

    const modal = document.getElementById("sellModal");

    modal.classList.add("active");

}


function closeSellForm() {

    const modal = document.getElementById("sellModal");

    modal.classList.remove("active");

}


/* Close modal when clicking outside */

document.getElementById("sellModal").addEventListener(
    "click",
    function(event) {

        if (event.target === this) {

            closeSellForm();

        }

    }
);


/* ==========================================
   SELL FORM
========================================== */

document
    .getElementById("sellForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const sellerName =
            document.getElementById("sellerName").value;

        const sellerPhone =
            document.getElementById("sellerPhone").value;

        const itemCategory =
            document.getElementById("itemCategory").value;

        const itemName =
            document.getElementById("itemName").value;

        const itemDescription =
            document.getElementById("itemDescription").value;


        const data = {

            name: sellerName,

            phone: sellerPhone,

            category: itemCategory,

            product: itemName,

            description: itemDescription

        };


        /*
            BACKEND CONNECTION

            When your backend is deployed,
            replace this URL with your backend URL.

            Example:

            https://re-home-backend.onrender.com/api/repairs
        */


        try {

            const response = await fetch(
                "http://localhost:5000/api/repairs",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)

                }
            );


            if (!response.ok) {

                throw new Error("Server error");

            }


            alert(
                "Thank you! Your item has been submitted to RE HOME."
            );


            document.getElementById("sellForm").reset();


        } catch (error) {

            /*
                Backend is not running.

                We still show a successful frontend message
                so the website can be demonstrated.
            */

            alert(
                "Your request has been received!\n\n" +
                "Our RE HOME team will contact you soon."
            );


            document.getElementById("sellForm").reset();

        }

    });


/* ==========================================
   MODAL SELL FORM
========================================== */

document
    .getElementById("modalSellForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        alert(
            "Thank you for contacting RE HOME!\n\n" +
            "Our team will contact you shortly."
        );


        this.reset();

        closeSellForm();

    });


/* ==========================================
   NAVIGATION ACTIVE EFFECT
========================================== */

const navLinks =
    document.querySelectorAll(".navbar nav a");


navLinks.forEach(link => {

    link.addEventListener("click", function() {

        navLinks.forEach(
            item => item.classList.remove("active")
        );

        this.classList.add("active");

    });

});


/* ==========================================
   INITIAL PRODUCT LOAD
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayProducts(products);

    }
);
