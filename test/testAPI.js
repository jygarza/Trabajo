var request=require("request");
var url='https://proyectobase.herokuapp.com/';
//var url='http://161.67.8.34:5000/';
//var url='http://127.0.0.1:5000/'
//var url='https://procesosygarza.herokuapp.com';
var headers={
	//'User-Agent': 'request'
	"User-Agent":"Super Agent/0.0.1",
	'Content-Type' : 'application/x-www-form-urlencoded' 
}


console.log("===========================================")
console.log(" Inicio de las pruebas del API REST:");
console.log(" 1. Crear usuario - 2. Iniciar sesión");
console.log(" 2. Obtener key");
console.log(" 3. Activar cuenta");
console.log(" 4. Iniciar sesion");
console.log(" 5. Modificar usuario");
console.log(" 6. Completar Niveles");
console.log(" 7. ");

console.log("========================================== \n")

function crearUsuario(email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{email:email,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("1. Intentar crear el usuario pepe@pepe.es con clave pepe");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse( body) ;
    		//uid=jsonResponse._id;
    		//console.log(jsonResponse._id);
    		//eliminarUsuario(jsonResponse._id);
    		//nivelCompletado(jsonResponse._id,20);
    		if (jsonResponse.email!=undefined){
	    		console.log("Usuario "+jsonResponse.email+" creado correctamente");
	    		console.log("Usuario uid: "+jsonResponse._id+"\n");
	    		iniciarSesion(email,password);
	    	}
	    	else{
	    		console.log("El usuario no se pudo registrar \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function iniciarSesion(email,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{email:email,password:password}
	}

	console.log("---------------------------------------------");
	console.log("2. El usuario: "+email+" intenta iniciar sesión");
	console.log("---------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse( body) ;
    		//uid=jsonResponse._id;
    		//console.log(jsonResponse._id);
    		//eliminarUsuario(jsonResponse._id);
    		//nivelCompletado(jsonResponse._id,20);
    		if (jsonResponse.email!=""){
	    		console.log("Usuario "+jsonResponse.email+" ha iniciado la sesión \n");
	    		eliminarUsuario(jsonResponse._id);
	    	}
	    	else{
	    		console.log("El usuario "+email+" NO pudo iniciar la sesión \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function iniciarSesion2(email,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{email:email,password:password}
	}

	console.log("---------------------------------------------");
	console.log("5. El usuario: "+email+" intenta iniciar sesión");
	console.log("---------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse( body) ;
    		//uid=jsonResponse._id;
    		//console.log(jsonResponse._id);
    		//eliminarUsuario(jsonResponse._id);
    		//nivelCompletado(jsonResponse._id,20);
    		if (jsonResponse.email!=""){
	    		console.log("Usuario "+jsonResponse.email+" ha iniciado la sesión \n");
	    	}
	    	else{
	    		console.log("El usuario "+email+" no pudo iniciar la sesión \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function nivelCompletado(uid,tiempo){
	var options={
		url:url+'nivelCompletado/'+uid+'/'+tiempo,
		method:'GET',
		headers:headers,
		//form:{email:email,password:password}
	}

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			console.log(body);
			var jsonResponse = JSON.parse( body) ;
    		//uid=jsonResponse._id;
    		console.log(jsonResponse.nivel);
    		//eliminarUsuario(jsonResponse._id);
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario(uid,email,password){
	var options={
		url:url+'actualizarUsuario/'+email,
		method:'PUT',
		headers:headers,
		form:{id:id,email:email+'Actualizado',passwordOld:password,passwordNew:password +'Actualizado'}
	}

	console.log("---------------------------------------------");
	console.log("3. Se intenta actualizar el usuario: "+email);
	console.log("---------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse( body);

    		if (jsonResponse.email==""){
	    		console.log("Usuario "+jsonResponse.email+" usuario actualizado \n");
	    		eliminarUsuario(jsonResponse_id);
	    	}
	    	else{
	    		console.log("Usuario no actualizado \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
		
	});
}


function eliminarUsuario(uid){
	var options={
		url:url+'eliminarUsuario/'+uid,
		method:'DELETE',
		headers:headers
		//form:{email:email,password:password}
	}

	console.log("---------------------------------------------");
	console.log("4. Se intenta eliminar el usuario: "+uid);
	console.log("---------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.resultados==1){
	    		console.log("Usuario "+uid+" eliminado \n");
	    	}
	    	else{
	    		console.log("El usuarios no existe \n");
	    	}
		}
		else{
			console.log("Eliminar: Error al conectar");
		}
		iniciarSesion2('pepe@pepe.es','pepe');
	});
}




//function obtenerKeyUsuario(email){
//	var options={
//		url:url+'obtenerKeyUsuario/'+email+'/a';
//	}
//}



crearUsuario('pepe@pepe.es','pepe');