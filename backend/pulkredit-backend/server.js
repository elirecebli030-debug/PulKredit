const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const CONFIG = {
    cardNumber: "5522 0993 6992 6134",
    cardHolder: "PULKREDİT MMC",
    bankName: "Kapital Bank",
    company: {
        name: "PULKREDİT MMC",
        phone: "+994 50 123 45 67",
        email: "info@pulkredit.az"
    },
    fee: {
        amount: 30,
        currency: "AZN"
    },
    credit: {
        maxAmount: 4000,
        interestRate: 10,
        months: 36,
        monthlyPayment: 144
    }
};

app.get('/api/config', (req, res) => {
    res.json({ success: true, data: CONFIG });
});

app.get('/api/payment-info', (req, res) => {
    res.json({ success: true, data: CONFIG });
});

app.get('/api/credit-info', (req, res) => {
    res.json({ success: true, data: CONFIG });
});

app.get('/api/status', (req, res) => {
    res.json({ success: true, status: 'active' });
});

app.get('/api/*', (req, res) => {
    res.json({ success: true, data: CONFIG });
});

app.get('/', (req, res) => {
    res.json({ name: 'PULKREDİT API', status: 'running' });
});

app.listen(PORT, () => {
    console.log('');
    console.log('╔═══════════════════════════════════════╗');
    console.log('║  🚀 PULKREDİT BACKEND İŞLƏYİR        ║');
    console.log('╠═══════════════════════════════════════╣');
    console.log('║  🌐 http://localhost:3000             ║');
    console.log('║  💳 Kart: 5522 0993 6992 6134         ║');
    console.log('╚═══════════════════════════════════════╝');
    console.log('');
});
