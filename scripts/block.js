class Block {

	constructor(pos) {
		this.pos = pos;
		board.boxes[pos] = -1;
	}

	drawBlock = () => {
		$('ul li:nth-child('+this.pos+')').attr('style','background-color:#807f8c');		
	}
}