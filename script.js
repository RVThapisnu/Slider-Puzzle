const gparent = document.getElementsByTagName('gparent')[0];
const gchilds = document.getElementsByTagName('gchild');

const rows = 3;
const cols = 3;

// Blank piece Index
const b_index = 0;
const area_label = "p";

const pos = {
    "vert" : ["top","center","bottom"],
    "horz" : ["left","center","right"]
};

for (let i=0,col=0;i < gchilds.length;i ++) {

    if (i % cols == 0 && i != 0) {
	col ++;
    }

    // area starts from 1
    gchilds[i].style.gridArea = toArea(i+1);

    // Set except for 1st child
    if(i > b_index) {
	gchilds[i].style.backgroundPosition = `${pos['vert'][col]} ${pos['horz'][i % cols]}`;
	gchilds[i].addEventListener('click',function() {
	    swapper(this);
	});
    }
}

// Core Functions

// Swapping Pieces / Tiles
function swapper(obj) {
    const t_area = obj.style;
    const b_area = gchilds[b_index].style;


    const t_pos = toIndex(t_area.gridArea);
    const b_pos = toIndex(b_area.gridArea);

    const isVertical = checkVertical(t_pos,b_pos);
    const isHorizontal = checkHorizontal(t_pos,b_pos);

    if (isVertical || isHorizontal) {
	const tmp = t_area.gridArea;
        t_area.gridArea = b_area.gridArea;
	b_area.gridArea = tmp;
    }
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

// Helper Functions

function toArea(index) {
    const area = area_label + index;

    const i = toIndex(area);
    console.log(i);

    return area;
}

function toIndex(area) {
    const index = area.slice(1);
    return Number(index);
}
