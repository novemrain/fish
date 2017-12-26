
/**
	第三关 拥挤的海底
	
	在拥挤的海底 躲开各种鱼的夹击
*/
var method = require('method')

/**
	第四关 智擒大乌龟
	
	吃掉大乌龟之后获得胜利
	自己被鱼吃掉或大乌龟游出界时,游戏失败
	
	本关会有自动追击的鱼
*/

Levels[4].levelMethod = function(){
	//现在this是theFishGame
	
	this.randomMin = 0.01;

	this.AutoAddFish = function( elapsed ){
		//自动加鱼

		this.timer += elapsed;
		if( this.timer > this.timeout ){
			this.timer = 0;
			
			//两种从上到下的鱼
			var fish;
			
			if( Math.random() > 0.2 ){			
				fish = this.glass.AddFishEX( "blowfish" , undefined , {"x":Math.random()*this.glass.width - this.glass.halfWidth,"y":this.glass.halfHeight} , undefined , undefined , 2 , undefined );			
			}
			else{			
				fish = this.glass.AddFishEX( "blowfish" , undefined , {"x":Math.random()*this.glass.width - this.glass.halfWidth,"y":this.glass.halfHeight}  , undefined , undefined , 10 , method.Update_UpDownComeBack );
				
				/**Update_UpDownComeBack需要鱼有加速度属性a*/
				fish.a = 10;
			}
			
			fish.SetForward( 0 , -1 );
			//减肥鱼
			fish.eatType = "LOSEWEIGHT";
			//添加至数组
			this.fishes[ fish.Name ] = fish;		
		}
	}
	
	this.RandomAddFish = function(){
		//随即加鱼
		
		//先加一遍小鱼
		this.__proto__.RandomAddFish.apply( this , arguments );
		
		//第三关特色 加超大的乌龟
		var random = Math.random();
		
		if( random > 0.98 ){
			var fish = this.glass.AddFishEX( "redfish" );
			//添加至数组
			this.fishes[ fish.Name ] = fish;	
		}	
		if( random < 0.005 ){		
			var fish = this.glass.AddFishEX( "FishModelEX6" , undefined , undefined , Math.random() * this.glass.autoMass + this.glass.autoMass );
			
			fish.Update = method.Update_AutoChase;
			/*Update_UpDownComeBack需要鱼有加速度,速率上限和开关三个属性*/
			fish.a = Math.random() * 30;
			fish.vmax = Math.random() * 10 + 5;//5-15
			fish.autoChaseStarted = true;
			
			//添加至数组
			this.fishes[ fish.Name ] = fish;	
		}
	}
	//重写isWin 改变胜利条件
	this.isWin = function(){
		return this.win;// ? true : false;
	}
	
	//超级慢大乌龟
	var big = this.glass.AddFishEX( "tortoise" , "BIG" , {"x":-this.glass.halfWidth,"y":0} , this.glass.autoMass * 5 , undefined , 0.5 );
	this.fishes[ big.Name ] = big;
	
	//超级慢大乌龟不会增大,重写Eat方法
	big.Eat = function( who , position ){
		who.die = true;	
	}
	
	//重写(增加)大乌龟的出界函数 出界就输了
	big.Out = function(){
		//GameOver应在时间步的最后调用,保证所有鱼都会停住(目前在玩家鱼的更新中,可以实现)
		//theFishGame.GameOver();	
		this.myFish.die = true;
	}
	
	//给自己加一个吃了乌龟就赢的方法
	this.myFish.MyselfEat = function( who , position ){
		if( who.node.getName() == "BIG" ){
			this.win = true;		
		}
	}
}