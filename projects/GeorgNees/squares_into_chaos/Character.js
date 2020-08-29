var Character = {
  hue: 0,
  saturation: 0,
  rotation: 0,
  offset: {x: 0, y: 0},

  construct: function(r, o, h, s) {
    this.rotation   = r;
    this.offset     = {x: o.x, y: o.y};
    this.hue        = h;
    this.saturation = s;
  },

  getHue = function() {
    return hue;
  },

  getSaturation = function() {
    return saturation;
  },

  getRotation = function() {
    return rotation;
  },

  getOffset = function() {
    return offset;
  },

  getRelativeRotation = function(factor) {
    return rotation * factor;
  },

  getRelativeOffset = function(factor) {
    return {x: o.x * factor, y: o.y * factor}
  }
};
