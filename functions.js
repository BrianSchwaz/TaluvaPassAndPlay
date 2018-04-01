var colorGrid = makeDoubleArray(rows,columns);

function nextTurn()
{
	if(tilesRemaining != 0)
	{
		updatePlayerTurn();
		stage = 0;
		drawBackground();
		drawScreen();
	}
	if(gameOver() == true)
	{
		displayWinner();
	}
}

function hutsWin()
{
	for(var i = 0; i < rows;i++)
	{
		for(var j = 0; j < columns;j++)
		{
			if(colorGrid[i][j].huts > 0)
			{
				scores[colorGrid[i][j].playerOwner - 1] += colorGrid[i][j].huts;
			}
		}
	}
	return greatestScore();
}

function towerWin()
{
	for(var i = 0; i < rows;i++)
	{
		for(var j = 0; j < columns;j++)
		{
			if(colorGrid[i][j].tower == 1)
			{
				scores[colorGrid[i][j].playerOwner - 1] += 1;
			}
		}
	}
	if(checkTie() == true)
	{
		return hutsWin();
	}
	return greatestScore();
}

function templeWin()
{
	for(var i = 0; i < rows;i++)
	{
		for(var j = 0; j < columns;j++)
		{
			if(colorGrid[i][j].temple == 1)
			{
				scores[colorGrid[i][j].playerOwner - 1] += 1;
			}
		}
	}
	if(checkTie() == true)
	{
		return towerWin();
	}
	return greatestScore();
}

function greatestScore()
{
	var maxScore = 0;
	var maxPlayer = 0;
	for(var i = 0; i < players; i++)
	{
		if(scores[i] > maxScore)
		{
			maxScore = scores[i];
			maxPlayer = i + 1;
		}
	}
	return maxPlayer;
}

function checkTie()
{
	var maxScore = 0;
	var isTie = false;
	for(var i = 0; i < players; i++)
	{
		if(scores[i] > maxScore)
		{
			maxScore = scores[i];
			isTie = false;
		}
		else if(scores[i] == maxScore)
		{
			isTie = true;
		}
	}
	return isTie;
}

function finalTemples(playerWinner)
{
	var totalTemples = 0;
	for(var i = 0; i < rows;i++)
	{
		for(var j = 0; j < columns;j++)
		{
			if(colorGrid[i][j].playerOwner == playerWinner && colorGrid[i][j].temple == 1)
			{
				 totalTemples += 1;
			}
		}
	}
	return totalTemples;
}
function finalTowers(playerWinner)
{
	var totalTowers = 0;
	for(var i = 0; i < rows;i++)
	{
		for(var j = 0; j < columns;j++)
		{
			if(colorGrid[i][j].playerOwner == playerWinner && colorGrid[i][j].tower == 1)
			{
				 totalTowers += 1;
			}
		}
	}
	return totalTowers;
}

function finalHuts(playerWinner)
{
	var totalHuts = 0;
	for(var i = 0; i < rows;i++)
	{
		for(var j = 0; j < columns;j++)
		{
			if(colorGrid[i][j].playerOwner == playerWinner && colorGrid[i][j].huts > 0)
			{
				 totalHuts += colorGrid[i][j].huts;
			}
		}
	}
	return totalHuts;
}

function displayWinner()
{
	if(placedBuildings() == false)
	{
		winner = templeWin();
	}
	context.strokeStyle = "black";
	console.log("placedBuildings was true");
	context.fillStyle="#FFC300";
	context.fillRect(250,50,400,300);
	context.textAlign = "center";
	context.font =  "30px Lucida Console";
	context.fillStyle = playerColor[winner - 1];
	context.fillText("Player " + winner + " wins!",450,100);
	context.font =  "15px Lucida Console";
	context.fillText("Temples: " + finalTemples(winner) + "   Towers: " + finalTowers(winner) + "   Huts: " + finalHuts(winner),450,125);
	console.log(winner);
	var textHeight = 150;
	for(var i = 1; i <= players; i++)
	{
		if(i != winner)
		{
			context.fillStyle = playerColor[i - 1];
			context.fillText("Player " + i + ":",450,textHeight);
			textHeight += 25;
			context.fillText("Temples: " + finalTemples(i) + "   Towers: " + finalTowers(i) + "   Huts: " + finalHuts(i),450,textHeight);
			textHeight += 25;
		}
	}
	gameEnded = true;
	/*****************************************************************************CONTINUE************************************************************/
}

function placeHut()
{
	huts[playerTurn - 1] -= 1;
	colorGrid[row][col].playerOwner = playerTurn;
	colorGrid[row][col].huts += 1;
}

function placeTemple()
{
	temples[playerTurn - 1] -= 1;
	colorGrid[row][col].playerOwner = playerTurn;
	colorGrid[row][col].temple = 1;
}

function placeTower()
{
	towers[playerTurn - 1] -= 1;
	colorGrid[row][col].playerOwner = playerTurn;
	colorGrid[row][col].tower = 1;
}

