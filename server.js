const express           = require('express');
const mustacheExpress   = require('mustache-express');
const bodyParser        = require('body-parser');
const MongoClient       = require('mongodb').MongoClient;
const ObjectID          = require('mongodb').ObjectID;

const db_name           = "ecommerce";

var mongoDb;

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    if (err) {
        console.log("Could not connect to the DB");
    } else {
        mongoDb = client.db(db_name);
    }
});

const app               = express();

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));

app.engine('html', mustacheExpress());

app.set('view engine', 'html');

app.set('views', __dirname + '/views');

app.set("layout", "layouts/layout");

app.get("/", (req, res) => {

    res.render('home.html');
});

app.get("/admin", (req, res) => {

    res.render('form.html');
});

app.get("/products", (req, res) => {

    mongoDb.collection('products').find().toArray(function(err, results) {
        res.render('products.html', { products: results });
    });
});

app.post("/products/create", (req, res) => {

    mongoDb.collection("products").save(req.body, (err, result) => {

        if (err) return console.log(err);
        res.redirect('/products');
      })
});

app.get("/products/:id", (req, res) => {

    const id = req.params.id;

    mongoDb.collection('products').findOne({ _id: new ObjectID(id)}, (err, data) => {

        res.render("item.html", { product: data });
    });
});


app.get("/products/:id/edit", (req, res) => {

    const id = req.params.id;

    mongoDb.collection('products').findOne({ _id: new ObjectID(id)}, (err, data) => {

        res.render("edit.html", { product: data })
    });

    
});

app.post("/products/:id/update", (req, res) => {

    const id = req.params.id;

    mongoDb.collection("products").update(
        { _id: new ObjectID(id)},
        req.body, (err, result) => {

            if (err) return console.log(err)
            res.redirect('/products')
      })
});

app.post("/products/:id/delete", (req, res) => {

    const id = req.params.id;

    mongoDb.collection("products").removeOne(
        { _id: new ObjectID(id)}, (err, result) => {

        if (err) return console.log(err)
        res.redirect('/products')
      })
});


// ??????????????????????????????????????????????????????????????????????????????????????
//cart

app.post("/products/:id/cart", (req, res) => {

    mongoDb.collection("cart").save(req.body, (err, result) => {
        
        if (err) return console.log(err);

        if (err) throw err; 
        if (result) console.log("Successfully Added to Cart!"); 
        res.redirect('/cart');
      });
});

app.get("/cart", (req, res) => {

    mongoDb.collection('cart').find().toArray(function(err, results) {
        res.render('form-cart.html', { cart: results });
    });
});

app.post("/products/:id/cart/delete", (req, res) => {

    const id = req.params.id;

    mongoDb.collection("cart").removeOne(
        { _id: new ObjectID(id)}, (err, result) => {

        if (err) return console.log(err)
        res.redirect('/cart');
      });
});


//MISC
app.get("/about", (req, res) => {

    res.render('about.html');
});

app.get("/contact", (req, res) => {

    res.render('contact.html');
});

//clear cart after checkout 
app.post("/checkout", (req, res) => { 
    const id = req.params.id; 
    
    mongoDb.dropCollection("cart", function(err, delOK) { 
    if (err) throw err; 
    if (delOK) console.log("cart deleted"); 
   res.redirect('/') 
    }); 
    }); 


app.get("/products", (req, res) => {

    res.render('products.html');
});

app.listen(3000, () => {
    console.log('server started');
})