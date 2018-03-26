'use strict';Object.defineProperty(exports,'__esModule',{value:!0});function _toConsumableArray(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}var PATTERNS=[{mustHave:[{row:0,col:1},{row:0,col:2}],needOne:[{row:0,col:-1},{row:-1,col:0},{row:1,col:0}]},{mustHave:[{row:0,col:-1},{row:0,col:-2}],needOne:[{row:0,col:1},{row:-1,col:0},{row:1,col:0}]},{mustHave:[{row:1,col:0},{row:2,col:0}],needOne:[{row:-1,col:0},{row:0,col:-1},{row:0,col:1}]},{mustHave:[{row:-1,col:0},{row:-2,col:0}],needOne:[{row:1,col:0},{row:0,col:-1},{row:0,col:1}]},{mustHave:[{row:0,col:-1},{row:0,col:1}],needOne:[{row:-1,col:0},{row:1,col:0}]},{mustHave:[{row:-1,col:0},{row:1,col:0}],needOne:[{row:0,col:-1},{row:0,col:1}]}],forEach=function(a,b){for(var c=0;c<a.length;c++)for(var d=0;d<a[c].length;d++)b({row:c,col:d},a[c][d])},copyGrid=function(a){return a.map(function(a){return[].concat(_toConsumableArray(a))})},getRandomPiece=function(a){return{type:Math.floor(Math.random()*a)+1}},getPiece=exports.getPiece=function(a,b){var c=2<arguments.length&&arguments[2]!==void 0?arguments[2]:{row:0,col:0},d=a[b.row+c.row];return d&&d[b.col+c.col]},isNeighbor=exports.isNeighbor=function(a,b){return 1===Math.abs(a.row-b.row+(a.col-b.col))},isEqualType=exports.isEqualType=function(a,b,c){var d=getPiece(a,b),e=getPiece(a,c);return!!(d&&e&&d.type===e.type)},getMoves=exports.getMoves=function(a){var b=[];return forEach(a,function(c){PATTERNS.forEach(function(d){var e,f=d.mustHave.every(function(b){var d=getPiece(a,c,b);if(d)return void 0===e&&(e=d.type),e===d.type});if(f)return d.needOne.forEach(function(d){var f={row:c.row+d.row,col:c.col+d.col},g=getPiece(a,f);g&&e===g.type&&b.push({from:c,to:f})})})}),b},getMatches=exports.getMatches=function(a){for(var b=[],c=0;c<a.length;c++)for(var d,e=1,f=a[c].length,g=0;g<f;g++){if(d=!1,g===f-1)d=!0;else{var l=getPiece(a,{row:c,col:g}),m=getPiece(a,{row:c,col:g},{row:0,col:1});l&&m&&l.type===m.type?e+=1:d=!0}d&&(3<=e&&b.push({row:c,col:g+1-e,length:e,horizontal:!0}),e=1)}for(var n=0;n<a[0].length;n++)for(var h,i=a.length,j=1,k=0;k<i;k++){if(h=!1,k===a.length)h=!0;else{var o=getPiece(a,{row:k,col:n}),p=getPiece(a,{row:k,col:n},{row:1,col:0});o&&p&&o.type===p.type?j+=1:h=!0}h&&(3<=j&&b.push({row:k+1-j,col:n,length:j,horizontal:!1}),j=1)}return b},removeMatches=exports.removeMatches=function(a,b){var c=copyGrid(a);return b.forEach(function(a){if(a.horizontal)for(var b=0;b<a.length;b++)c[a.row][a.col+b]=null;else for(var d=0;d<a.length;d++)c[a.row+d][a.col]=null}),c},swap=exports.swap=function(a,b){var c=copyGrid(a);return c[b.to.row][b.to.col]=a[b.from.row][b.from.col],c[b.from.row][b.from.col]=a[b.to.row][b.to.col],c},applyGravity=exports.applyGravity=function(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:'down',c=copyGrid(a),d={up:{col:0,row:1},down:{col:0,row:-1},left:{col:1,row:0},right:{col:-1,row:0}};return forEach(a,function(a){for(var e=a.row,f=a.col,g={from:{row:e,col:f},to:{row:e+d[b].row,col:f+d[b].col}},h=getPiece(c,g.from),i=getPiece(c,g.to);null===h&&i;)c=swap(c,g),g.from=Object.assign({},g.to),g.to={row:g.from.row+d[b].row,col:g.from.col+d[b].col},h=getPiece(c,g.from),i=getPiece(c,g.to)}),c},fillVoid=exports.fillVoid=function(a,b){var c=copyGrid(a);return forEach(c,function(a,d){var e=a.row,f=a.col;null===d&&(c[e][f]=getRandomPiece(b))}),c},createLevel=exports.createLevel=function(a){for(var b=a.rows,c=a.cols,d=a.types,e=[],f=function(){for(var a=0;a<b;a++){e[a]=[];for(var f=0;f<c;f++)e[a][f]=getRandomPiece(d)}};0===getMoves(e).length||0<getMatches(e).length;)f();return e};
