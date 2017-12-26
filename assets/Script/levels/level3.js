
/**
	第三关 拥挤的海底
	
	在拥挤的海底 躲开各种鱼的夹击
*/
var method = require('method')
Levels[3].levelMethod = function(){
	//现在this是theFishGame
	
	this.randomMin = 0.02;

	this.AutoAddFish = function( elapsed ){
		//自动加鱼

		this.timer += elapsed;
		if( this.timer > this.timeout ){
			this.timer = 0;
			
			//两种从上到下的鱼
			var fish;
			
			if( Math.random() > 0.1 ){			
				fish = this.glass.AddFishEX( "blowfish" , undefined , {"x":Math.random()*this.glass.width - this.glass.halfWidth,"y":this.glass.halfHeight} ,undefined , undefined , 50 );			
			}
			else{			
				fish = this.glass.AddFishEX( "blowfish" , undefined , {"x":-Math.random()*this.glass.halfWidth,"y":this.glass.halfHeight}  , undefined , undefined , 80 , method.Update_UpDownComeBack );
				//速度动态改变的,需要加一个speed属性 TODO 后期需要改名(method.js)
				fish.a = 10;
			}
			var posy = this.glass.halfHeight + Util.getSize(fish.node).height / 2
			//console.log('BLOWFISH' , fish.node.position.y , posy)
			fish.node.setPositionY(posy)
			fish.SetForward( 0 , -1 );
			//减肥鱼
			fish.eatType = "LOSEWEIGHT";
			//添加至数组
			this.fishes[ fish.node.getName() ] = fish;		
		}
	}
	
	this.RandomAddFish = function(){
		//随即加鱼
		
		//先加一遍小鱼 TODO
		this.__proto__.RandomAddFish.apply( this , arguments );
		
		//第三关特色 加超大的乌龟
		var random = Math.random();
		
		if( random > 0.99 ){
			
			//( typename , name , pos , mass , layer , speed , update )
		
			var fish = this.glass.AddFishEX( "tortoise" , undefined , undefined , Math.random() * this.glass.autoMass * 1.2 + this.glass.autoMass , undefined , Math.random() * 10 + 5 );
			//添加至数组
			this.fishes[ fish.node.getName() ] = fish;	
		}
	}
}