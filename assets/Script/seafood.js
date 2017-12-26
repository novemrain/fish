

const SCALE_RATE = 2
var NodePool = require('NodePool')
var seafood = cc.Class({
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
		baseScale: {
            default: 1,
            type: Number
        },
    },

    // use this for initialization
    onLoad: function () {
		
		//鱼的最大最小速度
		this.VMAX = 100;
		this.VMIN = 20;
		//this.flipped = false;

		this.mass;
		this.typename;
		this.type;
		//(最大)速率
		this.speed;
		
		this.speedValue = 0
		this.speedDirection = cc.v2(1,0)
		cc.log('seafood.onLoad')
    },
	
	setScale:function(scale){
		scale = scale * this.baseScale
		Util.setScale(this.node , scale)
	},
	setScaleX:function(scale){
		scale = scale * this.baseScale
		this.node.__proto__.setScaleX(scale)
	},
	setScaleY:function(scale){
		scale = scale * this.baseScale
		this.node.__proto__.setScaleY(scale)
	},
    // called every frame, uncomment this function to activate update callback
	// 改为updatePosition 由game对象统一调用
    updatePosition: function (dt) {
		var pos = this.node.getPosition()
		pos.x += this.speedDirection.x * this.speedValue * dt
		pos.y += this.speedDirection.y * this.speedValue * dt
		//console.log(pos)
		this.node.position = pos
    },
	
	onCollisionEnter: function (other, self) {
		console.log('onCollisionEnter' , self.tag);
		if(self.tag == 0) return
		
		console.log('on collision enter' , this.node.getName() , arguments);
		
		var otherCls = other.node.getComponent(seafood)
		//唯一标识这次碰撞是否要吃
		var eat = false;
		
		if( this.mass > otherCls.mass ){
			eat = true;
		}
		//还应该加上重量相等的情况
		else if( this.mass == otherCls.mass && this.node.getName() > otherCls.node.getName()){
			eat = true;
		}
		//如果要吃的话
		if( eat ){
			
			//吃!
			var position = self.offset
			this.Eat( otherCls , position );
			
			/**
				这里可以判断一下是不是自己
				如果是自己
				调用一下胜负判定(判定函数每一关都不一样)
			
			*/
			
			if( this.node.getName() == "MyFish" ){
				//调用自身鱼的回调函数
				if( this.MyselfEat )
					this.MyselfEat( otherCls , position );	
			}
		}
	
	
	

		// 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
		var world = self.world;

		// 碰撞组件的 aabb 碰撞框
		var aabb = world.aabb;

		// 上一次计算的碰撞组件的 aabb 碰撞框
		var preAabb = world.preAabb;

		// 碰撞框的世界矩阵
		var t = world.transform;

		// 以下属性为圆形碰撞组件特有属性
		var r = world.radius;
		var p = world.position;

		// 以下属性为 矩形 和 多边形 碰撞组件特有属性
		var ps = world.points;
	},
	reset:function(){
		this.speedValue = 0
		this.speedDirection = cc.v2(1,0)
		this.a = null
		this.turned = null
		this.scale = 1
		this.Update = null
		this.eatType = null
		this.die = false
	},
});

seafood.prototype.Clear = function(){
	cc.log("seafood.prototype.Clear" , this.node.getName())
	this.reset()
	NodePool.put(NodePool.keys.FISH , this.typename , this.node)
	//this.node.destroy()
}
seafood.prototype.SetV = function(v){
	//以v大小沿着当前方向运动
	// var body = this.Members.Body.b2Body;
	// var angle = body.GetAngle();
	// var b2v = new JSB2Vec2();
	// b2v.Set( v * Math.cos(angle), v * Math.sin(angle));
	// body.SetLinearVelocity(b2v);
	// return b2v;
	this.speedValue = v
}
seafood.prototype.SetVByVector = function( b2v ){
	//var body = this.Members.Body.b2Body;
	//body.SetLinearVelocity( b2v );
	this.speedDirection = cc.pNormalize(b2v)
	this.speedValue = cc.pLength(b2v)
}
seafood.prototype.SetForward = function(x,y)
{
	/** 需要考虑x==0,除法错误 */
	this.SetForwardOnly( x , y );
	this.speedDirection = cc.v2(x , y)
	//重置速度(调转了方向)
	//this.SetV( this.Members.Body.b2Body.GetLinearVelocity().Length() );
}
seafood.prototype.SetForwardOnly = function(x,y)
{
	// var body = this.Members.Body.b2Body;
	if( x != 0 ){
		var angle = Math.atan(y/x);
		if (x<0)
			angle+=3.1415926;	
	}
	else{
		if(y>0) angle = 3.1415926/2;
		else angle = 3.1415926*3/2;
	}
	if( this.turned ) angle += 3.1415926;
	// var tsf = body.GetTransform();	
	// //翻转物体
	// body.SetTransform(tsf.p, angle);
	//cc.log(cc.radiansToDegrees(angle))
	this.node.setRotation(-cc.radiansToDegrees(angle))
}
seafood.prototype.SetForwardEX = function(a)
{
	var body = this.Members.Body.b2Body;
	var angle = body.GetAngle();
	angle+=a;
	if( this.turned ) angle += 3.1415926;
	var tsf = body.GetTransform();	
	body.SetTransform(tsf.p, angle);

}

