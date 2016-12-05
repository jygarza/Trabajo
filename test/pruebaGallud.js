var request=require("request");
//var url='https://tu_app.herokuapp.com/';
var url='http://127.0.0.1:5000/'
var headers={
	//'User-Agent': 'request'
	"User-Agent":"Super Agent/0.0.1",
	'Content-Type' : 'application/x-www-form-urlencoded' 
}


console.log("===========================================")
console.log(" PRUEBAS ConquistaNiveles - Control Errores");
console.log(" 1. Crear usuario con cuenta ficticia");
console.log(" 2. Obtener key que no existe");
console.log(" 3. Activar cuenta con key que no existe");
console.log(" 4. Iniciar sesiÃ³n");
console.log(" 5. Modificar usuario campos vacÃ­os");
console.log(" 6. Eliminar usuario con uid inexistente");
console.log(" url= "+url);
console.log("========================================== \n")

function crearUsuario(email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{email:email,password:password}
	}

	console.log("---------------------------------------------------------------------------");
	console.log("1. Intentar crear el usuario "+emailTest+" con clave "+claveTest);
	console.log("---------------------------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse( body) ;
    		//uid=jsonResponse._id;
    		//console.log(jsonResponse._id);
    		//eliminarUsuario(jsonResponse._id);
    		//nivelCompletado(jsonResponse._id,20);
    		if (jsonResponse.email!=undefined){
	    		console.log("Usuario "+jsonResponse.email+" creado correctamente \n");
	    		//console.log("Usuario uid: "+jsonResponse.key+"\n");
	    		//iniciarSesion(email,password);
	    		obtenerKeyUsuario(email);
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

function obtenerKeyUsuario(email){
	var options={
		url:url+'obtenerKeyUsuario/'+email+'/tu-clave-root',
		method:'GET',
		headers:headers,
		//form:{email:email,password:password}
	}

	console.log("-------------------------------------------------------------------");
	console.log("2. Obtener key usuario: "+email+" para activar cuenta");
	console.log("-------------------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var respuesta = JSON.parse( body);
    		if (respuesta.key!=""){
	    		console.log("Usuario "+email+" tiene clave: "+respuesta.key+" \n");
	    		keyTest=respuesta.key;
	    		confirmarUsuario(email,"123456789"); //respuesta.key
	    	}
	    	else{
	    		console.log("El usuario "+email+" NO pudo iniciar la sesiÃ³n \n");
	    	}
		}
		else{
			console.log(response.statusCode);
			//confirmarUsuario(email,"123456789");
		}
	});
}

function obtenerUidUsuario(email,key){
	var options={
		url:url+'obtenerUid/'+email+'/'+key,
		method:'GET',
		headers:headers,
		//form:{email:email,password:password}
	}

	console.log("-------------------------------------------------------------------");
	console.log("8. Obtener uid usuario: "+email+" con key "+key+" para eliminar usuario");
	console.log("-------------------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var respuesta = JSON.parse( body);
    		if (respuesta.uid!=-1){
	    		console.log("Usuario "+email+" tiene uid: "+respuesta.uid+" \n");
	    		uidTest=respuesta.uid;
	    		//eliminarUsuario(email,respuesta.uid); //respuesta.key
	    		eliminarUsuario(email,undefined);
	    	}
	    	else{
	    		console.log("El usuario "+email+" NO pudo iniciar la sesiÃ³n \n");
	    	}
		}
		else{
			console.log(response.statusCode);
			//confirmarUsuario(email,"123456789");
		}
	});
}

function confirmarUsuario(email,key){
	var options={
		url:url+'confirmarUsuario/'+email+'/'+key,
		method:'GET',
		headers:headers,
		//form:{email:email,password:password}
	}

	console.log("---------------------------------------------------------------");
	console.log("3. Confirmar cuenta usuario: "+email+" con key errÃ³nea "+key);
	console.log("---------------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			//var respuesta = JSON.parse( body);
    		//if (respuesta.key!=""){
	    	console.log("Cuenta confirmada \n");
	    		//activarCuentaUsuario(email,respuesta.key);
	    	iniciarSesion(emailTest,claveTest);
	    	//}
	    	//else{
	    	//	console.log("El usuario "+email+" NO pudo iniciar la sesiÃ³n \n");
	    	//}
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

	console.log("-------------------------------------------------------------------");
	console.log("4. El usuario: "+email+" intenta iniciar sesiÃ³n");
	console.log("-------------------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var usuario = JSON.parse( body);
    		if (usuario.email!=""){
	    		console.log("Usuario "+usuario.email+" ha iniciado la sesiÃ³n \n");
	    		//actualizarUsuario(usuario._id,usuario.email,"Pepe",usuario.password);
	    		uidTest=usuario._id;
	    	}
	    	else{
	    		console.log("El usuario "+email+" NO pudo iniciar la sesiÃ³n \n");
	    		actualizarUsuario(usuario._id,usuario.email,undefined,usuario.password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario(uid,email,nombre,password){
	var options={
		url:url+'actualizarUsuario/',
		method:'PUT',
		headers:headers,
		form:{uid:uid,email:email,nombre:nombre,newpass:password}
	}
	console.log("-------------------------------------------------------------------");
	console.log("5. El usuario: "+email+" intenta actualizar el nombre undefined");
	console.log("-------------------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse( body) ;
    		//uid=jsonResponse._id;
    		console.log("El usuario ha cambiado el nombre: "+jsonResponse.nombre+" \n");
    		//eliminarUsuario(jsonResponse._id);

    		nivelCompletado(uidTest,30);
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
		headers:headers
		//form:{email:email,password:password}
	}

	console.log("-------------------------------------------------------------------");
	console.log("6. El usuario: "+emailTest+" completa un nivel ");
	console.log("-------------------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse( body) ;
    		//uid=jsonResponse._id;
    		// console.log("Nivel actual: "+jsonResponse.nivel+" \n");
    		// if (jsonResponse.nivel<jsonResponse.max){
    		// 	nivelCompletado(uid,30);
    		// }
    		// else{
	    		//eliminarUsuario(uid);
	    	obtenerUidUsuario(emailTest,keyTest);
	    	//}
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

	console.log("-------------------------------------------------------------------");
	console.log("7. Se intenta eliminar el usuario: "+uid);
	console.log("-------------------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.resultados==1){
	    		console.log("Usuario "+uid+" eliminado \n");
	    	}
	    	else{
	    		console.log("El usuarios no existe \n");
	    		//obtenerUidUsuario(emailTest,keyTest);
	    		eliminarUsuario(uidTest);
	    	}
		}
		else{
			console.log("Eliminar: Error al conectar");
		}
		//iniciarSesion2(emailTest,claveTest);
		//eliminarUsuario(uidTest);
	});
}

var emailTest='jygarza92@gmail.com';
var claveTest='pepexyz';
var uidTest;
var keyTest;
crearUsuario(emailTest,claveTest);