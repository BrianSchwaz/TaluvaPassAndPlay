
function drawScreen() {
	var prevWidth = context.lineWidth;
	var prevstyle = context.strokeStyle;
	context.lineWidth="3";
	context.strokeStyle= "black";
	context.rect(0,0,200,600);
	context.stroke();
	//context.lineWidth = prevWidth;
	//context.strokeStyle = prevstyle;
	context.fillStyle="#FFC300";
	context.fillRect(0,0,200,600);
	/*context.font =  "23px Arial";
	shadowOn();
	context.fillStyle = playerColor[playerTurn - 1];
	context.fillText("Player"+ playerTurn + "'s Turn",25,50);
	shadowOff();*/
	drawPlayerTurn()
	context.font =  "16px Arial";
	context.fillStyle = "black";
	context.fillText("remaining: " + tilesRemaining,50,200);
	context.shadowBlur = 0;
	context.shadowOffsetY = 0;
	context.shadowOffsetX = 0;
	stationary = 1;
	if(tilesRemaining > 0)
		drawTriHex(100,300,size,color1,color2,0,0);
	stationary = 0;
} 

function drawSelection(x,y)
{
	context.lineWidth=3;
	context.lineCap = 'square';
	context.beginPath();
	context.moveTo(hex_cornerX(x,y,size,0),hex_cornerY(x,y,size,0));
	for (var i = 1; i <= 5; i++) {
		context.lineTo(hex_cornerX(x,y,size,i),hex_cornerY(x,y,size,i));
	}
	context.strokeStyle = "white";
	context.closePath();
	context.stroke();
	context.font =  "20px Arial";
	context.fillStyle = "black";
	shadowOff();
	context.fillText("Press Backspace to change building selection",50,100);
}

function drawComponents()
{
	drawBackground();
	drawScreen();
	drawHoldingTriHex();
	//console.log("row " + row);
	//console.log("col " + col);
}

function drawHoldingTriHex()
{
	if(isHolding)
	{
		shadowOn();
		/*if(mouseX >=250)
		{*/
		//overMap = 1;
		stagger = size;
		position = findValidPosition();
		validPos = position.valid;
		row = position.row;
		col = position.col;
		findPlacements();
		if(colorGrid[row][col].level > 0)
		{
			validPos = validEruption(coordinates);
			//console.log(validPos);
		}
		if(flipped == 1)
		{
			drawTriHex(position.x,position.y - stagger,size,lastColor1,lastColor2,volcano,flipped,1);
		}
		else
		{
			drawTriHex(position.x,position.y + stagger,size,lastColor1,lastColor2,volcano,flipped,1);
		}
		//drawScreen();
		/*}
		else
		{
			overMap = 0;
			validPos = 0;
			stagger = size;
			if(flipped == 1)
			{
				stagger *= -1;
			}
			drawTriHex(mouseX - startX,mouseY - startY + stagger,size,lastColor1,lastColor2,volcano,flipped,1);
		}*/
		context.font =  "20px Arial";
		context.fillStyle = "black";
		shadowOff();
		context.fillText("Use A to rotate and S to flip tile",50,100);
	}
	shadowOff();
}

function drawBackground()
{	
	stationary = 1;
	context.clearRect(0,0,theCanvas.width,theCanvas.height);
	context.fillStyle=EMPTYCOLOR;
	context.fillRect(0,0,theCanvas.width,theCanvas.height);
	//draw top hex
	//-50s are to start mapping of hexes off the screen;
	//console.log(rows);
	for(var i = 0; i < rows;i++)
	{
		checkY = offY + i * 1.5 * size;
		for(var j = 0; j < columns; j++)
		{
			if(i % 2 == 0)
			{
				checkX = offX + j * xIncrement/2 - size;
			}
			else
			{
				checkX = offX - (xIncrement/4) + j * xIncrement/2 - size;
			}
			drawHex(checkX,checkY,size,colorGrid[i][j].color,colorGrid[i][j].lavaX,colorGrid[i][j].lavaY,0);
			context.font =  "12px Arial";
			if(colorGrid[i][j].level > 0)
			{
				context.fillStyle = "black";
				context.fillText("L" + colorGrid[i][j].level,checkX - size/4,checkY - size/3);
			}
			//console.log("player" + playerTurn);
			context.fillStyle = playerColor[colorGrid[i][j].playerOwner - 1];
			if(colorGrid[i][j].huts > 0)
			{
				context.fillText("Huts:" + colorGrid[i][j].huts,checkX - size/2,checkY);
			}
			else if(colorGrid[i][j].temple == 1)
			{
				context.fillText("Temple",checkX - size/2,checkY);
			}
			else if(colorGrid[i][j].tower == 1)
			{
				context.fillText("Tower",checkX - size/2,checkY);
			}
		}
	}
	drawPlayerTurn();
	stationary = 0;
}

