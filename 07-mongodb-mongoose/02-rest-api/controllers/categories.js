const Category = require('../models/Category');

const toSubcategoryDTO = (model) => {
  return {
    id: model._id,
    title: model.title,
  };
};

const toCategoryDTO = (model) => {
  return {
    id: model._id,
    title: model.title,
    subcategories: model.subcategories.map(toSubcategoryDTO),
  };
};

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({});
  const categoryDTO = categories.map(toCategoryDTO);
  ctx.body = {categories: categoryDTO};
  await next();
};
