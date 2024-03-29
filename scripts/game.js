
// create the board
const board = new Board();

// create players
const marian	 = new Player(40,'#e6183c','marian');
const steven	 = new Player(42,'#13aede','steven');

const blocks = [];

// init all players
marian.init();
steven.init();

// set initial position for players
board.init();

// game params
let turn = marian.name;
let playerBlockedAPosition = false;
let playerMadeAMove = false;
let winner = null;


//initDisplayScreen();

// playing and switching turns
$('ul li').on('click',function(evt){
	let selectedPos = $(this).index() + 1;
	switch(turn){
		case 'marian':
			updatePlayerAction();
			play(marian, selectedPos);
			if(playerBlockedAPosition && (!playerIsBlocked(marian) || !playerIsBlocked(steven)) ) {
				switchTurn(steven);
			}
			checkWinner();
		break;
		case 'steven':
			updatePlayerAction();
			play(steven, selectedPos);
			if(playerBlockedAPosition && ((!playerIsBlocked(marian) || !playerIsBlocked(steven))) ) {
				switchTurn(marian);
			}
			checkWinner();
		break;
		default:
			alert("Game Over");
		break;
	}
});

let play = (player, selectedPos) => {
	if(!playerMadeAMove){
		if(!isValidPositionForMove(player, selectedPos))
			return;// TODO : show a message that says the position is not valid 
		player.moveTo(selectedPos);
		playerMadeAMove = true;
	}
	else if(!playerBlockedAPosition && isValidPositionToBlock(selectedPos)){
		let block = new Block(selectedPos);
		block.drawBlock();
		blocks.push(block);
		playerBlockedAPosition = true;
	}
}

let checkWinner = () => {
	if(playerIsBlocked(marian)){
		showWinner(steven);
		turn = null;
	}
	if(playerIsBlocked(steven)){
		showWinner(marian);
		turn = null;
	}
}

let showWinner = (winner) => {
	$("#panel-info").html(`
		<h2> Congratulations ${winner.name} you won! </h2> 
	`);
};

let switchTurn = (player) => {
	turn = player.name;
	updateScreen(player);
	playerBlockedAPosition = false;
	playerMadeAMove = false;
}

let isValidPositionForMove = (player, newPos) => {
	return board.isPlaceEmpty(newPos) && isNearPlace(player,newPos);
}

let isValidPositionToBlock = (newPos) =>{ 
	return board.isPlaceEmpty(newPos);
}

let isNearPlace = (player, newPos) => {
	let currentPos = player.pos;
	if(isInCorner(currentPos)){
		var corner = getPosCorner(currentPos);
		switch(corner){
			case 'TL':
				return  newPos === currentPos + 1 ||
						newPos === currentPos + 9 ||
						newPos === currentPos + 10;
			case 'TR':
				return	newPos === currentPos - 1 ||
						newPos === currentPos + 8 ||
						newPos === currentPos + 9;
			case 'BL':
				return  newPos === currentPos + 1 ||
						newPos === currentPos - 8 ||
						newPos === currentPos - 9;	
			case 'BR':
				return  newPos === currentPos - 1 ||
						newPos === currentPos - 9 ||
						newPos === currentPos - 10;
		}
	}
	else if(isInEdge(currentPos)){
		let edge = getPosEdge(currentPos);
		if(edge){
			switch(edge){
				case 'T':
					return  newPos === currentPos - 1 ||
							newPos === currentPos + 1 ||
							newPos === currentPos + 8 ||
							newPos === currentPos + 9 ||
							newPos === currentPos + 10;
				case 'R':
					return	newPos === currentPos - 1 ||
							newPos === currentPos + 8 ||
							newPos === currentPos + 9 ||
							newPos === currentPos - 9 ||
							newPos === currentPos - 10;
				case 'L':
					return  newPos === currentPos + 1 ||
							newPos === currentPos + 9 ||
							newPos === currentPos + 10 ||
							newPos === currentPos - 8 ||
							newPos === currentPos - 9;
				case 'B':
					return  newPos === currentPos - 1 ||
							newPos === currentPos + 1 ||
							newPos === currentPos - 8 ||
							newPos === currentPos - 9 ||
							newPos === currentPos - 10;
			}
		}
	}
	else if(isInInMiddle(currentPos)){
		return  newPos === currentPos - 8  ||
				newPos === currentPos - 9  ||
				newPos === currentPos - 10 ||
				newPos === currentPos - 1  ||
				newPos === currentPos + 1  ||
				newPos === currentPos + 8  ||
				newPos === currentPos + 9  ||
				newPos === currentPos + 10;
	}
	return false;
}


let updateScreen = (player) => {
	$('#player-icon').attr("style","color:" + player.color);
	updatePlayerAction();
}

let updatePlayerAction = () => {
	let action = playerBlockedAPosition ? "moooving" : "blooocking";
	$('#player-action').text(action);
}

