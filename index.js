(function(a,b){"object"==typeof module&&module.exports?module.exports=b():a.m3=b()})(this,()=>{var a=Math.floor;return class{constructor({grid:a=[],height:b=6,width:c=6,typesCount:d=5,gravity:e="down"}={}){this.grid=a,this.width=c,this.height=b,this.gravity=e,this.typesCount=d,this.patterns=[{mustHave:[{y:0,x:1},{y:0,x:2}],needOne:[{y:0,x:-1},{y:-1,x:0},{y:1,x:0}]},{mustHave:[{y:0,x:-1},{y:0,x:-2}],needOne:[{y:0,x:1},{y:-1,x:0},{y:1,x:0}]},{mustHave:[{y:1,x:0},{y:2,x:0}],needOne:[{y:-1,x:0},{y:0,x:-1},{y:0,x:1}]},{mustHave:[{y:-1,x:0},{y:-2,x:0}],needOne:[{y:1,x:0},{y:0,x:-1},{y:0,x:1}]},{mustHave:[{y:0,x:-1},{y:0,x:1}],needOne:[{y:-1,x:0},{y:1,x:0}]},{mustHave:[{y:-1,x:0},{y:1,x:0}],needOne:[{y:0,x:-1},{y:0,x:1}]}]}setGrid(a){this.grid=a}coordToIdx({y:b,x:c}){const d=b*this.width+c;return b===a(d/this.width)?d:-1}idxToCoord(b){const c=a(b/this.width),d=b%this.width;return{y:c,x:d}}forEach(a){this.grid.forEach((b,c)=>{a(this.idxToCoord(c),this.grid[c],c)})}generateRandomPiece(){return{type:a(Math.random()*this.typesCount)+1}}isNeighbor(a,b){var c=Math.abs;const d=a.y-b.y,e=a.x-b.x;return!!(1>=c(d)&&1>=c(e)&&1===c(d+e))}getPiece(a,b={y:0,x:0}){const c=this.coordToIdx({y:a.y+b.y,x:a.x+b.x});if(~c)return this.grid[c]}getMoves(){const a=[];return this.forEach(b=>{this.patterns.forEach(c=>{let d;const e=c.mustHave.every(a=>{const c=this.getPiece(b,a);if(c)return void 0===d&&(d=c.type),d===c.type});if(e)return c.needOne.forEach(c=>{const e={y:b.y+c.y,x:b.x+c.x},f=this.getPiece(e);f&&d===f.type&&a.push({from:b,to:e})})})}),a}getMatches(){const a=[];for(let b=0;b<this.height;b++){let c=null,d=1;for(let e,f=0;f<this.width;f++){if(e=!1,f==this.width-1)e=!0;else{const a=this.getPiece({y:b,x:f}),g=this.getPiece({y:b,x:f},{y:0,x:1});a&&g&&a.type===g.type?(c=a.type,d+=1):e=!0}e&&(3<=d&&a.push({y:b,x:f+1-d,type:c,length:d,horizontal:!0}),c=null,d=1)}}for(let b=0;b<this.width;b++){let c=null,d=1;for(let e,f=0;f<this.height;f++){if(e=!1,f===this.height)e=!0;else{const a=this.getPiece({y:f,x:b}),g=this.getPiece({y:f,x:b},{y:1,x:0});a&&g&&a.type===g.type?(c=a.type,d+=1):e=!0}e&&(3<=d&&a.push({y:f+1-d,x:b,type:c,length:d,horizontal:!1}),c=null,d=1)}}return a}removeMatches(a){a.forEach(a=>{if(a.horizontal)for(let b=0;b<a.length;b++){const c=this.coordToIdx({y:a.y,x:a.x+b});~c&&(this.grid[c]=null)}else for(let b=0;b<a.length;b++){const c=this.coordToIdx({y:a.y+b,x:a.x});~c&&(this.grid[c]=null)}})}swap(a){const b=this.grid[this.coordToIdx(a.to)];this.grid[this.coordToIdx(a.to)]=this.grid[this.coordToIdx(a.from)],this.grid[this.coordToIdx(a.from)]=b}applyGravity(){const a={up:{x:0,y:1},down:{x:0,y:-1},left:{x:1,y:0},right:{x:-1,y:0}};this.forEach(({y:b,x:c})=>{const d={from:{y:b,x:c},to:{y:b+a[this.gravity].y,x:c+a[this.gravity].x}};let e=this.getPiece(d.from),f=this.getPiece(d.to);for(;null===e&&f;)this.swap(d),d.from=Object.assign({},d.to),d.to={y:d.from.y+a[this.gravity].y,x:d.from.x+a[this.gravity].x},e=this.getPiece(d.from),f=this.getPiece(d.to)})}fillVoid(){this.forEach(({y:a,x:b},c,d)=>{null===c&&(this.grid[d]=this.generateRandomPiece())})}createLevel(){for(const a=()=>{const a=[];for(let b=0;b<this.width*this.height;b++)a[b]=this.generateRandomPiece();this.setGrid(a)};0===this.getMoves().length||0<this.getMatches().length;)a()}}});
