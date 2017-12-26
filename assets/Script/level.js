//
var Level = function( l , t , /*sd , sm , a ,*/ wm , bg , g , /*my ,*/ task , bgm ){
	//当前关卡号
	this.level = l;
	//

	//加鱼间隔时间
	this.timeout = t;
	
	//减速距离
	//this.slowdownDistance = sd;
	//玩家鱼的最大速率
	//this.speedMAX = sm;
	//玩家鱼加速度大小
	//this.a = a;
	
	//吃到多重算赢
	this.winmass = wm;
	//背景图片名
	this.BGTypename = bg;
	
	this.glassTypename = g;
	
	//this.myFishTypename = my;

	this.levelMethod;
	//本关任务,字符串
	this.task = task;
	
	this.BGM = bgm;

}
window.Levels = {};
var task1 = "Level_1 Learn to Fish!\n\nTask:try_to_get_10_points";
Levels[1] = new Level( 1 , 2 , /*2 , 5 , 20 ,*/ 10 , "BackGround" , "Glass" ,  task1 , "BGMusic" );

var task2 = "Level_2 Get Bigger!\n\nTask:try_to_get_200_points";
Levels[2] = new Level( 1 , 2 , /*2 , 5 , 20 ,*/ 200 , "BackGround2" , "Glass" ,  task2 , "BGM2" );

var task3 = "Level_3 Crowded Subway\n\nTask:try_to_get_200_points\n\nTake care of the Turtles";
Levels[3] = new Level( 3 , 2 , /*2 , 5 , 20 ,*/ 200 , "BackGround2" , "Glass" ,  task3 , "BGMusic" );

var task4 = "Level_4 Big Turtle\n\nTask:eat_the_Big-Turtle\n\nMaybe somebody gonna chase you\n\nTake Care!";
Levels[4] = new Level( 4 , 2 , /*2 , 5 , 20 ,*/ 5 , "BackGround2" , "Glass" ,  task4 , "BGMusic" );

var task5 = "Level_5 Kill the Monster!\n\nTask:kill_the_Monster-Fish\n\nmoster fish is so DANGEROUS!\n\nBut something can make you hide";
Levels[5] = new Level( 5 , 5 , /*2 , 5 , 20 ,*/ 50 , "BackGround2" , "Glass" ,  task5 , "BGMusic" );

var task6 = "Level_6 Hold for 1 minute!\n\nTask:Hold on for a minute\n\ntry your best";
Levels[6] = new Level( 6 , 2 , /*2 , 5 , 20 ,*/ 50 , "BackGround2" , "Glass" , task6 , "BGMusic" );

var task7 = "Level_7 Do it Again!\n\nTask:Hold on for a minute\n\nDo it Again!";
Levels[7] = new Level( 7 , 60 , /*2 , 5 , 20 ,*/ 50 , "BackGround2" , "Glass" ,  task7 , "BGMusic" );

var task8 = "Level_8 Endless Rain\n\nTask:Hold on for a minute\n\nDo it Again!";
Levels[8] = new Level( 8 , 60 , /*2 , 5 , 20 ,*/ 50 , "BackGround2" , "Glass" ,  task8 , "BGMusic" );

var task9 = "Level_9 Water Jump\n\nTask:Hold on for a minute\n\nDo it Again!";
Levels[9] = new Level( 9 , 2 , /*2 , 5 , 20 ,*/ 50 , "BackGround9" , "Glass" ,  task9 , "BGMusic" );

var taskEX1 = "Level_1 How much point can u get!\n\nTask:get_more_points";
Levels[11] = new Level( 1 , 60 , 100 , "BackGround" , "Glass" ,  taskEX1 , "BGMusic" );



Levels[2].levelMethod = function(){
	//现在this是theFishGame
	
	//this.randomFishTypeName = "FishModelEX10";
	
	this.RandomAddFish = function(){
		//随即加鱼

		var random = Math.random();
		
		if( random > 0.99 ){
			var fish = this.glass.AddFishEX( "uglyfish" , undefined , undefined , this.glass.autoMass );
			//添加至数组
			this.fishes[ fish.node.getName() ] = fish;	
		}
		
		if( random < 0.03 ){
			var fish = this.glass.AddFishEX( this.randomFishTypeName , undefined , undefined , 2 );
			//添加至数组
			this.fishes[ fish.node.getName() ] = fish;	
		}
	}

}



var MatchInfo = function( t , p , m , s , turned , update ){
	
	this.typeName = t;
	this.pos = p;
	this.mass = m;
	if( s < 0 )System.PrintInfo("\nSpeed can't be <0");
	this.speed = s;
	this.turned = turned;
	this.update = update;

}


var MatchInfoEX = function( t , p , m , s , turned , update , init ){
	
	this.typeName = t;
	this.pos = p;
	this.mass = m;
	if( s < 0 )System.PrintInfo("\nSpeed can't be <0");
	this.speed = s;
	this.turned = turned;
	this.update = update;
	this.init = init;
}






