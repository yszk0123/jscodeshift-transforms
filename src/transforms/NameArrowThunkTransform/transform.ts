import { Transform } from 'jscodeshift';
import {
  isReturnStatement,
  isBlockStatement,
  isFunctionDeclaration,
} from '@babel/types';

const transform: Transform = (fileInfo, { jscodeshift: t }) => {
  return t(fileInfo.source)
    .find(t.ArrowFunctionExpression)
    .filter(path => {
      const p1 = path.parent.value;
      if (!isReturnStatement(p1)) {
        return false;
      }

      const p2 = path.parent.parent.value;
      if (!isBlockStatement(p2)) {
        return false;
      }

      const p3 = path.parent.parent.parent.value;
      if (!isFunctionDeclaration(p3)) {
        return false;
      }
      return !!p3.id && p3.id.name.endsWith('Thunk');
    })
    .replaceWith(path => {
      const p = path.parent.parent.parent.value;
      const name = p.id.name;
      const node = path.node;
      const body: any = isBlockStatement(node.body)
        ? node.body
        : t.blockStatement([t.expressionStatement(node.body as any)]);
      return t.functionExpression(
        t.identifier(name),
        node.params,
        body,
        node.generator,
        node.expression,
      );
    })
    .toSource();
};

// const f = e => String(e.id.name).endsWith('Thunk');

export default transform;
