const loaderUtils = require('loader-utils');


function transform(str) {
  str = str.replace(/([\s\S]*)in /, '$1' + 'attribute ');

  return str;
}

module.exports = function(source, map) {
  this.cacheable();

  const options = loaderUtils.getOptions(this);


  // const json = JSON.stringify(source)
    // .replace(/\u2028/g, '\\u2028')
    // .replace(/\u2029/g, '\\u2029');

  const transformed = transform(source);

  // return `export default ${transformed}`;
  return `export default ${JSON.stringify({code: transformed})}`;
};
