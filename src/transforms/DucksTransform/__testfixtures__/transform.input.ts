import { createDucks } from '../../../../application/DucksType';
import { namespaceActions } from './NamespaceActions';
import { namespaceInitialState, namespaceReducer } from './NamespaceReducer';
import { namespaceFetchThunk } from './NamespaceThunks/namespaceFetchThunk';

export const namespaceActionCreators = {
  ...namespaceActions,
  namespaceFetchThunk: namespaceFetchThunk,
};

export const namespaceDucks = createDucks({
  initialState: namespaceInitialState,
  reducer: namespaceReducer,
});
