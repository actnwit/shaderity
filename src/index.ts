export type ShaderStageStr = 'vertex' | 'fragment' | 'pixel'

export type ShaderityObject = {
  code: string,
  shaderStage: ShaderStageStr
};

export type VarType = 'unknown' | 'float' | 'int' |
               'vec2' | 'vec3' | 'vec4' |
               'mat2' | 'mat3' | 'mat4' |
               'ivec2' | 'ivec3' | 'ivec4' | 'sampler2D' | 'sampler3D' | 'samplerCube';

export type AttributeSemantics = 'POSITION' | 'COLOR_0' | 'NORMAL' | 'TANGENT' | 'TEXCOORD_0' | 'TEXCOORD_1' | 'JOINTS_0' | 'WEIGHTS_0' | 'UNKNOWN';

export type ReflectionAttribute = {
  name: string,
  type: VarType,
  semantic: AttributeSemantics
};

export type ReflectionUniform = {
  name: string,
  type: string,
  semantic: string
}

export type ReflectionVarying = {
  name: string,
  inout: "in" | "out",
  type: VarType
}

export class Reflection {
  attributes: ReflectionAttribute[] = []
  varyings: ReflectionVarying[] = [];
  uniforms: ReflectionUniform[] = [];

  get attributesNames() {
    return this.attributes.map((attribute) => {return attribute.name});
  }

  get attributesSemantics() {
    return this.attributes.map((attribute) => {return attribute.semantic});
  }

  get attributesTypes() {
    return this.attributes.map((attribute) => {return attribute.type});
  }
};

export default class Shaderity {
  private static __instance: Shaderity;
  private __attributeSemanticsMap = new Map();
  private __uniformSemanticsMap = new Map();

  private constructor() {
    this.__attributeSemanticsMap.set('position', 'POSITION');
    this.__attributeSemanticsMap.set('color', 'COLOR_0');
    this.__attributeSemanticsMap.set('texcoord', 'TEXCOORD_0');
    this.__attributeSemanticsMap.set('normal', 'NORMAL');
    this.__attributeSemanticsMap.set('tangent', 'TANGENT');
    this.__attributeSemanticsMap.set('joint', 'JOINTS_0');
    this.__attributeSemanticsMap.set('bone', 'JOINTS_0');
    this.__attributeSemanticsMap.set('weight', 'WEIGHTS_0');

    this.__uniformSemanticsMap.set('worldmatrix', 'WorldMatrix');
    this.__uniformSemanticsMap.set('normalmatrix', 'NormalMatrix');
    this.__uniformSemanticsMap.set('viewmatrix', 'ViewMatrix');
    this.__uniformSemanticsMap.set('projectionmatrix', 'ProjectionMatrix');
    this.__uniformSemanticsMap.set('modelviewmatrix', 'ModelViewMatrix');
  }

  static getInstance(): Shaderity {
    if (!this.__instance) {
      this.__instance = new Shaderity();
    }
    return this.__instance;
  }

  addAttributeSemanticsMap(map: Map<string, string>) {
    this.__attributeSemanticsMap = new Map([...this.__attributeSemanticsMap, ...map]);
  }

