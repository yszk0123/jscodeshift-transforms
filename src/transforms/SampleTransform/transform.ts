import { Transform } from 'jscodeshift';

const transform: Transform = (fileInfo, api) => {
  return api
    .jscodeshift(fileInfo.source)
    .findVariableDeclarators('foo')
    .renameTo('bar')
    .toSource();
};

export default transform;
