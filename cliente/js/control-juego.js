//Funciones que modifican el index
//var url="http://127.0.0.1:5000/";
//var url="http://procesosygarza.herokuapp.com/";
var url=window.location.href.split('#')[0]; //Funciona
var game;

$('.toggle-sidebar').click(function(){
 $('body').toggleClass('sidebar-open');
 return false;
});

function inicio(){
	borrarJuego();
	comprobarUsuario();
}

function borrarControl(){
	$('#control').remove();
}

function mostrarCabecera(){
	$('#control').empty();
	$('#control').append('<div id="cabecera"><h2>Nombre jugador</h2><p><input type="text" id="nombreInput" placeholder="Introduce tu nombre"></p>');
	botonNombre();
}

function botonNombre(){
	var nombre="";
	$('#cabecera').append('<p><button type="button" id="nombreBtn" class="btn btn-primary btn-lg"><b>Nuevo Juego</b></button></p>');
	$('#nombreBtn').on('click',function(){
		var nombre=$('#nombreInput').val();
		$('#nombreBtn').remove();
		$('#nombreInput').remove();
		crearUsuario(nombre);
	})
}

function mostrarInfoJugador(){
	var email=$.cookie('email');
	var id=$.cookie('id');
	var nivel=$.cookie('nivel');
	var percen=Math.floor((nivel/maxNiveles)*100);
	$('#control').empty();
	$('#control').append('<div id="cabecera"><h2>Jugador</h2></div>')
	$('#control').append('<div id="datos"><h4>Nombre: '+email+'<br>Nivel: '+nivel+'</h4></div>');
	$('#control').append('<div class="progress" id="prog"><div class="progress-bar" aria-valuemin="0" aria-valuemax="100" style="width:'+percen+'%">'+percen+'%</div></div>');
	siguienteNivel();
}

function siguienteNivel(){
		var nivel=$.cookie('nivel');
		if (nivel==0) { 
			$('#siguienteBtn').remove();
			$('#enh').remove();
			$('#res').remove();
	  		$('#resultados').remove();
			//crearNivel($.cookie('nivel'));
			pedirNivel(nivel);
		} else if (nivel==maxNiveles) {
			$('#juegoId').before("<h2 id='enh'>Lo siento, no hay más niveles</h2>");
			$('#control').append('<button type="button" id="siguienteBtn" class="btn btn-success btn-md">Volver a empezar</button>')
			$('#siguienteBtn').on('click',function(){
				$('#enh').remove();
				$('#siguienteBtn').remove();
				resetNiveles();
			});
		} else {
			$('#juegoId').before("<h2 id='enh'>¡Enhorabuena!</h2>");
			$('#control').append('<button type="button" id="siguienteBtn" class="btn btn-primary btn-lg">Siguiente Nivel</button>');
			$('#siguienteBtn').on('click',function(){
				$('#siguienteBtn').remove();
				$('#enh').remove();
				$('#res').remove();
	  			$('#resultados').remove();
				//crearNivel($.cookie('nivel'));
				pedirNivel(nivel);
			});
		}
}



function mostrarResultados(datos){
  //eliminarGame();
  //eliminarCabeceras();
  $('#res').remove();
  $('#resultados').remove();
  borrarJuego();
  $('#juegoId').append('<h3 id="res">Resultados</h3>');
  var cadena="<table id='resultados' class='table table-bordered table-condensed'><tr><th>Nombre</th><th>Nivel</th><th>Tiempo</th></tr>";
    for(var i=0;i<datos.length;i++){
      cadena=cadena+"<tr><td>"+datos[i].nombre+"</td><td> "+datos[i].nivel+"</td>"+"</td><td> "+datos[i].tiempo+"</td></tr>";      
    }
    cadena=cadena+"</table>";
    $('#juegoId').append(cadena);
}

function reset(){
	borrarJuego();
	borrarCookies();
	mostrarLogin();
}


function reiniciarNivel(){
	$('#control').append('<button type="button" id="reiniciarBtn" class="btn btn-warning btn-lg">Reinicar Nivel</button>');
			$('#reiniciarBtn').on('click',function(){
				$('#reiniciarBtn').remove();
				borrarJuego();
				pedirNivel(nivel);
				//crearNivel($.cookie('nivel'));
			});
};

function noHayNiveles(){
	
}

function nivelCompletado(tiempo){
	comunicarNivelCompletado(tiempo);
	obtenerResultados();
}


function borrarCookies(){
	$.removeCookie("email");
	$.removeCookie("id");
	$.removeCookie("nivel");
}

