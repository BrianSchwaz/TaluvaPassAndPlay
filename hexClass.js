class Hex{
	
	constructor(color,lavaX,lavaY,lavaRow,lavaCol,level,huts,tower,temple,settlement,playerOwner)
	{
		this.color = color;
		this.lavaX = lavaX; //index col of lava flow
		this.lavaY = lavaY; //index row of lava flow
		this.lavaRow = lavaRow;
		this.lavaCol = lavaCol; 
		this.level = level;
		this.huts = huts;
		this.tower = tower;
		this.temple = temple;
		this.settlement = []; //keeps track of fields adj part of same settlement
		this.playerOwner = playerOwner;
		if(this.color == undefined)
			this.color = 0;
		if(this.lavaX == undefined)
			this.lavaX = 0;
		if(this.lavaY == undefined)
			this.lavaY = 0;
		if(this.lavaRow == undefined)
			this.lavaRow = 0;
		if(this.lavaCol == undefined)
			this.lavaCol = 0;
		if(this.level == undefined)
			this.level = 0;
		if(this.huts == undefined)
			this.huts = 0;
		if(this.tower == undefined)
			this.tower = 0;
		if(this.temple == undefined)
			this.temple = 0;
		if(this.playerOwner == undefined)
			this.playerOwner = 0;
	}
}