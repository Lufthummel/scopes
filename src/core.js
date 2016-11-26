/*!
	Scopes version 0.1.1 ALPHA
	(c) 2015-2016 epistemex.com

	Dual license applies (GPL2 and commercial licenses).
	See included readme for details.
*/

/**
 * Create a new scope for given image or video source.
 *
 * @param {*} source - Image, Video, Canvas element for source
 * @param {HTMLCanvasElement} target - target canvas to draw resulting scope to
 * @param {*} options - options (see below)
 * @param {number} [options.quality=2] - values 1, 2, 4 determines scope quality for some scopes
 * @param {string} [options.scopeType="histogram"] - either "histogram", "waveform", "parade" or "vector"
 * @param {string} [options.lumaType="709"] - either "601", "709" or "linear"
 * @param {boolean} [options.interpolate=false] - interpolate output scope or not
 * @param {string} [options.show="RGB"] - which channels to show. Available channels varies depending on scope-type.
 * @param {boolean} [options.scopeAlpha=false] - use or ignore alpha channel of scope canvas
 * @param {number} [options.intensity=16] - value between 1 and 100. Determines intensity of scope pixels depending on scope-type
 * @constructor
 */
function Scope(source, target, options) {

	options = options || {};

	var me = this,
		quality = options.quality || 2,
		interpolate = typeof options.interpolate === "boolean" ? options.interpolate : false,
	   	scopeType = options.scopeType || "histogram",
		lumaType = options.lumaType || "709",
		scopeAlpha = typeof options.scopeAlpha === "boolean" ? options.scopeAlpha : false,
		dOptions = {
			lumR: null,
			lumG: null,
			lumB: null,
			sWidth: null,
			sHeight: null,
			tWidth: null,
			tHeight: null,
			show: (options.show || "RGB").toUpperCase(),
			rCtx: null,
			gCtx: null,
			bCtx: null,
			lCtx: null,
			intensity: options.intensity || 16
		},
		tw, th,
		sw, sh,
		w, h,
		scope,
		scopes = ["histogram", "waveform", "parade", "vector"],
		scopeFuncs = [Scope._histogram, Scope._waveform, Scope._parade, Scope._vector],
	   	canvas = document.createElement("canvas"),
		ctx, dctx;

	/**
	 * Grab a snapshot of current video or image source, analyse and
	 * update current scope.
	 * @returns {*}
	 */
	this.update = function() {

		var data;

		ctx.drawImage(source, 0, 0, w, h);
		data = ctx.getImageData(0, 0, w, h).data;

		// clear target canvas
		if (scopeType === "histogram") dctx.clearRect(0, 0, tw, th);

		// do scope
		return scope(data, dOptions);
	};

	/**
	 * Get or set a scope type. If no argument is given, the current type
	 * will be returned as a string.
	 * @param {string} [type="histogram"] - scope type, valid values: histogram, waveform, parade, vector
	 * @returns {*}
	 */
	this.scopeType = function(type) {
		if (!arguments.length) return scopeType;

		var index = scopes.indexOf(type);
		if (index < 0) throw "Invalid scope type.";

		scopeType = type;

		scope = scopeFuncs[index];

		tw = target.width;
		th = target.height;
		sw = source.videoWidth || source.naturalWidth || source.width;
		sh = source.videoHeight || source.naturalHeight || source.height;

		Scope._graticule = null;
		Scope._vector._tmp = null;

		switch(type) {
			case "histogram":
				w = Math.ceil(sw / quality);
				h = Math.ceil(sh / quality);
				break;

			case "waveform":
				w = Math.floor(tw / 3) * 3;
				h = 256; //Math.min(256, Math.ceil(sh / quality));
				dctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
				break;

			case "parade":
				w = Math.floor(tw / 3) - 1;
				h = 256; //(256 / quality)|0;
				dctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
				break;

			case "vector":
				w = Math.ceil(sw / quality);
				h = Math.ceil(sh / quality);
				break;
		}

		dOptions.sWidth = canvas.width = w;
		dOptions.sHeight = canvas.height = h;
		dOptions.tWidth = tw;
		dOptions.tHeight = th;

		ctx = canvas.getContext("2d", {alpha: scopeAlpha});
		dctx = target.getContext("2d", {alpha: scopeAlpha});

		dctx.setTransform(1,0,0,1,0,0);
		dctx.globalAlpha = 1;
		dctx.clearRect(0, 0, tw, th);

		ctx.mozImageSmoothingEnabled =
		ctx.msImageSmoothingEnabled =
		ctx.oImageSmoothingEnabled =
		ctx.imageSmoothingEnabled = interpolate;

		dctx.mozImageSmoothingEnabled =
		dctx.msImageSmoothingEnabled =
		dctx.oImageSmoothingEnabled =
		dctx.imageSmoothingEnabled = false;

		dOptions.rCtx =
		dOptions.gCtx =
		dOptions.bCtx =
		dOptions.lCtx = dctx;
	};

	/**
	 * If target canvas was for some reason changed or resized, this
	 * call will setup the internal metrics for that to match the new
	 * size and so forth.
	 */
	this.refresh = function() {me.scopeType(scopeType)};

	/**
	 * Intensity value for the scopes. Does not affect the data, only
	 * the rendering of the data. Value 0 is not a valid value.
	 * @param {number} [newInt] - new value [1, 100]
	 * @returns {*}
	 */
	this.intensity = function(newInt) {
		if (!arguments.length)
			return (scopeType === "histogram") ? null : dOptions.intensity;

		dOptions.intensity = Math.max(0, Math.min(255, newInt)) * 2.55;
	};

	/**
	 * Which components to show in the scope. Not all scopes supports all
	 * combination. Use support() to list which channels and combinations
	 * are supported.
	 *
	 * The new channels are given as abbreviations for thw channel, f.ex.
	 * "RGBL" is red, green, blue and luminance channels. If no argument
	 * is given, current channels are returned instead as an upper-case
	 * string.
	 *
	 * @param {string} [channels="RGB"] - valid value channels: R, G, B, L
	 * @returns {*}
	 */
	this.show = function(channels) {
		if (!arguments.length) return dOptions.show;
		dOptions.show = channels.toUpperCase();
	};

	/**
	 * Quality setting for some of the scopes. Reducing quality can
	 * improve performance at the cost of some accuracy.
	 *
	 * The value must be in steps of 2^n; only 1, 2, 4 and 8 are supported
	 * where 1 is best, 8 is fastest.
	 *
	 * If no argument is given, current quality setting is returned.
	 *
	 * @param {number} [q=2] - new quality, 1, 2, 4 or 8.
	 * @returns {Function|*|boolean|number}
	 */
	this.quality = function(q) {
		if (!arguments.length) return quality;
		if ([1,2,4,8].indexOf(q) < 0) throw "Illegal quality value";

		if (q !== quality) {
			quality = q;
			me.scopeType(scopeType);
		}
	};

	/**
	 * The luma channel can be comverted from RGB in various. It defaults
	 * to industry standard BT.601. Also BT.709 and linear conversion are
	 * supported. An unsupported name will default to "601".
	 *
	 * If no argument is given, current luma type is returned.
	 *
	 * @param {string} [type="601"] - luma conversion scheme, valid values: 601, 709, linear
	 * @returns {Function|*|boolean|string}
	 */
	this.lumaType = function(type) {
		if (!arguments.length) return lumaType;

		var lumR, lumG, lumB;

		switch(type) {
			case "709":
				lumR = 0.2126;
				lumG = 0.7152;
				lumB = 0.0722;
				break;

			case "linear":
				lumR = lumG = lumB = 0.333;
				break;

			default: //'601':
				lumR = 0.299;
				lumG = 0.587;
				lumB = 0.114;
				break;
		}

		lumaType = type;
		dOptions.lumR = lumR;
		dOptions.lumG = lumG;
		dOptions.lumB = lumB;
	};

	/**
	 * A secondary quality setting. To increase performance internal
	 * image interpolation can be switched off. This increase performance
	 * but reduce accuracy. If defaults to off.
	 *
	 * @param {boolean} [state=false] - Turn on or off internal image interpolation
	 * @returns {*}
	 */
	this.interpolate = function(state) {
		if (!arguments.length) return interpolate;

		if (state !== interpolate) {
			interpolate = state;
			me.scopeType(scopeType);
		}
	};

	/**
	 * Returns supported settings for either the current scope type or
	 * the one given if any. An object is returned with properties set
	 * to true or false depending on what the scope supports. F.ex.
	 * RGB parade or vector scope will return false for the L channel.
	 *
	 * Use this to set up options for things like what channel combinations
	 * are allowed etc.
	 *
	 * @param {string} [type] - optional scope type, otherwise current
	 * @returns {*}
	 */
	this.support = function(type) {

		switch(type || scopeType) {
			case "histogram":
				return {
					R: true,
					G: true,
					B: true,
					L: true,
					RGB: true,
					RGBL: true,
					RG: true,
					RB: true,
					GB: true,
					quality: true
				};

			case "waveform":
				return {
					R: true,
					G: true,
					B: true,
					L: true,
					RGB: true,
					RGBL: false,
					RG: false,
					RB: false,
					GB: false,
					quality: false
				};

			case "parade":
				return {
					R: false,
					G: false,
					B: false,
					L: false,
					RGB: true,
					RGBL: false,
					RG: false,
					RB: false,
					GB: false,
					quality: false
				};

			case "vector":
				return {
					R: false,
					G: false,
					B: false,
					L: false,
					RGB: true,
					RGBL: false,
					RG: false,
					RB: false,
					GB: false,
					quality: true
				};
		}

		return null;
	};

	// set up scope type
	this.scopeType(scopeType);
	this.lumaType(lumaType);
}

// For Node.js
if (typeof exports !== "undefined") exports.Scopes = Scopes;