function updatePlayerTurn()
{
	playerTurn = (playerTurn % players) + 1;
	if(contains(eliminated,playerTurn))
	{
		updatePlayerTurn();
	}
}

//stage 0 is placement stage 1 is buildings
function updateStage()
{
	stage = (stage + 1) % 3;
}

function makeDoubleArray(d1, d2) {
    var arr = new Array(d1), i, l;
    for(i = 0, l = d2; i < l; i++) {
        arr[i] = new Array(d1);
    }
    return arr;
}

function calcVolcano()
{
	var volcanoIndex = volcano;
	var c1Index = (volcano + 1) % 3;
	var c2Index = (volcano + 2) % 3;

	c[volcano] = VOLCANOCOLOR;
	c[c1Index] = colors[lastColor1];
	c[c2Index] = colors[lastColor2];
}

function makeEmptyColor()
{
	for(var i = 0;i<rows;i++)
	{
		for(var j= 0;j<columns;j++)
		{
			colorGrid[i][j] = new Hex(EMPTYCOLOR);
		}
	}
}

function build()
{
	drawBackground();
	var position = findValidPosition();
	row = position.row;
	col = position.col;
	drawSelection(position.x,position.y);
}

function toPixels(row,col)
{
	var pixelY = row * 1.5 * size -10;
	var pixelX;
	if(row % 2 == 0)
	{
		pixelX = col * xIncrement/2 - size -10;
	}
	else
	{
		pixelX = col * xIncrement/2 - size - xIncrement/4 -10;
	}
	return {
		x: pixelX,
		y: pixelY,
	}
}

function genNewTile()
{
	if(tilesRemaining > 0)
	{
		do
		{
			color1 = Math.floor(Math.random() * (5));
			color2 = Math.floor(Math.random() * (5));
		}while(tiles[color1][color2] == 0);
	}
}

function getLavaFlow()
{
	var towards = (volcano + 2) % 3;
	var lavaR = coordinates[towards * 2];
	var lavaC = coordinates[towards * 2 + 1];
	return {
		lavaRow :lavaR,
		lavaCol : lavaC,
	}
}

	
function hex_cornerX(x,y,size, i){
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return x + size * Math.cos(angle_rad);
}
		
function hex_cornerY(x,y,size, i){
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return y + size * Math.sin(angle_rad);
}

function distance(x1,y1,x2,y2)
{
	return Math.sqrt(Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2));
}

function isOver()
{
	for(var i = 0;i < 3;i++)
	{
		if(colorGrid[coordinates[i*2]][coordinates[i*2+1]].level > 0)
			return .5;
	}
	return 1.0;
}

function drawHex(x,y,size,color,pointX,pointY,triHex){
	//context.beginPath(event.clieniX,event.clientY,25);
	shadowOn();
	if(triHex == 0 || isHolding == 0)
	{
		context.strokeStyle = "white"; 
		shadowOff();
	}
	else
	{
		validPos = validity();
		if( validPos == true)
		{
			context.strokeStyle = "white";
		}
		else
		{
			context.strokeStyle = "red"; 
		}
	}
	if(triHex == 1 && isHolding == 1)
	{
		context.globalAlpha = isOver();
	}
	context.lineWidth=3;
	if(color == EMPTYCOLOR)
	{
		context.strokeStyle = color;
		context.lineWidth=1;
	}
	else if(triHex == 0)
	{
		context.strokeStyle = "black";
		context.lineWidth=2;
	}
	context.lineCap = 'square';
	context.beginPath();
	context.moveTo(hex_cornerX(x,y,size,0),hex_cornerY(x,y,size,0));
	for (var i = 1; i <= 5; i++) {
		context.lineTo(hex_cornerX(x,y,size,i),hex_cornerY(x,y,size,i));
	}
	if(color != EMPTYCOLOR)
	{
		context.fillStyle = color;
		context.closePath();
		context.stroke();
		context.fill();
		shadowOff();
		context.stroke();
	}
	shadowOff();
	if(color == VOLCANOCOLOR)
	{
		context.lineWidth=3;
		context.beginPath();
		context.moveTo(x,y);
		context.strokeStyle = "orange";
		/*console.log("x:" + x);
		d.log("y:" + y);
		console.log("pointX " + pointX);
		console.log("pointY " + pointY);
		console.log("midx:" + (x+pointX)/2);
		console.log("midy:" + (y+pointY)/2);*/
		context.lineTo((x+pointX)/2,(y+pointY)/2);
		context.stroke();
	}
	context.globalAlpha = 1.0;
}