seafood.prototype.Init = function( typename , mass , pos){
	var winHeight = cc.director.getWinSize().height
	this.typename = typename;
	this.mass = mass;
	
	var scale = this.mass>0? Math.sqrt(this.mass): 1;
	//Util.setScale(this.node , scale / SCALE_RATE)
	this.setScale(scale / SCALE_RATE)
	
	var fishSize = Util.getSize(this.node)
	var posxDelta = this.node.scaleX < 0 ? fishSize.width * 0.5 : fishSize.width * -0.5
	var posy = Math.min(pos.y , winHeight/2 - fishSize.height/2)
	posy = Math.max(posy , -winHeight/2 + fishSize.height/2)
	this.node.position = cc.p(pos.x + posxDelta , posy)
}

seafood.prototype.Eat = function( who , position ){
	//所有鱼的通用 吃 方法
	//减肥鱼互相之间不碰撞
	if(who.eatType == "LOSEWEIGHT" && this.eatType == "LOSEWEIGHT")return
	var growMass = who.mass;
	//有些"减肥鱼"导致 越吃越少
	if( who.eatType == "LOSEWEIGHT" ){
		growMass *= (-1);
	}
	else if(who.eatType == "NOGROW"){
		growMass = 0;
	}
	else{
		growMass = Math.sqrt( growMass );
	}
	/**
		可以考虑在这里加上一种eatType
		让鱼吃了之后体重不发生变化
		比如吃天线宝宝的时候
	*/
	if( this.eatType == "LOSEWEIGHT" ){
		//减肥鱼就别长了
		growMass = 0
	}
	
	
	this.growMass = growMass;
	//被吃的死了
	who.die = true;
	
	
	cc.log("\nPosition_"+position.x+" "+position.y);

}

seafood.prototype.Grow = function(mass){	
	//自增重
	this.mass += mass;
	// var body = this.Members.Body.b2Body;
	// //保留当前的速度角度位置
	// var v = body.GetLinearVelocity();//.Length();
	// var angle = body.GetAngle();
	// var pos = body.GetPosition();
	// //删了
	// this.Clear();
	// //重建
	// this.ReCreate(pos.x, pos.y, this.type,angle , v );
	
	var scale = this.mass>0? Math.sqrt(this.mass): 1;
	//Util.setScale(this.node , scale / SCALE_RATE)
	this.setScale(scale / SCALE_RATE)
}

