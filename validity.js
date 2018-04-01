function findPlacements()
{   
	var pos1row = row;
	var pos1col = col;
	var pos2row;
	var pos2col;
	var pos3row;
	var pos3col;
	if(flipped == 1)
	{
		pos2row = row -1;
		pos2col = col + ((row+1) % 2); 
		pos3row = row -1;
		pos3col = pos2col - 1;
	}
	else
	{
		pos2row = row + 1;
		pos2col = col - (row % 2); 
		pos3row = row + 1;
		pos3col = pos2col + 1;
	}
	coordinates = [pos1row,pos1col,pos2row,pos2col,pos3row,pos3col];
}

function notSquashed(squashed,hexRow,hexCol)
{
	for(var j = 0;j < squashed.length/2; j++)
	{
		if(squashed[j*2] == hexRow && squashed[j*2+1] == hexCol)
		{
			return false;
		}
	}
	return true;
}

function adjOfAdj(hRow,hCol,squashed,curPlayer)
{
	var adj = getAdjacent(hRow,hCol);
	for(var i = 0; i < adj.length / 2;i++)
	{
		if(colorGrid[adj[i*2]][adj[i*2+1]].playerOwner == curPlayer)
		{
			if(notSquashed(squashed,adj[i*2],adj[i*2+1]) == true)
			{
				return true;
			}
		}
	}
	return false;
}

function checkAdj(adj,squashed,curPlayer)
{
	for(var i = 0; i < adj.length / 2;i++)
	{
		if(colorGrid[adj[i*2]][adj[i*2+1]].playerOwner == curPlayer)
		{
			if(notSquashed(squashed,adj[i*2],adj[i*2+1]) == true)
			{
				return true;
			}
			else
			{
				if(adjOfAdj(adj[i*2],adj[i*2+1],squashed,curPlayer) == true)
				{
					return true;
				}
			}
		}
	}
	return false;
}

/*function checkSettlement(set,squashed)
{
	for(var i = 0; i < set.length;i++)
	{
		if(notSquashed(squashed,set[i].row,set[i].col) == true)
			return true;
	}
	return false;
}*/

function validEruption(coordinates)
{
	for(var i = 0; i < 3;i++)
	{
		if((colorGrid[coordinates[i*2]][coordinates[i*2+1]].playerOwner != 0))
		{
			/*var set = BFS(coordinates[i*2],coordinates[i*2+1]);
			if(checkSettlement(set.settlements,coordinates) == false)
			{
				return false;
			}*/
			var adj = getAdjacent(coordinates[i*2],coordinates[i*2+1]);
			if(checkAdj(adj,coordinates,colorGrid[coordinates[i*2]][coordinates[i*2+1]].playerOwner) == false)
			{
				alarm = "You cannot create an erruption that destroys an entire settlement";
				return false;
			}
		}
	}
	return true;
}

function contains(array,value)
{
	for(var i = 0; i < array.length; i++)
	{
		if(array[i] == value)
			return true;
	}
	return false;
}

function containsCoordinate(array,coord)
{
	for(var i = 0; i < array.length; i++)
	{
		if(array[i].row == coord.row && array[i].col == coord.col)
			return true;
	}
	return false;
}

function validTower(therow,thecol)
{
	if(colorGrid[therow][thecol].level < 3)
	{
		alarm = "you must place towers on a field of level 3 or higher";
		return false;
	}
	else if(colorGrid[therow][thecol].color == VOLCANOCOLOR)
	{
		alarm = "you cannot place towers on a volcano field";
		return false;
	}
	else if(colorGrid[therow][thecol].playerOwner != 0)
	{
		alarm = "you cannot place towers on a field that is already occupied by buildings";
		return false;
	}
	else
	{
		var adjacent = getAdjacent(therow,thecol);
		var found = false;
		for (var i = 0; i < adjacent.length / 2; i++)
		{
			if(colorGrid[adjacent[i*2]][adjacent[i*2+1]].playerOwner == playerTurn)
			{
				var borderSettle = BFS(adjacent[i*2],adjacent[i*2+1]);
				if(borderSettle.settlement.length > 0)
				{
					if(borderSettle.hasTower == 1)
					{
						alarm = "towers cannot be built adjacent to settlements that already contain a tower";
						return false;
					}
					//had playerOwner change here but removed
					found =  true;
				}
			}
		}
		if(found == true)
		{
			return true;
		}
		alarm = "towers must be placed bordering a settlement";
		return false;
	}
}