function borrarJuego(){
	if (game!=undefined){
		game.destroy();
		game=undefined;
	}
	$('#juegoId').empty();
	$('#enh').remove();
}

function resultados(){
	$('#control').empty();
	$('#control').append('<div id="cabecera"><h3>Resultados</h3><table id="resultados" class="table table-bordered table-condensed"><tbody><tr><th>Nombre</th><th>Nivel</th><th>Tiempo</th></tr></tbody></table>');
}

function mostrarLogin(){
	$('#control').empty();
	$('#control').append('<div id="cabecera"><h2>Iniciar Sesion </h2>'+'<p><input type="text" class="form-control" id="emailInput" placeholder="nombre de usuario o correo electrónico">');
	$('#control').append('</p><p><input type="password" class="form-control" id="claveInput" placeholder="contraseña"></p>'+'<p class="bg-danger hidden" id="errorLoginText">Esta cuenta no existe o la contraseña es incorrecta. Indica una cuenta diferente.</p>');
	$('#control').append('<p><button type="button" id="loginBtn" class="btn btn-primary btn-mdn"><b>Entrar</b></button>&nbsp;&nbsp;<a href="#" id="refRegistrar">Registrarse</a></p>');
	$('#loginBtn').on('click',function(){
		var email=$('#emailInput').val();
		var password=$('#claveInput').val();
		loginUsuario(email,password);
	});
	$('#refRegistrar').on('click',function(){
		mostrarRegistro();
	});
}

function mostrarRegistro(){
	$('#control').empty();
	$('#control').append('<div id="cabecera"><h2>Nuevo Registro</h2><p><input type="text" class="form-control" id="emailInput" placeholder="nombre de usuario o correo electrónico">'+'<p class="bg-danger hidden" id="errorEmailText">Introduce un nombre de usuario o correo electrónico</p>'+'<p class="bg-danger hidden" id="errorRegistroText">usuario no válido o en uso.</p>');
	$('#control').append('</p><p><input type="password" class="form-control" id="claveInput" placeholder="contraseña"></p>'+'<p class="bg-danger hidden" id="errorPasswordText">Introduce una contraseña.</p>');
	$('#control').append('<p><button type="button" id="registroBtn" class="btn btn-primary btn-mdn"><b>Registrar usuario</b></button></p>');
	$('#registroBtn').on('click',function(){
		if (comprobarInputRegistro()) {	
			var email=$('#emailInput').val();
			var password=$('#claveInput').val();
			registroUsuario(email,password);
		}
	});
}

function comprobarInputRegistro(){
	var email=$('#emailInput').val();
	var password=$('#claveInput').val();
	var ok=true;
	if (email=='') {
		$('#errorEmailText').removeClass('hidden');
		ok=false;
	} else {
		$('#errorEmailText').addClass('hidden');
	}
	if (password==''){
		$('#errorPasswordText').removeClass('hidden');
		ok=false;
	} else {
		$('#errorPasswordText').addClass('hidden');
	}
	return ok;
}

function comprobarInputActualizar(){
	var email=$('#emailInput').val();
	var passwordOld=$('#claveInputOld').val();
	var passwordNew=$('#claveInputNew').val();
	var ok=true;
	if (email=='') {
		$('#errorEmailText').removeClass('hidden');
		ok=false;
	} else {
		$('#errorEmailText').addClass('hidden');
	}
	if (passwordOld==''){
		$('#errorPasswordOldText').removeClass('hidden');
		ok=false;
	} else {
		$('#errorPasswordOldText').addClass('hidden');
	}
	if (passwordOld==''){
		$('#errorPasswordNewText').removeClass('hidden');
		ok=false;
	} else {
		$('#errorPasswordNewText').addClass('hidden');
	}
	return ok;
}

function modificarPerfil(){
	if ($.cookie('id')!=undefined) {
		$('#control').empty();
		$('#control').append('<div id="cabecera"><h2>Modificar usuario</h2><p><input type="text" class="form-control" id="emailInput" placeholder="'+$.cookie('email')+'">'+'<p class="bg-danger hidden" id="errorEmailText">Introduce un nombre de usuario o correo electrónico</p>');
		$('#control').append('</p><p><input type="password" class="form-control" id="claveInputOld" placeholder="contraseña actual"></p>'+'<p class="bg-danger hidden" id="errorPasswordOldText">Introduce la contraseña actual.</p>'+'<p class="bg-danger hidden" id="errorPasswordLoginText">contraseña incorrecta.</p>');
		$('#control').append('</p><p><input type="password" class="form-control" id="claveInputNew" placeholder="contraseña nueva"></p>'+'<p class="bg-danger hidden" id="errorPasswordNewText">Introduce una contraseña nueva.</p>');
		$('#control').append('<p><button type="button" id="actualizarBtn" class="btn btn-primary btn-mdn"><b>Guardar Cambios</b></button>'+'&nbsp;&nbsp;<button type="button" id="eliminarBtn" class="btn btn-danger btn-mdn"><b>Eliminar usuario</b></button></p>');
		$('#actualizarBtn').on('click',function(){
			if (comprobarInputActualizar()) {
				var email=$('#emailInput').val();
				var passwordOld=$('#claveInputOld').val();
				var passwordNew=$('#claveInputNew').val();
				actualizarUsuario(email,passwordOld,passwordNew);
			}
		});
		$('#eliminarBtn').on('click',function(){
			eliminarUsuario($.cookie('id'));
			reset();
		});
	} else {
		mostrarLogin();
	}
}

