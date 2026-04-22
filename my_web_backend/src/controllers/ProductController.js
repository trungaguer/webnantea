const ProductService = require("../services/ProductService");

// CREATE
const createProduct = async (req, res) => {
  try {
    const { name, image, type, countInStock, price } = req.body;

    if (
      !name ||
      !image ||
      !type ||
      countInStock === undefined ||
      price === undefined
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing required fields",
      });
    }

    const data = await ProductService.createProduct(req.body);

    return res.status(201).json({
      status: "OK",
      data,
    });
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// GET ALL
const getAllProduct = async (req, res) => {
  try {
    let { limit = 8, page = 1, sort, type, keyword } = req.query;

    limit = Number(limit);
    page = Number(page);

    const data = await ProductService.getAllProduct({
      limit,
      page,
      sort,
      type,
      keyword,
    });

    return res.status(200).json({
      status: "OK",
      ...data,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// DETAILS
const getDetailsProduct = async (req, res) => {
  try {
    const data = await ProductService.getDetailsProduct(req.params.id);

    return res.status(200).json({
      status: "OK",
      data,
    });
  } catch (e) {
    return res.status(404).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// UPDATE
const updateProduct = async (req, res) => {
  try {
    const data = await ProductService.updateProduct(req.params.id, req.body);

    return res.status(200).json({
      status: "OK",
      data,
    });
  } catch (e) {
    return res.status(404).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// DELETE
const deleteProduct = async (req, res) => {
  try {
    await ProductService.deleteProduct(req.params.id);

    return res.status(200).json({
      status: "OK",
      message: "Delete success",
    });
  } catch (e) {
    return res.status(404).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// DELETE MANY
const deleteMany = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        status: "ERR",
        message: "ids must be an array",
      });
    }

    await ProductService.deleteManyProduct(ids);

    return res.status(200).json({
      status: "OK",
      message: "Delete many success",
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// GET TYPE
const getAllType = async (req, res) => {
  try {
    const data = await ProductService.getAllType();

    return res.status(200).json({
      status: "OK",
      data,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getDetailsProduct,
  updateProduct,
  deleteProduct,
  deleteMany,
  getAllType,
};
