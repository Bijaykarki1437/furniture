export const admin = (req, res, next) => {
  console.log("USER:", req.user); // 👈 DEBUG

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin only access" });
  }
};