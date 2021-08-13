import {AttributeSemantics, ReflectionAttribute, ReflectionUniform, ReflectionVarying, ShaderStageStr, UniformSemantics, VarType} from '../types/type';

export default class Reflection {
	attributes: ReflectionAttribute[] = []
	varyings: ReflectionVarying[] = [];
	uniforms: ReflectionUniform[] = [];

	private static readonly attributeAndVaryingTypeRegExp
		= /[\t ]+(float|int|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4)[\t ]+(\w+);/;
	private static readonly uniformTypeRegExp
		= /[\t ]+(float|int|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4|sampler2D|samplerCube|sampler3D)[\t ]+(\w+);/;
	private static readonly semanticRegExp = /<.*semantic[\t ]*=[\t ]*(\w+).*>/;

	private __attributeSemanticsMap = new Map();
	private __uniformSemanticsMap = new Map();

	private readonly __splittedShaderCode: string[];
	private readonly __shaderStage: ShaderStageStr;

	constructor(splittedShaderityShaderCode: string[], shaderStage: ShaderStageStr) {
		this.__splittedShaderCode = splittedShaderityShaderCode;
		this.__shaderStage = shaderStage;

		this.__attributeSemanticsMap.set('position', 'POSITION');
		this.__attributeSemanticsMap.set('color$', 'COLOR_0');
		this.__attributeSemanticsMap.set('color_?0', 'COLOR_0');
		this.__attributeSemanticsMap.set('texcoord$', 'TEXCOORD_0');
		this.__attributeSemanticsMap.set('texcoord_?0', 'TEXCOORD_0');
		this.__attributeSemanticsMap.set('texcoord_?1', 'TEXCOORD_1');
		this.__attributeSemanticsMap.set('normal', 'NORMAL');
		this.__attributeSemanticsMap.set('tangent', 'TANGENT');
		this.__attributeSemanticsMap.set('joint$', 'JOINTS_0');
		this.__attributeSemanticsMap.set('bone$', 'JOINTS_0');
		this.__attributeSemanticsMap.set('joint_?0', 'JOINTS_0');
		this.__attributeSemanticsMap.set('bone_?0', 'JOINTS_0');
		this.__attributeSemanticsMap.set('weight$', 'WEIGHTS_0');
		this.__attributeSemanticsMap.set('weight_?0', 'WEIGHTS_0');

		this.__uniformSemanticsMap.set('worldmatrix', 'WorldMatrix');
		this.__uniformSemanticsMap.set('normalmatrix', 'NormalMatrix');
		this.__uniformSemanticsMap.set('viewmatrix', 'ViewMatrix');
		this.__uniformSemanticsMap.set('projectionmatrix', 'ProjectionMatrix');
		this.__uniformSemanticsMap.set('modelviewmatrix', 'ModelViewMatrix');
	}

	get attributesNames() {
		return this.attributes.map((attribute) => {return attribute.name});
	}

	get attributesSemantics() {
		return this.attributes.map((attribute) => {return attribute.semantic});
	}

	get attributesTypes() {
		return this.attributes.map((attribute) => {return attribute.type});
	}

	addAttributeSemanticsMap(map: Map<string, string>) {
		this.__attributeSemanticsMap = new Map([...this.__attributeSemanticsMap, ...map]);
	}

	addUniformSemanticsMap(map: Map<string, string>) {
		this.__uniformSemanticsMap = new Map([...this.__uniformSemanticsMap, ...map]);
	}

	reflect() {
		const splittedShaderCode = this.__splittedShaderCode;
		const shaderStage = this.__shaderStage;

		for (const shaderCodeLine of splittedShaderCode) {
			const isAttributeLine = this.__matchAttribute(shaderCodeLine, shaderStage);
			if (isAttributeLine) {
				this.__addAttribute(shaderCodeLine);
				continue;
			}

			const isVaryingLine = this.__matchVarying(shaderCodeLine, shaderStage);
			if (isVaryingLine) {
				this.__addVarying(shaderCodeLine, shaderStage);
				continue;
			}

			const isUniformLine = shaderCodeLine.match(/^(?![\/])[\t ]*uniform[\t ]+/);
			if (isUniformLine) {
				this.__addUniform(shaderCodeLine);
				continue;
			}
		}
	}

	private __matchAttribute(shaderCodeLine: string, shaderStage: ShaderStageStr) {
		if (shaderStage !== 'vertex') {
			return false;
		}
		return shaderCodeLine.match(/^(?![\/])[\t ]*(attribute|in)[\t ]+.+;/);
	}

	private __addAttribute(shaderCodeLine: string) {
		const reflectionAttribute: ReflectionAttribute = {
			name: '',
			type: 'float',
			semantic: 'UNKNOWN'
		};

		const matchType = shaderCodeLine.match(Reflection.attributeAndVaryingTypeRegExp);
		if (matchType) {
			const type = matchType[1];
			reflectionAttribute.type = type as VarType;
			const name = matchType[2];
			reflectionAttribute.name = name;

			const matchSemantic = shaderCodeLine.match(Reflection.semanticRegExp)
			if (matchSemantic) {
				reflectionAttribute.semantic = matchSemantic[1] as AttributeSemantics;
			} else {
				for (let [key, value] of this.__attributeSemanticsMap) {
					if (name.match(new RegExp(key, 'i'))) {
						reflectionAttribute.semantic = value;
					}
				}
			}
		}
		this.attributes.push(reflectionAttribute);
	}

	private __matchVarying(shaderCodeLine: string, shaderStage: ShaderStageStr) {
		if (shaderStage === 'vertex') {
			return shaderCodeLine.match(/^(?![\/])[\t ]*(varying|out)[\t ]+.+;/);
		} else {
			return shaderCodeLine.match(/^(?![\/])[\t ]*(varying|in)[\t ]+.+;/);
		}
	}

	private __addVarying(shaderCodeLine: string, shaderStage: ShaderStageStr) {
		const reflectionVarying: ReflectionVarying = {
			name: '',
			type: 'float',
			inout: 'in'
		};

		const matchType = shaderCodeLine.match(Reflection.attributeAndVaryingTypeRegExp);
		if (matchType) {
			const type = matchType[1];
			reflectionVarying.type = type as VarType;
			const name = matchType[2];
			reflectionVarying.name = name;
			reflectionVarying.inout = (shaderStage === 'vertex') ? 'out' : 'in';
		}
		this.varyings.push(reflectionVarying);
	}

	private __addUniform(shaderCodeLine: string) {
		const reflectionUniform: ReflectionUniform = {
			name: '',
			type: 'float',
			semantic: 'UNKNOWN'
		};

		const matchType = shaderCodeLine.match(Reflection.uniformTypeRegExp);
		if (matchType) {
			const type = matchType[1];
			reflectionUniform.type = type as VarType;
			const name = matchType[2];
			reflectionUniform.name = name;

			const matchSemantics = shaderCodeLine.match(Reflection.semanticRegExp)
			if (matchSemantics) {
				reflectionUniform.semantic = matchSemantics[1] as UniformSemantics;
			} else {
				for (let [key, value] of this.__uniformSemanticsMap) {
					if (name.match(new RegExp(key, 'i'))) {
						reflectionUniform.semantic = value;
					}
				}
			}
		}
		this.uniforms.push(reflectionUniform);
	}
};