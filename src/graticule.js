/*
	Graticule for scope version 0.1.0 ALPHA

	By Epistemex (c) 2015-2017
	www.epistemex.com
*/

Scope._graticule = null;
Scope._createGraticule = function(radius) {

	var
    w = radius * 2,
		canvas = document.createElement("canvas"),
		ctx = canvas.getContext("2d"),
		bw = radius * 0.1,
		//lw = radius * 0.02,
		color = "rgba(255,255,170,0.5)",
		texts = ["G", "YL", "R", "MG", "B", "CY"],
		i;

	canvas.width = canvas.height = w;
	Scope._graticule = canvas;

	ctx.save();
	ctx.globalAlpha = 1;
	ctx.setTransform(1, 0, 0, 1, radius + 0.5, radius + 0.5);
	ctx.strokeStyle = color;

	// outer circle
	ctx.arc(0, 0, radius * 0.9, 0, 2*Math.PI);
	ctx.stroke();

	// 50%
	ctx.beginPath();
	ctx.arc(0, 0, radius * 0.3, 0, 2*Math.PI);
	ctx.globalAlpha = 0.25;
	ctx.stroke();

	// 75%
	ctx.beginPath();
	ctx.arc(0, 0, radius * 0.54, 0, 2*Math.PI);
	ctx.globalAlpha = 0.5;
	ctx.strokeStyle = "#f00";
	ctx.stroke();

	ctx.strokeStyle = color ;
	ctx.globalAlpha = 1;

	// main cross
	cross(ctx, 0.75);

	// skin cross
	ctx.rotate(-(90-57) / 180 * Math.PI);
	cross(ctx, 0.33);
	ctx.rotate((90-57) / 180 * Math.PI);

	// HUE wheel
	ctx.beginPath();
	ctx.rotate(-0.23736477827122882);

	ctx.save();
	ctx.lineWidth = 3;
	ctx.rotate(-0.5 * Math.PI);

	for(i = 359; i >= 0; i--) {
		ctx.beginPath();
		ctx.arc(0, 0, radius - 2, 0, 0.0175);
		ctx.rotate(0.017453);
		ctx.strokeStyle = "hsl("+ i + ", 90%, 33%)";
		ctx.stroke();
	}
	ctx.restore();

	ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
	ctx.beginPath();
	for(i = 0; i < 360; i += 5) {
		ctx.rotate(5 / 180 * Math.PI);					// 5°
		ctx.moveTo(((i-1) % 6 === 0) ? radius - 14 : radius - 9, 0);
		ctx.lineTo(radius - 4, 0);
		//ctx.fillText((i + 95) % 360, radius*0.92,0);
	}
	ctx.stroke();

	// boxes 100% / 75%
	ctx.font = ((radius * 0.075)|0) + "px sans-serif";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.beginPath();

	for(i = 0; i < 6; i++) {

		// create gap in underlying circle
		ctx.clearRect(-bw, radius * 0.85, bw * 2, bw);
		ctx.clearRect(-bw*0.75, radius * 0.49, bw * 1.5, bw);

		// boxes
		ctx.rect(-bw * 0.5, radius * 0.85, bw, bw);
		ctx.rect(-bw * 0.5, radius * 0.49, bw, bw);
		ctx.rotate(1.0471975511965976);						// 60°

		// box label
		ctx.save();
		ctx.translate(0, radius * 0.75);
		ctx.rotate(-1.0471975511965976 * i - 0.8098327729253688);
		ctx.fillText(texts[i], 0, 0);
		ctx.restore();
	}

	// Q label
	ctx.strokeStyle = color;
	ctx.stroke();
	ctx.rotate(-0.28);
	ctx.fillText("Q", radius * 0.83, 0);

	// PST labels
	ctx.rotate(0.35);
	ctx.globalAlpha = 0.5;
	ctx.font = ((radius * 0.05)|0) + "px sans-serif";
	ctx.fillText("50%", radius * 0.38, 0);
	ctx.fillText("75%", radius * 0.61, 0);
	ctx.fillText("100%", radius * 0.8, 0);

	// HUE fan center pies
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, radius + 0.5, radius + 0.5);
	ctx.globalCompositeOperation = "destination-over";
	ctx.rotate(-Math.PI - 0.23736477827122882);		// 180°

	for(i = 5; i >= 0; i--) {
		ctx.rotate(1/3 * Math.PI);		// 60°
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(radius * 0.9, 0);
		ctx.arc(0, 0, radius * 0.9, 0, 1/3 * Math.PI);
		ctx.fillStyle = "hsla(" + ((i+1) * 60) + ",100%, 80%, 0.1)";
		ctx.fill();
	}

	// HUE fan center
	ctx.globalCompositeOperation = "source-over";
	ctx.beginPath();
	for(i = 0; i < 6; i++) {
		ctx.rotate(1/3 * Math.PI);		// 60°
		ctx.moveTo(0, 0);
		ctx.lineTo(radius * 0.55, 0);
	}
	ctx.strokeStyle = "rgba(70, 70, 70, 0.33)";
	ctx.stroke();
	ctx.restore();

	ctx.restore();

	function cross(ctx, pst) {
		ctx.beginPath();

		ctx.moveTo(0, radius * pst);	// bottom
		ctx.lineTo(0, radius * 0.95);

		ctx.moveTo(0, -radius * pst);	// top
		ctx.lineTo(0, -radius * 0.95);

		ctx.moveTo(radius * pst, 0);	// right
		ctx.lineTo(radius * 0.95, 0);

		ctx.moveTo(-radius * pst, 0);	// left
		ctx.lineTo(-radius * 0.95, 0);

		ctx.stroke();
	}

};

