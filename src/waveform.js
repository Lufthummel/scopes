/*
	Waveform module version 0.1.0 ALPHA

	By Epistemex (c) 2015-2016
	www.epistemex.com
*/

Scope._waveform = function(data, options) {

	var rCtx = options.rCtx,
		gCtx = options.gCtx,
		bCtx = options.bCtx,
		lCtx = options.lCtx,
		lumR = options.lumR,
		lumG = options.lumG,
		lumB = options.lumB,
		show = options.show,
		w    = options.sWidth,
		h    = 256, //options.tHeight,
		luma = (show.indexOf("L") > -1),
		r    = new Uint8ClampedArray(256 * w),
		g    = new Uint8ClampedArray(256 * w),
		b    = new Uint8ClampedArray(256 * w),
		l    = luma ? new Uint8ClampedArray(256 * w) : null,
		lw   = w * 0.025,
		lh   = w * 0.0125,
		rr, gg, bb, ll,
		x, y, p;

	// do actual waveform
	for(y = 0; y < h; y++) {
		for(x = 0; x < w; x++) {
			p = (y * w + x) << 2;

			rr = data[p++];
			gg = data[p++];
			bb = data[p++];

			r[rr * w + x]++;
			g[gg * w + x]++;
			b[bb * w + x]++;

			if (luma) {
				ll = (rr * lumR + gg * lumG + bb * lumB + 0.5) | 0;
				l[ll * w + x]++;
			}
		}
	}

	if (show === "RGB") {
		renderArray(lCtx, r, g, b, l);
	}
	else if (show === "R") {
		renderArrayComp(rCtx, r, 0x7777ff);
	}
	else if (show === "G") {
		renderArrayComp(gCtx, g, 0x77ff77);
	}
	else if (show === "B") {
		renderArrayComp(bCtx, b, 0xff7777);
	}
	else if (luma) {
		renderArrayComp(lCtx, l, 0xffffff);
	}

	lCtx.beginPath();
	drawMeter(lCtx, ((h * 0.25)|0) + 0.5, lw * 0.5);
	drawMeter(lCtx, (h >> 1) + 0.5, lw);
	drawMeter(lCtx, ((h * 0.75)|0) + 0.5, lw * 0.5);
	lCtx.moveTo(0, h-1);
	lCtx.lineTo(w, h-1);
	lCtx.stroke();

	function drawMeter(ctx, y, lw) {
		ctx.moveTo(0 , y);
		ctx.lineTo(lw, y);
		ctx.moveTo((w>>1) - lw , y);
		ctx.lineTo((w>>1) + lw, y);
		ctx.moveTo(w - lw , y);
		ctx.lineTo(w, y);

		ctx.moveTo((w>>1) + 0.5, y - lh);
		ctx.lineTo((w>>1) + 0.5, y + lh);
	}

	function renderArray(ctx, r, g, b) {
		var idata = ctx.createImageData(w, h),
			data = new Uint32Array(idata.data.buffer),
			intensity = options.intensity,
			y, x, py, pyi;

		for(y = 0; y < 256; y++) {
			py = y * w;
			pyi = ((h - 1) - y) * w;
			for(x = 0; x < w; x++) {
				var p = py + x,
					rr = Math.min(255, r[p] * intensity),
					gg = Math.min(255, g[p] * intensity),
					bb = Math.min(255, b[p] * intensity);
				data[pyi + x] = 0xff000000 | (bb << 16) | (gg << 8) | rr;
			}
		}
		ctx.putImageData(idata, 0, 0);
	}

	function renderArrayComp(ctx, c, color) {
		var idata = ctx.createImageData(w, h),
			data = new Uint32Array(idata.data.buffer),
			intensity = options.intensity;

		for(var y = 0, x, py, pyi; y < 256; y++) {
			py = y * w;
			pyi = (h - y) * w;
			for(x = 0; x < w; x++) {
				var p = py + x,
					p2 = pyi + x,
					cc = Math.min(255, c[p] * intensity);
				data[p2] = (cc << 24) | color;
			}
		}
		ctx.putImageData(idata, 0, 0);
	}

};