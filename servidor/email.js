
/*
var url="http://127.0.0.1:5000/";
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

module.exports.enviarEmail=function(direccion,key){
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
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://jygarza@gmail.com:pass@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Fred Foo ?" <foo@blurdybloop.com>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plaintext body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});