const Product = require("../models/ProductModel");

// CREATE
const createProduct = async (data) => {
  const existing = await Product.findOne({ name: data.name });
  if (existing) {
    throw new Error("Product already exists");
  }

  return await Product.create(data);
};

// UPDATE
const updateProduct = async (id, data) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  return await Product.findByIdAndUpdate(id, data, { new: true });
};

// DETAILS
const getDetailsProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");
  return product;
};

// DELETE
const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  return await Product.findByIdAndDelete(id);
};

// DELETE MANY
const deleteManyProduct = async (ids) => {
  return await Product.deleteMany({ _id: { $in: ids } });
};

// 🔥 GET ALL (FULL OPTION)
const getAllProduct = async ({ limit, page, sort, type, keyword }) => {
  const query = {};

  // filter type
  if (type) {
    query.type = type;
  }

  // search name
  if (keyword) {
    query.name = { $regex: keyword, $options: "i" };
  }

  // sort
  let sortOption = { createdAt: -1 }; // mặc định mới nhất

  if (sort) {
    const [field, order] = sort.split(",");
    sortOption = { [field]: order === "desc" ? -1 : 1 };
  }

  const total = await Product.countDocuments(query);

  // 🔥 FIX PAGE CHUẨN
  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .limit(limit)
    .skip(skip)
    .sort(sortOption);

  return {
    data: products,
    total,
    page,
    totalPage: Math.ceil(total / limit),
  };
};

// GET ALL TYPE
const getAllType = async () => {
  return await Product.distinct("type");
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  deleteManyProduct,
  getAllProduct,
  getAllType,
};
