var Objs = {
    EnemiesDirection: [],
    Enemies: [],
    Square: null,
    Title: null,
    gameTime: null,
    gameTimeInfo: null,
    gameTimeTotal: null,
    gameBestInfo: null,
    gameBestValue: null,
    gameInfo1: null,
    gameInfo2: null}

var timePlayed = 0;
var isAlive = false;
function moveSquare(destination){
    var size = cc.director.getWinSize();
    if((destination.x > 0 ) && (destination.x < size.width))
        if((destination.y > 0) && (destination.y < size.height))
            Objs.Square.setPosition(destination);
}

function gameStart(){
    isAlive = true;
    timePlayed = 0;
    Objs.Title.setVisible(false);
    Objs.gameTimeInfo.setVisible(false);
    Objs.gameTimeTotal.setVisible(false);
    Objs.gameBestInfo.setVisible(false);
    Objs.gameBestValue.setVisible(false);
    Objs.gameInfo1.setVisible(false);
    Objs.gameInfo2.setVisible(false);
}

function gameOver(){
    isAlive = false;
    Objs.Title.setVisible(true);
    Objs.gameTimeInfo.setVisible(true);
    Objs.gameTimeTotal.setVisible(true);
    Objs.gameBestInfo.setVisible(true);
    Objs.gameBestValue.setVisible(true);
    Objs.gameInfo1.setVisible(true);
    Objs.gameInfo2.setVisible(true);

    Objs.gameTimeTotal.setString(timePlayed.toFixed(3));

    Objs.Square.setPosition(cc.p(400, 225));
    Objs.Enemies[0].setPosition(cc.p(100, 100));
    Objs.Enemies[1].setPosition(cc.p(700, 100));
    Objs.Enemies[2].setPosition(cc.p(700, 350));
    Objs.Enemies[3].setPosition(cc.p(100, 350));

    var bestTime = parseFloat(Objs.gameBestValue.getString());
    if(timePlayed > bestTime){
        localStorage.setItem("bestTime", timePlayed);
        Objs.gameBestValue.setString(timePlayed.toFixed(3));
    }


}
var GameLayer = cc.Layer.extend({
    ctor:function () {
        // 1. super init first
        this._super();

        var eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved});

        this.addSquares();
        this.addTexts();

        cc.eventManager.addListener(eventListener, Objs.Square);

        for(var i = 0; i < 4; i++)
            Objs.EnemiesDirection[i] = this.generateDirection();

        this.scheduleUpdate();
        return true;
    },

    update: function(dt){
        if(!isAlive)
            return;
        timePlayed += dt;
        Objs.gameTime.setString(timePlayed.toFixed(3));

        var size = cc.director.getWinSize();

        for(var i = 0; i < 4; i++){
            var pos = Objs.Enemies[i].getPosition();

            if((pos.x <= 0) || (pos.x >= size.width))
                Objs.EnemiesDirection[i] = cc.p(Objs.EnemiesDirection[i].x * -1, Objs.EnemiesDirection[i].y)
            if((pos.y <= 0) || (pos.y >= size.height))
                Objs.EnemiesDirection[i] = cc.p(Objs.EnemiesDirection[i].x, Objs.EnemiesDirection[i].y * -1)
            Objs.Enemies[i].setPosition(cc.pAdd(Objs.EnemiesDirection[i], pos));

        }
        this.checkCollision();

    },

    checkCollision: function(){
        var rectHero = cc.rect(Objs.Square.getPositionX() - Objs.Square.getContentSize().width/2*Objs.Square.getScaleX(),
                Objs.Square.getPositionY() - Objs.Square.getContentSize().height/2*Objs.Square.getScaleY(),
                Objs.Square.getContentSize().width*Objs.Square.getScaleX(),
                Objs.Square.getContentSize().height*Objs.Square.getScaleY());

        for(var i =0; i < 4; i++){
            var rectEnemy = cc.rect(Objs.Enemies[i].getPositionX() - Objs.Enemies[i].getContentSize().width/2*Objs.Enemies[i].getScaleX(),
                    Objs.Enemies[i].getPositionY() - Objs.Enemies[i].getContentSize().height/2*Objs.Enemies[i].getScaleY(),
                    Objs.Enemies[i].getContentSize().width*Objs.Enemies[i].getScaleX(),
                    Objs.Enemies[i].getContentSize().height*Objs.Enemies[i].getScaleY());
            if(cc.rectIntersectsRect(rectHero, rectEnemy)) {
                gameOver();
                return;
            }
        }

    },

    onTouchBegan: function(touch, event){
        var target = event.getCurrentTarget();
        var PosInScreen = target.convertToNodeSpace(touch.getLocation());
        var Size = target.getContentSize();
        var rect = cc.rect(0, 0, Size.width, Size.height);

        if(cc.rectContainsPoint(rect, PosInScreen)){
            switch(target.getTag()){
                case 1:
                    if(!isAlive){
                        gameStart();
                        moveSquare(cc.p(400, 225));
                    }
                    return true;
            }
        }
        return false;
    },

    onTouchMoved: function(touch, event){
        var target = event.getCurrentTarget();
        var PosInScreen = target.convertToNodeSpace(touch.getLocation());
        var Size = target.getContentSize();
        var rect = cc.rect(0, 0, Size.width, Size.height);
        if(!isAlive)
            return;


        if(cc.rectContainsPoint(rect, PosInScreen)){
            switch(target.getTag()){
                case 1:
                    moveSquare(touch._point);
                    return true;
            }
        }
        return false;

    },

    addTexts: function(){
        var bestTime = localStorage.getItem("bestTime");
        Objs.Title = cc.LabelTTF.create("Slide & Survive", res.TitleFont, 40);
        Objs.Title.setPosition(cc.p(400, 350));
        this.addChild(Objs.Title);

        Objs.gameTime = cc.LabelTTF.create("0.000", res.TitleFont, 20);
        Objs.gameTime.setPosition(cc.p(50, 10));
        this.addChild(Objs.gameTime);

        Objs.gameTimeInfo = cc.LabelTTF.create("Time: ", res.TitleFont, 26);
        Objs.gameTimeInfo.setPosition(cc.p(200, 225));
        this.addChild(Objs.gameTimeInfo);

        Objs.gameTimeTotal = cc.LabelTTF.create("0.000", res.TitleFont, 26);
        Objs.gameTimeTotal.setPosition(cc.p(300, 225));
        this.addChild(Objs.gameTimeTotal);

        Objs.gameBestInfo = cc.LabelTTF.create("Best time: ", res.TitleFont, 26);
        Objs.gameBestInfo.setPosition(cc.p(540, 225));
        this.addChild(Objs.gameBestInfo);

        Objs.gameBestValue = cc.LabelTTF.create(bestTime ? parseFloat(bestTime).toFixed(3) : "0.000", res.TitleFont, 26);
        Objs.gameBestValue.setPosition(cc.p(650, 225));
        this.addChild(Objs.gameBestValue);

        Objs.gameInfo1 = cc.LabelTTF.create("Move the green square avoiding contact with the red ones!",
            res.TitleFont, 20);
        Objs.gameInfo1.setPosition(cc.p(400, 310));
        this.addChild(Objs.gameInfo1);

        Objs.gameInfo2 = cc.LabelTTF.create("Are you able to do it???",
            res.TitleFont, 20);
        Objs.gameInfo2.setPosition(cc.p(440, 290));
        this.addChild(Objs.gameInfo2);

    },

    addSquares: function(){
        Objs.Square = cc.Sprite.create(res.Square_png);
        Objs.Square.setPosition(cc.p(400,225));
        Objs.Square.setTag(1);

        this.addChild(Objs.Square);

        var En = Objs.Enemies;
        for(var i = 0; i < 4; i++) {
            En[i] = cc.Sprite.create(res.Enemy_png);
            this.addChild(En[i]);
        }
        En[0].setPosition(cc.p(100, 100));

        En[1].setPosition(cc.p(700, 100));
        En[1].setScaleX(1.7);
        En[1].setScaleY(0.4);

        En[2].setPosition(cc.p(700, 350));
        En[2].setScaleX(0.4);
        En[2].setScaleY(1.5);

        En[3].setPosition(cc.p(100, 350));
        En[3].setScale(0.8);

        Objs.Enemies = En;

    },

    generateDirection: function(){
        var i = Math.floor((Math.random() * 3));
        var v = 7;
        switch (i){
            case 0:
                return cc.p(v, v);
            case 1:
                return cc.p(-v, v);
            case 2:
                return cc.p(-v, -v);
            case 3:
                return cc.p(v, -v);
        }
        return cc.p(0, 0);
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

