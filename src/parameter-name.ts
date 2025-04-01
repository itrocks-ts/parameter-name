import { readFileSync } from 'node:fs'
import ts               from 'typescript'

export function parameterNamesFromFile(fileName: string, className: string, methodName: string): string[]
{
	const isMethod = (methodName === 'constructor')
		? ts.isConstructorDeclaration
		: function (node: ts.Node): node is ts.MethodDeclaration {
			return ts.isMethodDeclaration(node) && node.name && ts.isIdentifier(node.name) && (node.name.text === methodName)
		}
	const content    = readFileSync(fileName.substring(0, fileName.lastIndexOf('.')) + '.d.ts', 'utf8')
	const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true)

	let propertyNames = new Array<string>

	function searchClass(node: ts.Node)
	{
		if (
			ts.isClassDeclaration(node)
			&& node.name
			&& ts.isIdentifier(node.name)
			&& (node.name.text === className)
		) {
			return ts.forEachChild(node, searchMethod)
		}
		ts.forEachChild(node, searchClass)
	}

	function searchMethod(node: ts.Node)
	{
		if (isMethod(node)) {
			propertyNames = node.parameters.map(parameter => ts.isIdentifier(parameter.name) ? parameter.name.text : '')
		}
	}

	searchClass(sourceFile)
	return propertyNames
}
