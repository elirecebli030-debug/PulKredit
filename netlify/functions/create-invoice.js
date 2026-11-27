const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Yalnız POST sorğularına icazə veririk
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const amount = body.amount;

    if (!amount || amount <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid amount' }) };
    }

    // API açarları (Bunları Netlify Environment Variables-dan oxuyuruq!)
    const CLIENT_ID = process.env.COINPAYMENTS_CLIENT_ID;
    const CLIENT_SECRET = process.env.COINPAYMENTS_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return { statusCode: 500, body: JSON.stringify({ error: 'API keys missing' }) };
    }

    const timestamp = new Date().toISOString().split('.')[0] + 'Z';
    const method = 'POST';
    const path = '/api/v1/merchant/invoices';
    const host = 'a-api.coinpayments.net';
    
    const payload = JSON.stringify({ 
      amount: amount, 
      currency: 'USD', 
      description: 'Payment for services' 
    });

    const signatureString = `${method}\n${host}\n${path}\n${timestamp}\n${payload}`;
    const signature = crypto.createHmac('sha256', CLIENT_SECRET).update(signatureString).digest('base64');

    // CoinPayments API-yə sorğu
    const response = await fetch(`https://${host}${path}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-CoinPayments-Client': CLIENT_ID,
        'X-CoinPayments-Timestamp': timestamp,
        'X-CoinPayments-Signature': signature
      },
      body: payload
    });

    const data = await response.json();

    // CoinPayments-dən gələn cavabı frontend-ə qaytarırıq
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Server xətası:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
