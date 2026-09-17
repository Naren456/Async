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
  profilePic: null,
  notificationTone: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setUser(state, action) {
      const { user, token } = action.payload || {};
      if (!user) {
        // Critical fix: actually clear state when logging out / null user
        Object.assign(state, userInitialState);
        return;
      }
      state.id = user.id || null;
      state.name = user.name || null;
      state.email = user.email || null;
      state.role = user.role || null;
      state.cohortNo = user.cohortNo ?? null;
      state.semester = user.semester ?? null;
      state.term = user.term ?? null;
      state.cgr = user.cgr ?? null;
      state.token = token ?? user.token ?? null;
      state.profilePic = user.profilePic ?? null;
      state.notificationTone = user.notificationTone ?? null;
    },
    clearUser(state) {
      Object.assign(state, userInitialState);
    },
    updateUser(state, action) {
      const { name, email, profilePic, notificationTone, cohortNo, semester, term, cgr } = action.payload || {};
      if (typeof name === 'string') state.name = name;
      if (typeof email === 'string') state.email = email;
      if (profilePic !== undefined) state.profilePic = profilePic;
      if (notificationTone !== undefined) state.notificationTone = notificationTone;
      if (cohortNo !== undefined) state.cohortNo = cohortNo;
      if (semester !== undefined) state.semester = semester;
      if (term !== undefined) state.term = term;
      if (cgr !== undefined) state.cgr = cgr;
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export default rootReducer;