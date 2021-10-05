import express, { response } from "express";
import {
  getUsers,
  createNewUser,
  getUserById,
  deleteUserById,
  updateUserById,
  getProjectByUser,
  createNewProject,
  createNewPost,
  selectAllPosts,
  searchUserByName
} from "../controllers/users.controller";

const router = express.Router();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('../auth/pass');
const flash = require('connect-flash');


router.use(session({ cookie: { maxAge: 3600000 }, 
  secret: 'woot',
  resave: false, 
  saveUninitialized: false}));

router.use(passport.initialize());
router.use(passport.session());

router.use(
  cors({
       origin: "http://localhost:3000", // allow to server to accept request from different origin
       methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
       withCredentials: true, // allow session cookie from browser to pass through
 })
);

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
  });




router.use(flash());

router.get("/usuario", getUsers);

router.post("/register", createNewUser);

router.get("/usuario/:idusuario", getUserById);



router.post("/login", (req, res, next) => {
  passport.authenticate('local.signin', function (err, user) {
    if (err) {
      res.status(500).json('Error while auth');
    } else if (!user) {
      res.status(401).json('Unauthorized');
    } else {
      req.login(user, function(err) {
        if (err) {
          res.status(500).json(err);
        } else {
            res.status(200).json({...user});
          }
        })
    }
  }) (req, res, next);
});



router.delete("/usuario/:idusuario",  deleteUserById);

router.put("/usuario/:idusuario", updateUserById);

//HANDLING PROJECTS ROUTES

router.post("/project", createNewProject);

router.post("/project/:idusuario", getProjectByUser);


//HANDLING POSTS ROUTES

router.post("/uplpost", createNewPost);

router.post("/posts", selectAllPosts);

//SEARCH ROUTES

router.post("/search", searchUserByName);

export default router;
