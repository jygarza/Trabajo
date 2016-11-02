var _ = require("underscore");

function Juego(){
	this.nombre="Niveles";
	this.niveles=[];
	this.usuarios=[];
	this.resultados=[];
	this.agregarNivel=function(nivel){
		this.niveles.push(nivel);
	}
	this.agregarUsuario=function(usuario){
		this.usuarios.push(usuario);
	}
	this.obtenerUsuario=function(id){
		return _.find(this.usuarios,function(usu){
			return usu._id==id;
		});
	}
	this.obtenerUsuarioLogin=function(email,password){
		return _.find(this.usuarios,function(usu){
			return (usu.email==email && usu.password==password);
		});
	}
	this.agregarResultado=function(resultado){
		this.resultados.push(resultado);
	}
}

function Nivel(num){
	this.nivel=num;
}

function Usuario(nombre){
	this.nombre=nombre;
	this.nivel=0;
	this.esil=nombre;
	this.password=undefined;
}

function Usuario(nombre,password){
	this.nombre=nombre;
	this.nivel=0;
	this.email=nombre;
	this.password=password;
}

function Resultado(nombre,nivel,tiempo){
	this.nombre=nombre;
	this.email=nombre;
	this.nivel=nivel;
	this.tiempo=tiempo;
}

module.exports.Juego=Juego;
module.exports.Usuario=Usuario;
module.exports.Resultado=Resultado;