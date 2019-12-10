import prettier from 'prettier';
import {
  Transform,
  JSCodeshift,
  ExportNamedDeclaration,
  ArrowFunctionExpression,
  FunctionExpression,
  MemberExpression,
  CallExpression,
} from 'jscodeshift';
import { upperFirst, snakeCase, camelCase } from 'lodash';
import {
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isObjectProperty,
  isArrowFunctionExpression,
} from '@babel/types';

function createAction(
  j: JSCodeshift,
  namespace: string,
  actionType: string,
  expression: any,
) {
  const varName = `${namespace}${upperFirst(actionType)}`;
  const actionName = `${namespace}/${snakeCase(actionType).toUpperCase()}`;
  const decl = j.variableDeclaration('const', [
    j.variableDeclarator(
      j.identifier(varName),
      j.callExpression(j.identifier('createAction'), [
        j.literal(actionName),
        expression,
      ]),
    ),
  ]);
  return j.exportNamedDeclaration(decl);
}

const transform: Transform = (fileInfo, { jscodeshift: j }) => {
  const toolkitImport = j.template
    .statement`import { createReducer } from '@reduxjs/toolkit';`;
  const root = j(fileInfo.source);
  const decls: ExportNamedDeclaration[] = [];

  root
    .find(j.CallExpression, { callee: j.identifier('createReducer') })
    .replaceWith(path => {
      const call = path.node;
      const [state, obj]: any = call.arguments;
      if (!isObjectExpression(obj)) {
        return path;
      }
      let m: MemberExpression = j.memberExpression(
        j.identifier('builder'),
        calls,
      );
      const calls: CallExpression[] = obj.properties.map((prop: any) => {
        const namespace = camelCase(prop.key.object.replace('ActionType', ''));
        const value = upperFirst(camelCase(prop.key.property));
        const actionName = `${namespace}${value}`;
        const fn: FunctionExpression = prop.value;
        const arrowFn = j.arrowFunctionExpression(
          fn.params,
          fn.body,
          fn.expression,
        );
        return j.callExpression();
      });

      return j.callExpression(call.callee, [state, newObj]);

      obj.properties.forEach(prop => {
        if (!isObjectProperty(prop)) {
          return;
        }
        const key = prop.key;
        if (!isIdentifier(key)) {
          return;
        }
        const expression = prop.value;
        if (!isArrowFunctionExpression(expression)) {
          return;
        }

        let withoutType: any = {
          ...expression,
          body: {
            ...expression.body,
            properties: (expression.body as any).properties.filter(
              (prop: any) => prop.key && prop.key.name !== 'type',
            ),
          },
        };
        decls.push(createAction(j, namespace, key.name, withoutType));
      });
    });

  root.get().node.program.body.unshift(toolkitImport);
  root.get().node.program.body.push(...decls);
  const out = root.toSource({ quote: 'single' });
  return prettier.format(out, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'all',
  });
};

export default transform;
