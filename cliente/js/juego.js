
var player;
var platforms;
var cursors;
var cielo;

var stars;
var meteoritos;
var score = 0;
var scoreText;
var timer;
var tiempo=0;
var tiempoText;
var explosions;
var liveText;

var maxNiveles=4;
var ni;
var level = 0;

var s;
var music;

inicializarCoordenadas();

function crearNivel(data){
   /* ni=parseInt(nivel);
    if(ni<maxNiveles)
    {
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'juegoId', { preload: preload, create: create, update: update });
    }
    else{
        noHayNiveles();
    }*/
    if(data.nivel<0){
        noHayNiveles();
    }else{
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'juegoId', { preload: preload, create: create, update: update, render: render});
        nivel=data.id;
        coord=data.coordenadas;
        gravedad=data.gravedad;
    }
}
    

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('sky1', 'assets/sky1.jpg');
    game.load.image('sky2', 'assets/sky2.jpg');
    game.load.image('sky3', 'assets/sky3.jpg');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('ground2', 'assets/ground2.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude5.png', 32, 48);
    game.load.spritesheet('dude2', 'assets/dude8.png', 32, 48);
    game.load.spritesheet('dude3', 'assets/dude6b.png', 32, 48);
    game.load.spritesheet('dude4', 'assets/dude6a.png', 32, 48);
    game.load.image('heaven', 'assets/heaven.png');
    game.load.image('meteorito', 'assets/meteorito.png');
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);

    game.load.audio('boden', ['assets/audio.mp3', 'assets/audio.ogg']);
    game.load.audio('boden1', ['assets/salto.mp3', 'assets/salto.ogg']);
    game.load.audio('boden2', ['assets/explosion.mp3', 'assets/explosion.ogg']);
    game.load.audio('boden3', ['assets/cantina.mp3', 'assets/cantina.ogg']);
    game.load.audio('boden4', ['assets/pelea.mp3', 'assets/pelea.ogg']);
    game.load.audio('boden5', ['assets/marcha.mp3', 'assets/marcha.ogg']);
}

function noHayNiveles() {
        alert('No hay niveles');
}

function create() {

        //level=0;

        if(level>=4)
        {
            level=0;
        }
        
        //console.log(player.nivel);

        console.log(level);
        if (level == 0)
        {
            game.add.sprite(0, 0, 'sky');
        }
        else if (level == 1)
        {
            game.add.sprite(0, 0, 'sky1');
        }
        else if (level == 2)
        {
            game.add.sprite(0, 0, 'sky2');
        }
        else
        {
            game.add.sprite(0, 0, 'sky3');
        }



        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);



        //Audio
        music = game.add.audio('boden');
        music1 = game.add.audio('boden1');
        music2 = game.add.audio('boden2');
        music3 = game.add.audio('boden3');
        music4 = game.add.audio('boden4');
        music5 = game.add.audio('boden5');
        music.play();
        game.input.onDown.add(changeVolume, this);


        if (level == 1)
        {
            music.stop();
            music3.play();

        }
        if (level == 2)
        {
            music.stop();
            music5.play();

        }
        if (level == 3)
        {
            music.stop();
            music4.play();

        }
        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();
        heaven = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;
        heaven.enableBody = true;

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');
        var end = heaven.create(0,-15,'heaven');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);
        end.scale.setTo(2,1);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;
        //end.body.immovable = true;

        //  Now let's create two ledges
        for(var i=0;i<coord.length;i++){
            ledge = platforms.create(coord[i][0],coord[i][1], 'ground2');
            ledge.body.immovable = true;            
        }
        /*var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(350, 200, 'ground2');
        ledge.body.immovable = true;*/


     
        
            // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');
        player.vidas=4;

        

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        //  Finally some stars to collect
        stars = game.add.group();
        meteoritos = game.add.group();

        //  We will enable physics for any star that is created in this group
        stars.enableBody = true;
        meteoritos.enableBody = true;
    /****/
        stars.physicsBodyType = Phaser.Physics.ARCADE;
        //meteoritos.physicsBodyType = Phaser.Physics.ARCADE;

        //game.physics.arcade.enable(platforms);
        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++)
        {
            //  Create a star inside of the 'stars' group
            //var star = stars.create(i * 70, 0, 'star');
            var meteorito = meteoritos.create(i * 70, 0, 'meteorito');

            //  Let gravity do its thing
            //star.body.gravity.y = 300;
            meteorito.body.gravity.y = 250;

            //  This just gives each star a slightly random bounce value
            //star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        //  The score
        //scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        
        
            scoreText = game.add.text(16, 22, 'Vidas: 4', { fontSize: '32px', fill: '#FFFF00' });
        
        

        tiempoText=game.add.text(game.world.width-170,22,'Tiempo:0',{ fontSize: '32px', fill: '#FFFF00' });
        tiempo=0;
        timer=game.time.events.loop(Phaser.Timer.SECOND,updateTiempo,this);

        
       

        explosions = game.add.group();
        explosions.createMultiple(30, 'kaboom');
        explosions.forEach(setupMeteorito, this);
        function setupMeteorito(met){
            //met.anchor.x = 0.5;
            //met.anchor.y = 0.5;
            met.scale.setTo(0.3,0.3);
            met.animations.add('kaboom');
        }

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();


        
}

