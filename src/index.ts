type ShaderStageStr = 'vertex' | 'fragment' | 'pixel'

type ShaderityObject = {
  code: string,
  shaderStage: ShaderStageStr
}

export default class Shaderity {
  private static __instance: Shaderity;

  private constructor() {
  }

  static getInstance(): Shaderity {
    if (!this.__instance) {
      this.__instance = new Shaderity();
    }
    return this.__instance;
  }

  isVertexShader(obj: ShaderityObject) {
    if (obj.shaderStage === 'vertex') {
      return true;
    } else {
      return false;
    }
  }

  isFragmentShader(obj: ShaderityObject) {
    if (obj.shaderStage === 'fragment' || obj.shaderStage === 'pixel') {
      return true;
    } else {
      return false;
    }
  }

  isPixelShader(obj: ShaderityObject) {
    return this.isFragmentShader(obj);
  }

  private _replaceRow(inout_splitedSource: string[], inReg: RegExp, inAsES1: string) {
    for (let i = 0; i < inout_splitedSource.length; i++) {
      inout_splitedSource[i] = inout_splitedSource[i].replace(inReg, inAsES1);
    }
  }

  private _convertIn(obj: ShaderityObject, inout_splitedSource: string[]) {
    const inReg = /^in[\t ]+/g;
    let inAsES1 = 'attribute ';
    if (this.isFragmentShader(obj)) {
      inAsES1 = 'varying ';
    }

    this._replaceRow(inout_splitedSource, inReg, inAsES1);

    return inout_splitedSource;
  }


  private _convertOut(obj: ShaderityObject, inout_splitedSource: string[]) {
    const inReg = /^out[\t ]+/g;
    let inAsES1 = 'varying ';

    this._replaceRow(inout_splitedSource, inReg, inAsES1);

    return inout_splitedSource;
  }

  private _convertAttribute(obj: ShaderityObject, inout_splitedSource: string[]) {
    const inReg = /^attribute[\t ]+/g;
    let inAsES3 = 'in ';

    this._replaceRow(inout_splitedSource, inReg, inAsES3);

    return inout_splitedSource;
  }

  private _convertVarying(obj: ShaderityObject, inout_splitedSource: string[]) {
    const inReg = /^varying[\t ]+/g;
    let inAsES3 = 'out ';

    if (this.isFragmentShader(obj)) {
      inAsES3 = 'in ';
    }

    this._replaceRow(inout_splitedSource, inReg, inAsES3);

    return inout_splitedSource;
  }

  private _regSymbols() {
    return `[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^` + '`{|}~\t\n ]';
  }

  private _convertTexture2D(obj: ShaderityObject, inout_splitedSource: string[]) {
    const sbl = this._regSymbols();
    const reg = new RegExp(`(${sbl}+)(texture2D)(${sbl}+)`, 'g');
    let inAsES3 = 'texture';

    this._replaceRow(inout_splitedSource, reg, '$1' + inAsES3 + '$3');

    return inout_splitedSource;
  }

  private _convertTextureCube(obj: ShaderityObject, inout_splitedSource: string[]) {
    const sbl = this._regSymbols();
    const reg = new RegExp(`(${sbl}+)(textureCube)(${sbl}+)`, 'g');
    let inAsES3 = 'texture';

    this._replaceRow(inout_splitedSource, reg, '$1' + inAsES3 + '$3');

    return inout_splitedSource;
  }

  private _convertTexture2DProd(obj: ShaderityObject, inout_splitedSource: string[]) {
    const sbl = this._regSymbols();
    const reg = new RegExp(`(${sbl}+)(texture2DProj)(${sbl}+)`, 'g');
    let inAsES3 = 'textureProj';

    this._replaceRow(inout_splitedSource, reg, '$1' + inAsES3 + '$3');

    return inout_splitedSource;
  }


  copyShaderityObject(obj: ShaderityObject) {
    const copiedObj: ShaderityObject = {
      code: obj.code,
      shaderStage: obj.shaderStage
    }

    return copiedObj;
  }

  transformToGLSLES1(obj: ShaderityObject) {
    const copy = this.copyShaderityObject(obj);

    let splited = this._splitShaderCode(obj.code);

    this._convertIn(obj, splited);
    this._convertOut(obj, splited);

    copy.code = this._joinSplitedRow(splited);

    return copy;
  }

  transformToGLSLES3(obj: ShaderityObject) {
    const copy = this.copyShaderityObject(obj);

    let splited = this._splitShaderCode(obj.code);

    this._convertAttribute(obj, splited);
    this._convertVarying(obj, splited);
    this._convertTexture2D(obj, splited);
    this._convertTextureCube(obj, splited);
    this._convertTexture2DProd(obj, splited);

    copy.code = this._joinSplitedRow(splited);

    return copy;
  }

  private _splitShaderCode(source: string) {
    return source.split(/\r\n|\n/);
  }

  private _joinSplitedRow(splitedRow: string[]) {
    return splitedRow.join('\n');
  }

  private _defineGLSLES3() {

  }
}