// this.Create = function (x,y, type , extra ){
	// var Place = new JS2DThingPlace();	
	// Place.TypeName = this.typename;	
	// Place.scale = this.mass>0? Math.sqrt(this.mass): 1;
	// Place.x = x;
	// Place.y = y;
	// Place.Name = "Body";
	// Place.Type = Place.TModel;
	// //Place.Layer = 10;
	// Place.Layer = ( 50 - this.mass / 10 > 40 ) ? ( 50 - this.mass / 10 ) : 40;
	
	// var fishmodel = this.Create2DThing(Place);
	
	// if(!fishmodel.Shapes)cc.log("\n\n"+this.typename);
	
	// //默认Shape0就是鱼头,只给鱼头加了碰撞响应方法
	// fishmodel.Shapes.Shape0.OnBeginContact = OnBeginContact;
	// this.type = type;
	// //this.mass = mass;
	
	// if( extra ){
		
		// switch( extra ){
		
			// case "FishModelEX4":{
			
				// this.SetForward( 0 , -1 );
				// //减肥鱼
				// this.eatType = "LOSEWEIGHT";
				
				// fishmodel.Shapes.Shape0.OnBeginContact = function( who , position ){
				
					// if( who.Name == "Sensor" ) return;
					// //两个LOSEWEIGHT碰到一起 干脆别碰撞了
					// if( who.BodySpace.WorldSpace.eatType == "LOSEWEIGHT" ) return;
					// //唯一标识这次碰撞是否要吃
					// var eat = false;
					
					// if( this.BodySpace.WorldSpace.mass > who.BodySpace.WorldSpace.mass ){
						// eat = true;
					// }
					// //还应该加上重量相等的情况
					// else if( this.BodySpace.WorldSpace.mass == who.BodySpace.WorldSpace.mass ){
						// if( this.BodySpace.WorldSpace.Name > who.BodySpace.WorldSpace.Name ){
						
							// eat = true;
						// }
					// }
					// //如果要吃的话
					// if( eat ){
						// this.BodySpace.WorldSpace.Eat( who , position );
					// }
					// else{
						// //被吃
						// who.BodySpace.WorldSpace.Eat( this , position );
					// }
				// }
				
				// break;
			// }
			
			
			// case "AllStar2":{
			
				// this.SetForward( 0 , -1 );
				// //减肥鱼
				// //this.eatType = "LOSEWEIGHT";
				// this.Members.Body.Shapes.Shape0.Name = "Sensor";
				
				// fishmodel.Shapes.Shape0.OnBeginContact = function( who , position ){
				
					// if( who.Name == "Sensor" ) return;
					
					// if( who.BodySpace.WorldSpace.Name == "MyFish" ){
						// //如果碰到了我自己的鱼,就加分
						
						// theFishGame.currentPoint = 1;
						
						// //theFishGame.point += 1;
						// //theFishGame.gameUI.Show( "point" , {text:theFishGame.point,color:0xffffffff/*,scale:Math.sqrt(theFishGame.point)*/} );
						
						// this.BodySpace.WorldSpace.die = true;
					// }

				// }
				
				// break;
			// }
			
			// case "FishModelEX7":{
			
				// this.Members.Body.Shapes.Shape0.Name = "Sensor";
				
				// fishmodel.Shapes.Shape0.OnBeginContact = function( who , position ){
				
					// if( who.Name == "Sensor" ) return;
					
					// if( who.BodySpace.WorldSpace.Name == "MyFish" ){
						// //如果碰到了我自己的鱼,就加分
						
						// theFishGame.currentPoint = -1;
						
						// //theFishGame.point -= 1;
						// //theFishGame.gameUI.Show( "point" , {text:theFishGame.point,color:0xffff0000/*,scale:Math.sqrt(theFishGame.point)*/} );
						
						// this.BodySpace.WorldSpace.die = true;
					// }

				// }
				
				// break;
			// }
			
			
			// case "LOSEWEIGHT":{
			
				// fishmodel.Shapes.Shape0.OnBeginContact = function( who , position ){
				
					// if( who.Name == "Sensor" ) return;
					// //两个LOSEWEIGHT碰到一起 干脆别碰撞了
					// if( who.BodySpace.WorldSpace.eatType == "LOSEWEIGHT" ) return;
					// //唯一标识这次碰撞是否要吃
					// var eat = false;
					
					// if( this.BodySpace.WorldSpace.mass > who.BodySpace.WorldSpace.mass ){
						// eat = true;
					// }
					// //还应该加上重量相等的情况
					// else if( this.BodySpace.WorldSpace.mass == who.BodySpace.WorldSpace.mass ){
						// if( this.BodySpace.WorldSpace.Name > who.BodySpace.WorldSpace.Name ){
						
							// eat = true;
						// }
					// }
					// //如果要吃的话
					// if( eat ){
						// this.BodySpace.WorldSpace.Eat( who , position );
					// }
					// else{
						// //被吃
						// who.BodySpace.WorldSpace.Eat( this , position );
					// }
				// }
				
				// break;
			
			// }
		
		// }
	
	// }
	
	// return fishmodel;
// }
// this.ReCreate = function (x,y, type, angle , speed ){	
	// var fishmodel = this.Create( x , y , type ,this.eatType);
	
	// var body = fishmodel.b2Body;
	// var tsf = body.GetTransform();	
	// //翻转物体
	// body.SetTransform(tsf.p, angle);
	// body.SetLinearVelocity(speed);
// }
// this.TurnAround = function(){

	// //var typename = this.typename;
	// //换模型
	// if( this.typename.substr( this.typename.length - 1 ) == "_" ) this.typename -= "_";
	// else this.typename += "_";
	// //速度反向
	// var body = this.Members.Body.b2Body;
	// var v = body.GetLinearVelocity();
	// v.x *= -1;
	// v.y *= -1;
	
	// var angle = body.GetAngle();
	// //angle *= -1;
	
	// var pos = body.GetPosition();
	// //删了
	// this.Clear();
	// //重建
	// this.ReCreate(pos.x, pos.y, this.type,angle , v );
	// //cc.log("\nHelloWorld");
	

// }

// this.GetPos = function(){
	// return this.Members.Body.b2Body.GetPosition();
// }

// this.g = this.Grow;
// this.go = this.SetV;
// this.to = this.SetForward;


