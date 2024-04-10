/**
 * Parse numeric range such as '1-4','1,2', etc.
 */
export var numericRangeParser = function (input) {
    var output = [];
    var matched;
    var inputArr = input.split(',').map(function (i) { return i.trim(); });
    var dashNumberStr = '-?\\d+';
    var dashNumberRegex = new RegExp("^".concat(dashNumberStr, "$"));
    var dotNumberRegex = new RegExp('^' +
        '(' + dashNumberStr + ')' +
        '(' + '-|\\.\\.\\.?|\\u2025|\\u2026|\\u22EF' + ')' +
        '(' + dashNumberStr + ')' +
        '$');
    inputArr.forEach(function (str) {
        if (dashNumberRegex.test(str)) {
            output.push(parseInt(str, 10));
        }
        else if ((matched = str.match(dotNumberRegex))) {
            var lt = void 0;
            var rt = void 0;
            var sep = void 0;
            lt = matched[1], sep = matched[2], rt = matched[3];
            if (!lt || !rt)
                return;
            lt = parseInt(lt, 10);
            rt = parseInt(rt, 10);
            var incr = lt < rt ? 1 : -1;
            if (sep === '-' || sep === '..' || sep === '\u2025')
                rt += incr;
            for (var i = lt; i !== rt; i += incr) {
                output.push(i);
            }
        }
    });
    return output;
};
