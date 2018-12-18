export default (simpleReducerFunc) => (state, { payload }) => simpleReducerFunc(state, payload);
