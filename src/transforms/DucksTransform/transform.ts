import prettier from 'prettier';
import {
  Transform,
  JSCodeshift,
  ExportNamedDeclaration,
  ArrowFunctionExpression,
} from 'jscodeshift';
import { upperFirst, snakeCase } from 'lodash';
import {
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isObjectProperty,
  isArrowFunctionExpression,
} from '@babel/types';

function createImport(j: JSCodeshift, source: string, ids: string[]) {
  const specs = ids.map(id =>
    j.importSpecifier(j.identifier(id), j.identifier(id)),
  );
  return j.importDeclaration(specs, j.literal(source));
}
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
  const toolkitImport = createImport(j, '@reduxjs/toolkit', ['createAction']);
  const root = j(fileInfo.source);
  const decls: ExportNamedDeclaration[] = [];

  root
    // .insertAfter(toolkitImport)
    .find(j.VariableDeclarator)
    .filter(path => {
      const init = path.value.init && path.value.init;
      if (!isCallExpression(init)) {
        return false;
      }

      const callee = init.callee;
      if (!isCallExpression(callee)) {
        return false;
      }

      const id = callee.callee;
      if (!isIdentifier(id)) {
        return false;
      }
      return id.name === 'createActionCreators';
    })
    .forEach(path => {
      const namespace = (path.value.id as any).name.replace('Actions', '');
      const init = path.value.init && path.value.init;
      if (!isCallExpression(init)) {
        return false;
      }

      const obj = (init as any).arguments[0];
      if (!isObjectExpression(obj)) {
        return false;
      }
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
