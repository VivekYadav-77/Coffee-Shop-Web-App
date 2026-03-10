// api/proxy.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { endpoint } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  try {
    const renderUrl = `${process.env.VITE_API_URL}${endpoint}`;

    const fetchOptions = {
      method: req.method,
      headers: {
        'x-api-key': process.env.VITE_PROXYSECRETE
      },
      body: (req.method !== 'GET' && req.method !== 'HEAD') ? req : undefined,
      duplex: 'half' 
    };

    // 1. Forward Content-Type (for JSON and Image Uploads)
    if (req.headers['content-type']) {
      fetchOptions.headers['Content-Type'] = req.headers['content-type'];
    }
    
    // 2. NEW: Forward Authentication Cookies
    if (req.headers.cookie) {
      fetchOptions.headers.cookie = req.headers.cookie;
    }

    // 3. NEW: Forward Bearer Tokens (if you use Authorization headers instead of cookies)
    if (req.headers.authorization) {
      fetchOptions.headers.authorization = req.headers.authorization;
    }

    const renderResponse = await fetch(renderUrl, fetchOptions);
    
    const contentType = renderResponse.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await renderResponse.json();
    } else {
      data = await renderResponse.text();
    }

    // NEW: Pass any newly created cookies from Render back to the Browser
    // (Crucial for when the user actually submits the login form!)
    const setCookieHeader = renderResponse.headers.get('set-cookie');
    if (setCookieHeader) {
        res.setHeader('Set-Cookie', setCookieHeader);
    }

    return res.status(renderResponse.status).json(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ error: 'Proxy server error', details: error.message });
  }
}