function updateAvailable()
{
	var newLevel = colorGrid[coordinates[0]][coordinates[1]].level + 1;
	if(newLevel == 1)
	{
		available[0] += 2;
		return;
	}
	else if (newLevel == 2)
	{
		available[1] += 2
	}
	else if(newLevel > 2)
	{
		available[2] += 2
	}
	var squashed = 0;
	for(var i = 0;i < 3; i++)
	{
		if(colorGrid[coordinates[i*2]][coordinates[i*2 + 1]].color != VOLCANOCOLOR && colorGrid[coordinates[i*2]][coordinates[i*2 + 1]].playerOwner == 0)
		{
			squashed += 1;
		}
	}
	available[newLevel -2] -= squashed;
}

function arrayToCoords(array)
{
	var newArray = [];
	var coord;
	//console.log("arryLen" + array.length);
	for(var i = 0; i < array.length/2;i++)
	{
		coord = new Coordinate(array[i*2],array[i*2+1]);
		newArray.push(coord);
	}
	return newArray;
}

function placeTile()
{
	validPos = false;			
	shadowOff();
	isHolding = 0;
	calcVolcano();
	var lavaflow = getLavaFlow();
	//console.log(lavaflow.lavaRow + "," + lavaflow.lavaCol);
	//spot1
	updateAvailable();
	colorGrid[coordinates[0]][coordinates[1]] = new Hex(
		c[0],
		posX,
		posY,
		lavaflow.lavaRow,
		lavaflow.lavaCol,
		colorGrid[coordinates[0]][coordinates[1]].level + 1);
	colorGrid[coordinates[2]][coordinates[3]] = new Hex(c[1],
		posX,
		posY,
		lavaflow.lavaRow,
		lavaflow.lavaCol,
		colorGrid[coordinates[2]][coordinates[3]].level + 1
		);
	colorGrid[coordinates[4]][coordinates[5]] = new Hex(c[2],
		posX,
		posY,
		lavaflow.lavaRow,
		lavaflow.lavaCol,
		colorGrid[coordinates[4]][coordinates[5]].level + 1
		);			
	drawBackground();
	if(!canBuild())
	{
		alert("you have been eliminated from the game because you cannot place any buildings");
		eliminated.push(playerTurn);
		nextTurn();
		return;
	}
	drawBuildingPanel();
	flipped = 0;
	volcano = 0;
	updateStage();
}

//x and y indicate center position color1 botom left color2 bottom right volcano indicates rotation(0,1,2)
function drawTriHex(x,y,size,color1,color2,volcano,flip,holding,coordinates){
	var len = size;
	//console.log(flip);
	if(flip == 1)
	{
		len *= -1;
	}
	var yIncrement = (len/2);
	var xIncrement = ((len/2) * (3**(1/2)));
	var place1X = x;
	var place1Y = y - len;
	var place2X = x - xIncrement;
	var place2Y = y + (len/2);
	var place3X = x + xIncrement;
	var place3Y = y + (len/2);

	var volcanoIndex = volcano;
	var c1Index = (volcano + 1) % 3;
	var c2Index = (volcano + 2) % 3;

	c[volcano] = VOLCANOCOLOR;
	c[c1Index] = colors[color1];
	c[c2Index] = colors[color2];

	var positionX;
	var positionY;

	if(volcanoIndex == 0)
	{
		positionX = place3X;
		positionY = place3Y;
	}
	else if(volcanoIndex == 1)
	{
		positionX = place1X;
		positionY = place1Y;
	}
	else
	{
		positionX = place2X;
		positionY = place2Y;
	}
	if(holding == 1)
	{
		posX = positionX;
		posY = positionY;
	}

	if(flip == 0)
	{
		drawHex(place1X,place1Y,size,c[0],positionX,positionY,1);
		/*context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("1",place1X,place1Y);*/
		drawHex(place2X,place2Y,size,c[1],positionX,positionY,1);
		/*context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("2",place2X,place2Y);*/
		drawHex(place3X,place3Y,size,c[2],positionX,positionY,1);
		/*context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("3",place3X,place3Y,positionX,positionY);*/
	}
	else
	{
		drawHex(place3X,place3Y,size,c[2],positionX,positionY,1);
		/*context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("3",place3X,place3Y);*/
		drawHex(place2X,place2Y,size,c[1],positionX,positionY,1);	
		/*context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("2",place2X,place2Y);*/
		drawHex(place1X,place1Y,size,c[0],positionX,positionY,1);
		/*context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("1",place1X,place1Y);*/
	}
}	

function expandTerrain(terrain)
{
	for(var i = 0; i < expansionHighlights.length;i++)
	{
		if(colorGrid[expansionHighlights[i].row][expansionHighlights[i].col].color == terrain)
		{
			colorGrid[expansionHighlights[i].row][expansionHighlights[i].col].playerOwner = playerTurn;
			colorGrid[expansionHighlights[i].row][expansionHighlights[i].col].huts = colorGrid[expansionHighlights[i].row][expansionHighlights[i].col].level;
			huts[playerTurn - 1] -= colorGrid[expansionHighlights[i].row][expansionHighlights[i].col].level;
		}
	}
	expansionHighlights.splice(0,expansionHighlights.length);
	console.log(expansionHighlights.length);
}