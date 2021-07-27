const mongoose = require('mongoose');
const Product = require('../models/Product');

const toProductDTO = (model) => {
  return {
    id: model._id,
    title: model.title,
    images: model.images,
    category: model.category,
    subcategory: model.subcategory,
    price: model.price,
    description: model.description,
  };
};

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategoryId = ctx.query.subcategory;
  if (subcategoryId) {
    const productBySubcategory = await Product.find({subcategory: subcategoryId});
    ctx.body = {
      products: productBySubcategory.map(toProductDTO),
    };
  } else {
    await next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {
    products: products.map(toProductDTO),
  };
};

module.exports.productById = async function productById(ctx, next) {
  const productID = ctx.params.id;
  if (mongoose.isValidObjectId(productID)) {
    const productById = await Product.findById(productID);
    if (productById) {
      ctx.body = {
        product: toProductDTO(productById),
      };
    } else {
      ctx.throw(404, 'Product was not found.');
    }
  } else {
    ctx.throw(400, 'Invalid id.');
  }
};

