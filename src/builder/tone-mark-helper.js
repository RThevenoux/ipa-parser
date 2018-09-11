const map = {
    "extra-high": [5],
    "high": [4],
    "mid": [3],
    "low": [2],
    "extra-low": [1],
    "rising": [1, 5],
    "falling": [5, 1],
    "high-rising": [4, 5],
    "low-rising": [1, 2],
    "low-falling": [2, 1],
    "high-falling": [5, 4],
    "rising-falling": [3, 4, 3],
    "falling-rising": [3, 2, 3]
};

module.exports = class ToneMarkHelper {
    constructor() {
        this.label = null;
    };

    set(label) {
        if (this.label == null) {
            this.label = label;
        } else {
            //Err
        }
    }

    isTone() {
        return this.label != null;
    }

    buildTone() {
        return { "segment": false, "category": "tone", "label": this.label, "heights": map[this.label] };
    }
};