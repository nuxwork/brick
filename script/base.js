function Rect(left, top, width, height){
	this.set(left, top, width, height);
}

Rect.prototype.set = function(left, top, width, height){
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;

	this.right = left + width;
	this.bottom = top + height;
}

Rect.prototype.contain = function(x, y){
	return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
}

function Point(x, y){
	this.x = x;
	this.y = y;
}

function Size(w, h){
	this.width = w;
	this.height = h;
}

function CalcElementSize(e){
	e.width = e.style.width || e.clientWidth || e.offsetWidth || e.scrollWidth;
	e.height = e.style.height || e.clientHeight || e.offsetHeight || e.scrollHeight;
}

function include(path){ 
	var a=document.createElement("script"); 
	a.type = "text/javascript"; 
	a.src=path; 
	var head=document.getElementsByTagName("head")[0]; 
	head.appendChild(a); 
} 