const jwt = require("jsonwebtoken");

const authAdminToken = async (req, res, next) => {
  try {
    let token;

    // 1. Try to get token from cookies
    if (req.cookies?.AdminToken) {
      token = req.cookies.AdminToken;
    }

    // 2. Fallback: Try to get token from Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3. If token still not found
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Admin token not provided" });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 5. Verify admin role
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    // 6. Attach admin ID to request
    req.adminId = decoded.id;

    // 7. Continue
    next();
  } catch (err) {
    console.error("Admin JWT Verification Error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired. Please log in again." });
    }

    return res.status(403).json({ error: "Invalid token. Authentication failed." });
  }
};

module.exports = authAdminToken;
