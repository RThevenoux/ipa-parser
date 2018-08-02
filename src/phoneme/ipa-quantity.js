const IpaQuantityValue = Object.freeze(
  {
    "EXTRASHORT": 1,
    "SHORT": 2,
    "HALFLONG": 3,
    "LONG": 4,
    "EXTRALONG": 5
  }
);

class IpaQuantity {
  constructor() {
    this.value = IpaQuantityValue.SHORT;
  }

  isShort() {
    return this.value <= IpaQuantityValue.SHORT;
  }

  isLong() {
    return this.value > IpaQuantityValue.SHORT;
  }

  /**
  * @param {String} label 
  */
  update(label) {
    switch (this.value) {
      case IpaQuantityValue.EXTRASHORT:
      case IpaQuantityValue.HALFLONG:
      case IpaQuantityValue.EXTRALONG:
        _exception(label);
      case IpaQuantityValue.LONG:
        if (label === "Long") {
          this.value = IpaQuantityValue.EXTRALONG;
        } else {
          _exception(label);
        }
        break;
      case IpaQuantityValue.SHORT: {
        switch (label) {
          case "Extra-short": this.value = IpaQuantityValue.EXTRASHORT; break;
          case "Half-long": this.value = IpaQuantityValue.HALFLONG; break;
          case "Long": this.value = IpaQuantityValue.LONG; break;
          default:
            _exception(label);
        }
      }
    }
  }

  getValueName() {
    for (let key in IpaQuantityValue) {
      if (IpaQuantityValue[key] === this.value) {
        return key;
      }
    }
  }

  _exception(label) {
    throw new Exception("Unexpected quantity symbol: " + label + " current quantity: " + this.getValueName());
  }
}

module.exports = IpaQuantity;
module.exports.Quantity = IpaQuantityValue;