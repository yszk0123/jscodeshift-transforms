import { NamespaceActions, NamespaceActionType } from './NamespaceActions';
import { NamespaceState } from './NamespaceState';

export const namespaceInitialState: NamespaceState = {
  error: null,
};

export const namespaceReducer = createReducer<
  NamespaceState,
  NamespaceActionType,
  ValueOf<NamespaceActions>
>(namespaceInitialState, {
  [NamespaceActionType.NAMESPACE_FOO_SHOWN](state, { payload: { error } }) {
    return { ...state, error };
  },
  [NamespaceActionType.NAMESPACE_FOO_HIDDEN](state) {
    return { ...state, error: null };
  },
});
