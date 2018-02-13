const Product = require('../models/product');
const mongoose = require('mongoose');

// Get all products
exports.products_get_all = (req, res, next) => {
	Product.find()
		.select('name price _id productImage')
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				products: docs.map(doc => {
					return {
						_id: doc._id,
						name: doc.name,
						price: doc.price,
						productImage: doc.productImage,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/products/' + doc._id,
						},
					};
				}),
			};
			res.status(200).json(response);
		})
		.catch(err => {
			res.status(500).json({
				error: err,
			});
		});
};

// Create new product
exports.products_create_product = (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path,
	});

	product
		.save()
		.then(result => {
			res.status(201).json({
				message: 'Created product successfully',
				createdProduct: {
					name: result.name,
					price: result.price,
					_id: result._id,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/products/' + result._id,
					},
				},
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err,
			});
		});
};

// Get product by ID
exports.products_get_product = (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.select('name price _id productImage')
		.exec()
		.then(doc => {
			if (doc) {
				res.status(200).json({
					product: doc,
					request: {
						type: 'GET',
						description: 'Get all products',
						url: 'http:/localhost:3000/products',
					},
				});
			} else {
				res
					.status(404)
					.json({ message: 'No valid entry found for provided ID' });
			}
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
};

// Update Product
exports.products_update_product = (req, res, next) => {
	const id = req.params.productId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Product.update({ _id: id }, { $set: updateOps })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Product updated',
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/' + id,
				},
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err,
			});
		});
};

// Delete Product
exports.products_delete_product = (req, res, next) => {
	const id = req.params.productId;
	Product.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Product deleted',
				request: {
					type: 'POST',
					url: 'http://localost:3000/products',
					body: { name: 'String', price: 'Number' },
				},
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err,
			});
		});
};
