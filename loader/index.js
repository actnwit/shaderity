const loaderUtils = require('loader-utils');



function isVertexShader(path) {
  const ext = fileExtension(path);
  if (ext == 'vs' || ext == 'vert') {
    return true;
  } else {
    return false;
  }
}

function isFragmentShader(path) {
  const ext = fileExtension(path);
  if (ext == 'fs' || ext == 'ps' || ext == 'frag') {
    return true;
  } else {
    return false;
  }
}

function fileExtension(path) {
  const splitted = path.split('.');
  const ext = splitted[splitted.length - 1];

  return ext;
}

function convertIn(str, loader) {
  const inReg = /([\s\S]*)in /;
  let inAsES1 = 'attribute ';
  if (isFragmentShader(loader.resourcePath)) {
    inAsES1 = 'varying ';
  }
  return str.replace(inReg, '$1' + inAsES1);
}

function transform(str, loader) {
  str = convertIn(str, loader);
  return str;
}

function shaderStage(loader) {
  if (isVertexShader(loader.resourcePath)) {
    return 'vertex';
  } else {
    return 'fragment';
  }
}

module.exports = function(source, map, meta) {
  this.cacheable();

  const json = {};

  const options = loaderUtils.getOptions(this);

  json.code = transform(source, this);

  json.shaderStage = shaderStage(this);

  return `export default ${JSON.stringify(json)}`;
};
