var request = require("request");
//var url='http://127.0.0.1:5000';
var url='https://procesosygarza.herokuapp.com';
var headers={
	"User-Agent":"Super Agent/0.0.1",
	"Content-Type":'application/x-www-form-urlencoded'
}

var usuario;

function testRaiz(){
	var options={
		url:url,
		method:'GET',
		headers:headers,
		qs:{'':''}
	}

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			console.log(body);
		} else {
			console.log(response.statusCode);
			//console.log(error);
		}
	});
}

function crearUsuario(email,password){
	var options={
		url:url+'/signup',
		method:'POST',
		headers:headers,
		form:{email:email,password:password}
	}

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			console.log('Usuario creado:     '+body);
			usuario = JSON.parse( body) ;
			comprobarUsuario(usuario._id);
			actualizarUsuario(usuario._id,usuario.email,usuario.password);
    		eliminarUsuario(usuario._id);
		}
		else{
			console.log(response.statusCode);
			throw error;

		}
	});
}

function comprobarUsuario(id){
	var options={
		url:url+'/comprobarUsuario/'+id,
		method:'GET',
		headers:headers
	}

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			console.log('Usuario comprobado: '+body);
		}
		else{
			console.log(response.statusCode);
			throw error;

		}
	});
}

function actualizarUsuario(id,email,password){
	var options={
		url:url+'/actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,email:email+'Actualizado',passwordOld:password,passwordNew:password+'Actualizada'}
	}

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var resultados = JSON.parse(body).resultados ;
			if (resultados==1) {
				console.log('Usuario actualizado');
			} else {
				console.log('Usuario no actualizado');
			}
		}
		else{
			console.log(response.statusCode);
			throw error;

		}
	});
}


function eliminarUsuario(uid){
	var options={
		url:url+'/eliminarUsuario/'+uid,
		method:'DELETE',
		headers:headers
		//form:{email:email,password:password}
	}
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.resultados==1){
	    		console.log("Usuario eliminado");
	    	}
	    	else{
	    		console.log("El usuarios no existe");
	    		throw error;
	    	}
		}
		else{
			console.log("Error al conectar");
			//throw error;
		}
	});
}


//testRaiz();
crearUsuario('test','test');