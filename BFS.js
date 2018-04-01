//not yet tested
function BFS(hexRow,hexCol)
{
	var templeExists = 0;
	var towerExists = 0;
	var curCoord = new Coordinate(hexRow,hexCol);
	//var temCoord;
	var bordering = getAdjacent(hexRow,hexCol);
	var settle;
	var poppedRow;
	var poppedCol;
	/*console.log("bordering" + hexRow + "," + hexCol);
	for(var i = 0; i < bordering.length/2;i++)
	{
		console.log(bordering[i*2] + "," + bordering[i*2 + 1]);
	}*/
	var queue = [curCoord];
	var visited = [];
	//console.log(queue.includes(curCoord));
	while(queue.length > 0)
	{

		curCoord = queue[0];
		visited.push(curCoord);
		queue.shift();
		//console.log(queue.length);
		poppedRow = curCoord.row;
		poppedCol = curCoord.col;
		//var test = poppedRow  + 1;
		//console.log("poppedRow + 1" + test);
		//console.log("poppedRow" + poppedRow);
		if(colorGrid[poppedRow][poppedCol].temple == 1)
			templeExists = 1;
		if(colorGrid[poppedRow][poppedCol].tower == 1)
			towerExists = 1;
		bordering = getAdjacent(poppedRow,poppedCol);
		/*for(var i = 0; i < bordering.length/2;i++)
		{
			console.log("borderpoint");
			console.log(bordering[i*2] + "," + bordering[i*2 +1]);
		}*/
		settle = sameSettlement(hexRow,hexCol,bordering);
		for(var i = 0; i < settle.length / 2;i++)
		{
			curCoord = new Coordinate(settle[i*2],settle[i*2+1]);
			/*console.log("visited");
			for(var i = 0; i < visited.length;i++)
			{
				console.log(visited[i]);
			}
			console.log("queue" + queue);
			for(var i = 0; i < queue.length;i++)
			{
				console.log(queue[i]);
			}*/
			if(!(containsCoordinate(visited,curCoord)) && !(containsCoordinate(queue,curCoord)))
			{
				//console.log(curCoord);
				queue.push(curCoord);
			}
		}
	}
	for(var i = 0; i < visited.length;i++)
	{
		//console.log("visited:" + visited[i].row + "," + visited[i].col);
	}
	//console.log("end");
	return {
		settlement: visited,
		hasTemple: templeExists,
		hasTower: towerExists,
	}
}