const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ejs = require("ejs");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bcrypt = require("bcrypt");

const employeeRoute = require("./routes/employeeRoute");
const User = require("./models/User");

//MVC - Model(models) view(views-html pages - ssrendering) controllers(controllers)

const middleware1 = (req, res, next) => {
  if (10 < 20) {
    next();
  } else {
    console.log("Sorry you are not eligible");
  }
};

const checkAuth = (req, res, next) => {
  if (req.session?.isAuthenicated) {
    next();
  } else {
    res.redirect("/sign-up");
  }
};

dotEnv.config();
const app = express();
app.use(bodyParser.json());
app.set("view engine", "ejs"); //to access html files
app.use(express.static("public")); //to access images, js files,styles in public folder
app.use(express.urlencoded({ extended: true })); //it is a middleware to access the data which comes from the ejs files

app.use("/employees", employeeRoute);

app.listen("4040", () => {
  console.log("Server running on http://localhost:4040");
});

//client side rendering
app.get("/mango", (req, res) => {
  res.json({ friut: "mango" });
});

//server side rendering
app.get("/dashboard",checkAuth, (req, res) => {
  res.render("dashboard");
});

app.get("/sign-up", (req, res) => {
  res.render("signUp");
});

//sign up ejs files creation in db
app.post("/create-user", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.redirect("/sign-up");
    }
    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, password: hashedPass });
    // req.session["person"] = newUser.userName
    await newUser.save();
    res.redirect("/login");
    // res.status(200).json({ message: "User Created Successfully" });
  } catch (err) {
    res.redirect("/sign-up");
    console.log("err in creation", err);
    // status(500).json({ message: "Some error occured in creation",Error : err });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

//login user
app.post("/login-user", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log("!user",user)
      return res.redirect("/sign-up");
    }
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      console.log("!pass",checkPass)
      return res.send({message : "Please check password"});
    }
    // req.session.isAuthenicated = true;
    res.redirect("/dashboard");
    // res.send({message : "success"})
  } catch (err) {
    res.send({message : err})
    // res.redirect("/sign-up");
  }
});

//logout
app.post("/log-out",(req,res) => {
  req.session.destroy((err) => {
    if(err) throw err
    res.redirect("/login")
  })
})
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log('"Error1', err);
  });

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "mySession",
});

app.use(
  session({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
