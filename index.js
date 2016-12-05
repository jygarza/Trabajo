var fs=require("fs");
//var config=JSON.parse(fs.readFileSync("config.json"));
//var host=config.host;
//var url=window.location.href.split('#')[0]; //Funciona
var url="http://127.0.0.1:5000/";
//var url="http://procesosygarza.herokuapp.com/";

var exp=require("express");
var app=exp();
var mongo=require("mongodb").MongoClient;
var ObjectId=require("mongodb").ObjectId;
var bodyParser=require("body-parser");
//var debug=true;
var modelo=require("./servidor/modelo.js");
//var juego= new modelo.Juego();
var fm=new modelo.JuegoFM("./servidor/coordenadas.json");
var juego=fm.makeJuego(fm.juego,fm.array);
//var moduloEmail=require("./servidor/email.js");
//var persistencia=require("./servidor/persistencia.js");
var cifrado = require("./servidor/cifrado.js");


/*
//SendGrid
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_user: 'jygarza',
    api_key: 'arbeloa17'
  }
}

var client = nodemailer.createTransport(sgTransport(options));
//Final SendGrid
*/
console.log(juego.niveles);


var usuariosCol;
var resultadosCol;
var limboCol;


app.set('port', (process.env.PORT || 5000));

app.use(exp.static(__dirname +"/cliente"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());




app.get("/",function(request,response){
	console.log(request.get('host'));
	var contenido=fs.readFileSync("./cliente/index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});

//insertar({nombre:"Pepe",email:"pe",clave:"pe"});


app.post('/login',function(request,response){
	var nombre=request.body.nombre;
	var password=request.body.password;
	var passwordCifrada = cifrado.encrypt(password);
	//var email=request.body.email;
	//var pass=request.body.password;
	//var usuario=juego.obtenerUsuarioLogin(email,pass);
	//console.log(usr);
	usuariosCol.find({nombre:nombre,password:passwordCifrada}).toArray(function(error,usr){
		if  (usr.length==0) {
			//if(error){
	 		//response.redirect("/signup");
			response.send({'nombre':undefined});
		} else {
			//response.send({'usuario':usr});
			var usuario=usr[0];
			juego.agregarUsuario(usuario);
			response.send(limpiarUsuario(usuario));
			//response.send(usuario);
		}
	});
});


app.post("/signup",function(request,response){
	//console.log(request.body.email);
 	//console.log(request.body.password);
 	var nombre = request.body.nombre;
	var email = request.body.email;
	//var pass = request.body.password;
	var password = request.body.password;
	var passwordCifrada = cifrado.encrypt(password);
	//usuariosCol.find({email:email}).toArray(function(error,usr){
	limboCol.find({nombre:nombre}).toArray(function(error,usr){
		//console.log(usr);
		if (usr.length>0){
			//if (usr==undefined){
			response.send({email:undefined});
		} else {
			usuariosCol.find({nombre:nombre}).toArray(function(error,usr){
				if (usr.length>0){
					response.send({nombre:undefined});
					} else {
					var usuario=new modelo.Usuario(nombre,email,passwordCifrada);
					insertarUsuarioLimbo(usuario,response);		
				}
			});
		}
	});
});


app.get('/nivelCompletado/:id/:tiempo/:vidas',function(request,response){
	console.log('nivelCompletado');
	var id=request.params.id;
	var vidas=request.params.vidas;
	var tiempo=request.params.tiempo;
	var usuario=juego.obtenerUsuario(id);
	var json={'nivel':-1}
	if (usuario!=undefined){
		insertarResultado(new modelo.Resultado(usuario.nombre,usuario.nivel,tiempo,vidas,usuario.intentos));
		usuario.nivel+=1;
		usuario.intentos=0;
		usuariosCol.update({_id:ObjectId(id)}, {$set: {nivel:usuario.nivel,intentos:usuario.intentos}});
		json=limpiarUsuario(usuario);	
	}
	response.send(json);
});

app.get("/comprobarUsuario/:id",function(request,response){
	var id = request.params.id;
	var usuario = juego.obtenerUsuario(id);
	var json={nivel:-1};
	if (usuario!=undefined) {
		json=JSON.stringify(limpiarUsuario(usuario));
	} else {
		usuariosCol.find({_id:ObjectId(id)}).toArray(function(error,usr){
			if (usr.length>0){
				var usuario=usr[0];
				juego.agregarUsuario(usuario);
				json=JSON.stringify(limpiarUsuario(usuario));
			}
		});
	}
	response.send(json);
});


app.get('/resetNiveles/:id',function(request,response){
	var id=request.params.id;
	var usuario=juego.obtenerUsuario(id);
	var json={'nivel':-1}
	if (usuario!=undefined){
		usuario.nivel=0;
		usuario.intentos=0;
		usuariosCol.update({_id:ObjectId(id)}, {$set: {nivel:usuario.nivel}});		
		json={'nivel':usuario.nivel};
	}
	response.send(json);
});


app.get('/sumarIntento/:id',function(request,response){
	var id=request.params.id;
	var usuario=juego.obtenerUsuario(id);
	var json={'intentos':-1}
	if (usuario!=undefined){
		usuario.intentos+=1;
		usuariosCol.update({_id:ObjectId(id)}, {$set: {intentos:usuario.intentos}});		
		json=JSON.stringify(limpiarUsuario(usuario));
	}
	response.send(json);
});

app.get('/obtenerResultados/',function(request,response){
	var json={'resultados':[]};
	if (juego!=undefined){
		json=juego.resultados;
	}
	response.send(json);
});



app.delete("/eliminarUsuario/:id",function(request,response){
 var id=request.params.id;
 var password=request.body.password;
 var passwordCifrada = cifrado.encrypt(password);
 var json={'resultados':-1};
 usuariosCol.remove({_id:ObjectId(id), password:passwordCifrada},function(err,result){
 	//console.log(result);
  if (result.result.n==0){
    console.log("No se pudo eliminar");
  }else{
   	json={"resultados":1};
   	console.log("Usuario eliminado");
   	var usuario=juego.obtenerUsuario(id);
   	juego.eliminarUsuario(id);
   	resultadosCol.remove({nombre:usuario.nombre},function(err,result){
	if (result.result.n==0){
	   	console.log("No se pudo eliminar los resultados");
	} else {
		juego.eliminarResultado(usuario.nombre);
		console.log("Resultados eliminados");
		}
	});
  	}
 	response.send(json);
	});
});


app.put('/actualizarUsuario/',function(request,response){
	//var uid=request.params.uid;
 	//var email=request.body.email;
	var id=request.body.id;
	var email=request.body.email;
	var passwordOld=request.body.passwordOld;
	var passwordOldCifrada=cifrado.encrypt(passwordOld);
	var passwordNew=request.body.passwordNew;
	var passwordNewCifrada=cifrado.encrypt(passwordNew);
	var nombre=request.body.nombre;
    //var password=request.body.newpass;
    //var nivel=parseInt(request.body.nivel);
    console.log("Actualizando");
	var json={'nombre':undefined};
	if (nombre!='' && passwordOld!='' && passwordNew!='') {
		usuariosCol.update({_id:ObjectId(id),password:passwordOldCifrada}, {$set: {nombre:nombre,password:passwordNewCifrada}},function(err,result){
			if (result.result.n!=0){
				json=juego.obtenerUsuario(id);
		   		json.nombre=nombre
		   		console.log("Usuario actualizado");
		   		}
		  	response.send(limpiarUsuario(json));
		});
  		} else {
  			response.send(json);
	   		//json=juego.obtenerUsuario(id);
	   		console.log("No se pudo actualizar");
 		}
	});


app.get('/pedirNivel/:uid',function(request,response){
	var uid=request.params.uid;
	var usuario=juego.obtenerUsuario(uid);
	var json={'nivel':-1};
	if(usuario && usuario.nivel<juego.niveles.length){
		response.send(juego.niveles[usuario.nivel]);
	}else{
		response.send(json);
	}
});

app.get('/confirmarUsuario/:nombre/:key',function(request,response){
	var key = request.params.key;
	var nombre = request.params.nombre;
	limboCol.find({nombre:nombre,key:key}).toArray(function(error,usr){
		//console.log(usr);
		if (usr.length==0){
			console.log("El usuario no existe");
			response.send("<h1>Cuenta ya activada</h1>");
		} else {
			//persistencia.insertarUsuario(usuariosCol,usr[0],function(usr));
			console.log("Usuario Confirmado");
			insertarUsuario(usr[0],response);
		}
	});
});

/*
app.get("/obtenerKeyUsuario/:email/:adminKey",function(request,response){
	var adminKey=request.params.adminKey;
	var email=request.params.email;
	var usuario;
	if(adminKey=="a")
	{
		limboCol.find({email:email}).toArray(function(error,usr){
			//console.log(usr);
			if(usr.length==0){
				response.send({key:""})
			}else{
				response.send({key:usr[0].key});
			}
		});
	}
});

*/

//Inserciones

function insertarUsuario(usu,response){
	console.log(usu);
	usuariosCol.insert(usu,function(err){
		if(err){
			console.log("error");
		} else {
			console.log("Nuevo usuario creado");
			limboCol.remove({key:usu.key},function(error,result){
				if(!error){
					console.log('Usuario eliminado del limbo');
				}
			});
			juego.agregarUsuario(usu);
			//response.send("<h1>Que la fuerza te acompañe</h1>");
			response.redirect(url);
		}
	});
}

function insertarUsuarioLimbo(usu,response){
	limboCol.insert(usu,function(err,result){
		var json={'nombre':undefined};
		if(err){
			console.log("error");
		} else {
			console.log("Nuevo usuario creado");
			enviarEmail(usu);
			json=limpiarUsuario(result["ops"][0]);
		}
		response.send(JSON.stringify(json));
	});
}

function insertarResultado(resultado){
	/*console.log(resultado);
	resultadosCol.insert(resultado,function(err){
		if(err){
			console.log("error");
		} else {
			console.log("Nuevo usuario creado");
			juego.agregarResultado(resultado);
		}
	});
	*/
	juego.agregarResultado(resultado);
	resultadosCol.insert(resultado);
}

//Fin Inserciones

/*
function comprobarCambios(body,usu){
 if (body.email!=usu.email && body.email!=""){
   usu.email=body.email;
 }
 if (body.newpass!=usu.password && body.newpass!=""){
   usu.password=body.newpass;
 }
   if (body.nombre!=usu.nombre && body.nombre!=""){
   usu.nombre=body.nombre;
 }
 return usu;
}
*/

function enviarEmail(usuario){
	
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://procesosygarza@gmail.com:procesosygarza44@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Juego Ygarza" <procesosygarza@gmail.com>', // sender address
    to: usuario.email, // list of receivers
    subject: 'Confirmación usuario ✔', // Subject line
    text: 'Que la fuerza te acompañe', // plaintext body
    html: '<a href="'+url+'confirmarUsuario/'+usuario.nombre+'/'+usuario.key+'">Juego Procesos confirmación</a>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});

}

/*
function insertarUsuarioLimbo(usu,response){
	console.log(usu);
	limboCol.insert(usu,function(err){
		if(err){
			console.log("error");
		} else {
			console.log("Nuevo usuario creado en");
			response.send({email:'ok'});
			moduloEmail.enviarEmail(usu.email,usu.key);
		}
	});
}*/
/*
function enviarEmail(direccion,key){
	var email = {
		  from: 'jygarza@gmail.com',
		  to:direccion,
		  subject: 'Confirmación de cuenta',
		  text: 'Confirmar Cuenta',
		  html: '<a href="confirmarUsuario/'+direccion+'/'+key+'">Que la fuerza te acompañe</a>'
	};

	client.sendMail(email, function(err, info){
    if (err){
      console.log('No se ha podido enviar el email '+ err);
    }
    else {
      console.log('Email enviado: ' + info);
    }
	});
}

*/



function cargarUsuarios(){
	juego.usuarios=[];
	usuariosCol.find().forEach(function (usr){juego.agregarUsuario(usr);});
}

function cargarResultados(){
	juego.resultados=[];
	resultadosCol.find().forEach(function (result){juego.agregarResultado(result)});
}

function limpiarUsuario(usuario){
	usuario.email=undefined;
	usuario.password=undefined;
	return usuario;
};





app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

mongo.connect("mongodb://pepe:pepe@ds035046.mlab.com:35046/usuarioscn",function(err, db) {
//mongo.connect("mongodb://127.0.0.1:27017/usuarioscn", function(err, db) {
	if (err){
 		console.log("No pudo conectar a la base de datos");
 	} else {
		console.log("Conectado a Mongo: usuarioscn");
		db.collection("usuarios",function(error,col){
			if (error){
				console.log("No pudo obtener la colección usuarios");
			} else {
				console.log("Tenemos la colección usuario");
				usuariosCol=col;
		}
	});
	db.collection("resultados",function(err,col){
		if(err){
			console.log("No se pudo conectar");
		}
		else{
			console.log("tenemos la colección resultados");
			resultadosCol=col;
			cargarResultados();
		}
	});
	db.collection("limbo",function(err,col){
		if(err){
			console.log("No se pudo conectar");
		}
		else{
			console.log("tenemos la colección limbo");
			limboCol=col;
		}
		});
	}
});

