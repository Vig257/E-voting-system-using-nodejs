
const localStrategy = require('passport-local').Strategy;
const { User } = require('./database');
const bcrypt=require("bcrypt")

exports.initializingPassport = (passport) => {

    passport.use(
        new localStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username });
                if (!user) return done(null, false);
                
               
                
                const passwordMatched = await bcrypt.compare(password,user.password )
                if(passwordMatched) 
                {
                    return done(null,user)

                }
                if(!passwordMatched){
                    return done(null, false,{message:"invalid email or password"});
                }
            } 
            catch (error) {
                return done(error, false)
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);

        }
        catch (error) {
            done(error, false);

        }
    });
};



exports.isAuthenticated=(req,res,next)=>{
    if(req.user) return next();
    
    res.redirect('/login');
}
