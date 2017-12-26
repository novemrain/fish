/**
游戏主逻辑控制
关卡/结算相关
*/
var FishGame = cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
		window.root = this.node
		window.Game = this
		window.WinSize = cc.director.getWinSize()
		cc.game.setFrameRate(30)
		
        this.glass = this.node.getComponent('seafoodCreator')
		
		var manager = cc.director.getCollisionManager();
		manager.enabled = true;
		//是否绘制碰撞边界(debug)
		//manager.enabledDebugDraw = true;
		
		this.initGame()


		
		this.tortoise = this.node.getChildByName('tortoise')
		this.node.on("mousemove" , this.touchCallBack, this)
		this.node.on("touchend" , this.touchCallBack, this)
		this.node.on("touchmove" , this.touchCallBack, this)
    },
	touchCallBack:function(event){
		var loc = this.node.convertToNodeSpaceAR(event.getLocation()); 
		this.mousePosition = loc
	},

    // called every frame
    update: function (elapsed) {
		
		//选鱼的界面
		//if( this.gameUI.select.Visible == true && this.myFish ) this.Move( elapsed );	
		//安全返回仅当暂停时 返回true
		//if( this.pause == true ) return true;
		if( this.isGameOver ) return;
		if( !this.levelInitOver ) return;
		//动态加鱼
		this.AutoAddFish( elapsed );
		//随即加鱼
		this.RandomAddFish();
		//删除出界了的鱼
		this.RefreshFishes( elapsed );
		//移动鱼
		this.Move( elapsed );	
		//这里面会改变isGameOver 所以放在最后
		
		//this.gameUI.Update( elapsed );
		
		this.RefreshMySelf( elapsed );
	
    },
});

FishGame.prototype.initGame = function(){
	
	//玩家鱼,worldspace对象
	this.myFish;
	//鱼缸,worldspace对象
	this.glass;

	//控制自动加鱼
	this.timer = 0;
	//加鱼间隔时间
	this.timeout = 2;
	//电脑鱼数组
	this.fishes = {};
	//当前鼠标位置(游戏世界坐标)
	this.mousePosition = cc.v2( 0 , 0 );
	
	
	//玩家鱼当前速度
	this.v = cc.v2( 0 , 0 );
	//吃到多重算赢
	this.winmass = 2500;
	//当前关卡号
	this.level;
	//
	this.levelInitOver = false;
	//游戏是否结束标志
	this.isGameOver = false;
	
	//自动加鱼的类型
	this.autoFishTypeName = "tortoise";
	//随即加鱼的类型
	this.randomFishTypeName = "redfish";
	//随即加鱼的量
	this.randomMin = 0.01;
	//标识是否处于隐身状态
	this.isHiding;
	//隐身时间
	this.hideTime;
	
	//鼠标/触点是否在边缘
	this.edgeDistance = 5;
	this.edge = false;
	//当前是否处于暂停状态
	this.pause = false;
	
	//自己鱼动画的FPS
	this.myFishFPS = 5;
}




FishGame.prototype.AutoAddFish = function( elapsed ){
	//自动加鱼
	//自动按时间间隔(this.timeout)和this.autoFishTypeName从左右加鱼

	this.timer += elapsed;
	if( this.timer > this.timeout ){
		this.timer = 0;
		var fish = this.glass.AddFishEX( this.autoFishTypeName );
		//添加至数组
		cc.log('FishGame.prototype.AutoAddFish' , fish.node.getName())
		this.fishes[ fish.node.getName() ] = fish;		
	}
}
FishGame.prototype.RandomAddFish = function(){
	//随即加鱼 
	//默认加类型为randomFishTypeName的小鱼,this.randomMin为加小鱼的比例

	var random = Math.random();
	if( random < this.randomMin ){
		var fish = this.glass.AddFishEX( this.randomFishTypeName , undefined , undefined , 2 + random * 100 );
		//添加至数组
		cc.log('FishGame.prototype.RandomAddFish' , fish.node.getName())
		this.fishes[ fish.node.getName() ] = fish;	
	}
}
FishGame.prototype.RefreshFishes = function( elapsed ){
	//更新鱼
	var winSize = cc.director.getWinSize()
	var halfWidth = winSize.width / 2
	var halfHeight = winSize.height / 2
	
	for( var i in this.fishes ){		
		var fish = this.fishes[i];
		if( fish.die == true ){
			//清空鱼的worldspace
			var name = fish.node.getName();
			//从鱼缸中清除鱼
			//this.glass.RemoveSpace(fish.Name);	
			fish.Clear();
			//从程序中清除
			delete this.fishes[name];
			cc.log("FishGame.prototype.RefreshFishes delete die" , name)
			continue
		}		
		if( fish.growMass ){
			fish.Grow( fish.growMass );
			fish.growMass = 0;
		}		

		var posx = fish.node.position.x
		var posy = fish.node.position.y
		var size = Util.getSize(fish.node)//.getContentSize()
		if(posx > halfWidth + size.width / 2 
		|| posx < -halfWidth - size.width / 2 
		|| posy > halfHeight + size.height / 2
		|| posy < -halfHeight - size.height / 2
			){
			//出界了
			/**
				若有出界的相关处理函数,调用
				函数名定为Out
			*/
			if( fish.Out ) fish.Out();
			//同上
			
			var name = fish.node.getName();
			fish.Clear();
			//this.glass.RemoveSpace(fish.Name);			
			delete this.fishes[name];
			
			cc.log("FishGame.prototype.RefreshFishes delete out" , name)
			continue
		}
		
		fish.updatePosition(elapsed)
		if( fish.Update ) fish.Update( elapsed );
	}
}



