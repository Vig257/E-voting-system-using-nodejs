const express = require("express")
const ejs = require("ejs");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { initializingPassport, isAuthenticated } = require("./passportConfig");
const expressSession = require("express-session");
const flash = require('connect-flash');


const app = express()


app.set('view engine', "ejs");
const { connectMongoose, User, Votes, Admin } = require("./database.js");
const { render } = require("express/lib/response");
const { authenticate } = require("passport/lib");
connectMongoose();

initializingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({ secret: "secret", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
const saltRounds = 10;




//ALL GET ROUTES
app.get("/adminLogin/results", async (req, res) => {
    //count votes
    const person1Count = await Votes.find({ option: "BJP" }).count()
    const person2Count = await Votes.find({ option: "congress" }).count()
    const person3Count = await Votes.find({ option: "SS" }).count()
    const noOneCount = await Votes.find({ option: "noOne" }).count()
    const votesCount = [
        person1Count, person2Count, person3Count, noOneCount

    ];
    
         //name of candidates
    const per1Name=await Votes.find({ option: "BJP" })
    const per2Name=await Votes.find({ option: "congress" })
    const per3Name=await Votes.find({ option: "SS" })
    const noOneName=await Votes.find({ option: "noOne" })
     const candidateName=[per1Name,per2Name,per3Name,noOneName]
      
     console.log(candidateName)

    res.render("adminDashBoard.ejs", { votesCount ,candidateName});
 
})
app.get('/', (req, res) => {
    res.render("index")
})
app.get('/index', (req, res) => {
    res.render('index');

})
app.get('/about', (req, res) => {
    res.render("about")
})
app.get('/register', (req, res) => {
    res.render("register")
})

app.get('/login', (req, res) => {
    res.render("login")
})


app.get('/logout', (req, res) => {
    res.redirect("/index")
})
app.get('adminLogin/results',(req,res)=>{
    res.render("adminDashBoard")
})


//ALL POST METHOD ROUTE
//userlogin post method
app.post('/login', passport.authenticate("local", { failureRedirect: "/register",failureFlash:true,successFlash:"Hey,welcome ! "}), (req, res) => {
    
    res.redirect("/userPage")
   
})


//registration post method
app.post('/register', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

   
    if (user) return res.status(400).send("user already exists");
      if(!user){
          const hashedPass=await bcrypt.hash(req.body.password, saltRounds);
            const newUser = await User.create({
            username: req.body.username,
            password:hashedPass,
        });
        /*  const token=newUser.getJWTToken(); */
    
        res.status(201).render("index")
      }

   
});

//User page ie voting page submit post method
app.post("/userPage", async (req, res) => {
    try{
        const newVote = await Votes.create(req.body);
        res.status(201).send("vote is submitted").json({
            success: true,
    
        });
    }
    catch(error){
        return (error, false)
    }
   
  

})
app.get("/userPage", (req, res) => {
    res.render('userPage')
})

//admin routes
app.get("/adminLogin", (req, res) => {
    res.render('adminLoginPAge')
})
//result show


//admin login authentication post method
app.post('/adminLogin', async (req, res) => {
    const adminUsername = await Admin.findOne({ username: req.body.adminUsername });
    const adminPassword = await Admin.findOne({ password: req.body.adminPassword })
    if (adminPassword && adminUsername) {
        res.redirect("adminLogin/results")

    }
    else {
        console.log("error logic not working");
    }
})
//app listening
app.listen(4000, () => {
    console.log("server running at http://localhost:4000")



})