function shadowOn()
{
  	context.shadowOffsetX=20;
	context.shadowOffsetY=20;
	context.shadowColor='black';
	context.shadowBlur=30;
}

function shadowOff()
{
  	context.shadowOffsetX=0;
	context.shadowOffsetY=0;
	context.shadowBlur=0;
}

function drawBuildingPanel()
{
	var prevWidth = context.lineWidth;
	var prevstyle = context.strokeStyle;
	context.lineWidth="2";
	context.strokeStyle= "black";
	context.rect(0,0,200,600);
	context.stroke();
	context.lineWidth = prevWidth;
	context.strokeStyle = prevstyle;

	context.fillStyle="#FFC300";
	context.fillRect(0,0,200,600);
	context.font =  "16px Arial";
	context.fillStyle = "black";
	context.fillText("Huts: " + huts[playerTurn - 1],50,125);
	context.fillText("Temples: " + temples[playerTurn - 1],50,225);
	context.fillText("Towers: " + towers[playerTurn - 1],50,325);
	context.fillText("Expand Settlement",50,425);
  	drawHut(hutPos[0],hutPos[1],80,60);
  	drawTemple(templePos[0],templePos[1],50,50);
  	drawTower(towerPos[0],towerPos[1],50,50);
  	drawExpandSettlement(expandSettlementPos[0],expandSettlementPos[1],50,50);
  	drawPlayerTurn();
}

function drawHut(x,y,scaleWidth,scaleHeight)
{
	var hutImage = new Image();
  	hutImage.src = "hut.png";
  	hutImage.onload = function(e)
  	{
		context.drawImage(hutImage,x,y,scaleWidth,scaleHeight);
	}
}

function drawTemple(x,y,scaleWidth,scaleHeight)
{
	var templeImage = new Image();
  	templeImage.src = "temple.png";
  	templeImage.onload = function(e)
  	{
		context.drawImage(templeImage,x,y,scaleWidth,scaleHeight);
	}
}

function drawTower(x,y,scaleWidth,scaleHeight)
{
	var towerImage = new Image();
  	towerImage.src = "tower.png";
  	towerImage.onload = function(e)
  	{
		context.drawImage(towerImage,x,y,scaleWidth,scaleHeight);
	}
}

function drawExpandSettlement(x,y,scaleWidth,scaleHeight)
{
	var expandSettlementImage = new Image();
	expandSettlementImage.src = "hammer.png";
	expandSettlementImage.onload = function(e)
	{
		context.drawImage(expandSettlementImage,x,y,scaleWidth,scaleHeight);
	}
}

function drawPlayerTurn()
{
	context.lineWidth="6";
	if(playerTurn < 3)
	{
		context.strokeStyle= "white";
	}
	else
	{
		context.strokeStyle= "black";
	}
	context.rect(20,20,155,50);
	context.stroke();
	context.fillStyle= playerColor[playerTurn - 1];
	context.fillRect(20,20,155,50);
	context.font =  "23px Arial";
	//shadowOn();
	if(playerTurn < 3)
	{
		context.fillStyle= "white";
	}
	else
	{
		context.fillStyle= "black";
	}
	//context.fillStyle = "black";
	context.fillText("Player"+ playerTurn + "'s Turn",25,50);
	shadowOff();
}
