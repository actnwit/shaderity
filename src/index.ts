type ShaderStageStr = 'vertex' | 'fragment' | 'pixel'

type ShaderityObject = {
  code: string,
  shaderStage: ShaderStageStr
};

type VarType = 'float' | 'int' |
               'vec2' | 'vec3' | 'vec4' |
               'mat2' | 'mat3' | 'mat4' |
               'ivec2' | 'ivec3' | 'ivec4' | 'sampler2D' | 'sampler3D' | 'samplerCube';

type ReflectionAttribute = {
  name: string,
  type: VarType,
  semantic: 'POSITION' | 'COLOR_0' | 'NORMAL' | 'TANGENT' | 'TEXCOORD_0' | 'TEXCOORD_1' | 'JOINTS_0' | 'WEIGHTS_0'
};

type ReflectionUniform = {
  name: string,
  type: string,
  semantic: string
}

type ReflectionVarying = {
  name: string,
  inout: "in" | "out",
  type: VarType
}

type Reflection = {
  attributes: ReflectionAttribute[],
  varyings: ReflectionVarying[],
  uniforms: ReflectionUniform[]
};

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

  /**
   * Fill arguments into template shader text in ShaderityObject.
   * @param obj a shaderity object
   * @returns a copied and processed shaderity object
   */
  fillTemplate(obj: ShaderityObject, arg: {[s: string]: string}) {
    const copy = this.copyShaderityObject(obj);

    const templateString = obj.code.replace(/#pragma[\t ]+shaderity:[\t ]*(\${)(\S+)(})/g, `$1this.$2$3`)

    const fillTemplate = function(templateString: string, arg:{[s: string]: string}){
      return new Function("return `"+templateString +"`;").call(arg);
    }
    copy.code = fillTemplate(templateString, arg);

    return copy;
  }

  insertDefinition(obj: ShaderityObject, definition: string) {
    const copy = this.copyShaderityObject(obj);
    let splited = this._splitShaderCode(obj.code);

    const defStr = definition.replace(/#define[\t ]+/, '');

    splited.unshift(`#define ${defStr}`);

    copy.code = this._joinSplitedRow(splited);

    return copy;
  }

  reflect(obj: ShaderityObject): Reflection {
    let splited = this._splitShaderCode(obj.code);

    const reflection: Reflection = {
      attributes: [],
      varyings: [],
      uniforms: []
    };
    const varTypes = /[\t ]+(float|int|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4)[\t ]+(\w+);/;
    const varTypes2 = /[\t ]+(float|int|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4|sampler2D|samplerCube|sampler3D)[\t ]+(\w+);/;
    for (let row of splited) {
      const attributeMatch = row.match(/attribute[\t ]+/);
      if (attributeMatch) {
        const reflectionAttribute: ReflectionAttribute = {
          name: '',
          type: 'float',
          semantic: 'POSITION'
        };
        const match = row.match(varTypes);
        if (match) {
          const type = match[1];
          reflectionAttribute.type = type as any as VarType;
          const name = match[2];
          reflectionAttribute.name = name;
          if (name.match(/position/i)) {
            reflectionAttribute.semantic = 'POSITION';
          } else if (name.match(/color/i)) {
            reflectionAttribute.semantic = 'COLOR_0';
          } else if (name.match(/texcoord/i)) {
            reflectionAttribute.semantic = 'TEXCOORD_0';
          } else if (name.match(/normal/i)) {
            reflectionAttribute.semantic = 'NORMAL';
          } else if (name.match(/tangent/i)) {
            reflectionAttribute.semantic = 'TANGENT';
          } else if (name.match(/joint|bone/i)) {
            reflectionAttribute.semantic = 'JOINTS_0';
          } else if (name.match(/weight/i)) {
            reflectionAttribute.semantic = 'WEIGHTS_0';
          }
        }
        reflection.attributes.push(reflectionAttribute);
        continue;
      }

      const varyingMatch = row.match(/varying[\t ]+/);
      if (varyingMatch) {
        const reflectionVarying: ReflectionVarying = {
          name: '',
          type: 'float',
          inout: 'in'
        };
        const match = row.match(varTypes);
        if (match) {
          const type = match[1];
          reflectionVarying.type = type as any as VarType;
          const name = match[2];
          reflectionVarying.name = name;
          reflectionVarying.inout = (obj.shaderStage === 'vertex') ? 'out' : 'in';
        }
        reflection.varyings.push(reflectionVarying);
        continue;
      }

      const uniformMatch = row.match(/uniform[\t ]+/);
      if (uniformMatch) {
        const reflectionUniform: ReflectionUniform = {
          name: '',
          type: 'float',
          semantic: ''
        };
        const match = row.match(varTypes2);
        if (match) {
          const type = match[1];
          reflectionUniform.type = type as any as VarType;
          const name = match[2];
          reflectionUniform.name = name;
        }
        const match2 = row.match(/semantic[\t ]*=[\t ]*(\w+)/);
        if (match2) {
          const semantic = match2[1];
          reflectionUniform.semantic = semantic;
        }
        reflection.uniforms.push(reflectionUniform);
        continue;
      }
    }

    return reflection;
  }

  private _defineGLSLES3() {

  }
}

