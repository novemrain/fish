var GameUI = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
		Util.bindChildren(this.node , this)
		this.display = this.node.getChildByName('ui')
		window.UI = this
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

GameUI.prototype.win = function(bonus , pos){
	var panel = Util.instant(this.panelWin)
	panel.parent = this.display
}
GameUI.prototype.lose = function(){
	var panel = Util.instant(this.panelLose)
	panel.parent = this.display
}
GameUI.prototype.showBonus = function(bonus , pos){
	var scale = 1+2*Math.abs( bonus )/100;
	//(scale<1)&&(scale = 1);
	(scale>3)&&(scale = 3);
	
	var label = cc.instantiate(this.lbBonus)
	label.active = true
	label.parent = this.display
	label.scale = scale
	label.position = pos
	label.getComponent(cc.Label).string = bonus
	var white = cc.color(255,255,255)
	var red = cc.color(255,0,0)
	label.setColor(cc.color(bonus > 0 ? white : red))
	label.runAction(cc.sequence(cc.fadeOut(1) , cc.callFunc(function(){
		label.destroy()
	})))
}
GameUI.prototype.setScore = function(score){
	var scale = 1.2
	var label = this.lbScore
	label.getComponent(cc.Label).string = score
	label.runAction(cc.sequence(cc.scaleTo(0.2 , scale) , cc.scaleTo(0.2 , 1)))
}
GameUI.prototype.showLevel = function(info){
	var panel = Util.instant(this.panelLevel)
	panel.parent = this.display
	Util.bindChildren(panel , panel)
	panel.lbDesc.getComponent(cc.Label).string = info.task
	Util.bindButton(panel.btnOK , function(){
		panel.destroy()
		//
		Game.levelInitOver = true
		Game.isGameOver = false
	})
	
	Util.bindButton(panel.btnPrevious , function(){
		cc.log('~~~')
	})
	Util.bindButton(panel.btnNext , function(){
		cc.log('~~~')
	})
}