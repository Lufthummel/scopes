/*
	Vector module version 0.1.0 ALPHA

	By Epistemex (c) 2015-2016
	www.epistemex.com
*/
Scope._vector = function(data, options) {

	var	dia = Math.min(options.tWidth, options.tHeight)>>1,
		radius = dia * 0.5,
		radius2 = (radius * 0.9)|0,
		ctx = options.rCtx,
		tCtx = Scope._vector._tmp,
		scope = new Uint8ClampedArray(dia * dia),
		len = data.byteLength,
		i, r, g, b, p;

	if (!tCtx) {
		Scope._vector._tmp = tCtx = createTmp(dia);
	}

	for(i = 0; i < len; i++) {
		r = data[i++];
		g = data[i++];
		b = data[i++];
		p = rgb2xy(r, g, b, radius, radius, radius2);
		scope[p.y * dia + p.x]++;
	}

	renderArray(tCtx, ctx, scope);

	function renderArray(ctx, dCtx, arr) {

		var x, y, p, v,
			idata = ctx.createImageData(dia, dia),
			data = new Uint32Array(idata.data.buffer);

		for(y = 0; y < dia; y++) {
			for(x = 0; x < dia; x++) {
				p = y * dia + x;
				v = Math.min(255, arr[p] * options.intensity);
				data[p] = (v << 24) | 0xbbbb77;
			}
		}

		ctx.putImageData(idata, 0, 0);

		if (!Scope._graticule) Scope._createGraticule(radius<<1);

		//dctx.setTransform(1,0,0,1,0,0);
		dCtx.globalCompositeOperation = "source-over";
		dCtx.clearRect(0, 0, dia<<1, dia<<1);
		dCtx.drawImage(ctx.canvas, 0, 0, dia, dia, 0, 0, dia<<1, dia<<1);
		dCtx.drawImage(Scope._graticule, 0, 0);
	}

	function rgb2xy(r, g, b, x, y, radius) {

		r /= 255;
		g /= 255;
		b /= 255;

		var max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			dlt = max - min,
			hue, sat,
			l = (max + min) * 0.5;

		if (dlt) {
			if (r === max)
				hue = (g - b) / dlt;
			else {
				if (g === max)
					hue = 2 + (b - r) / dlt;
				else
					hue = 4 + (r - g) / dlt
			}

			sat = (l < 0.5 ? dlt / (2 - max - min) : dlt / (max + min));
			//sat = e(sat);
			sat *= radius;

			hue *= 1.0471975511965976;			// 60° in radians
			if (hue < 0) hue += Math.PI * 2;
		}
		else
			hue = sat = 0;

		hue += 0.23736477827122882;				// -(90 - 76.4°)

		//function e(t) {return Math.pow(t, 0.47)}

		return {
			x: (x - sat * Math.sin(hue) + 0.5)|0,
			y: (y - sat * Math.cos(hue) + 0.5)|0
		}
	}

	function createTmp(sz) {
		var c = document.createElement("canvas"),
			ctx = c.getContext("2d", {alpha: false});
		c.width = c.height = sz;

		return ctx
	}
};
Scope._vector._tmp = null;
