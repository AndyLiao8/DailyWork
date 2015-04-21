$(function(){
	$( "#accordion" ).accordion();
	_CanvasManager.bindEvent();
});
var _CanvasManager=(function(){
	var CanvasContext=null,canvasObject=null;
		preStatus="",
		customCodes=null;
	CanvasRenderingContext2D.prototype.clear = 
	  CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
	    if (preserveTransform) {
	      this.save();
	      this.setTransform(1, 0, 0, 1, 0, 0);
	    }

	    this.clearRect(0, 0, this.canvas.width, this.canvas.height);

	    if (preserveTransform) {
	      this.restore();
	    }           
	};
	function init(){
		getContext();
		drawLine();
		preStatus="canvas";
		customCodes=$("#customcodes");
	}
	function getContext(){
		if(CanvasContext!=null)return CanvasContext;
		canvasObject=$("#myCanvas");
		CanvasContext=canvasObject.get(0).getContext("2d");
		return CanvasContext;
	}
	function switchSection(source){
		var cat=source.data("category");
		if(cat!==preStatus){
			var target=source.next();
			canvasObject.appendTo(target);
			CanvasContext.clear();
			CanvasContext.lineWidth=5;
			CanvasContext.strokeStyle="black";
		}
	}

	function drawLine(category){
		if(preStatus==category)return;
		CanvasContext.beginPath();
		CanvasContext.moveTo(10,10);
		CanvasContext.lineTo(200,10);
		CanvasContext.stroke();
	}

	//lineCap:butt,round,square
	function drawDetailLine(width,color,cap){
		CanvasContext.beginPath();
		CanvasContext.moveTo(10,10);
		CanvasContext.lineTo(200,10);
		CanvasContext.lineWidth=width||10;

		CanvasContext.strokeStyle=color||"red";
		CanvasContext.lineCap=cap||"butt";
		CanvasContext.stroke();
	}
	//curves
	function drawCurveByType(dir,tp){
		switch(tp){
			case "curve":
			drawCurves(dir);
			break;
			case "quadratic":
			drawQuadratic();
			break;
			case "bezier":
			drawBezierCurve();
			break;
		}
	}
	//arc(px,py,startAngle,endAngle,counterClockwise);
	function drawCurves(cw){
		var px=canvasObject.get(0).width/2;
		var py=canvasObject.get(0).height/2;
		var sAngle=1.1*Math.PI;
		var eAngle=1.9*Math.PI;
		var radius=50;
		CanvasContext.beginPath();
		CanvasContext.arc(px,py,radius,sAngle,eAngle,cw);
		CanvasContext.lineWidth=5;
		CanvasContext.lineCap="butt";

		CanvasContext.strokeStyle="#000";
		CanvasContext.stroke();
	}
	//quadraticCurveTo
	function drawQuadratic(){
		CanvasContext.beginPath();
		CanvasContext.moveTo(188,150);
		CanvasContext.quadraticCurveTo(288,0,388,150);
		CanvasContext.width=10;

		CanvasContext.stroke();
	}
	//bezier: it is defined by current point,two control point and an ending point.
	function drawBezierCurve(){
		CanvasContext.beginPath();
		CanvasContext.moveTo(155,120);
		CanvasContext.bezierCurveTo(100,10,388,10,288,170);
		CanvasContext.lineWidth=10;
		CanvasContext.stroke();
	}
	//Canvas-Paths
	function drawPathsByType(tp,join,wd){
		switch(tp){
			case "paths":
			drawPaths(wd);
			break;
			case "join":
			drawLineWithJoin(join,wd);
			break;
			case "corner":
			drawRoundCorner(wd);
			break;
		}
	}
	function drawPaths(wd){
		CanvasContext.beginPath();
		CanvasContext.moveTo(50,10);
		CanvasContext.lineTo(100,150);
		CanvasContext.quadraticCurveTo(150,20,300,130);
		CanvasContext.bezierCurveTo(250,15,240,10,240,110);
		CanvasContext.lineTo(310,80);
		CanvasContext.lineWidth=wd||10;

		CanvasContext.stroke();
	}
	//lineJoin: miter,round and bevel,default it is miter
	function drawLineWithJoin(join,wd){
		CanvasContext.beginPath();
		CanvasContext.moveTo(100,200);
		CanvasContext.lineTo(150,10);
		CanvasContext.lineTo(200,200);
		CanvasContext.lineJoin=join||"miter";
		CanvasContext.lineWidth=wd||10;

		CanvasContext.stroke();
	}
	//corner
	function drawRoundCorner(wd){
		var width=200,height=100,
			rx=10,ry=10,
			radius=50;
		CanvasContext.beginPath();
		CanvasContext.moveTo(rx,ry);
		CanvasContext.lineTo(rx+width-radius,ry);
		CanvasContext.arcTo(rx+width,ry,rx+width,ry+radius,radius);
		CanvasContext.lineTo(rx+width,ry+height);
		CanvasContext.lineWidth=wd||5;

		CanvasContext.strokeStyle="blue";
		CanvasContext.stroke();
	}
	//Shape
	function drawShapeByType(tp){
		switch(tp){
			case "custom":
			drawCustomShape();
			break;
			case "rect":
			drawRectCircle();
			break;
		}
	}
	function drawCustomShape(){
		CanvasContext.beginPath();
		CanvasContext.moveTo(100,100);
		CanvasContext.bezierCurveTo(110,80,120,100,100,120);
		CanvasContext.bezierCurveTo(140,140,140,200,100,230);
		CanvasContext.bezierCurveTo(80,160,60,160,100,100);
		CanvasContext.lineWidth=5;
		CanvasContext.strokeStyle="black";
		CanvasContext.fillStyle="#ccc";
		CanvasContext.fill();
		CanvasContext.lineJoin="round";
		CanvasContext.stroke();
	}
	function drawRectCircle(){
		CanvasContext.beginPath();
		CanvasContext.lineWidth=5;
		CanvasContext.rect(10,10,200,100);
		CanvasContext.fillStyle="red";
		CanvasContext.fill();
		CanvasContext.beginPath();
		CanvasContext.arc(300,200,40,0,Math.PI*2,false);
		CanvasContext.fillStyle="blue";
		CanvasContext.fill();
	}
	//gradient
	function drawGradientByType(tp){
		var grd;
		// draw a rect
		CanvasContext.rect(20,20,400,100);
		//CanvasContext.lineWidth=1;
		grd=CanvasContext.createLinearGradient(20,20,400,300);
		switch(tp){
			case "linear":
			grd=CanvasContext.createLinearGradient(20,20,400,300);
			break;
			case "radial":
			grd=CanvasContext.createRadialGradient(220,70,10,220,70,80);
			break;
		}		
		if(grd){
			grd.addColorStop(0,"#8ed6ff");
			grd.addColorStop(1,"#004cb3");
			CanvasContext.fillStyle=grd;
			CanvasContext.fill();
		}
	}
	//images
	function drawImageByType(tp,t,l,w,h,dx,dy,dw,dh){
		var image=new Image();
		switch(tp){
			case "fill":
			image.onload=function(){
				//repeat,no-repeat,repeat-x,repeat-y
				CanvasContext.rect(0,0,canvasObject.width(),canvasObject.height());
				var pattern=CanvasContext.createPattern(image,"no-repeat");
				CanvasContext.fillStyle=pattern;
				CanvasContext.fill();
			}
			image.src="images/bg.jpg";
			break;
			case "drawimage":
			image.src="images/mm.jpg";
			image.onload=function(){
				CanvasContext.drawImage(image,t||10,l||10,w||500,h||400);
			}
			break;
		}
	}
	//text
	function drawFillText(tp,align,vAlign){
		CanvasContext.font="italic 40pt Calibri";//normal,blod
		CanvasContext.fillStyle="blue";
		switch(tp){
			case "normal":
			CanvasContext.textAlign=align||"center";
			CanvasContext.textBaseline=vAlign||"alphabetic";
			CanvasContext.fillText("faile",150,100);			break;
			case "stroke":
			CanvasContext.lineWidth=3;
			CanvasContext.strokeText("Hello World!",150,100);
			break;
		}
		
	}
	//Translate
	function funTranslate(tp){
		var cw=canvasObject.width(),
			ch=canvasObject.height(),rectw=150,recth=75;
		CanvasContext.setTransform(1,0,0,1,0,0);
		CanvasContext.translate((cw-rectw)/2,(ch-recth)/2);
		switch(tp){			
			case "scale":
				CanvasContext.scale(1,0.5);
			break;
			case "rotate":
				CanvasContext.rotate(Math.PI/4);
			break;
			case "custom":
				CanvasContext.transform(1,0,0,1,cw/2,ch/2);
			break;
			case "shear":
				CanvasContext.transform(1,0.5,0,1,0,0);
			break;
			case "mirror":
				CanvasContext.scale(-1,1);
				CanvasContext.font="30pt Calibri";
				CanvasContext.textAlign="center";
				CanvasContext.fillStyle="blue";
				CanvasContext.fillText("Hello",0,0);
			return;
		}
		CanvasContext.fillStyle="#ccc";
		CanvasContext.fillRect(0,0,rectw,recth);
	}
	function funShadows(tp){
		CanvasContext.setTransform(1,0,0,1,0,0);
		if(tp=="shadow"){
			CanvasContext.rect(10,10,150,80);
			CanvasContext.fillStyle="red";
			CanvasContext.shadowColor="#999";
			CanvasContext.shadowBlur=20;
			CanvasContext.shadowOffsetX=15;
			CanvasContext.shadowOffsetY=15;
			CanvasContext.fill();
		}else if(tp=="alpha"){
			CanvasContext.beginPath();
			CanvasContext.rect(10,10,100,100);
			CanvasContext.fillStyle="blue";
			CanvasContext.fill();

			CanvasContext.beginPath();
			CanvasContext.globalAlpha=0.5;
			CanvasContext.arc(80,80,50,0,2*Math.PI,false);
			CanvasContext.fillStyle="red";
			CanvasContext.fill();
		}else if(tp=="clip"){
			clipFunc();
		}
	}
	function clipFunc(){
		var radius=75;
		CanvasContext.save();
		CanvasContext.beginPath();
		CanvasContext.arc(200,200,radius,0,2*Math.PI,false);
		CanvasContext.clip();

		CanvasContext.beginPath();
		CanvasContext.arc(150,150,radius,0,2*Math.PI,false);
		CanvasContext.fillStyle="blue";
		CanvasContext.fill();

		CanvasContext.beginPath();
		CanvasContext.arc(250,250,radius,0,2*Math.PI,false);
		CanvasContext.fillStyle="red";
		CanvasContext.fill();

		CanvasContext.restore();
		CanvasContext.beginPath();
		CanvasContext.arc(200,200,radius,0,2*Math.PI,false);
		CanvasContext.strokeStyle="red";
		CanvasContext.stroke();
	}
	function bindEvent(){
		init();
		$("#customcodes").val("_CanvasManager.context");
		$(".section-title").click(function(){
			var category=$(this).data("category");
			
			switchSection($(this));
			switch(category){
				case "canvas":
					drawLine(category);
				break;
				case "line":
					customCodes.val("_CanvasManager.drawDetailLine(5,'red','round')");
				break;
				case "curves":
					customCodes.val("_CanvasManager.drawCurveByType(false,'curve')");
				break;
				case "paths":
					customCodes.val("_CanvasManager.drawPathsByType('paths')");
				break;
				case "shapes":
					customCodes.val("_CanvasManager.drawShapeByType('custom')");
				break;
				case "fillstyle":
					customCodes.val("_CanvasManager.drawGradientByType('linear')");
				break;
				case "image":
					customCodes.val("_CanvasManager.drawImageByType('fill')");
				break;
				case "filltext":
					customCodes.val("_CanvasManager.drawFillText('normal')");
				break;
				case "translate":
					customCodes.val("_CanvasManager.funTranslate('translate')");
				break;
				case "shadows":
					customCodes.val("_CanvasManager.funShadows('shadow')");
				break;
			}
			preStatus=category;
		});
		$("#btn-run").click(function(){
			var sc=customCodes.val();
			if($.trim(sc)!==""){
				CanvasContext.clear();
				eval(sc);
			}
		});
		$("#btn-clear").click(function(){
			customCodes.val("_CanvasManager.context");
		});
	}

	return{
		bindEvent:bindEvent,
		context:getContext,
		drawDetailLine:drawDetailLine,
		drawCurveByType:drawCurveByType,
		drawBezierCurve:drawBezierCurve,
		drawPathsByType:drawPathsByType,
		drawShapeByType:drawShapeByType,
		drawGradientByType:drawGradientByType,
		drawImageByType:drawImageByType,
		drawFillText:drawFillText,
		funTranslate:funTranslate,
		funShadows:funShadows
	}
})();