FishGame.prototype.Clear = function(){
	//置位在哪置位都是一样的
	
	/** 待优化 依次清除屏幕上的鱼(包括自己的鱼)并delete掉其程序中的索引 可能有些多此一举 */
	
	for(var i in this.fishes)
	{
		this.fishes[i].node.destroy()
		delete this.fishes[i]
	}
		
	//置位
	this.levelInitOver = false;
	this.isGameOver = true;

}


FishGame.prototype.GetDirection = function(){
	//返回玩家鱼指向鼠标的方向
	var tempx = this.mousePosition.x - this.myFish.node.position.x;
	var tempy = this.mousePosition.y - this.myFish.node.position.y;
	var result = cc.pNormalize(cc.v2( tempx , tempy ));
	return result;
}
var rate = 20
FishGame.prototype.Move = function( elapsed ){
	
	//玩家移动方法
	
	//确定距离
	var fishpos = this.myFish.node.position;
	var distance = cc.pDistance( fishpos , this.mousePosition );
	//按鼠标指向转向
	var direction = this.GetDirection();
	//这个退出以后需要修改 当前是防止根据方向计算角度时,除数为0
	if( direction.x == 0 || direction.y == 0 )return;
	
	//转向
	this.myFish.SetForwardOnly( direction.x , direction.y );		
	if( distance > this.slowdownDistance ){
		//一般情况	
		//达到加速距离,或者在边界,则加速
		if( distance > this.speedUpDistance || this.edge ){
			//this.speedMAX = this.overSpeed;
			//this.a = this.overA;
			this.speedMAX = this.overSpeed;
			this.a = this.overA;
			//加速 更新fps
			//this.UpdateMyFishFPS( this.FPSMAX );
		}
		//加减速
		//this.v.x += elapsed * direction.x * this.a;
		//this.v.y += elapsed * direction.y * this.a;
		
		var v = cc.pMult(this.myFish.speedDirection , this.myFish.speedValue)
		v.x += elapsed * direction.x * this.a;
		v.y += elapsed * direction.y * this.a;
		
		//不能超限
		//这里以后可以改成平方的比较
		if( cc.pLength(v) > this.speedMAX  ){
			//超限了
			// this.v.Normalize();
			// this.v.x *= this.speedMAX;
			// this.v.y *= this.speedMAX;
			
			v = cc.pMult(cc.pNormalize(v) , this.speedMAX)
		}
		this.myFish.SetVByVector( v );	
	}
	else{
		//距离很近
		//减速系数
		this.speedMAX = 5 * rate;
		this.a = 20 * rate;
		
		//减速,更新fps
		//this.UpdateMyFishFPS( this.FPSMIN );
		
		var slowdownFactor = distance/this.slowdownDistance;		
		if( slowdownFactor < 0.2 ){
			//可以认为已经到了,停
			//this.v.SetZero();
			//this.myFish.SetVByVector( this.v );		
			this.myFish.SetVByVector( cc.v2(0,0) )
		}
		else{
			//减速朝目标前进
			// this.v.x = direction.x * slowdownFactor * this.speedMAX;
			// this.v.y = direction.y * slowdownFactor * this.speedMAX;
			// this.myFish.SetVByVector( this.v );
			
			this.myFish.SetVByVector(cc.v2( direction.x * slowdownFactor * this.speedMAX , 
											direction.y * slowdownFactor * this.speedMAX ))
		}	
	}
	//
	this.myFish.updatePosition(elapsed)
}

FishGame.prototype.ChangeMyFish = function( typename , isTry ){
	
	//更新自身鱼类型
	if( isTry ) this.myFishType = typename;//假改(用于玩家试的时候)
	else FishGame.prototype.myFishType = typename;//真改
	
	//先把当前自己的鱼 清理掉
	if( this.myFish ) {
	
		//清空鱼的worldspace
		this.myFish.Clear();
		//从鱼缸中清除鱼
		//this.glass.RemoveSpace( this.myFish.Name );	
	}
	
	//然后再加
	this.myFish = this.glass.AddMyFish( this.myFishType , {"x":0,"y":0} , 4 );
	
	//然后再改变相应的操作属性
	
	switch ( typename ){
	
		case "FishModelEX10" : {
			if( isTry ){
			this.slowdownDistance = 2 * rate;
			this.speedMAX = 5 * rate;
			this.a = 20 * rate;	
			this.overSpeed = 15 * rate;
			this.overA = 50 * rate;
			this.speedUpDistance = 10 * rate;
			}
			else{
			FishGame.prototype.slowdownDistance = 2 * rate;
			FishGame.prototype.speedMAX = 5 * rate;
			FishGame.prototype.a = 20 * rate;	
			FishGame.prototype.overSpeed = 15 * rate;
			FishGame.prototype.overA = 50 * rate;
			FishGame.prototype.speedUpDistance = 10 * rate;
			}
			
			break;
		}
		case "FishModelEX1" : {
			if( isTry ){
			this.slowdownDistance = 2;
			this.speedMAX = 5;
			this.a = 20;	
			this.overSpeed = 20;
			this.overA = 200;
			this.speedUpDistance = 5;
			}
			else{
			FishGame.prototype.slowdownDistance = 2;
			FishGame.prototype.speedMAX = 5;
			FishGame.prototype.a = 20;	
			FishGame.prototype.overSpeed = 20;
			FishGame.prototype.overA = 200;
			FishGame.prototype.speedUpDistance = 5;
			}
			
			break;
		}
	}
}

