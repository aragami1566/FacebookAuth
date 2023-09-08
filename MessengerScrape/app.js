const express = require('express');

const app = express();

const passport = require('passport');

const session = require('express-session');

const facebookStrategy = require('passport-facebook').Strategy;

const FB = require('fb');

app.set("view engine", "ejs");

app.use(session({ secret: "secretkey" }));
app.use(passport.initialize());
app.use(passport.session());

//facebook strategy

passport.use(new facebookStrategy({
    clientID: "1725640667903023",
    clientSecret: "2c2abe2195ec979ffe0617b89a973b5b",
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
},
    
async function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    FB.setAccessToken(accessToken);
    FB.api('https://www.facebook.com/test.page.567426/', function(response) {
        if(response.is_published) {
          console.log('Page is published');
        }
      });
    const res = await FB.api('/me/accounts');
    console.log(res.data);
    const page = res.data[0];

    console.log(accessToken);
    return done(null, profile);
}

));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/auth/facebook", passport.authenticate("facebook", { scope: ['email'] }));

app.get("/auth/facebook/callback", passport.authenticate("facebook", {
    successRedirect: '/profile',
    failureRedirect: '/failed',
}));

app.get("/profile", (req, res) => {
    res.send("Validated")
});

app.get("/failed", (req, res) => {
    res.send("Failed")
});

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
    cb(null, id);
});

app.listen(5000);