/**
 * checks if the given player is blocked and could not move
 * starts by checking if player is in corner then in edge and finaly in the middle of the board
 *
 * @param {a player} player 
 */
let playerIsBlocked = (player) => {
	let currentPos = player.pos;
	if(isInCorner(currentPos)){
		return isBlockedInCorner(currentPos);
	}
	else if(isInEdge(currentPos)){
		return isBlockedInEdge(currentPos);
	}
	else if(isInInMiddle(currentPos)){
		return isBlockedInMiddle(currentPos);
	}
	return false;
}

let isBlockedInCorner = (pos) => {
	let corner = getPosCorner(pos);
	if(corner){
		switch(corner){
			case 'TL':
				return  board.boxes[pos + 1]  !== 0 &&
						board.boxes[pos + 9]  !== 0 &&
						board.boxes[pos + 10] !== 0;
			case 'TR':
				return	board.boxes[pos - 1]  !== 0 &&
						board.boxes[pos + 8]  !== 0 &&
						board.boxes[pos + 9]  !== 0;
			case 'BL':
				return  board.boxes[pos + 1]  !== 0 &&
						board.boxes[pos - 8]  !== 0 &&
						board.boxes[pos - 9]  !== 0;	
			case 'BR':
				return  board.boxes[pos - 1]  !== 0 &&
						board.boxes[pos - 9] !== 0 &&
						board.boxes[pos - 10]  !== 0;
		}
	}
	return false;
}
let isBlockedInEdge= (pos) => {
	let edge = getPosEdge(pos);
	if(edge){
		switch(edge){
			case 'T':
				return  board.boxes[pos - 1]  !== 0 &&
						board.boxes[pos + 1]  !== 0 &&
						board.boxes[pos + 8]  !== 0 &&
						board.boxes[pos + 9]  !== 0 &&
						board.boxes[pos + 10] !== 0;
			case 'R':
				return	board.boxes[pos - 1]  !== 0 &&
						board.boxes[pos + 8]  !== 0 &&
						board.boxes[pos + 9] !== 0 &&
						board.boxes[pos - 9]  !== 0 &&
						board.boxes[pos - 10] !== 0;
			case 'L':
				return  board.boxes[pos + 1]  !== 0 &&
						board.boxes[pos + 9]  !== 0 &&
						board.boxes[pos + 10] !== 0 &&
						board.boxes[pos - 8]  !== 0 &&
						board.boxes[pos - 9] !== 0;
			case 'B':
				return  board.boxes[pos - 1]  !== 0 &&
						board.boxes[pos + 1]  !== 0 &&
						board.boxes[pos - 8]  !== 0 &&
						board.boxes[pos - 9]  !== 0 &&
						board.boxes[pos - 10] !== 0;
		}
	}
	return false;

}
let isBlockedInMiddle = (pos) => {
	return  board.boxes[pos - 8]  !== 0 &&
			board.boxes[pos - 9]  !== 0 &&
			board.boxes[pos - 10] !== 0 &&
			board.boxes[pos - 1]  !== 0 &&
			board.boxes[pos + 1]  !== 0 &&
			board.boxes[pos + 8]  !== 0 &&
			board.boxes[pos + 9]  !== 0 &&
			board.boxes[pos + 10] !== 0;
}

let isInInMiddle = (pos) => {
	return !isInEdge(pos) && !isInCorner(pos);
}

let isInEdge = (pos) => {
	return  isInBottomEdge(pos) ||
			isInRightEdge(pos) ||
			isInLeftEdge(pos) ||
			isInTopEdge(pos);
}

let getPosEdge = (pos) => {
	if(isInTopEdge(pos)){
		return 'T';
	}else if(isInRightEdge(pos)){
		return 'R';
	}else if(isInLeftEdge(pos)){
		return 'L';
	}else if(isInBottomEdge(pos)){
		return 'B';
	}
	else{
		return null;
	}
}

let isInTopEdge = (pos) => {
	return pos <= 9;
}

let isInBottomEdge = (pos) => {
	return pos >= 73;
}

let isInRightEdge = (pos) => {
	return pos % 9 === 0 ? true : false;
}

let isInLeftEdge = (pos) => {
	for(let i = 1 ; i < 100 ; i+=9){
		if(pos === i){
			return true;
		}
	}
	return false;
}

let isInCorner = (pos) => {
	return pos === 1 || pos === 9 || pos === 73 || pos === 81;
}
/**
 * return the location of pos in boarder :
 * TL : Top Left
 * TR : Top Right
 * BL : Bottom Left
 * BR : Bottom Right
 * null if position is not in a corner
 * 
 * @param {position in board} pos 
 */
let getPosCorner = (pos) => {
	switch(pos){
		case 1:
			return 'TL';
		case 9:
			return 'TR';
		case 73:
			return 'BL';
		case 81:
			return 'BR';
		default:
			return null;
	}
}