function validHut(therow,thecol)
{
	if(colorGrid[therow][thecol].level == 0)
	{
		//console.log(colorGrid[row][col].level);
		alarm = "you must place huts on a field";
		return false;
	}
	else if(colorGrid[therow][thecol].color == VOLCANOCOLOR)
	{
		alarm = "you cannot place huts on a volcano field";
		return false;
	}	
	else if(colorGrid[therow][thecol].playerOwner != 0 && colorGrid[therow][thecol].playerOwner != playerTurn)
	{
		alarm = "you cannot place huts on a field that is occupied by another player";
		return false;
	}
	else if(colorGrid[therow][thecol].level != 1)
	{
		alarm = "you cannot place huts on a level other than level 1";
		return false;
	}
	else if(colorGrid[therow][thecol].temple == 1 || colorGrid[therow][thecol].tower == 1 || colorGrid[therow][thecol].huts > 0)
	{
		alarm = "you cannot place huts on a field containing other buildings";
		return false;
	}
	//had playerOwner change here but removed
	return true;
}

function validTemple(therow,thecol)
{
	if(colorGrid[therow][thecol].level == 0)
	{
		alarm = "you must place towers on a field";
		return false;
	}
	else if(colorGrid[therow][thecol].color == VOLCANOCOLOR)
	{
		alarm = "you cannot place temples on a volcano field";
		return false;
	}
	else if(colorGrid[therow][thecol].playerOwner != 0)
	{
		alarm = "you cannot place temples on a field that is already occupied by buildings";
		return false;
	}
	else
	{
		var adjacent = getAdjacent(therow,thecol);
		for (var i = 0; i < adjacent.length / 2; i++)
		{
			if(colorGrid[adjacent[i*2]][adjacent[i*2+1]].playerOwner == playerTurn)
			{
				var borderSettle = BFS(adjacent[i*2],adjacent[i*2+1]);
				if(borderSettle.settlement.length >= 3)
				{
					if(borderSettle.hasTemple == 1)
					{
						alarm = "temples cannot be built adjacent to settlments that already contain a temple";
						return false;
					}
					//had playerOwner change here but removed
					return true;
				}
			}
		}
		alarm = "temples must be placed bordering a settlement of at least size 3";
		return false;
	}
}

