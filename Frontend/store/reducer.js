import { combineReducers } from 'redux';
import { createSlice } from '@reduxjs/toolkit';

const userInitialState = {
  id: null,
  name: null,
  email: null,
  role: null,
  cohortNo: null,
  semester: null,
  term: null,
  cgr: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setUser(state, action) {
      const { user, token } = action.payload || {};
      if (!user) return state;
      state.id = user.id || null;
      state.name = user.name || null;
      state.email = user.email || null;
      state.role = user.role || null;
      state.cohortNo = user.cohortNo ?? null;
      state.semester = user.semester ?? null;
      state.term = user.term ?? null;
      state.cgr = user.cgr ?? null;
      state.token = token || null;
    },
    clearUser(state) {
      Object.assign(state, userInitialState);
    },
    updateUser(state, action) {
      const { name, email } = action.payload || {};
      if (typeof name === 'string') state.name = name;
      if (typeof email === 'string') state.email = email;
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export default rootReducer;