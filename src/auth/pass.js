/**
 * Module dependencies
 */

import { querys, getConnection } from "../database";
import { matchPassword } from "../controllers/users.controller";


const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


/**
 * Query definitions
 */

const deserializeQuery = querys.getUserById;
const strategyQuery = querys.authUser;



/**
 * Expose
 */

 passport.use('local.signin', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'password',
    passReqToCallback: true
 }, async (req, username, password, done) => {
    const pool = await getConnection();

    const row = await pool.request().input("usuario", username).query(strategyQuery);

    if(row.recordset.length > 0){
      const user = row.recordset[0];

      passport.serializeUser(function(user, done) {
        console.log("SERIALIZED USER");
        done(null, user);
      });
      
      passport.deserializeUser( function(user, done) {
        console.log('DESERIALIZED USER');
        done(null, user);
      });

      const validationPassword = await matchPassword(password, user.pass);
      
      if(validationPassword){
        done(null, user, req.flash("Welcome"));
      }else{
        done(null, false, req.flash("Incorrect password >:("));
      }
    }else{
      return done(null, false, req.flash("User doesnt exist"));  
    }
  
  
  
 }));
