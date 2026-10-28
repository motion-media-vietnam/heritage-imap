import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

test('the existing OSM tile layer explicitly preserves the approved referrer policy', () => {
  // Inspect configuration without executing browser code or requesting OSM tiles.
  const source = readFileSync(new URL('../src/scripts/explore.ts', import.meta.url), 'utf8');
  const file = ts.createSourceFile('explore.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const layers: ts.CallExpression[] = [];
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)
      && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === 'L'
      && node.expression.name.text === 'tileLayer') layers.push(node);
    ts.forEachChild(node, visit);
  }
  visit(file);
  assert.equal(layers.length, 1, 'retain the single existing tile layer');
  const [url, options] = layers[0]!.arguments;
  assert(url && ts.isStringLiteral(url));
  assert.equal(url.text, 'https://tile.openstreetmap.org/{z}/{x}/{y}.png');
  assert(options && ts.isObjectLiteralExpression(options));
  const policies = options.properties.filter((property): property is ts.PropertyAssignment =>
    ts.isPropertyAssignment(property)
    && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
    && property.name.text === 'referrerPolicy');
  assert.equal(policies.length, 1, 'set the policy exactly once on the OSM layer');
  const policy = policies[0]!.initializer;
  assert(ts.isStringLiteral(policy));
  assert.equal(policy.text, 'strict-origin-when-cross-origin');
});
