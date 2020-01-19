function Board() {
	

	/**
	 * the first index of boxes is not uesed !! because counting boxes starts from 1
	 * 0  : empty
	 * -1 : blocked
	 * 1  : marian
	 * 2  : steven
	 * */

	this.boxes = [
		0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0
	];

	this.init = function(){
		this.drawPlayers();
	};

	this.isPlaceEmpty = function(pos){
		return this.boxes[pos] === 0;
	};

	// todo : we can refacto this code to remove duplication 
	this.drawPlayers = function(){
		var self = this; // to access the 'this' variable inside forEach
		this.boxes.forEach((el,index) => {
			if(marian.pos == index) {
				self.boxes[index] = marian.name;
				$('ul li:nth-child('+marian.pos+')').find('i').addClass("fa-chess-pawn");
				$('ul li:nth-child('+marian.pos+')').find('i').attr("style","color:"+marian.color);
			}
			else if(steven.pos == index) {
				self.boxes[index] = steven.name;
				$('ul li:nth-child('+steven.pos+')').find('i').addClass("fa-chess-pawn");
				$('ul li:nth-child('+steven.pos+')').find('i').attr("style","color:"+steven.color);
			}
		});
	};

	this.refreshPlayerPosition = function(player){

		// remove player from old position
		$('ul li:nth-child('+player.oldPos+')').find('i').removeClass("fa-chess-pawn");
		$('ul li:nth-child('+player.oldPos+')').find('i').removeAttr("style");
		this.boxes[player.oldPos] = 0; // empty

		// TODO : call the drawPlayer(player)
		// draw player in new position
		$('ul li:nth-child('+player.pos+')').find('i').addClass("fa-chess-pawn");
		$('ul li:nth-child('+player.pos+')').find('i').attr("style","color:"+player.color);
		this.boxes[player.pos] = player.name; // new occuped place
	}
}
