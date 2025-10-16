export const authMiddleware = (req, res, next) => {
  if (!req.user) {
    console.log("not authenticated");
    return res.status(401).json({ error: "Not authenticated" });
  }
  console.log("authencticated");
  next();
};

export const adminMiddleware = (req, res, next) => {
  console.log("user", req.user);
  if (req.user) {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ notadmin: "Forbidden. You are not an admin." });
    }
  } else {
    return res
      .status(401)
      .json({ notauth: "Not authenticated. Please log in." });
  }
  next();
};
export const agentMiddleware = (req, res, next) => {
  if (req.user) {
    if (req.user.role !== "AGENT") {
      return res
        .status(403)
        .json({ notagent: "Forbidden. You are not an admin." });
    }
  } else {
    return res
      .status(401)
      .json({ notauth: "Not authenticated. Please log in." });
  }
  next();
};
export const customerMiddleware = (req, res, next) => {
  if (req.user) {
    if (req.user.role !== "CUSTOMER") {
      return res
        .status(403)
        .json({ notagent: "Forbidden. You are not an admin." });
    }
  } else {
    return res
      .status(401)
      .json({ notauth: "Not authenticated. Please log in." });
  }
  next();
};
export const AdminorAgentMiddleware = (req, res, next) => {
  if (req.user) {
    if (req.user.role !== "AGENT" || req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ notagent: "Forbidden. You are not an admin." });
    }
  } else {
    return res
      .status(401)
      .json({ notauth: "Not authenticated. Please log in." });
  }
  next();
};
