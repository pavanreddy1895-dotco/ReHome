const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataFolder = path.join(__dirname, "data");

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

const files = {
    products: path.join(dataFolder, "products.json"),
    repairs: path.join(dataFolder, "repairs.json"),
    messages: path.join(dataFolder, "messages.json")
};

function initializeFile(file) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, "[]");
    }
}

Object.values(files).forEach(initializeFile);

function readData(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
        return [];
    }
}

function writeData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function generateId() {
    return Date.now().toString();
}

/* ---------------- HOME ---------------- */

app.get("/", (req, res) => {
    res.json({
        project: "RE HOME",
        message: "Welcome to the RE HOME API",
        model: "Buy → Repair → Refurbish → Sell",
        status: "Backend is running"
    });
});

/* ---------------- PRODUCTS ---------------- */

// Get all products
app.get("/api/products", (req, res) => {
    const products = readData(files.products);
    res.json(products);
});

// Get product by ID
app.get("/api/products/:id", (req, res) => {
    const products = readData(files.products);

    const product = products.find(
        item => item.id === req.params.id
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});

// Add a product
app.post("/api/products", (req, res) => {
    const {
        name,
        category,
        description,
        condition,
        buyPrice,
        repairCost,
        sellingPrice,
        sellerName,
        sellerContact
    } = req.body;

    if (!name || !category || !sellingPrice) {
        return res.status(400).json({
            message: "Name, category and selling price are required"
        });
    }

    const products = readData(files.products);

    const newProduct = {
        id: generateId(),
        name,
        category,
        description: description || "",
        condition: condition || "Refurbished",
        buyPrice: Number(buyPrice) || 0,
        repairCost: Number(repairCost) || 0,
        sellingPrice: Number(sellingPrice),
        sellerName: sellerName || "",
        sellerContact: sellerContact || "",
        status: "Available",
        createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    writeData(files.products, products);

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

// Update product
app.put("/api/products/:id", (req, res) => {
    const products = readData(files.products);

    const index = products.findIndex(
        item => item.id === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    products[index] = {
        ...products[index],
        ...req.body,
        id: products[index].id,
        updatedAt: new Date().toISOString()
    };

    writeData(files.products, products);

    res.json({
        message: "Product updated successfully",
        product: products[index]
    });
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
    const products = readData(files.products);

    const filteredProducts = products.filter(
        item => item.id !== req.params.id
    );

    if (filteredProducts.length === products.length) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    writeData(files.products, filteredProducts);

    res.json({
        message: "Product deleted successfully"
    });
});

/* ---------------- REPAIR REQUESTS ---------------- */

app.get("/api/repairs", (req, res) => {
    const repairs = readData(files.repairs);
    res.json(repairs);
});

app.post("/api/repairs", (req, res) => {
    const {
        customerName,
        phone,
        email,
        productName,
        category,
        problem,
        address
    } = req.body;

    if (!customerName || !phone || !productName || !problem) {
        return res.status(400).json({
            message: "Please provide customer name, phone, product and problem"
        });
    }

    const repairs = readData(files.repairs);

    const repairRequest = {
        id: generateId(),
        customerName,
        phone,
        email: email || "",
        productName,
        category: category || "",
        problem,
        address: address || "",
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    repairs.push(repairRequest);
    writeData(files.repairs, repairs);

    res.status(201).json({
        message: "Repair request submitted successfully",
        repairRequest
    });
});

/* ---------------- CONTACT MESSAGES ---------------- */

app.get("/api/messages", (req, res) => {
    const messages = readData(files.messages);
    res.json(messages);
});

app.post("/api/messages", (req, res) => {
    const {
        name,
        email,
        phone,
        subject,
        message
    } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            message: "Name, email and message are required"
        });
    }

    const messages = readData(files.messages);

    const newMessage = {
        id: generateId(),
        name,
        email,
        phone: phone || "",
        subject: subject || "General Enquiry",
        message,
        createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    writeData(files.messages, messages);

    res.status(201).json({
        message: "Your message has been received",
        data: newMessage
    });
});

/* ---------------- BUSINESS INFORMATION ---------------- */

app.get("/api/business", (req, res) => {
    res.json({
        name: "RE HOME",
        tagline: "Give Old Items a New Life",
        model: [
            "Buy",
            "Repair",
            "Refurbish",
            "Sell"
        ],
        categories: [
            "Electronics",
            "Furniture",
            "Household Items",
            "Home Appliances"
        ],
        objective:
            "To provide affordable refurbished products while promoting reuse and reducing waste."
    });
});

/* ---------------- 404 ---------------- */

app.use((req, res) => {
    res.status(404).json({
        message: "API endpoint not found"
    });
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
    console.log(`RE HOME backend running on port ${PORT}`);
});
