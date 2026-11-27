const crypto = require('crypto');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Əgər event.body boşdursa, xəta verməməsi üçün yoxlayırıq
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Body is empty' }) };
    }

    const body = JSON.parse(event.body);
    const amount = body.amount;

    if (!amount || amount <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid amount' }) };
    }

    // ... (qalan kod eyni qalır: CLIENT_ID, CLIENT_SECRET, timestamp, payload, signature və s.)
    const CLIENT_ID = process.env.COINPAYMENTS_CLIENT_ID;
    const CLIENT_SECRET = process.env.COINPAYMENTS_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return { statusCode: 500, body: JSON.stringify({ error: 'API keys missing' }) };
    }

    const timestamp = new Date().toISOString().split('.')[0] + 'Z';
    const method = 'POST';
    const host = 'a-api.coinpayments.net';
    const path = '/api/v2/merchant/invoices'; 
    
    const payload = JSON.stringify({ 
      amount: amount, 
      currency: 'USD', 
      description: 'Payment for services' 
    });

    const signatureString = `\ufeff${method}https://${host}${path}${CLIENT_ID}${timestamp}${payload}`;
    const signature = crypto.createHmac('sha256', CLIENT_SECRET).update(signatureString, 'utf8').digest('base64');

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
