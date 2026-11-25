// Extract and validate the Bearer token from the request header
const authHeaderCheck = (req) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return null;
  }

  const match = authHeader.match(/^Bearer\s+(\S+)$/i);

  return match ? match[1] : null;
};

module.exports = authHeaderCheck;