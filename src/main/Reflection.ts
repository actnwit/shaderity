import {ReflectionAttribute, ReflectionUniform, ReflectionVarying} from '../types/type';

export default class Reflection {
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