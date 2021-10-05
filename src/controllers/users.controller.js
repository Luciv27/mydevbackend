import { getConnection, querys, sql } from "../database";
const bcrypt = require("bcrypt");

export const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querys.getAllUsers);
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const createNewUser = async (req, res) => {
  const { usuario, nombre, avatar, profesion, biografia, correo, pass } = req.body;

  // validating
  if (usuario == '' || nombre == '' || profesion == '' || biografia == '' || correo == '' || avatar == '' || pass == '') {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  const hashedPass = await encryptPassword(pass);

  try {

    
    const pool = await getConnection();

    await pool
      .request()
      .input("usuario", sql.VarChar, usuario)
      .input("nombre", sql.VarChar, nombre)
      .input("avatar", sql.VarChar, avatar)
      .input("profesion", sql.VarChar, profesion)
      .input("biografia", sql.VarChar, biografia)
      .input("correo", sql.VarChar, correo)
      .input("pass", sql.Text, hashedPass)
      .query(querys.addNewUser);


    res.status(200);
    res.send('User registered correctly!');
  } catch (error) {
    console.log(error)
    res.status(500);
    res.send(error.message);
  }
};

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
 };

export const matchPassword = async (password, savedPassword) =>{
  try{
    return await bcrypt.compare(password, savedPassword);
  
  }catch(err){
    console.error(err);
  }
}

export const getUserById = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("idusuario", req.params.idusuario)
      .query(querys.getUserById);

    const parseImage = Buffer.from(result.recordset[0].avatar.toString('utf-8'));
    console.log(parseImage);
    const decodedImage = Buffer.from(parseImage, 'base64');
    console.log(decodedImage);
    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("idusuario", req.params.idusuario)
      .query(querys.deleteUser);

    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getTotalUsers = async (req, res) => {
  const pool = await getConnection();

  const result = await pool.request().query(querys.getTotalUsers);
  console.log(result);
  res.json(result.recordset[0][""]);
};

export const updateUserById = async (req, res) => {
  const { usuario, nombre, avatar, biografia, correo } = req.body;

  // validating
  if (usuario == null || nombre == null || avatar == null || biografia == null || correo == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("usuario", sql.VarChar, usuario)
      .input("nombre", sql.VarChar, nombre)
      .input("avatar", sql.VarBinary, avatar)
      .input("biografia", sql.VarChar, biografia)
      .input("description", sql.VarChar, correo)
      .query(querys.updateUserById);
      res.json({ usuario, nombre, avatar, biografia, correo });
  } catch (error) {
    res.status(500);
    console.log(error);
    res.send(error.message);
  }
};


//HANDLING PROJECT

export const createNewProject = async (req, res) => {
  const { idusuario, nombreproyecto, contenidopr, descripcion, linkdirecto} = req.body;

  // validating
  if (idusuario == '' || nombreproyecto == '' || contenidopr == '' || descripcion == '' || linkdirecto == '') {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }
  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("idusuario", sql.Int, idusuario)
      .input("nombreproyecto", sql.VarChar, nombreproyecto)
      .input("contenidopr", sql.VarChar, contenidopr)
      .input("descripcion", sql.VarChar, descripcion)
      .input("linkdirecto", sql.VarChar, linkdirecto)
      .query(querys.addNewProject);


    res.status(200);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getProjectByUser = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("idusuario", req.params.idusuario)
      .query(querys.getProjectByUserId);

    
    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }};

// HANDLING SEARCH

export const searchUserByName = async (req, res) => {
  const {username} = req.body
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("username", username)
      .query(querys.searchUserByName);

    
    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

// HANDLING POSTS

export const createNewPost = async (req, res) => {
  const { idusuario, nombreusuario, fotoperfil, descripcionpub, contenidopub } = req.body;

  // validating
  if (idusuario == '' || nombreusuario == '' || fotoperfil == '' ||  descripcionpub == '' || contenidopub == '') {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }
  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("idusuario", sql.Int, idusuario)
      .input("nombreusuario", sql.VarChar, nombreusuario)
      .input("fotoperfil", sql.VarChar, fotoperfil)
      .input("descripcionpub", sql.VarChar, descripcionpub)
      .input("contenidopub", sql.VarChar, contenidopub)
      .query(querys.addNewPost);


    res.status(200);
  } catch (error) {
    res.status(500);
    console.log(error);
    res.send(error.message);
  }
};

export const selectAllPosts = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .query(querys.selectAllPosts);

    
    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }};