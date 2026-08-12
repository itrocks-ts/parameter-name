export declare class ParameterFixture {
	constructor(required: string, optional?: number, ...remaining: boolean[])
	destructured({ left }: { left: string }, [head]: string[]): void
	method(first: string, second: number, third?: boolean): void
	'quoted-method'(quoted: string): void
}

export declare class ParameterFixtureSuffix {
	constructor(other: string)
}

export declare namespace Scope {
	class NestedFixture {
		constructor(nestedId: number)
		nestedMethod(value: string): void
	}
}
