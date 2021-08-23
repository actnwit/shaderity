import {
	AttributeSemantics,
	ReflectionAttribute,
	ReflectionUniform,
	ReflectionVarying,
	ShaderStageStr,
	UniformSemantics,
	VarType,
} from '../types/type';

/**
 * This class gets the attribute, varying, and uniform information from the code property of a shaderity object.
 * The methods of the Shaderity instance create an instance of this class.
 *
 * Before getting the information of the attribute, varying, and uniform, you need to call the reflect method of this instance.
 */
export default class Reflection {
	private static readonly attributeAndVaryingTypeRegExp
		= /[\t ]+(float|int|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4)[\t ]+(\w+);/;
	private static readonly uniformTypeRegExp
		= /[\t ]+(float|int|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4|sampler2D|samplerCube|sampler3D)[\t ]+(\w+);/;
	private static readonly semanticRegExp = /<.*semantic[\t ]*=[\t ]*(\w+).*>/;

	private __attributeSemanticsMap = new Map<string, string>();
	private __uniformSemanticsMap = new Map<string, string>();
	private __attributes: ReflectionAttribute[] = [];
	private __varyings: ReflectionVarying[] = [];
	private __uniforms: ReflectionUniform[] = [];

	private readonly __splittedShaderCode: string[];
	private readonly __shaderStage: ShaderStageStr;

	constructor(splittedShaderityShaderCode: string[], shaderStage: ShaderStageStr) {
		this.__splittedShaderCode = splittedShaderityShaderCode;
		this.__shaderStage = shaderStage;
		this.__setDefaultAttributeAndUniformSemanticsMap();
	}

	/**
	 * Gets all attribute variable information in the shader code.
	 * Before calling this method, you need to call the reflect method of this instance.
	 * @returns Array of ReflectionAttribute object
	 */
	public get attributes() {
		return this.__attributes;
	}

	/**
	 * Gets all varying variable information in the shader code.
	 * Before calling this method, you need to call the reflect method of this instance.
	 * @returns Array of ReflectionVarying object
	 */
	public get varyings() {
		return this.__varyings;
	}

	/**
	 * Gets all uniform variable information in the shader code.
	 * Before calling this method, you need to call the reflect method of this instance.
	 * @returns Array of ReflectionUniform object
	 */
	public get uniforms() {
		return this.__uniforms;
	}

	/**
	 * Get the names of all attributes included in the shader.
	 * Before calling this method, you need to call the reflect method of this instance.
	 * @returns Array of string
	 */
	public get attributesNames() {
		return this.__attributes.map((attribute) => {return attribute.name});
	}

	/**
	 * Get the attribute semantic (e.g. 'POSITION') of all attributes included in the shader.
	 * Before calling this method, you need to call the reflect method of this instance.
	 * @returns Array of AttributeSemantics object
	 */
	public get attributesSemantics() {
		return this.__attributes.map((attribute) => {return attribute.semantic});
	}

	/**
	 * Get the variable type (e.g. 'vec4') of all attributes included in the shader.
	 * Before calling this method, you need to call the reflect method of this instance.
	 * @returns Array of VarType object
	 */
	public get attributesTypes() {
		return this.__attributes.map((attribute) => {return attribute.type});
	}

	/**
	 * Add an attributeSemantics.
	 * The attributeSemantics is used in the ReflectionAttribute.semantics
	 * (See reflect method of this class)
	 */
	public addAttributeSemanticsMap(map: Map<string, string>) {
		this.__attributeSemanticsMap = new Map([...this.__attributeSemanticsMap, ...map]);
	}

	/**
	 * Add a uniformSemantics.
	 * The attributeSemantics is used in the ReflectionAttribute.semantics
	 * (See reflect method of this class)
	 */
	public addUniformSemanticsMap(map: Map<string, string>) {
		this.__uniformSemanticsMap = new Map([...this.__uniformSemanticsMap, ...map]);
	}

	/**
	 * Add an attributeSemantics.
	 * The attributeSemantics is used in the ReflectionAttribute.semantics
	 * (See reflect method of this class)
	 */
	public addAttributeSemantics(key: string, value: string) {
		this.__attributeSemanticsMap.set(key, value);
	}

	/**
	 * Add a uniformSemantics.
	 * The attributeSemantics is used in the ReflectionAttribute.semantics
	 * (See reflect method of this class)
	 */
	public addUniformSemantics(key: string, value: string) {
		this.__uniformSemanticsMap.set(key, value);
	}

	/**
	 * Initialize attributeSemantics
	 */
	public resetAttributeSemantics() {
		this.__attributeSemanticsMap = new Map<string, string>();
	}

	/**
	 * Initialize uniformSemantics
	 */
	public resetUniformSemantics() {
		this.__uniformSemanticsMap = new Map<string, string>();
	}

	/**
	 * Analyze shader code of the shaderity and get information of attribute, varying and uniform.
	 * The information can be retrieved from the get method of this instance.
	 *
	 * The semantic property of the ReflectionAttribute is assigned to the value of the semantic if
	 * it is specified in the attribute line of the shader code. If not, the AttributeSemanticsMap
	 * is searched for matching semantics, or UNKNOWN. The same applies to the semantic property of
	 * ReflectionUniform.
	 */
	public reflect() {
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

	private __setDefaultAttributeAndUniformSemanticsMap() {
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
						reflectionAttribute.semantic = value as AttributeSemantics;
					}
				}
			}
		}
		this.__attributes.push(reflectionAttribute);
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
		this.__varyings.push(reflectionVarying);
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
		this.__uniforms.push(reflectionUniform);
	}
};