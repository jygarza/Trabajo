



module.exports.insertarUsuario=function(coleccion,objeto,callback){
	
	coleccion.insert(objeto,function(err){
		if(err){
			console.log("error");
			callback(undefined);
		} else {
			console.log("Nuevo usuario creado");
			callback(objeto);
		}
	});
}