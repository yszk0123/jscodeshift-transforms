import { namespaceFooShown, namespaceFooHidden } from './NamespaceActions';
import { NamespaceState } from './NamespaceState';

export const namespaceInitialState: NamespaceState = {
  error: null,
};

export const namespaceReducer = createReducer(namespaceInitialState, builder =>
  builder
    .addCase(namespaceFooShown, (state, { payload: { error } }) => {
      return { ...state, error };
    })
    .addCase(namespaceFooHidden, state => {
      return { ...state, error: null };
    }),
);
