const verifyClientRequest = (req, res, next) => {
  const clientKey = req.headers['x-api-key'];
  
  if (!clientKey || clientKey !== process.env.PROXYSECRETE) {
    console.log("Blocked unauthorized direct access attempt.");
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }

  next();
};
export default verifyClientRequest