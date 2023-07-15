const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { log } = require("console");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get((req, res) => {
    Article.find({})
    .then((articles) => {
        res.send(articles);
    }).catch((err) => {
        res.send(err);
    })
})
.post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save().then(() => {
        res.send("Successfully added a new article");
    }).catch((err) => {
        res.send(err);
    });
})
.delete((req, res) => {
    Article.deleteMany({}).then(() => {
        res.send("Successfully deleted all articles");
    }).catch((err) => {
        res.send(err);
    });
});

app.route("/articles/:articleTitle")
.get((req, res) => {
    Article.findOne({title: req.params.articleTitle})
    .then((article) => {
        res.send(article);
    })
    .catch((err) => {
        res.send(err);
    });
})
.put((req, res) => {
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content}
    )
    .then(() => {
        res.send("Successfully updated an article");
    }).catch((err) => {
        res.send(err);
    })
})
.patch((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        req.body
    )
    .then(() => {
        res.send("Successfully updated an article");
    }).catch((err) => {
        res.send(err);
    });
})
.delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle})
    .then(() => {
        res.send("Successfully deleted an article");
    }).catch((err) => {
        res.send(err);
    });
});

app.listen(3000, () => {
    console.log("Server is started on port 3000");
});