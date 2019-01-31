var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
    this.active = false;
}

Animation.prototype.rowMode = function(){
    this.totalTime = this.frameDuration * this.sheetWidth;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.active = true;
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop){
            this.elapsedTime = 0;
        } else {
            this.active = false;
        }
        
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.drawFrameFromRow = function (tick, ctx, x, y, row) {
    this.active = true;
    this.elapsedTime += tick;
    if (this.isDone()) {
        if(this.frames == 28) console.log("done");
        if (this.loop){
            this.elapsedTime = 0;
        } else {
            this.active = false;
        }
        
    }
    var frame = this.currentFrameFixedRow();
    // var imgheight =  (this.frames/this.sheetWidth)*this.frameHeight;
    var yidx = this.frameHeight*row;
    ctx.drawImage(this.spriteSheet,
                frame * this.frameWidth, yidx,  // source from sheet
                this.frameWidth, this.frameHeight,
                x, y,
                this.frameWidth * this.scale,
                this.frameHeight * this.scale);
}


Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

//take sprites from one particular row
Animation.prototype.currentFrameFixedRow = function () {
    return Math.floor(this.elapsedTime / this.frameDuration)%this.sheetWidth;
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function Camera(game, obj, background, width, height){
    this.game = game;
    this.ctx = game.ctx;
    var center = obj.center();
    this.obj = obj;
    this.background = background;
    this.worldWidth=width;
    this.worldHeight=height;
    this.frameWidth = this.ctx.canvas.width;
    this.frameHeight = this.ctx.canvas.height;
    this.x =  0;
    this.y = 0;
    console.log(`width ${this.frameWidth}, height ${this.frameHeight}`);
}

Camera.prototype.update = function(){
    this.x = this.obj.x - this.frameWidth/2;
    this.y = this.obj.y - this.frameHeight/2;
}

Camera.prototype.draw = function() {
    document.getElementById("debug-out2").innerHTML = `Camera: x-${this.x}, y-${this.y}`;

    this.ctx.drawImage(this.background, this.x, this.y, this.frameWidth, this.frameHeight, 0, 0, this.frameWidth, this.frameHeight);		
}





// function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
AM.queueDownload("./img/crosshair.png");
AM.queueDownload("./img/castle_hall.png");
AM.queueDownload("./img/charwalk.png");
AM.queueDownload("./img/charstand.png");
AM.queueDownload("./img/charshoot_loop.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    canvas.onclick = function() {
        canvas.requestPointerLock();
    };
    var gameEngine = new GameEngine();
    
    
    gameEngine.init(ctx);
    var player = new Player(gameEngine, AM.getAsset("./img/charwalk.png"), AM.getAsset("./img/charshoot_loop.png"), AM.getAsset("./img/charstand.png"));
    var camera = new Camera(gameEngine, player, AM.getAsset("./img/castle_hall.png"), 2688, 1392);
    gameEngine.start(player, camera);
    // gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/castle_hall.png")));
    gameEngine.addEntity(player);
    gameEngine.addEntity(new Crosshair(gameEngine, AM.getAsset("./img/crosshair.png")));
    console.log("All Done!");
});