cc.Class({
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
		Util.bindButton(this.btnOK , this.panelCallBack.bind(this))
		Util.bindButton(this.btnCancel , this.panelCallBack.bind(this))
		Util.bindButton(this.btnSelect1 , this.selectCallBack.bind(this))
		Util.bindButton(this.btnSelect2 , this.selectCallBack.bind(this))
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
	
	panelCallBack: function(event){
		var rtn = event.target == this.btnOK ? true : false
		console.log( rtn ? 'ok' : 'cancel')
		
		if(rtn)
		{
			//TODO
			//Game.levelInitOver = true
			Game.myFishType = 'FishModelEX10'
			Game.InitLevel(1) 
		}
		this.node.destroy()
	},
	
	selectCallBack: function(event){
		var rtn = event.target == this.btnSelect1 ? 1 : 2
		console.log( rtn )
		
		//TODO
	},
});
