var _ = require("underscore");
var fs = require("fs");

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

function JuegoFM(archivo){
	this.juego=new Juego();
	this.array=leerCoordenadas(archivo);

	this.makeJuego=function(juego,array){
		var indi=0;
		array.forEach(function(ele){
			console.log(ele.gravedad);
			console.log(ele.coord);
			var nivel=new Nivel(indi,ele.coord,ele.gravedad);
			juego.agregarNivel(nivel);
			indi++;
		});
		return juego;
	}
}

function leerCoordenadas(archivo){
	var array=JSON.parse(fs.readFileSync(archivo));
	//console.log(array);
	return array;
}

function Nivel(num,coord,gravedad){
	this.nivel=num;
	this.coordenadas=coord;
	this.gravedad=gravedad;
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

module.exports.JuegoFM=JuegoFM;
module.exports.Juego=Juego;
module.exports.Usuario=Usuario;
module.exports.Resultado=Resultado;
