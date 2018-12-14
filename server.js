const express           = require('express');
const mustacheExpress   = require('mustache-express');
const app               = express();

app.use(express.static(__dirname + "/public"));

app.engine('html', mustacheExpress());

app.set('view engine', 'html');

app.set('views', __dirname + '/views');

app.set("layout", "layouts/layout");

app.get("/", (req, res) => {

    res.render('home.html');
});

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