//Funciones de comunicación con el servidor

function crearUsuario(nombre){
	if (nombre==""){
		nombre="jugador";
	}
	$.getJSON(url+"crearUsuario/"+nombre,function(datos){
		$.cookie('email',datos.email);
		$.cookie('id',datos.id);
		$.cookie('nivel',datos.nivel);
		mostrarInfoJugador();
	});
	//mostrar datos
}

function comprobarUsuario(){
	var id=$.cookie('id');

	if (id!=undefined){
		$.getJSON(url+'comprobarUsuario/'+id,function(datos){
			if(datos.nivel<0){
				borrarCookies();
				mostrarLogin();
			} else {
				$.cookie('nivel',datos.nivel);
				mostrarInfoJugador();
			}
		});
	} else {
		mostrarLogin();
	}
}

function comunicarNivelCompletado(tiempo){
	var id=$.cookie("id");
	$.getJSON(url+'nivelCompletado/'+id+"/"+tiempo,function(datos){
			$.cookie("nivel",datos.nivel);
			mostrarInfoJugador();
	});	
}

function resetNiveles(){
	var id=$.cookie("id");
	$.getJSON(url+'resetNiveles/'+id,function(datos){
			$.cookie("nivel",datos.nivel);
			mostrarInfoJugador();
	});	
}

function obtenerResultados(){
	$.getJSON(url+'obtenerResultados/',function(datos){
			mostrarResultados(datos);
	});
}

function loginUsuario(email, password){
	$.ajax({
		type:'POST',
		url:'/login',
		data:JSON.stringify({email:email, password:password}),
		success:function(data){
			if(data.email==undefined){
				$('#errorLoginText').removeClass('hidden');
			} else {
				$.cookie('email',data.email);
				$.cookie('id',data._id);
				$.cookie('nivel',data.nivel);
				mostrarInfoJugador();
			}
		},
		contentType:'application/json',
		dataType:'json'
	});
}

function registroUsuario(email, password){
	$.ajax({
		type:'POST',
		url:'/signup',
		data:JSON.stringify({email:email, password:password}),
		success:function(data){
			if (data.email==undefined){
				//avisar del email no vale
				$('#errorRegistroText').removeClass('hidden');
			} else {
				$.cookie('email',data.email);
				$.cookie('id',data._id);
				$.cookie('nivel', data.nivel);
				//mostrarInfoJugador();
				mostrarLogin();
			}
		},
		contentType:'application/json',
		dataType:'json'
	});
}

function eliminarUsuario(id){
	$.ajax({
		type:'DELETE',
		url:'/eliminarUsuario/'+id,
		data:{},
		success:function(data){
			if (data.resultados<1){
				//avisar del email no vale
				$('#errorPasswordLoginText').removeClass('hidden');
				//mostrarRegistro();
			} else {
				reset();
			}
		},
		contentType:'application/json',
		dataType:'json'
	});
}

function actualizarUsuario(email, passwordOld, passwordNew){
	$.ajax({
		type:'POST',
		url:'/actualizarUsuario/',
		data:JSON.stringify({id:$.cookie('id'),email:email, passwordOld:passwordOld, passwordNew:passwordNew}),
		success:function(data){
			if (data.resultados<1){
				//avisar del email no vale
				$('#errorPasswordLoginText').removeClass('hidden');
				//mostrarRegistro();
			} else {
				$.cookie('email',email);
				//$.cookie('nivel',data.nivel);
				mostrarInfoJugador();
			}
		},
		contentType:'application/json',
		dataType:'json'
	});
}

function pedirNivel(){
	var uid=$.cookie("id");
	if(uid!=undefined){
		$.getJSON(url+"pedirNivel/"+uid,function(data){
			crearNivel(data);
		});
	}
}