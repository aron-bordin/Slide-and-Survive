
var GameLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        // 1. super init first
        this._super();

        // ask director the window size
        var size = cc.director.getWinSize();

        this.addSquares();
        this.addTexts();

        var EnemiesDirection = [];
        for(var i = 0; i < 4; i++)
            EnemiesDirection[i] = this.generateDirection();



        return true;
    },

    addTexts: function(){
        var Title = cc.LabelTTF.create("Slide & Survive", res.TitleFont, 40);
        Title.setPosition(cc.p(400, 350));
        this.addChild(Title);

        var gameTime = cc.LabelTTF.create("0.000", res.TitleFont, 20);
        gameTime.setPosition(cc.p(50, 10));
        this.addChild(gameTime);

        var gameTimeInfo = cc.LabelTTF.create("Time: ", res.TitleFont, 26);
        gameTimeInfo.setPosition(cc.p(230, 225));
        this.addChild(gameTimeInfo);

        var gameTimeTotal = cc.LabelTTF.create("0.000", res.TitleFont, 26);
        gameTimeTotal.setPosition(cc.p(300, 225));
        this.addChild(gameTimeTotal);

        var gameBestInfo = cc.LabelTTF.create("Best time: ", res.TitleFont, 26);
        gameBestInfo.setPosition(cc.p(540, 225));
        this.addChild(gameBestInfo);

        var gameBestValue = cc.LabelTTF.create("0.000", res.TitleFont, 26);
        gameBestValue.setPosition(cc.p(640, 225));
        this.addChild(gameBestValue);

        var gameInfo1 = cc.LabelTTF.create("Move the green square avoiding contact with the red ones!",
            res.TitleFont, 20);
        gameInfo1.setPosition(cc.p(400, 310));
        this.addChild(gameInfo1);

        var gameInfo2 = cc.LabelTTF.create("Are you able to do it???",
            res.TitleFont, 20);
        gameInfo2.setPosition(cc.p(440, 290));
        this.addChild(gameInfo2);

    },

    addSquares: function(){
        var Square = cc.Sprite.create(res.Square_png);
        Square.setPosition(cc.p(400,225));
        Square.setTag(1);
        this.addChild(Square);

        var Enemies = [];
        for(var i = 0; i < 4; i++) {
            Enemies[i] = cc.Sprite.create(res.Enemy_png);
            this.addChild(Enemies[i]);
        }
        Enemies[0].setPosition(cc.p(100, 100));

        Enemies[1].setPosition(cc.p(700, 100));
        Enemies[1].setScaleX(1.7);
        Enemies[1].setScaleY(0.4);

        Enemies[2].setPosition(cc.p(700, 350));
        Enemies[2].setScaleX(0.4);
        Enemies[2].setScaleY(1.5);

        Enemies[3].setPosition(cc.p(100, 350));
        Enemies[3].setScale(0.8);



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

