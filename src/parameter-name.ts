import { isClassDeclaration }       from 'typescript/unstable/ast'
import { isConstructorDeclaration } from 'typescript/unstable/ast'
import { isIdentifier }             from 'typescript/unstable/ast'
import { isMethodDeclaration }      from 'typescript/unstable/ast'
import { type MethodDeclaration }   from 'typescript/unstable/ast'
import { type Node }                from 'typescript/unstable/ast'
import { API }                      from 'typescript/unstable/sync'

export function parameterNamesFromFile(fileName: string, className: string, methodName: string): string[]
{
	const isMethod = (methodName === 'constructor')
		? isConstructorDeclaration
		: function (node: Node): node is MethodDeclaration {
			return isMethodDeclaration(node) && isIdentifier(node.name) && (node.name.text === methodName)
		}
	const declarationFileName = fileName.substring(0, fileName.lastIndexOf('.')) + '.d.ts'
	const api                 = new API()

	try {
		const snapshot   = api.updateSnapshot({ openFiles: [declarationFileName] })
		const project    = snapshot.getDefaultProjectForFile(declarationFileName)
		const sourceFile = project?.program.getSourceFile(declarationFileName)

		if (!sourceFile) {
			return []
		}

		let propertyNames = new Array<string>

		function searchClass(node: Node)
		{
			if (
				isClassDeclaration(node)
				&& node.name
				&& isIdentifier(node.name)
				&& (node.name.text === className)
			) {
				return node.forEachChild(searchMethod)
			}
			node.forEachChild(searchClass)
		}

		function searchMethod(node: Node)
		{
			if (isMethod(node)) {
				propertyNames = node.parameters.map(parameter => isIdentifier(parameter.name) ? parameter.name.text : '')
			}
		}

		searchClass(sourceFile)
		return propertyNames
	}
	finally {
		api.close()
	}
}
