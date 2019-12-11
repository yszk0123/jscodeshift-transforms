import { createDucks } from '../../../../application/DucksType';
import { namespaceActions } from './NamespaceActions';
import { namespaceInitialState, namespaceReducer } from './NamespaceReducer';
import { namespaceFetchThunk } from './NamespaceThunks/fetchThunk';

export { namespaceActions };
export { namespaceFetchThunk };

export const namespaceActionCreators = {
  ...namespaceActions,
  fetch: fetchThunk,
};

export const namespaceDucks = createDucks({
  initialState: namespaceInitialState,
  reducer: namespaceReducer,
});