FishGame.prototype.InitLevel = function( level ){
	//重置
	this.RandomAddFish = FishGame.prototype.RandomAddFish
	this.AutoAddFish = FishGame.prototype.AutoAddFish
	this.initGame()
	
	//关卡信息
	var levelinfo = Levels[level];

	this.level = levelinfo.level;
	this.timeout = levelinfo.timeout;
	this.winmass = levelinfo.winmass;
	//更换背景音乐
	//this.gameSound.musicname = levelinfo.BGM;
	
	//创建出鱼缸对象,比如背景颜色之类的参数,由levelinfo提供
	//然后调用关卡中的函数,这样就可以改变game对象的行为和game.glass对象的行为
	//this.ChangeBackGround( levelinfo.BGTypename );
	//this.CreateGlass( levelinfo.glassTypename , Glass );
	/** 若要临时改变本关的鱼 (比如本关临时变成超级鱼,那么这些应家在levelMethod中) */
	this.ChangeMyFish( this.myFishType );
	

	if( levelinfo.levelMethod ) levelinfo.levelMethod.call( this );
	
	//UI对象
	//this.gameUI.task.UIObjects.Task.SetText( levelinfo.task );
	//this.gameUI.Init( this.level );
	UI.showLevel(levelinfo)

}
FishGame.prototype.ChangeLevel = function( level ){
	//先清空
	this.Clear();
	//初始化关卡
	this.InitLevel( level );

}
FishGame.prototype.ReplayLevel = function(){
	
	this.ChangeLevel( this.level );

}
FishGame.prototype.GoToNextLevel = function(){

	this.ChangeLevel( this.level+1 );
	
	//进入新的一关,播放音乐
	//若玩家跳关,则听不到
	//this.gameSound.PlayMusic();
}
FishGame.prototype.GameOver = function(){
	//游戏结束调用
	
	this.isGameOver = true;
	for( var i in this.fishes ){
		this.fishes[i].SetV(0);
	}	
	this.myFish.SetV(0);
	//alert("Game Over")
	//this.gameUI.Show("gameOver");	
	UI.lose()
}
FishGame.prototype.Win = function(){
	//玩家通关
	
	this.isGameOver = true;
	for( var i in this.fishes ){
		this.fishes[i].SetV(0);
	}	
	this.myFish.SetV(0);

	//显示提示信息
	//this.gameUI.Show("win");	
	//在win了之后要停止音乐的播放 下一关可能会换音乐
	//this.gameSound.StopMusic();
	
	UI.win()
}


FishGame.prototype.isDie = function(){
	return ( this.myFish.die == true );
}
FishGame.prototype.isWin = function(){
	return ( this.myFish.mass > this.winmass );
}
FishGame.prototype.RefreshMySelf = function( elapsed ){
	//玩家自身更新
	
	if( this.isDie() ){
		//玩家已经挂了
		this.GameOver();
		return;
	}		

	if( this.isWin() ){
		//玩家通关
		this.Win();
		return;
	}		
	if( this.myFish.growMass ){
		//grow
		var gm = this.myFish.growMass;
		this.myFish.Grow( this.myFish.growMass );
		this.myFish.growMass = 0;
		//grow完了之后 会重新创建鱼对象,为了保证动画FPS不变
		//this.UpdateMyFishFPS();
		
		//UI对象
		UI.setScore( Math.round( this.myFish.mass ) );
		
		UI.showBonus(Math.round( gm ) , this.myFish.node.position)
		//吃鱼的音效
		//this.gameSound.PlayEffect("e1");
	}
	
	//隐身检测
	//this.IsHide( elapsed );
	
	//当前玩家位置
	// var currentPos = this.myFish.node.position
	// (currentPos.x > WinSize.width / 2) && (this.myFish.node.position.x = WinSize.width)
	// (currentPos.x < -WinSize.width / 2) && (this.myFish.node.position.x = -WinSize.width)
	// (currentPos.y > WinSize.height / 2) && (this.myFish.node.position.y = WinSize.height)
	// (currentPos.y < -WinSize.height / 2) && (this.myFish.node.position.y = -WinSize.height)
}


