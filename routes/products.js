const db = require('../models/index'); // equivalent mysql
const TestProduct = db.sequelize.models.TestProduct; // Model TestProduct
var express = require('express');
var router = express.Router();

/* GET home page. */
// http://localhost:4000/products
router.get('/', async function (req, res, next) {
    let products = await TestProduct.findAll({ attributes: ['id', 'name', 'price'] });
    res.render('products/list', {
        title: 'Express 002 - Products Page',
        message: "Products",
        list: products
    });
});

// GET create
router.get('/create', (req, res) => {
    res.render('products/create-update', {
        title: 'Express 002 - New Product page',
        message: 'New Product',
        action: 'create',
        product: {}
    });
})

// POST create 
router.post('/create', async (req, res) => {
    await TestProduct.create({
        name: req.body.name,
        price: req.body.price
    });
    res.redirect('/products');
});

// GET update
router.get('/edit/:id', async (req, res) => {
    let product = await TestProduct.findByPk(req.params.id, { attributes: ['id', 'name', 'price'] });
    // console.log(product);
    res.render('products/create-update', {
        title: 'Express 002 - Edit Product page',
        message: 'Edit a Product',
        action: 'update',
        product: product
    });
});

// POST update 
router.post('/update', async (req, res) => {
    let product = await TestProduct.findByPk(req.body.id, { attributes: ['id', 'name', 'price'] });
    if (product.id == req.body.id) {
        product.name = req.body.name;
        product.price = req.body.price;
        await product.save();
    }
    res.redirect('/products');
});


// /product/delete

// http://localhost:4000/products/delete?id=1&name=book // req.query.id
// http://localhost:4000/products/delete/1/book // req.params.id

router.get('/delete', async function (req, res) {
    
    await TestProduct.destroy({ where: { id: req.query.id } }).then((deleted) => {
        if (deleted === 1) {
            res.render('products/deleted',
                {
                    title: 'Express 002 - Products delete page',
                    // list: getProducts()
                    message: `You deleted product with id: ${req.query.id}`
                });
        }
    },
        (error) => {
            res.render('products/deleted',
                {
                    title: 'Express 002 - Products delete page',
                    // list: getCustomers()
                    message: `<div><p>There was an error deleting product with id: ${req.query.id}</p>
                                   <p>Error: ${error}</p></div>`
                });
        });

});


module.exports = router;