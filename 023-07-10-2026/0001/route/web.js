const express = require('express');
const webRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const authController = require("../controllers/authController");

const productController = require('../controllers/productController');

/* -------------- parse of form ------------------- */
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/uploades/");
    },
    filename: (req, file, cb) => {
        if(file){
            cb(null, Date.now() + path.extname(file.originalname))
        }
    }
});

const upload = multer({
    storage: storage
});

/* -------------- route roles ------------------------ */
webRouter.get('/', (req, res) => {
    homePage.publishedProducts(req, res);
});


webRouter.get('/signin', (req, res) => {
    authController.signin(req, res);
});

webRouter.post('/verifySignin', (req, res) => {
    authController.verifySignin(req, res);
});

webRouter.get('/logout', (req, res) => {
    authController.logout(req, res);
});

/* ------- auth --------- */

/* -------- authorized page ---------------------- */

webRouter.get('/signup', authController.isAdmin, (req, res) => {
    authController.signup(req, res);
});

webRouter.post('/storeUser', authController.isAdmin, (req, res) => {
    authController.storeUser(req, res);
});

webRouter.get('/dashboard/index', authController.isAdmin, (req, res) => {
    res.render("../views/dashboard/index.ejs");
});


/* -------------------products route roles----------------------- */
webRouter.get('/products', authController.isEditor, (req, res) => {
    productController.index(req, res);
});

webRouter.get('/products/createForm', authController.isEditor, (req, res) => {
    productController.createForm(req, res);
});

webRouter.post('/products/store', authController.isEditor, upload.single('photo'), (req, res) => {
    productController.store(req, res);
});

webRouter.get('/products/show/:id', authController.isEditor, (req, res) => {
    productController.show(req, res);
});

webRouter.get('/products/destroy/:id', authController.isEditor, (req, res) => {
    productController.destroy(req, res);
});

webRouter.get('/products/updateForm/:id', authController.isEditor, (req, res) => {
    productController.updateForm(req, res);
});
webRouter.post('/products/update', authController.isEditor, upload.single('photo'), (req, res) => {
    productController.update(req, res);
});


module.exports = webRouter;