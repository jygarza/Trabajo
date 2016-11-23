
var fs=require("fs");
//var config=JSON.parse(fs.readFileSync("config.json"));
//var host=config.host;
//var url=window.location.href.split('#')[0]; //Funciona
//var url="http://127.0.0.1:5000/";
var url="http://procesosygarza.herokuapp.com/";

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

console.log(juego.niveles);


var usuariosCol;
var resultadosCol;
var limboCol;


app.set('port', (process.env.PORT || 5000));

app.use(exp.static(__dirname +"/cliente"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());




app.get("/",function(request,response){
	var contenido=fs.readFileSync("./cliente/index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});

//insertar({nombre:"Pepe",email:"pe",clave:"pe"});


app.post('/login',function(request,response){
	var email=request.body.email;
	var pass=request.body.password;
	var usuario=juego.obtenerUsuarioLogin(email,pass);
	//console.log(usr);
	if  (usuario==undefined) {
		//if(error){
 		//response.redirect("/signup");
		response.send({'email':undefined});
	} else {
		//response.send({'usuario':usr});
		response.send(usuario);
	}
});


app.post("/signup",function(request,response){
	//console.log(request.body.email);
 	//console.log(request.body.password);
	var email = request.body.email;
	var pass = request.body.password;
	//usuariosCol.find({email:email}).toArray(function(error,usr){
	limboCol.find({email:email}).toArray(function(error,usr){
		//console.log(usr);
		if (usr.length>0){
			//if (usr==undefined){
			response.send({email:undefined});
		} else {
			var usuario=new modelo.Usuario(email,pass);
			//insertarUsuario(usuario,response);		
			insertarUsuarioLimbo(usuario,response);
		}
	});
});


app.get('/nivelCompletado/:id/:tiempo',function(request,response){
	console.log('nivelCompletado');
	var id=request.params.id;
	var tiempo=request.params.tiempo;
	var usuario=juego.obtenerUsuario(id);
	var json={'nivel':-1}

	if (usuario!=undefined){
		insertarResultado(new modelo.Resultado(usuario.email,usuario.nivel,tiempo),response);
		usuario.nivel+=1;
		usuariosCol.update({_id:ObjectId(id)}, {$set: {nivel:usuario.nivel}});	
		json={'nivel':usuario.nivel};
	}
	response.send(json);
});

app.get("/comprobarUsuario/:id",function(request,response){
	var usuario = juego.obtenerUsuario(request.params.id);
	var json={nivel:-1};
	if (usuario!=undefined) {
		json=usuario;
	}
	response.send(json);
});


app.get('/resetNiveles/:id',function(request,response){
	var id=request.params.id;
	var usuario=juego.obtenerUsuario(id);
	var json={'nivel':-1}
	if (usuario!=undefined){
		usuario.nivel=0;
		usuariosCol.update({_id:ObjectId(id)}, {$set: {nivel:usuario.nivel}});		
		json={'nivel':usuario.nivel};
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
 var uid=request.params.id;
 var json={'resultados':-1};
 usuariosCol.remove({_id:ObjectId(uid)},function(err,result){
 	//console.log(result);
  if (result.result.n==0){
    console.log("No se pudo eliminar");
  }
  else{
   json={"resultados":1};
   console.log("Usuario eliminado");
  }
  cargarUsuarios();
  response.send(json);
 });
});


app.put('/actualizarUsuario',function(request,response){
	//var uid=request.params.uid;
 	//var email=request.body.email;
	var id=request.body.id;
	var email=request.body.email;
	var passwordOld=request.body.passwordOld;
	var passwordNew=request.body.passwordNew;
	//var nombre=request.body.nombre;
    //var password=request.body.newpass;
    //var nivel=parseInt(request.body.nivel);
	var json={'email':''};
	usuariosCol.update({_id:ObjectId(id),password:passwordOld}, {$set: {nombre:email,email:email,password:passwordNew}},function(err,result){
		if (result.result.n==0){
    	console.log("No se pudo actualizar");
  		} else {
	   		json=juego.obtenerUsuario(id);
	   		console.log("Usuario actualizado");
 		}
	  	cargarUsuarios();
	  	response.send(json);
	});
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
})

app.get('/confirmarUsuario/:email/:key',function(request,response){
	var key = request.params.key;
	var email=request.params.email;
	var usuario;
	limboCol.find({email:email}).toArray(function(error,usr){
		//console.log(usr);
		if (usr.length==0){
			console.log("El usuario no existe");
			response.send("<h1>La cuenta ya esta activada</h1>");
		} else {
			insertarUsuario(usr[0],response);
		}
	});
})



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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function insertarUsuario(usu,response){
	console.log(usu);
	usuariosCol.insert(usu,function(err){
		if(err){
			console.log("error");
		} else {
			console.log("Nuevo usuario creado");
			juego.agregarUsuario(usu);
			response.send("<h1>Que la fuerza te acompañe</h1>");
		}
	});
}

function insertarUsuarioLimbo(usu,response){
	console.log(usu);
	limboCol.insert(usu,function(err){
		if(err){
			console.log("error");
		} else {
			console.log("Nuevo usuario creado");
			response.send({email:'ok'});
			enviarEmail(usu.email,usu.key);
		}
	});
}

function enviarEmail(direccion,key){
	var email = {
		  from: 'jygarza@gmail.com',
		  to:direccion,
		  subject: 'Confirmación de cuenta',
		  text: 'Confirmar Cuenta',
		  html: '<a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">Que la fuerza te acompañe</a>'
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



function insertarResultado(resultado,response){
	console.log(resultado);
	resultadosCol.insert(resultado,function(err){
		if(err){
			console.log("error");
		} else {
			console.log("Nuevo usuario creado");
			juego.agregarResultado(resultado);
		}
	});
}

function cargarUsuarios(){
	juego.usuarios=[];
	usuariosCol.find().forEach(function (usr){juego.agregarUsuario(usr);});
}



mongo.connect("mongodb://pepe:pepe@ds035046.mlab.com:35046/usuarioscn",function(err, db) {
//mongo.connect("mongodb://127.0.0.1:27017/usuarioscn", function(err, db) {
	if (err){
 		console.log("No pudo conectar a la base de datos");
 	} else {
		console.log("Conectado a Mongo: usuarioscn");
		db.collection("usuarios",function(error,col){
			console.log("tenemos la colección Usuarios");
			usuariosCol=col;
			cargarUsuarios();
		});
	}

	db.collection("resultados",function(err,col){
		if(err){
			console.log("No se pudo conectar");
		}
		else{
			console.log("tenemos la colección resultados");
			resultadosCol=col;
		}
	})

	db.collection("limbo",function(err,col){
		if(err){
			console.log("No se pudo conectar");
		}
		else{
			console.log("tenemos la colección limbo");
			limboCol=col;
		}
	})
});

