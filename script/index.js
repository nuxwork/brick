// args
var wall = new Size(0, 0);			// 整个拼镜的尺寸
var trim = new Size(0, 0);			// 需要裁减的尺寸，目前只支持一个
var model;							// 每一个模块的尺寸

var wall_area = new Rect(0, 0, 0, 0);
var trim_area = new Rect(0, 0, 0, 0);

var wall_offset = new Point(0, 0);	// 整个拼镜的偏移量
var trim_offset = new Point(0, 0);	// 裁剪区域的偏移量

var scale_ratio = 1;				// 真实长度 与 画面像素比

// views
var container = new Size(0, 0);
var gallery;
var context;

function changeModel(src){
	model = new Model(src);
	calc();
}

function init(){
	var models = document.getElementById('models');
	for(var i=0; i!= config.models.length; i++){
		models.innerHTML += '<img class="model" src="' + config.models[i].src + '"onclick="changeModel(this.src)">';
	}

	gallery = document.getElementById('gallery');
	context = gallery.getContext('2d');

	gallery.onmousedown = onMouseDown;
	gallery.onmousemove = onMouseMove;
	gallery.onmouseup = onMouseUp;

	

	var model_info = document.getElementById('model_info');
	model_info.onmousewheel = function(e){
		e.wheelDeltaY > 0 ? model.updateWidth(model.width + 1) :  model.updateWidth(model.width - 1);
		calc();
	};

	model = new Model(config.models[0].src);
	model.image.onload = function(){
		model.updateWidth(config.model_def_size);
		calc();
	}
}

function Model(src){
	this.image = new Image();
	this.image.src = src;

	this.updateWidth(config.model_def_size);
}

Model.prototype.updateWidth = function(width){
	if(width < config.model_min_size || width > config.model_max_size)
		return;

	if(this.image.width == 0) 
		return;

	this.width = width;
	this.height = this.width * (this.image.height / this.image.width); /*mm*/
}


function calc(){
	wall.width = document.getElementById('id_wall_width').value;
	wall.height = document.getElementById('id_wall_height').value;

	trim.width = document.getElementById('id_trim_width').value;
	trim.height = document.getElementById('id_trim_height').value;

	CalcElementSize(gallery);
	scale_ratio = wall_area.width / wall.width; 

	calcWallArea(gallery, wall, wall_area);

	context.beginPath();
	context.rect(wall_area.left, wall_area.top, wall_area.width, wall_area.height);
	context.clip();

	var w = 50, h = 50;
	var columns = gallery.width/model.width;
	var rows = gallery.height/model.height;

	document.getElementById('id_mouse_height').value = model.width;

	for(var i=0; i < columns; i++){
		for(var j=0;  j < rows; j++){
			context.drawImage(model.image, i*model.width, j*model.height, model.width, model.height);
		}
	}

	context.clearRect(model.width*7 + trim_offset.x, model.height*3 + trim_offset.y, trim.width*scale_ratio, trim.height*scale_ratio);
}

function calcWallArea(gallery, wall, wall_area){
	var g_ratio = gallery.width / gallery.height;
	var w_ratio = wall.width / wall.height;
	
	if(g_ratio > w_ratio){
		wall_area.set(0, 0, gallery.height*w_ratio, gallery.height);
	}else{
		wall_area.set(0, 0, gallery.width, gallery.width/w_ratio);
	}
}



var mouse_action = 0;   // 0 nothing, 1 down, 2 move, 3 up,
var mouse_down = false;

var d_x = 0, d_y=0;

function onMouseDown(e){
	mouse_action = 1;
	mouse_down = true;

	d_x = e.x;
	d_y = e.y;
}

function onMouseMove(e){
	document.getElementById('id_mouse_width').value = e.x;

	mouse_action = 2;
	if(mouse_down && (d_x !=0 || d_y != 0)){
		trim_offset.x = e.x - d_x;
		trim_offset.y = e.y - d_y;

		calc();
	}
}

function onMouseUp(e){
	trim_offset.x = 0;
	trim_offset.y = 0;
	mouse_down = false;
	mouse_action = 3;
}