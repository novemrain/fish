var NodePool = require('NodePool')
cc.Class({
    extends: cc.Component,

    properties: {
        tortoise: {
            default: null,
            type: cc.Node
        },
		redfish: {
            default: null,
            type: cc.Node
        },
        blowfish: {
            default: null,
            type: cc.Node
        },
		uglyfish: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
		
		this.display = this.node.getChildByName('display')
		
        //定义鱼缸中心和边界
		//this.center = new JSB2Vec2( 0 , 0 );
		this.height = cc.director.getWinSize().height
		this.width = cc.director.getWinSize().width
		this.halfHeight = this.height / 2;
		this.halfWidth = this.width / 2
		//鱼的姓名标号
		this.temp = 0;
		this.autoMass = 30;
		
		
    },

		
	AddMyFish : function( typename , pos , mass ){
		//加鱼(目前只用于加玩家自己)
		// var Place = new JS2DThingPlace();
		// Place.TypeName = "Fish";
		// Place.x = pos.x;
		// Place.y = pos.y;
		// Place.Name = "MyFish";
		// Place.Type = Place.TCombination;
		// Place.Layer = 50;
		// var fish = this.Create2DThing(Place);
		// fish.Init( typename , mass );
		// fish.Create(pos.x,pos.y,0);
		// return fish;
		
		
		var fish = cc.instantiate(this.tortoise)
		fish.active = true
		var fishCls = fish.getComponent('seafood')
		fish.setName("MyFish")
		//fish.position = cc.p(pos.x , pos.y)
		fish.parent = this.display		
		fishCls.Init( typename , mass , pos);
		return fishCls;

	},
	AddFishEX : function( typename , name , pos , mass , layer , speed , update ){
		cc.log('AddFishEX' , typename , name , pos , mass , layer , speed , update)
		
		//加鱼(电脑)
		
		//1.设置外观 根据typename,和鱼的重量(决定scale)
		//2.设置属性 初始位置,速度,重量
		//3.设置行为 即赋值鱼对象的update方法
		
		
		//默认加进来的鱼方向朝左
		var needtoturn = false;	
		//缺省值 用于电脑加鱼
		
		//if( typename == undefined ) typename = "FishModelEX2";
		
		if( name == undefined ) name = "fish"+(this.temp++);
		if( pos == undefined ){
			pos = {};
			var random = Math.random() - 0.5;		
			if( random > 0 ) { pos.x = this.halfWidth;needtoturn = true;}
			else pos.x = -this.halfWidth;
			//重新获取随机值
			random = Math.random()-0.5;
			pos.y = random * this.height;	
		}
		if( mass == undefined ) {
			mass = this.autoMass * Math.random();
			if( mass < 1 ) mass = 1;
			if( mass > this.autoMass * 0.9 ) mass *= 2;
		}
		if( layer == undefined ){
			/** 这里给一下默认层号,即重量越大的层号越低,鱼的层号在40-50之间 */
			//layer = 50-(mass/10);
			//if(layer<40)layer = 40;
			layer = 10;
		}

		//create worldspace
		// var Place = new JS2DThingPlace();
		// Place.TypeName = "Fish";
		// Place.x = pos.x;
		// Place.y = pos.y;
		// Place.Name = name;
		// Place.Type = Place.TCombination;
		// Place.Layer = layer;
		// var fish = this.Create2DThing(Place);
		
		var fish = NodePool.get(NodePool.keys.FISH , typename)
		cc.log('AddFishEX from' , typename , fish == null ? 'instantiate' : 'pool')
		if(fish == null){
			
			fish = cc.instantiate(this[typename])
		}
		fish.active = true
		var fishCls = fish.getComponent('seafood')
		fish.setName(name)
		//fish.position = cc.p(pos.x , pos.y)
		fish.parent = this.display
		
		/** 该鱼转过 */
		fishCls.turned = !!needtoturn;
		fish.setScaleX(needtoturn ? -1 : 1)
		
		fishCls.Init( typename , mass , pos);
		//以上创建的是fish的worldspace
		//fish.Create(pos.x,pos.y,0,typename);

		
		//设置速度
		if( speed == undefined ){
			//缺省值
			speed = Math.random() * fishCls.VMAX;
			if( speed < fishCls.VMIN ) speed = fishCls.VMIN;
			if( speed > fishCls.VMAX * 0.9 ) speed *= 2;	
				
		}
		
		//绑定更新函数
		if( update )fishCls.Update = update;
		
		//if( needtoturn ) speed = -speed;
		//fishCls.SetV( speed );
		
		cc.log('seafood creator' , speed , name)
		fishCls.speedDirection = cc.v2(needtoturn ? -1 : 1 , 0)
		
		//保存鱼的初始速率
		fishCls.speedValue = Math.abs( speed );

		return fishCls;

	}
});