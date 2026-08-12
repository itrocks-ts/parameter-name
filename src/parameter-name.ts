import { parseAll }     from '@itrocks/ast'
import { readFileSync } from 'node:fs'

export function parameterNamesFromFile(fileName: string, className: string, methodName: string): string[]
{
	const declarationFileName = fileName.substring(0, fileName.lastIndexOf('.')) + '.d.ts'
	let source: string
	try {
		source = readFileSync(declarationFileName, 'utf8')
	}
	catch {
		return []
	}
	const declaration = parseAll(source, declarationFileName).declarations.find(
		declaration => (declaration.kind === 'class') && (declaration.name === className)
	)
	if (!declaration || (declaration.kind !== 'class')) return []
	const method = declaration.members.find(member => (methodName === 'constructor')
		? member.kind === 'constructor'
		: (member.kind === 'method') && (member.name === methodName)
			&& new RegExp('(?:^|[\\s;{}])' + methodName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\(').test(source)
	)
	return method && ((method.kind === 'constructor') || (method.kind === 'method'))
		? method.parameters.map(parameter => parameter.name ?? '')
		: []
}
