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

  private _convertIn(obj: ShaderityObject) {
    const inReg = /([\t ]*)in[\t ]+/g;
    // const inReg = /[\t ]*in[\t ]+/;
    let inAsES1 = 'attribute ';
    if (this.isFragmentShader(obj)) {
      inAsES1 = 'varying ';
    }
    const replaced = obj.code.replace(inReg, inAsES1);

    return replaced;
  }

  copyShaderityObject(obj: ShaderityObject) {
    const copiedObj: ShaderityObject = {
      code: obj.code,
      shaderStage: obj.shaderStage
    }

    return copiedObj;
  }

  transform(obj: ShaderityObject) {
    const copy = this.copyShaderityObject(obj);
    copy.code = this._convertIn(obj);

    return copy;
  }

}

