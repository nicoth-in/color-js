function Color(input) {
	this.a = 1;
  this.getColor(input);
}
Color.prototype.getColor = function(string) {
  if(string.charAt(0) == "#") return this.fromHex(string)
  else if(~string.indexOf("rgb(")) return this.fromRGB(string)
  else if(~string.indexOf("rgba(")) return this.fromRGBa(string)
  else if(~string.indexOf("hsl(")) return this.fromHSL(string)
  else if(~string.indexOf("hsla(")) return this.fromHSLa(string)
  else if(~string.indexOf("hsv(")) return this.fromHSV(string)
  else if(~string.indexOf("hsva(")) return this.fromHSVa(string)
  //else if(~string.indexOf("hwb(")) return this.fromHWB(string)
  //else if(~string.indexOf("cmyk(")) return this.fromCMYK(string)
};


Color.prototype.fromRGB = function(string) {
	var colors = this.getNums(string);
  this.r = colors[0];
  this.g = colors[1];
  this.b = colors[2];
}
Color.prototype.fromRGBa = function(string) {
	var colors = this.getNums(string);
  this.r = colors[0];
  this.g = colors[1];
  this.b = colors[2];
  if(colors.length == 5) this.a = parseFloat(colors[3]+"."+colors[4])
  else this.a = colors[3];
}
Color.prototype.fromHSL = function(string) {
	var colors = this.getNums(string);
  this.HSLtoRGB(colors[0]/360, colors[1]/100, colors[2]/100);
}
Color.prototype.fromHSLa = function(string) {
	var colors = this.getNums(string);
  this.HSLtoRGB(colors[0]/360, colors[1]/100, colors[2]/100);
  if(colors.length == 5) this.a = parseFloat(colors[3]+"."+colors[4])
  else this.a = colors[3];
}
Color.prototype.fromHSV = function(string) {
	var colors = this.getNums(string);
  this.HSVtoRGB(colors[0]/360, colors[1]/100, colors[2]/100);
}
Color.prototype.fromHSVa = function(string) {
	var colors = this.getNums(string);
  this.HSVtoRGB(colors[0]/360, colors[1]/100, colors[2]/100);
  if(colors.length == 5) this.a = parseFloat(colors[3]+"."+colors[4])
  else this.a = colors[3];
}

Color.prototype.getHSV = function() {
  this.RGBtoHSV(this.r, this.g, this.b);
  return "hsv("+Math.round(this.h*360)+", "+Math.round(this.s*100)+"%, "+Math.round(this.v*100)+"%)";
}
Color.prototype.getHSVa = function() {
  this.RGBtoHSV(this.r, this.g, this.b);
  return "hsva("+Math.round(this.h*360)+", "+Math.round(this.s*100)+"%, "+Math.round(this.v*100)+"%, "+this.a+")";
}
Color.prototype.getRGB = function() {
  return "rgb("+this.r+", "+this.g+", "+this.b+")";
}
Color.prototype.getRGBa = function() {
  return "rgba("+this.r+", "+this.g+", "+this.b+", "+this.a+")";
}
Color.prototype.getHSL = function() {
  this.RGBtoHSL(this.r, this.g, this.b);
  return "hsl("+Math.round(this.h*360)+", "+Math.round(this.s*100)+"%, "+Math.round(this.l*100)+"%)";
}
Color.prototype.getHSLa = function() {
  this.RGBtoHSL(this.r, this.g, this.b);
  return "hsla("+Math.round(this.h*360)+", "+Math.round(this.s*100)+"%, "+Math.round(this.l*100)+"%, "+this.a+")";
}
Color.prototype.toString = function() {
	return this.getHex();
}
Color.prototype.getHex = function(string) {
  return "#"+this.r.toString(16)+this.g.toString(16)+this.b.toString(16);
}
// Hex to dec -> set rgb
Color.prototype.fromHex = function(string) {
	var colors = string.split("#")[1];
  this.r = parseInt("0x"+colors.slice(0, 2));
  this.g = parseInt("0x"+colors.slice(2, 4));
  this.b = parseInt("0x"+colors.slice(4, 6));
}
// Parser
Color.prototype.getNums = function(string) {
  var reg = /([0-9]*)/gm;
  var colors = []
  while((m = reg.exec(string))!== null) {
    if (m.index === reg.lastIndex) {
    	reg.lastIndex++;
    }
    if (m[0]!="") colors.push(m[0]);
  }
  return colors;
}
Color.prototype.RGBtoHSL = function(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
	this.h = h;
  this.s = s;
  this.l = l;
}
Color.prototype.HSLtoRGB = function(h, s, l) {
  var r, g, b;
  if (s == 0) {
    r = g = b = l;
  } else {
    var q = (l < 0.5) ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = this.HUEtoRGB(p, q, h + 1/3);
    g = this.HUEtoRGB(p, q, h);
    b = this.HUEtoRGB(p, q, h - 1/3);
  }
  this.r = Math.max(0, Math.min(Math.round(r * 255), 255));
  this.g = Math.max(0, Math.min(Math.round(g * 255), 255));
  this.b = Math.max(0, Math.min(Math.round(b * 255), 255));
}
Color.prototype.HUEtoRGB = function(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}
Color.prototype.RGBtoHSV = function(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;
  var d = max - min;
  s = max == 0 ? 0 : d / max;
  if (max == min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  this.h = h;
  this.s = s;
  this.v = v;
}
Color.prototype.HSVtoRGB = function(h, s, v) {
  var r, g, b;
  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  this.r = Math.round(r * 255);
  this.g = Math.round(g * 255);
  this.b = Math.round(b * 255);
}
