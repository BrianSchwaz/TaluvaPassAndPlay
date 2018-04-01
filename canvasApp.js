function canvasApp(){

	theCanvas = document.getElementById('canvas');
	context = theCanvas.getContext('2d');
	if (!theCanvas || !theCanvas.getContext) {
    	return;
	}
	if (!context) {
   	 	return;
  	}
  	height = theCanvas.height;
  	width = theCanvas.width;
	rows = Math.floor(theCanvas.height / (size * 2 * 3/5)) + 2;
	columns = Math.floor(theCanvas.width / ((xIncrement/2)* 3/5)) + 2;
	//console.log(Math.floor(theCanvas.height / (size * 2 * 3/5)));
	//console.log(Math.floor(theCanvas.width / ((xIncrement/2) * 3/5)));
  	theCanvas.addEventListener("mousemove", mouse_monitor, false);
  	theCanvas.addEventListener("mousedown", click,false);
  	window.addEventListener("keydown",checkKeyPress,false);

  	// Images

  	start();

  	function checkKeyPress(key)
  	{
  		if(gameEnded == true)
  		{
			return;
  		}
  		//shift flips 16
  		if(isHolding == 1 && stage == 0 && key.keyCode == "83")
  		{
  			flipped = !flipped;
  			drawBackground();
  			drawHoldingTriHex();
  			//console.log("flipped "+flipped);
  		}
  		//a rotates 65
  		if(isHolding == 1 && stage == 0 && key.keyCode == "65")
  		{
  			volcano = (volcano + 1) % 3;
  			drawBackground();
  			drawHoldingTriHex();
  			//console.log(volcano);
  		}
  		if(stage == 2 && key.keyCode == "8")
  		{
  			stage = 1;
  			drawBackground();
  			drawBuildingPanel();
  		}
		//context.fillStyle = "white";
		//context.fillRect(mouseX - startX ,mouseY-startY,10,10);
  	}

  	function start()
  	{
  		makeEmptyColor();
  		drawBackground();
		genNewTile();
  		drawScreen();
  	}

  	function mouse_monitor(e){
  		if(gameEnded == true)
  		{
			return;
  		}
		mouseX = event.clientX;
		mouseY = event.clientY;
		if(isHolding == 1)
		{
			drawBackground();
			drawHoldingTriHex();
		}
		else if(stage == 2)
		{
			build();
			//drawBackground();
			//drawScreen();
		}
		//console.log("mouseX " + mouseX);
		//console.log("mouseY " + mouseY);
		//context.fillStyle = "white";
		//context.fillRect(mouseX - startX ,mouseY-startY,10,10);
		//console.log("row " + row);
		//console.log("col " + col);
  	}

  	function click()
	{
		if(gameEnded == true)
		{
			return;
		}
		if(isHolding == 1)
		{
			//console.log("on click:" + validPos);
			if(validPos == true)
			{	
				placeTile();
			}
			else
			{
				alert(alarm);
			}
		}
		else if(tilesRemaining > 0 && distance(mouseX -10,mouseY -10,100,300) <= size * 2  && isHolding == 0 && stage == 0)
		{
			tilesRemaining = tilesRemaining - 1;
			isHolding = 1;
			lastColor1 = color1;
			lastColor2 = color2;
			genNewTile();
			tiles[color1][color2] = tiles[color1][color2] - 1;
			drawBackground();
			shadowOn();
			drawHoldingTriHex();
			shadowOff();
		}
		else if(stage == 1)
		{
			if(distance(mouseX -10,mouseY -10,hutPos[0] + hutPos[2]/2,hutPos[1] + hutPos[2]/2) < hutPos[2])
			{
				if(!(huts[playerTurn -1] > 0))
				{
					alert("you have no huts remaining")
				}
				else
				{
					updateStage();
					alert("place a hut on a level 1 field");
					building = 1; //hut
					build();
				}
			}
			else if(distance(mouseX -10,mouseY -10,templePos[0] + templePos[2]/2,templePos[1] + templePos[2]/2) < templePos[2])
			{
				updateStage();
				alert("place a temple on a field adjacent to one of your settlements that spans at least 3 fields and does not yet have a temple");
				building = 2; //temple
				build();
			
			}
			else if(distance(mouseX -10,mouseY -10,towerPos[0] + towerPos[2]/2,towerPos[1] + towerPos[2]/2) < towerPos[2])
			{
				if(available[2] < 1)
				{
					alert("there are no possible placements for towers right now");
				}
				else
				{
					updateStage();
					alert("place a tower on a 1 field of level 3 or higher, adjacent to one of your settlments that does not yet have a tower");
					building = 3; //tower
					build();
				}
			}
			else if(distance(mouseX -10,mouseY -10,expandSettlementPos[0] + expandSettlementPos[2]/2,expandSettlementPos[1] + expandSettlementPos[2]/2) < expandSettlementPos[2])
			{
				updateStage();
				alert("select a settlment that you would like to expand");
				building = 4; // expand settlement
				build();
			}
		}
		else if(stage ==2)
		{
			if(building == 1)
			{
				if(validHut(row,col) == true)
				{
					placeHut(row,col);
					nextTurn();
				}
				else
				{
					alert(alarm);
					alert("press Backspace to return to building selection");
				}
			}
			else if(building == 2)
			{
				if(validTemple(row,col) == true)
				{
					placeTemple(row,col);
					nextTurn();
				}
				else
				{
					alert(alarm);
					alert("press Backspace to return to building selection");
				}
			}
			else if(building == 3)
			{
				if(validTower(row,col) == true)
				{
					placeTower();
					nextTurn();
				}
				else
				{
					alert(alarm);
					alert("press Backspace to return to building selection");
				}
			}
			else if(building == 4)
			{
				if(validExpansion(row,col) == true)
				{
					alert("Select an empty terrain field bordering the settlment for expansion. Each terrain bordering the settlement of the same terrain type will gain huts equal to the level of the expansion");
					building = 5;
				}
				else
				{
					alert(alarm);
					alert("press Backspace to return to building selection");
				}
			}
			else if(building == 5)
			{
				console.log("isBorder");
				var selectedTerrain = validTerrain();
				if(selectedTerrain.validity == true)
				{
					if(testExpansion(selectedTerrain.terrain) == false)
					{
						alert("You do not have enough huts to make that expansion");
						alert("press Backspace to return to building selection");
					}
					else
					{
						expandTerrain(selectedTerrain.terrain);
						nextTurn();
					}
				}
				else
				{
					alert("You must select a nonvolcano terrain adjacent to the settlement that is unoccupied");
					alert("press Backspace to return to building selection");
				}
			}
		}
	}
}