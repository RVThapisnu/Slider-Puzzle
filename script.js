const gparent = document.getElementsByTagName('gparent')[0];
const gchilds = document.getElementsByTagName('gchild');

const resetBtn = document.getElementById('reset');

const dialog = document.getElementsByTagName('dialog')[0];
const dialogClose = document.getElementById('dclose');

const rows = Number(getComputedStyle(gparent).getPropertyValue('--rows'));
const cols = Number(getComputedStyle(gparent).getPropertyValue('--cols'));

// Blank piece Index
const b_index = 0;
const area_label = "p";

let wrong_pieces = 0;

const pos = {
    "vert" : ["top","center","bottom"],
    "horz" : ["left","center","right"]
};

const shuffled_order = shuffle();

for (let i=0,col=0;i < gchilds.length;i ++) {

    if (i % cols == 0 && i != 0) {
	col ++;
    }

    let index = shuffled_order[i];
    gchilds[index].style.gridArea = toArea(i + 1); // Area starts from 1

    // Count Wrong Pieces
    if(gchilds[i] != gchilds[index]) {
	wrong_pieces ++;
    }

    // Set except for 1st child
    if(i != b_index) {
	gchilds[i].style.backgroundPosition = `${pos['vert'][col]} ${pos['horz'][i % cols]}`;
	gchilds[i].addEventListener('click',function() {
	    const t = this; // Target Piece
	    const b = gchilds[b_index]; // Blank Piece

	    const t_area = t.style;
	    const b_area = b.style;

	    const t_pos = toIndex(t_area.gridArea);
	    const b_pos = toIndex(b_area.gridArea);

	    swapper(t_area,b_area,t_pos,b_pos);
	    checkPos(t,t_pos);
	    checkPos(b,b_pos);

	    // Win Event
	    if(wrong_pieces == 0) {
		// Due To CallStack in JS
		setTimeout(() => { dialog.showModal(); },0);
	    }
	});
    }
}

resetBtn.addEventListener('click',reset);
dialogClose.addEventListener('click',() => {
    dialog.close();
});

// Core Functions

// Swapping Pieces / Tiles
function swapper(t_area,b_area,t_pos,b_pos) {
    const isVertical = checkVertical(t_pos,b_pos);
    const isHorizontal = checkHorizontal(t_pos,b_pos);

    if (isVertical || isHorizontal) {
	[t_area.gridArea,b_area.gridArea] = [b_area.gridArea,t_area.gridArea];
    }
}

// Check whether piece is in the Correct Position and Update
function checkPos(piece,prev_Pos) {
    const curr_Pos = toIndex(piece.style.gridArea);
    const isPreviousWrong = gchilds[prev_Pos - 1] != piece;
    const isCurrentWrong = gchilds[curr_Pos - 1] != piece;

    if(!isCurrentWrong) {
	wrong_pieces --;
    }
    else if(isCurrentWrong && !isPreviousWrong) {
	wrong_pieces ++;
    }
    //console.log("Wrong =",wrong_pieces);
}

// Check Vertical Positions
function checkVertical(t_pos,b_pos) {
    const isTop = t_pos + (cols) == b_pos;
    const isBot = t_pos - (cols) == b_pos;

    //console.log(isTop,isBot);

    const isVertical = isTop || isBot;
    return isVertical;
}

// Check Horizontal Positions
function checkHorizontal(t_pos,b_pos) {
    const isLeft  = t_pos - 1 == b_pos;
    const isRight = t_pos + 1 == b_pos;

    const isStart = (t_pos - 1) % rows == 0;
    const isEnd = (t_pos) % rows == 0;

    //console.log(isLeft,isRight,isStart,isEnd);

    const isHorizontal = (isLeft && !isStart) || (isRight && !isEnd);
    return isHorizontal;
}

function shuffle() {
    let set = new Set([b_index]);

    const min = 0;
    const max = gchilds.length;

    while(set.size < gchilds.length) {
	const rand_float = Math.random() * (max - min) + min;
	const rand_index = Math.floor(rand_float);
	set.add(rand_index);
    }

    return Array.from(set);
}

// Reset Piece Order
function reset() {
    const shuffled = shuffle();

    for(let i=0;i < gchilds.length;i ++) {
	let index = shuffled[i];
	gchilds[index].style.gridArea = toArea(i + 1); // Area starts from 1

	// Count Wrong Pieces
	if(gchilds[i] != gchilds[index]) {
	    wrong_pieces ++;
	}
    }
}

// Helper Functions

function toArea(index) {
    const area = area_label + index;

    const i = toIndex(area);
    //console.log(i);

    return area;
}

function toIndex(area) {
    const index = area.slice(1);
    return Number(index);
}
