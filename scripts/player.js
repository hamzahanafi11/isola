class Player {
	constructor(pos, color, name) {
		this.oldPos = -1;
		this.pos = pos;
		this.color = color;
		this.name = name;
		this.path = [pos]; // to track the path walked by the player
	}

	init = () => {
	}
	
	moveTo = (newPos) => {
		this.oldPos = this.pos;
		this.pos = newPos;
		this.path.push(newPos);
		board.refreshPlayerPosition(this);
	};
	
	drawPath = () => {
		this.path.forEach(function (el) {
			$('ul li:nth-child(' + el + ')').attr('style', 'background-color:red');
		});
	};
}

