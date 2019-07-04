import * as API from '@/services/api';

export default {
  namespace: 'user',

  state: {
    list: [],
    page: null,
    size: null,
    total: null,
    last_week: 0,
    this_week: 0,
  },

  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },

  effects: {
    *fetch({ payload: { page = 1, size = 10 } }, { call, put }) {
      const data = yield call(API.getUserList, { page, size });
      yield put({
        type: 'update',
        payload: {
          list: data.users,
          page,
          size,
          total: data.total,
        }
      });
    },

    *create({ payload }, { call, put }) {
      yield call(API.createUser, payload);
      yield put({ type: 'reload' });
    },

    *delete({ payload: { id } }, { call, put }) {
      yield call(API.deleteUser, id);
      yield put({ type: 'reload' });
    },

    *star({ payload: { id } }, { call, put }) {
      yield call(API.setUserStar, id);
      yield put({ type: 'reload' });
    },

    *lock({ payload: { id } }, { call, put }) {
      yield call(API.setUserLock, id);
      yield put({ type: 'reload' });
    },

    *reload(_, { put, select }) {
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },

    *statis(_, { call, put }) {
      const total = yield call(API.getUserTotal);
      const this_week = yield call(API.getNewUserThisWeek);
      const last_week = yield call(API.getNewUserLastWeek);

      yield put({
        type: 'update',
        payload: {
          last_week,
          this_week,
          total,
        }
      });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/content/users') {
          dispatch({ type: 'fetch', payload: query });
        }

        if (pathname === '/dashboard') {
          dispatch({ type: 'statis' });
        }
      });
    },
  },
}