function update() {

        //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms);
        //game.physics.arcade.collide(stars, platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        game.physics.arcade.overlap(player, stars, collectStar, null, this);
        game.physics.arcade.overlap(player, meteoritos, collectMeteorito, null, this);
        game.physics.arcade.overlap(player, heaven, endNivel, null, this);
        game.physics.arcade.overlap(platforms, meteoritos, muereMeteorito, null,this);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -200;

            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 200;

            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }
        
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -270;
        }

}

function updateTiempo(){
    tiempo++;
    tiempoText.setText('Tiempo: '+tiempo);
}

function changeVolume(pointer) {

    if (pointer.y < 100)
    {
        music.mute = false;
    }
    else if (pointer.y < 300)
    {
        music.volume += 0.1;
    }
    else
    {
        music.volume -= 0.1;
    }

}

function render() {
   // game.debug.soundInfo(music, 20, 32);
}



function collectStar (player, star) {
        
        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        score += 10;
        scoreText.text = 'Score: ' + score;
}

function collectMeteorito (player, meteorito) {
        
        

        // Removes the star from the screen
        meteorito.kill();

        //  Add and update the score
        /*score += 10;
        scoreText.text = 'Score: ' + score;*/
        player.vidas=player.vidas-1;

         

        scoreText.text = 'Vidas: ' + player.vidas;
        if (player.vidas==0){
            player.kill();
            game.time.events.remove(timer);
            reiniciarNivel();
        }

        
             player.loadTexture('dude2');
        this.game.time.events.add(75,function(){player.loadTexture('dude');});
        this.game.time.events.add(150,function(){player.loadTexture('dude2');});
        this.game.time.events.add(225,function(){player.loadTexture('dude');});
        this.game.time.events.add(300,function(){player.loadTexture('dude2');});
        this.game.time.events.add(375,function(){player.loadTexture('dude');});
        

        
}

function endNivel (player, heaven) {
    player.kill();
    game.time.events.remove(timer);
    nivelCompletado(tiempo, player.vidas);
    level = level+1;
}

function muereMeteorito(platform,meteorito){
    var explosion = explosions.getFirstExists(false);
    explosion.reset(meteorito.body.x, meteorito.body.y);
    explosion.play('kaboom', 80, false, true);
    //music2.play();
    //music1.stop();
    meteorito.kill();
    lanzarMeteorito(50);

}


function lanzarMeteorito(gravedad){
            
    var i=Math.floor((Math.random()*(game.world.width-2)+1));
    //  Create a meteorito inside of the 'meteoritos' group
    var meteorito = meteoritos.create(i, 60, 'meteorito'); //i*70,0

    //  Let gravity do its thing
    meteorito.body.gravity.y = gravedad+200;

    //  This just gives each meteorito a slightly random bounce value
    //meteorito.body.bounce.y = 0.7 + Math.random() * 0.2;
     meteorito.checkWorldBounds = true;
}