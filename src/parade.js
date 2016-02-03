/*
	RGB Parade module version 0.1.0 ALPHA

	By Epistemex (c) 2015-2016
	www.epistemex.com
*/

Scope._parade = function(data, options) {

	var ctx    = options.lCtx,
		w      = options.sWidth,
		h      = 256, //options.tHeight,
		r      = new Uint8ClampedArray(256 * w),
		g      = new Uint8ClampedArray(256 * w),
		b      = new Uint8ClampedArray(256 * w),
		rr, gg, bb,
		x, y, p;

	// do actual RGB parade waveform
	for(y = 0; y < h; y++) {
		for(x = 0; x < w; x++) {
			p = (y * w + x) << 2;

			rr = data[p++];
			gg = data[p++];
			bb = data[p++];

			r[rr * w + x]++;
			g[gg * w + x]++;
			b[bb * w + x]++;
		}
	}

	renderArray(ctx, r, g, b);

	function renderArray(ctx, r, g, b) {

		var w3 = (w + 1) * 3,
			idata = ctx.createImageData(w3, 256),
			data = new Uint32Array(idata.data.buffer),
			intensity = options.intensity,
			offset = w,
			lw = w3 * 0.025,
			lh = w3 * 0.0125,
			x, y, py, pyi;

		for(y = 0; y < 256; y++) {
			py = y * w;
			pyi = ((h - 1) - y) * w3;
			for(x = 0; x < w; x++) {
				var p = py + x,
					p2 = pyi + x,
					rr = Math.min(255, r[p] * intensity) << 24,
					gg = Math.min(255, g[p] * intensity) << 24,
					bb = Math.min(255, b[p] * intensity) << 24;

				data[p2] = rr | 0x7777ff;
				data[p2 + offset + 1] = gg | 0x77ff77;
				data[p2 + (offset << 1) + 2] = bb | 0xff7777;
			}
		}
		ctx.putImageData(idata, 0, 0);

		ctx.beginPath();
		drawMeter(((h * 0.25)|0) + 0.5, lw * 0.5);
		drawMeter((h>>1) + 0.5, lw);
		drawMeter(((h * 0.75)|0) + 0.5, lw * 0.5);
		ctx.moveTo(0, h-1);
		ctx.lineTo(w3, h-1);
		ctx.stroke();

		function drawMeter(hh, lw) {
			ctx.moveTo(0 , hh);
			ctx.lineTo(lw, hh);
			ctx.moveTo(w - lw , hh);
			ctx.lineTo(w + lw, hh);
			ctx.moveTo(w * 2 + 1 - lw , hh);
			ctx.lineTo(w * 2 + 1 + lw, hh);
			ctx.moveTo(w3 - lw , hh);
			ctx.lineTo(w3, hh);

			ctx.moveTo(w + 0.5, hh - lh);
			ctx.lineTo(w + 0.5, hh + lh);
			ctx.moveTo(w*2 + 1.5, hh - lh);
			ctx.lineTo(w*2 + 1.5, hh + lh);
		}

	}
};