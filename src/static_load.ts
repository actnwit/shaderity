const path = require('path');
const fs = require('fs');

function isVertexShader(path: string) {
  const ext = fileExtension(path);
  if (ext == 'vs' || ext == 'vert') {
    return true;
  } else {
    return false;
  }
}

function isFragmentShader(path: string) {
  const ext = fileExtension(path);
  if (ext == 'fs' || ext == 'ps' || ext == 'frag') {
    return true;
  } else {
    return false;
  }
}

function fileExtension(path: string) {
  const splitted = path.split('.');
  const ext = splitted[splitted.length - 1];

  return ext;
}

function convertIn(str: string, resourcePath: string) {
  const inReg = /([\s\S]*)in /;
  let inAsES1 = 'attribute ';
  if (isFragmentShader(resourcePath)) {
    inAsES1 = 'varying ';
  }
  return str.replace(inReg, '$1' + inAsES1);
}

function transform(str: string, resourcePath: string) {
  str = convertIn(str, resourcePath);
  return str;
}

export function shaderStage(resourcePath: string) {
  if (isVertexShader(resourcePath)) {
    return 'vertex';
  } else {
    return 'fragment';
  }
}

export function requireFile(source: string, resourcePath: string) {
  const basePath = path.dirname(resourcePath) + '/';
  const arr = source.split(/\r\n|\n/);

  const newArr = [];
  for (let i = 0; i < arr.length; i++){
    const row = arr[i];
    const match = row.match(/^(?![\/])[\t ]*#pragma[\t ]+shaderity:[\t ]*(\S*)[\t ]*=?[\t ]*require\([\t ]*(\S+)[\t ]*\)/);
    if (match != null) {
      const filePath = path.resolve(basePath + match[2]);
      let extShader = fs.readFileSync(filePath, {encoding: 'utf-8'});
      newArr.push(extShader);
    } else {
      newArr.push(row);
    }
  }

  const requredShaderText = newArr.join('\n');

  return requredShaderText;
}
