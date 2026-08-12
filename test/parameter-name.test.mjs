import assert                       from 'node:assert/strict'
import { fileURLToPath }            from 'node:url'
import { test }                     from 'node:test'
import { parameterNamesFromFile }   from '../cjs/parameter-name.js'

const fixtureFileName = fileURLToPath(new URL('parameter-name.fixture.runtime', import.meta.url))

test('returns constructor parameter names in declaration order', () =>
{
	assert.deepEqual(
		parameterNamesFromFile(fixtureFileName, 'ParameterFixture', 'constructor'),
		['required', 'optional', 'remaining']
	)
})

test('returns method parameter names in declaration order', () =>
{
	assert.deepEqual(
		parameterNamesFromFile(fixtureFileName, 'ParameterFixture', 'method'),
		['first', 'second', 'third']
	)
})

test('returns an empty name for each destructured parameter', () =>
{
	assert.deepEqual(
		parameterNamesFromFile(fixtureFileName, 'ParameterFixture', 'destructured'),
		['', '']
	)
})

test('finds a class nested in a namespace', () =>
{
	assert.deepEqual(
		parameterNamesFromFile(fixtureFileName, 'NestedFixture', 'constructor'),
		['nestedId']
	)
	assert.deepEqual(
		parameterNamesFromFile(fixtureFileName, 'NestedFixture', 'nestedMethod'),
		['value']
	)
})

test('matches the class name exactly', () =>
{
	assert.deepEqual(
		parameterNamesFromFile(fixtureFileName, 'ParameterFixtureSuffix', 'constructor'),
		['other']
	)
})

test('returns an empty array when the class does not exist', () =>
{
	assert.deepEqual(
		parameterNamesFromFile(fixtureFileName, 'MissingFixture', 'constructor'),
		[]
	)
})

test('returns an empty array when the method does not exist', () =>
{
	assert.deepEqual(
		parameterNamesFromFile(fixtureFileName, 'ParameterFixture', 'missingMethod'),
		[]
	)
})

test('ignores method names that are not identifiers', () =>
{
	assert.deepEqual(
		parameterNamesFromFile(fixtureFileName, 'ParameterFixture', 'quoted-method'),
		[]
	)
})
