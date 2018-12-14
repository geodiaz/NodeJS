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

app.get("/products", (req, res) => {

    mongoDb.collection('products').find().toArray(function(err, results) {
        res.render('products.html', { products: results });
    });
});

app.get("/", (req, res) => {

    res.render('home.html');
});

app.get("/admin", (req, res) => {

    res.render('form.html');
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

        res.render("products.html", { product: data });
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

//MISC
app.get("/about", (req, res) => {

    res.render('about.html');
});

app.get("/contact", (req, res) => {

    res.render('contact.html');
});


app.get("/products", (req, res) => {

    res.render('products.html');
});

app.listen(3000, () => {
    console.log('server started');
})

