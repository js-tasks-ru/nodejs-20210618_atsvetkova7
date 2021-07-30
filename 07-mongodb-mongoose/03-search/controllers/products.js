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


module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query.query;

  if (!query) {
    ctx.throw(400, 'Query is missing.');
  }
  const products = await Product.find(
      {
        $text: {
          $search: query,
        },
      },
      {
        score: {$meta: 'textScore'},
      },
  ).sort({score: {$meta: 'textScore'}});

  ctx.body = {products: products.map(toProductDTO)};
};
