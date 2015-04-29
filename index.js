/*
 * http://en.wikipedia.org/wiki/XXTEA
 */

var XXTeaBuffer = function() {};
var _key = null;
var _keyArray = [];
var _debug = false;
var _isLE = true;

var _delta = 0x9e3779b9;

function bufToLongArray(buf) {
    var result = [];
    if (buf.length % 4 != 0) throw Error("buf length must be double word aligned (n*4bytes).");
    for (var j=0; j<buf.length/4; j++) {
        if (_isLE)
            result[j] = buf.readUInt32LE(j*4);
        else 
            result[j] = buf.readUInt32BE(j*4);
        //if (_debug) console.log("j|result[j]: " + j + "|" + result[j]);
    }
    return result;
}

function longArrayToBuf(la) {
    var bres = new Buffer(la.length*4);
    for (var j=0; j<la.length; j++) {
        if (_isLE)
            bres.writeInt32LE(la[j],j*4);
        else
            bres.writeInt32BE(la[j],j*4);
        //if (_debug) console.log("j|bres.toString(hex)|la[j]: " + j + "|" + bres.toString("hex") + "|" + la[j]);

    }
    return bres;
}

function toBuf(plain) {
    if (!Buffer.isBuffer(plain)) {
        return new Buffer(plain, "hex");
    } else {
        return plain;
    }
}



XXTeaBuffer.prototype.setKey = function(key) {
    _key = toBuf(key);
    if (_key.length != 16) throw Error("key length must be 128 bits (16 bytes), or 32 hex digits");
    _keyArray = bufToLongArray(_key);
    if (_debug) console.log("keyArray: " + _keyArray);
};

XXTeaBuffer.prototype.setBE = function(bval) {
    _isLE = !bval;
};

XXTeaBuffer.prototype.encrypt = function(plain) {
    var v = bufToLongArray(toBuf(plain));
    var n = v.length;
    var z=v[n-1], y=v[0], sum=0, e, p, q, mx;

    q = Math.floor(6 + 52/n);
    while (q-- > 0) {
        sum = (sum + _delta) & 0xffffffff;
        e = (sum >> 2) & 3;
        for (p=0; p<n-1; p++) {
            y = v[p+1]; 
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (_keyArray[p & 3 ^ e] ^ z);
            z = v[p] = (v[p] + mx) & 0xffffffff;
        }
        y = v[0];
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (_keyArray[p & 3 ^ e] ^ z);
        z = v[n-1] =  (v[n-1] + mx) & 0xffffffff;
    }
    return longArrayToBuf(v); 

};

XXTeaBuffer.prototype.decrypt = function(encrypted) {
    var v = bufToLongArray(toBuf(encrypted));
    var n = v.length;
    var z=v[n-1], y=v[0], sum=0, e, p, q, mx;

    q = Math.floor(6 + 52/n);
    sum = (q*_delta) & 0xffffffff;
    if (_debug) console.log('sum: ' + sum);
    while (sum != 0) {
        e = (sum >> 2) & 3;
        for (p=n-1; p>0; p--) {
            z = v[p-1]; 
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (_keyArray[p & 3 ^ e] ^ z);
            y = v[p] = (v[p] - mx) & 0xffffffff;
        }
        z = v[n-1];
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (_keyArray[p & 3 ^ e] ^ z);
        y = v[0] = (v[0] - mx) & 0xffffffff;
        sum = (sum - _delta) & 0xffffffff;
        q--;
        if (_debug) console.log('sum|q again: ' + sum + '|'+ q);
    }
    return longArrayToBuf(v);
};

exports.XXTeaBuffer = new XXTeaBuffer();
