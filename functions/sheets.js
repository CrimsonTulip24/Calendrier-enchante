const GAS_URL = 'https://script.google.com/macros/s/AKfycbw2V382rhEHvptb1lRxV6bIxEqLl5aRMVMvTrCAMLkROYQTurOi_C3PVMpXyh7OUWEd/exec';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Pré-vol CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    let res;

    if (event.httpMethod === 'GET') {
      res = await fetch(GAS_URL, { redirect: 'follow' });
    } else if (event.httpMethod === 'POST') {
      // GAS redirige les POST (302) → on suit manuellement
      res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: event.body,
        redirect: 'follow',
      });
    } else {
      return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
    }

    const text = await res.text();
    return { statusCode: 200, headers, body: text };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
