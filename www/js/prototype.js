Array.prototype.mkList = function (type) {
    var objs = [];
    this.forEach(function (value, key) {
        objs.push(value[type]);

    });
    return objs.getUnique();
}

Array.prototype.getObj = function (name, val) {
    var data = null;
    var index = null;
    this.forEach(function (value, key) {
        if (value[name] == val) {
            index = key
            data = value;
        }
    });
    return {index: index, data: data};

}


Array.prototype.getObjs = function (name, val) {
    var objs = [];
    this.forEach(function (value, key) {
        if (value[name] == val) {
            objs.push(value);
        }
    });
    return objs;
}

Array.prototype.getUnique = function () {
    var u = {}, a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}


Array.prototype.collectiveRemove = function (key, value) {
    var keep = [];
    this.forEach(function (item, index, object) {
        if (item[key] != value) {
            keep.push(item)
        }
    });
    return keep;
};