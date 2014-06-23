var Objs = {
    EnemiesDirection: [],
    Enemies: [],
    Square: null,
    Title: null,
    gameTitle: null,
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
                        isAlive = true;
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
        Objs.Title = cc.LabelTTF.create("Slide & Survive", res.TitleFont, 40);
        Objs.Title.setPosition(cc.p(400, 350));
        this.addChild(Objs.Title);

        Objs.gameTime = cc.LabelTTF.create("0.000", res.TitleFont, 20);
        Objs.gameTime.setPosition(cc.p(50, 10));
        this.addChild(Objs.gameTime);

        Objs.gameTimeInfo = cc.LabelTTF.create("Time: ", res.TitleFont, 26);
        Objs.gameTimeInfo.setPosition(cc.p(230, 225));
        this.addChild(Objs.gameTimeInfo);

        Objs.gameTimeTotal = cc.LabelTTF.create("0.000", res.TitleFont, 26);
        Objs.gameTimeTotal.setPosition(cc.p(300, 225));
        this.addChild(Objs.gameTimeTotal);

        Objs.gameBestInfo = cc.LabelTTF.create("Best time: ", res.TitleFont, 26);
        Objs.gameBestInfo.setPosition(cc.p(540, 225));
        this.addChild(Objs.gameBestInfo);

        Objs.gameBestValue = cc.LabelTTF.create("0.000", res.TitleFont, 26);
        Objs.gameBestValue.setPosition(cc.p(640, 225));
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

