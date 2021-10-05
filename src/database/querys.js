export const querys = {
  getAllUsers: "SELECT * FROM usuario",
  authUser: "SELECT * FROM usuario Where usuario = @usuario",
  getUserById: "SELECT * FROM usuario Where idusuario = @idusuario",
  addNewUser:
    "INSERT INTO usuario (usuario, nombre, avatar, profesion, biografia, correo, pass) VALUES (@usuario,@nombre,@avatar,@profesion,@biografia,@correo,@pass);",
  deleteUser: "DELETE FROM usuario WHERE idusuario= @idusuario",
  updateUserById:
    "UPDATE usuario SET nombre = @name, Description = @description, Quantity = @quantity WHERE Id = @id",
  addNewProject:
    "INSERT INTO proyecto (idusuario, nombreproyecto, contenidopr, descripcion, linkdirecto) VALUES (@idusuario, @nombreproyecto, @contenidopr, @descripcion, @linkdirecto);",
  getProjectByUserId:
    "SELECT * FROM proyecto Where idusuario = @idusuario" ,
  searchUserByName:
    "SELECT * FROM usuario WHERE nombre LIKE @username",
  addNewPost:
    "INSERT INTO publicacion (idusuario, nombreusuario, fotoperfil, descripcionpub, contenidopub) VALUES (@idusuario, @nombreusuario, @fotoperfil, @descripcionpub, @contenidopub);",
  selectAllPosts:
    "SELECT * FROM publicacion"
};
