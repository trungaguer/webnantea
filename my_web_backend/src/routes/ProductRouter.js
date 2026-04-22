const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const { authAdminMiddleware } = require("../middleware/authMiddleware");

// ================= PUBLIC =================

// 🔥 FIX: thêm route get-all (đặt trên)
router.get("/get-all", ProductController.getAllProduct);

// giữ nguyên route cũ
router.get("/", ProductController.getAllProduct);

// 🔥 FIX: thêm route get-details (đúng với FE)
router.get("/get-details/:id", ProductController.getDetailsProduct);

// ================= ADMIN =================

// giữ nguyên API cũ
router.post("/create", authAdminMiddleware, ProductController.createProduct);
router.put("/update/:id", authAdminMiddleware, ProductController.updateProduct);
router.delete(
  "/delete/:id",
  authAdminMiddleware,
  ProductController.deleteProduct,
);

module.exports = router;