  addUniformSemanticsMap(map: Map<string, string>) {
    this.__uniformSemanticsMap = new Map([...this.__uniformSemanticsMap, ...map]);
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

  private _createUniformSamplerMap(obj: ShaderityObject, inout_splitedSource: string[]) {
    const uniformSamplerMap = new Map();

    for (let i = 0; i < inout_splitedSource.length; i++) {
      const row = inout_splitedSource[i];
      const match = row.match(/uniform[\t ]+(sampler\w+)[\t ]+(\w+)/);
      if (match) {
        const samplerType = match[1];
        const name = match[2];
        uniformSamplerMap.set(name, samplerType);
      }
    }
    return uniformSamplerMap;
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

  _convertTextureFunctionToES1(inout_splitedSource: string[], uniformSamplerMap: Map<string, string>) {
    const sbl = this._regSymbols();

    for (let i = 0; i < inout_splitedSource.length; i++) {
      const row = inout_splitedSource[i];

      let reg = new RegExp(`(${sbl}+)(textureProj)(${sbl}+)`, 'g');
      let match = row.match(/textureProj[\t ]*\([\t ]*(\w+),/);
      if (match) {
        const name = match[1];
        const samplerType = uniformSamplerMap.get(name);
        if (samplerType != null) {
          let textureFunc = '';
          switch(samplerType) {
            case 'sampler2D': textureFunc = 'texture2DProj'; break;
            case 'sampler3D': textureFunc = 'texture3DProj'; break;
            default: console.log('not found');
          }
          inout_splitedSource[i] = inout_splitedSource[i].replace(reg, '$1' + textureFunc + '$3');
        }
        continue;
      }

      reg = new RegExp(`(${sbl}+)(texture)(${sbl}+)`, 'g');
      match = row.match(/texture[\t ]*\([\t ]*(\w+),/);
      if (match) {
        const name = match[1];
        const samplerType = uniformSamplerMap.get(name);
        if (samplerType != null) {
          let textureFunc = '';
          switch(samplerType) {
            case 'sampler2D': textureFunc = 'texture2D'; break;
            case 'sampler3D': textureFunc = 'texture3D'; break;
            case 'samplerCube': textureFunc = 'textureCube'; break;
            default: console.log('not found');
          }
          inout_splitedSource[i] = inout_splitedSource[i].replace(reg, '$1' + textureFunc + '$3');
        }
      }
    }

    return inout_splitedSource;
  }

  transformToGLSLES1(obj: ShaderityObject) {
    const copy = this.copyShaderityObject(obj);

    let splited = this._splitShaderCode(obj.code);

    this._convertIn(obj, splited);
    this._convertOut(obj, splited);

    const uniformSamplerMap = this._createUniformSamplerMap(obj, splited);
    splited = this._convertTextureFunctionToES1(splited, uniformSamplerMap);

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

  transformTo(version: string, obj: ShaderityObject) {
    if (version.match(/webgl2|es3/i)) {
      return this.transformToGLSLES3(obj);
    } else if (version.match(/webgl1|es1/i)) {
      return this.transformToGLSLES1(obj);
    } else {
      console.error('Invalid Version')
      return obj;
    }
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
  fillTemplate(obj: ShaderityObject, arg: {[s: string]: any}) {
    const copy = this.copyShaderityObject(obj);


    const templateString = obj.code.replace(/\/\*[\t ]*shaderity:[\t ]*(\${[\t ]*)(\S+)([\t ]*})[\t ]*\*\//g, `$1this.$2$3`)

    const fillTemplate = function(templateString: string, arg:{[s: string]: any}){
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

    const reflection = new Reflection();
    const varTypes = /[\t ]+(float|int|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4)[\t ]+(\w+);/;
    const varTypes2 = /[\t ]+(float|int|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4|sampler2D|samplerCube|sampler3D)[\t ]+(\w+);/;
    const semanticRegExp = /<.*semantic[\t ]*=[\t ]*(\w+).*>/;
    for (let row of splited) {
      if (obj.shaderStage === 'vertex') {
        const attributeMatch = row.match(/(attribute|in)[\t ]+.+;/);
        if (attributeMatch) {
          const reflectionAttribute: ReflectionAttribute = {
            name: '',
            type: 'float',
            semantic: 'UNKNOWN'
          };
          const match = row.match(varTypes);
          if (match) {
            const type = match[1];
            reflectionAttribute.type = type as any as VarType;
            const name = match[2];
            reflectionAttribute.name = name;

            const match2 = row.match(semanticRegExp)
            if (match2) {
              reflectionAttribute.semantic = match2[1] as AttributeSemantics;
            } else {
              for (let [key, value] of this.__attributeSemanticsMap) {
                if (name.match(new RegExp(key, 'i'))) {
                  reflectionAttribute.semantic = value;
                }
              }
            }
          }
          reflection.attributes.push(reflectionAttribute);
          continue;
        }
      }

      let varyingMatch;
      if (obj.shaderStage === 'vertex') {
        varyingMatch = row.match(/(varying|out)[\t ]+.+;/);
      } else {
        varyingMatch = row.match(/(varying|in)[\t ]+.+;/);
      }
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
          semantic: 'UNKNOWN'
        };
        const match = row.match(varTypes2);
        if (match) {
          const type = match[1];
          reflectionUniform.type = type as any as VarType;
          const name = match[2];
          reflectionUniform.name = name;

          const match2 = row.match(semanticRegExp)
          if (match2) {
            reflectionUniform.semantic = match2[1] as AttributeSemantics;
          } else {
            for (let [key, value] of this.__uniformSemanticsMap) {
              if (name.match(new RegExp(key, 'i'))) {
                reflectionUniform.semantic = value;
              }
            }
          }
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

