var request=require("request");
var url="http://procesosygarza.herokuapp.com/";
//var url='https://procesos.herokuapp.com/';
//var url='http://161.67.8.34:5000/';
//var url='http://127.0.0.1:5000/'
var headers={
	//'User-Agent': 'request'
	"User-Agent":"Super Agent/0.0.1",
	'Content-Type' : 'application/x-www-form-urlencoded' 
}


console.log("===========================================")
console.log(" Inicio de las pruebas del API REST:");
console.log(" 1. Crear usuario con cuenta ficticia");
console.log(" 2. Confirmar usuario que no existe");
console.log(" 3. Iniciar sesión");
console.log(" 4. Modificar usuario campos vacíos");
console.log(" 5. Eliminar usuario que no existe");
console.log(" url= "+url);
console.log("========================================== \n")

function crearUsuario(nombre,email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,email:email,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("1. Intentar crear el usuario "+nombre+" con email "+email+" y con clave "+password+"");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body)
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" creado correctamente \n");
	    		console.log("Usuario id: "+jsonResponse._id+"\n");
	    		confirmarUsuario(jsonResponse._id,jsonResponse.key,nombre,password);
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

function confirmarUsuario(id,key,nombre,password){
	var options={
		url:url+'confirmarUsuario/'+nombre+'/'+key+'1',
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("2. Se confirma el usuario con una key que no existe");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			console.log("Usuario "+nombre+" no es confirmado \n");
			iniciarSesion(id,key,nombre,password);
		}
		else{
			console.log("El usuario "+nombre+" no se ha podido confirmar \n");
		}
	});
}

function iniciarSesion(id,key,nombre,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("3. El usuario: "+nombre+" intenta iniciar sesión");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo iniciar la sesión \n");
	    		actualizarUsuario(id,key,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario(id,key,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,nombre:'',passwordOld:'',passwordNew:''}
	}

	console.log("--------------------------------------------------------");
	console.log("4. El usuario: "+nombre+" actualiza el nombre");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		eliminarUsuario(id,key,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}


function eliminarUsuario(id,key,nombre,password){
	var options={
		url:url+'eliminarUsuario/1837100cadc63c1ae8d6f0b2',
		method:'DELETE',
		headers:headers,
		form:{password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("5. Se intenta eliminar el usuario con un id que no existe");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.resultados==1){
	    		console.log("Usuario "+id+" eliminado \n");
	    	}
	    	else{
	    		console.log("El usuario no existe \n");
	    		confirmarUsuario2(id,key,nombre,password);
	    	}
		}
		else{
			console.log("Eliminar: Error al conectar");
		}
	});
}

function confirmarUsuario2(id,key,nombre,password){
	var options={
		url:url+'confirmarUsuario/'+nombre+'/'+key,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("6. Se confirma el usuario "+nombre+" para poder actulizarlo y eliminarlo");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			console.log("Usuario "+nombre+" confirmado \n");
			actualizarUsuario2(id,key,nombre,password);
		}
		else{
			console.log("El usuario "+nombre+" nose ha podido confirmar \n");
		}
	});
}

function actualizarUsuario2(id,key,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,nombre:'',passwordOld:password,passwordNew:password}
	}

	console.log("--------------------------------------------------------");
	console.log("7. El usuario: "+nombre+" actualiza el nombre en blanco");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		actualizarUsuario3(id,key,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario3(id,key,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,nombre:nombre,passwordOld:'',passwordNew:password}
	}

	console.log("--------------------------------------------------------");
	console.log("8. El usuario: "+nombre+" actualiza la password actual en blanco");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		actualizarUsuario4(id,key,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario4(id,key,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,nombre:nombre,passwordOld:password,passwordNew:''}
	}

	console.log("--------------------------------------------------------");
	console.log("9. El usuario: "+nombre+" actualiza la password nueva en blanco");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		eliminarUsuario2(id,key,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function eliminarUsuario2(id,key,nombre,password){
	var options={
		url:url+'eliminarUsuario/'+id,
		method:'DELETE',
		headers:headers,
		form:{password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("10. Se elimina el usuario "+nombre);
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.resultados==1){
	    		console.log("Usuario "+id+" eliminado \n");
	    	}
	    	else{
	    		console.log("El usuarios no existe \n");
	    	}
		}
		else{
			console.log("Eliminar: Error al conectar");
		}
	});
}

crearUsuario('Pepe3','pepe@pepe.com','pepe3');