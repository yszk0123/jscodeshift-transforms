type ReturnTypes<T> = any;
declare const createActionCreators: <T>() => any;

export enum NamespaceActionType {
  FOO_SHOWN = 'namespace/FOO_SHOWN',
  FOO_HIDDEN = 'namespace/FOO_HIDDEN',
  FOO_OTHER = 'namespace/FOO_OTHER',
}

export const namespaceActions = createActionCreators<NamespaceActionType>()({
  fooShown: (payload: { error: unknown }) => ({
    type: NamespaceActionType.FOO_SHOWN,
    payload,
  }),
  fooHidden: () => ({
    type: NamespaceActionType.FOO_HIDDEN,
    payload: {},
  }),
  fooOther: (first: number, second: string) => ({
    type: NamespaceActionType.FOO_OTHER,
    payload: { first, second },
  }),
});

type NamespaceActionCreators = typeof namespaceActions;

export type NamespaceActions = ReturnTypes<NamespaceActionCreators>;