function sameLevel()
{
	var level1 = colorGrid[coordinates[0]][coordinates[1]].level;
	var level2 = colorGrid[coordinates[2]][coordinates[3]].level;
	var level3 = colorGrid[coordinates[4]][coordinates[5]].level;
	if(level1 == level2 && level1== level3)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function getAdjacent(hexRow,hexCol)
{
	var neighbors = Array(12);
	var offset;
	if(hexRow % 2 == 0)
	{
		offset = 0;
	}
	else
	{
		offset = -1;
	}
	for(var i = 0; i < 3;i++)
	{
		neighbors[i*4] = hexRow + i - 1;
		neighbors[i*4 + 2] = hexRow + i - 1;
	}
	for(var i = 0; i < 2;i++)
	{
		neighbors[i*8 + 1] = hexCol + offset;
		neighbors[i*8 + 3] = hexCol + offset + 1;
	}
	neighbors[5] = hexCol - 1;
	neighbors[7] = hexCol + 1;

	/*console.log("neighbors of" + hexRow + "," + hexCol);
	for(var i = 0; i < 6;i++)
	{
		console.log(neighbors[i*2] + "," + neighbors[i*2 + 1]);
	}*/
	return neighbors;
}

function sameSettlement(hexRow,hexCol,borders)
{
	var sameSettlement = [];
	//console.log("borders:" + borders.length/2);
	for(var i = 0; i < borders.length/2;i++)
	{
		//console.log(borders[i*2] + "," + borders[i*2 +1]);
		//console.log(colorGrid[borders[i*2]][borders[i*2+1]].playerOwner);
		if(colorGrid[hexRow][hexCol].playerOwner == colorGrid[borders[i*2]][borders[i*2 +1]].playerOwner)
		{
			sameSettlement.push(borders[i*2]);
			sameSettlement.push(borders[i*2+1]);
		}
	}
	return sameSettlement;
}

function volcanoPlacement()
{
	//first level placement doesn't matter
	if(colorGrid[coordinates[volcano*2]][coordinates[volcano*2+1]].level == 0)
		return true;
	//a volcano tile is under the volcano tile that will be placed
	if(colorGrid[coordinates[volcano*2]][coordinates[volcano*2+1]].color == VOLCANOCOLOR)
	{
		var lavaflow = getLavaFlow();
		if(!(colorGrid[coordinates[volcano*2]][coordinates[volcano*2+1]].lavaRow == lavaflow.lavaRow &&
		   colorGrid[coordinates[volcano*2]][coordinates[volcano*2+1]].lavaCol == lavaflow.lavaCol))
			return true;

	}
	return false;
}

function isAdjacent()
{
	findPlacements();
	var neighbors;
	if(tilesRemaining == tilesCapacity -1)
		return true;
	for(var i = 0; i < 3;i++)
	{
		neighbors = getAdjacent(coordinates[i*2],coordinates[i*2 + 1]);
		for(var j = 0; j < 6; j++)
		{
			if(colorGrid[neighbors[j*2]][neighbors[j*2+1]].level > 0)
				return true;
		}
	}
	return false;
}

function containsTower()
{
	for(var i = 0; i < 3;i++)
	{
		if(colorGrid[coordinates[i*2]][coordinates[i*2+1]].tower == 1)
			return true;
	}
	return false;
}

function containsTemple()
{
	for(var i = 0; i < 3;i++)
	{
		if(colorGrid[coordinates[i*2]][coordinates[i*2+1]].temple == 1)
			return true;
	}
	return false;
}

function validity()
{
	if(isAdjacent() == false)
	{
		alarm = "There is no adjacent tile. Please try placing again";
		return false;
	}
	if(sameLevel() == false)
	{
		alarm = "The tiles beneath are not on equal level. Please try placing again";
		return false;
	}
	if(volcanoPlacement() == false)
	{
		alarm = "the volcano alignment of the tile beneath is invalid";
		return false;
	}
	if(containsTower() == true)
	{
		alarm = "You cannot place tiles over fields containing towers";
		return false;
	}
	if(containsTemple() == true)
	{
		alarm = "You cannot place tiles over fields containing temples";
		return false;
	}
	if(colorGrid[row][col].level > 0)
	{
		if(validEruption(coordinates) == false)
		{
			return false;
		}
	}
	alarm = "no allert";
	return true;
}

function findValidPosition()
{
	var v = 0;
	var r = 0;
	var c = 0;
	var closeX = mouseX - 10;
	var closeY = mouseY - 10 + size;
	if(flipped == 1)
	{
		closeY = mouseY - size;
	}
	//console.log("closeX " + closeX);
	//console.log("closeY " + closeY);
	var checkX;
	var checkY;
	for(var i = 0; i < rows;i++)
	{
		checkY = i * 1.5 * size + offY;
		for(var j = 0; j < columns; j++)
		{
			if(v == 1)
			{
				break;
			}
			if(i % 2 == 0)
			{
				checkX = j * xIncrement/2 - size  + offX;
				if(distance(closeX,closeY,checkX,checkY) < size)
				{
					//console.log(i + ","  + j);
					closeX = checkX;
					closeY = checkY;
					r = i;
					c = j;
					v = 1;
					break;
				}
			}
			else
			{
				checkX = j * xIncrement/2 -size - xIncrement/4 + offX;
				if(distance(closeX,closeY,checkX,checkY) < size)
				{
					//console.log(i + ","  + j);
					//console.log(distance(closeX,closeY,checkX,checkY));
					closeX = checkX;
					closeY = checkY;
					r = i;
					c = j;
					v = 1;
					break;
				}
			}
			context.font = "12px Arial";
			context.fillStyle = "black";
			//context.fillText(i + ","  + j,checkX-size/2,checkY);
		}
	}
	return {
		x:  closeX,
		y:  closeY,
		valid: v,
		row: r,
		col: c,
	}
}

function validExpansion(therow,thecol)
{

	if(colorGrid[therow][thecol].playerOwner == 0 || colorGrid[therow][thecol].playerOwner != playerTurn)
	{
		alarm = "you must select a terrain tile you occupy of the settlement you wish to expand";
		return false;
	}
	//console.log(row + "," + col);
	var possibleSettlement = BFS(therow,thecol).settlement;
	console.log(possibleSettlement);
	var foundBorder = false;
	for(var i = 0; i < possibleSettlement.length;i++)
	{
		var possAdj = getAdjacent(possibleSettlement[i].row,possibleSettlement[i].col);
		for(var j = 0; j < possAdj.length/2;j++)
		{
			if(colorGrid[possAdj[j*2]][possAdj[j*2+1]].playerOwner == 0 && colorGrid[possAdj[j*2]][possAdj[j*2+1]].level > 0 && colorGrid[possAdj[j*2]][possAdj[j*2+1]].color != VOLCANOCOLOR)
			{
				expansionHighlights.push(new Coordinate(possAdj[j*2],possAdj[j*2+1]));
				foundBorder = true;
			}
		}
	}
	if(foundBorder == false)
	{
		console.log("didn't find border");
		alarm = "there are no possible terrain tiles to expand to from that settlement";
		return false;
	}
	expandingSettlement = new Coordinate(therow,thecol);
	return true;
}

function validTerrain()
{
	console.log(expansionHighlights.length);
	var validity = false;
	var v;
	var t;
	for(var i = 0; i < expansionHighlights.length;i++)
	{
		if(row == expansionHighlights[i].row && col == expansionHighlights[i].col)
		{
			v = true;
			t = colorGrid[row][col].color;
		}
	}
	return{
		validity: v,
		terrain: t,
	}
}

function testExpansion(terrain)
{
	var testHuts = huts[playerTurn-1];
	for(var i = 0; i < expansionHighlights.length;i++)
	{
		if(colorGrid[expansionHighlights[i].row][expansionHighlights[i].col].color == terrain)
		{
			testHuts -= colorGrid[expansionHighlights[i].row][expansionHighlights[i].col].level;
		}
	}
	if(testHuts < 0)
	{
		return false;
	}
	return true;
}

function canBuild()
{
	if(!(canBuildHut()) && !(canBuildTower()) && !(canBuildTemple()) && !(canExpand()))
	{
		return false;
	}
	return true;
}

function canBuildHut()
{
	if(huts[playerTurn -1] == 0)
	{
		return false;
	}
	for(var i = 0;i < rows;i++)
	{
		for(var j = 0;j < columns;j++)
		{
			if(validHut(i,j) == true)
			{
				return true;
			}
		}
	}
	return false;
}

function canBuildTemple()
{
	if(temples[playerTurn -1] == 0)
	{
		return false;
	}
	for(var i = 0;i < rows;i++)
	{
		for(var j = 0;j < columns;j++)
		{
			if(validTemple(i,j))
			{
				return true;
			}
		}
	}
	return false;
}

function canBuildTower()
{
	if(towers[playerTurn -1] == 0)
	{
		return false;
	}
	for(var i = 0;i < rows;i++)
	{
		for(var j = 0;j < columns;j++)
		{
			if(validTower(i,j))
			{
				return true;
			}
		}
	}
	return false;
}

function canExpand()
{
	if(temples[playerTurn -1] == 0)
	{
		return false;
	}
	for(var i = 0;i < rows;i++)
	{
		for(var j = 0;j < columns;j++)
		{
			if(validExpansion(i,j))
			{
				return true;
			}
		}
	}
	return false;
}

function placedBuildings()
{
	for(var i = 0; i < players; i++)
	{
		var buildingsfinished = 0;
		if(huts[i] == 0)
		{
			buildingsfinished += 1;
		}
		if(temples[i] == 0)
		{
			buildingsfinished += 1;
		}
		if(towers[i] == 0)
		{
			buildingsfinished += 1;
		}
		if(buildingsfinished > 1)
		{
			winner = i + 1;
			return true;
		}
	}
	return false;
}

function gameOver()
{
	if(eliminated.length == players -1)
	{
		return true;
	}
	if(tilesRemaining == 0)
	{
		return true;
	}
	if(placedBuildings() == true)
	{
		return true;
	}
	return false;
}