/*
	Histogram module version 0.1.0 ALPHA

	By Epistemex (c) 2015-2017
	www.epistemex.com
*/

Scope._histogram = function(data, options) {

	var
    rCtx = options.rCtx,
		gCtx = options.gCtx,
		bCtx = options.bCtx,
		lCtx = options.lCtx,
		show = options.show.toUpperCase(),
		h      = options.tHeight,
		w      = options.tWidth,
		r = new Uint32Array(256),
		g = new Uint32Array(256),
		b = new Uint32Array(256),
		l = new Uint32Array(256),
		rr, gg, bb, ll,
		lw = w * 0.0125,
		y = (h>>1) + 0.5,
		lumR = options.lumR,
		lumG = options.lumG,
		lumB = options.lumB,
		max = 1,
		alpha = Math.min(1, options.intensity / 255 + 0.75),
		scale,
		step = options.tWidth / 256,
		len = data.byteLength,
		i;

	// do actual histogram
	for(i = 0; i < len; i++) {
		rr = data[i++];
		gg = data[i++];
		bb = data[i++];
		ll = (rr * lumR + gg * lumG + bb * lumB + 0.5)|0;

		r[rr]++;
		g[gg]++;
		b[bb]++;
		l[ll]++;
	}

	// find max, skipping first and last
	for(i = 1; i < 255; i++) {
		max = Math.max(max, r[i], g[i], b[i], l[i]);
	}

	scale = options.tHeight / max;

	if (show.indexOf("R") > -1) {
		resetCtx(rCtx);
		rCtx.fillStyle = "rgba(255, 110, 110, " + alpha + ")";
		renderArray(rCtx, r);
	}

	if (show.indexOf("G") > -1) {
		resetCtx(gCtx);
		gCtx.fillStyle = "rgba(110, 255, 110, " + alpha + ")";
		renderArray(gCtx, g);
	}

	if (show.indexOf("B") > -1) {
		resetCtx(bCtx);
		bCtx.fillStyle = "rgba(110, 110, 255, " + alpha + ")";
		renderArray(bCtx, b);
	}

	if (show.indexOf("L") > -1) {
		resetCtx(lCtx);
		lCtx.fillStyle = "rgba(170, 170, 170, " + alpha + ")";
		lCtx.globalAlpha = 0.67;
		lCtx.globalCompositeOperation = "source-over";
		renderArray(lCtx, l);
	}

	lCtx.beginPath();
	lCtx.moveTo(((w*0.25)|0) + 0.5 , y - lw);
	lCtx.lineTo(((w*0.25)|0) + 0.5 , y + lw);
	lCtx.moveTo((w>>1) - lw , y);
	lCtx.lineTo((w>>1) + lw, y);
	lCtx.moveTo((w>>1) + 0.5, y - lw);
	lCtx.lineTo((w>>1) + 0.5, y + lw);
	lCtx.moveTo(((w*0.75)|0) + 0.5 , y - lw);
	lCtx.lineTo(((w*0.75)|0) + 0.5 , y + lw);
	lCtx.strokeStyle = "rgba(170, 170, 170, 0.75)";
	lCtx.globalCompositeOperation = "source-over";
	lCtx.stroke();

	function renderArray(ctx, arr) {

		var i = 0, x = 0;

		ctx.beginPath();
		ctx.moveTo(0, 0);

		while(i < 256) {
			ctx.lineTo(x, arr[i++] * scale);
			x += step;
		}

		ctx.lineTo(x, 0);
		ctx.fill();
	}

	function resetCtx(ctx) {
		ctx.setTransform(1, 0, 0, -1, 0, options.tHeight);
		ctx.globalCompositeOperation = "lighten";
		ctx.globalAlpha = 1;
	}

	return {
		r: r,
		g: g,
		b: b,
		luma: l,
		step: step,
		max: max,
		scale: scale
	}
};