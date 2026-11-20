(function(){
 if(!Array.prototype.at)Object.defineProperty(Array.prototype,'at',{configurable:true,writable:true,value:function(i){i=Number(i)||0;i=i<0?Math.ceil(i):Math.floor(i);return this[i<0?this.length+i:i]}});
 if(!Object.hasOwn)Object.hasOwn=function(o,p){return Object.prototype.hasOwnProperty.call(o,p)};
 if(!String.prototype.replaceAll)Object.defineProperty(String.prototype,'replaceAll',{configurable:true,writable:true,value:function(search,replacement){if(search instanceof RegExp){if(!search.global)throw new TypeError('replaceAll requires a global RegExp');return this.replace(search,replacement)}return this.replace(new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'),replacement)}});
})();
