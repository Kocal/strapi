'use strict';

const path = require('path');
const { fromFile, t } = require('ts-zen');

const STRING_UTILS_DTS_PATH = path.join(__dirname, '..', 'definitions', 'utils', 'string.d.ts');

/**
 * @type {import('ts-zen').AssertTypeSelector}
 */
let assertType;

describe('Utils.String', () => {
  beforeAll(() => {
    assertType = fromFile(STRING_UTILS_DTS_PATH, {
      compilerOptions: { strict: true },
      ignoreProjectOptions: true,
    });
  });

  test('Dict', () => {
    // TODO: Replace with isMappedType matcher when available
    assertType('NumberDict').equals('{ [x: string]: number; }');
    assertType('StringDict').equals('{ [x: string]: string; }');
    assertType('BooleanDict').equals('{ [x: string]: boolean; }');
  });

  test('EndsWith', () => {
    assertType('EndsWithCorrectNumber').isBooleanLiteral(true);
    assertType('EndsWithIncorrectNumber').isBooleanLiteral(false);
    assertType('EndsWithCorrectString').isBooleanLiteral(true);
    assertType('EndsWithIncorrectString').isBooleanLiteral(false);
  });

  test('StartsWith', () => {
    assertType('StartsWithCorrectNumber').isBooleanLiteral(true);
    assertType('StartsWithIncorrectNumber').isBooleanLiteral(false);
    assertType('StartsWithCorrectString').isBooleanLiteral(true);
    assertType('StartsWithIncorrectString').isBooleanLiteral(false);
  });

  test('Includes', () => {
    const asTemplatedString = (str) => `\`$\{string}${str}$\{string}\``;

    // TODO: Replace with isStringTemplate matcher when available
    assertType('IncludesNumber').equals(asTemplatedString(42));
    assertType('IncludesString').equals(asTemplatedString('foo'));
    assertType('IncludesBoolean').equals(
      `${asTemplatedString(false)} | ${asTemplatedString(true)}`
    );
    assertType('IncludesBooleanLiteral').equals(asTemplatedString(true));
  });

  test('NonEmpty', () => {
    // TODO: Replace with isNever matcher when available
    assertType('NonEmptyOnEmptyString').equals('never');
    assertType('NonEmptyOnNonEmptyString').isStringLiteral('Hello World');
  });

  test('Prefix', () => {
    assertType('PrefixEmptyString').isStringLiteral('Hello');
    // TODO: Replace with isStringTemplate matcher when available
    assertType('PrefixString').equals('`Hello ${string}`');
    assertType('PrefixLiteralString').isStringLiteral('Hello World');
    assertType('PrefixLiteralStringUnion').isUnion([
      t.stringLiteral('Hello World'),
      t.stringLiteral('Hello Everyone'),
    ]);
    assertType('PrefixLiteralStringWithUnion').isUnion([
      t.stringLiteral('Hello World'),
      t.stringLiteral('Bonjour World'),
      t.stringLiteral('Hola World'),
    ]);
  });

  test('Suffix', () => {
    assertType('SuffixEmptyString').isStringLiteral('Hello');
    // TODO: Replace with isStringTemplate matcher when available
    assertType('SuffixString').equals('`${string}.`');
    assertType('SuffixLiteralString').isStringLiteral('Hello World');
    assertType('SuffixLiteralStringUnion').isUnion([
      t.stringLiteral('Hello World'),
      t.stringLiteral('Bonjour World'),
      t.stringLiteral('Hola World'),
    ]);
    assertType('SuffixLiteralStringWithUnion').isUnion([
      t.stringLiteral('Hello World'),
      t.stringLiteral('Hello Everyone'),
    ]);
  });

  test.skip('Literal', () => {
    // TODO: Remove .skip when t.bigint() is fixed
    assertType('Literal').isUnion([t.string(), t.number(), t.bigint(), t.boolean()]);
  });

  test('split', () => {
    // TODO: Replace with .isTuple matcher when available
    assertType('SplitEmptyStringBySpace').equals('[]');
    assertType('SplitEmptyStringByEmptyString').equals('[]');
    assertType('SplitEmptyStringByString').equals('[]');
    assertType('SplitBySpace').equals('["Hello", "World,", "How", "are", "you?"]');
    assertType('SplitByEmptyString').equals('["H", "e", "l", "l", "o"]');
    // This will use any string character as a delimiter, thus removing 1/2 characters
    assertType('SplitByString').equals('["H", "l", "o"]');
  });
});