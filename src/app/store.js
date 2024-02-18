import { configureStore } from '@reduxjs/toolkit';
import adminSlice from "../slices/adminSlice";
import gameSlice from "../slices/gameSlice";
import pretaskSlice from "../slices/pretaskSlice";
import attendantSlice from "../slices/attendantSlice";

export const store = configureStore({
  reducer: {
    admin: adminSlice,
    attendant: attendantSlice,
    game: gameSlice,
    pretask: pretaskSlice,
  },
});

store.subscribe(() => {
  const { admin, attendant } = store.getState();
  if (admin.loginAdmin) {
    localStorage.setItem('loginAdmin', admin.loginAdmin);
  } else {
    localStorage.removeItem('loginAdmin');
  }

  if (attendant.loginAttendant) {
    localStorage.setItem('loginAttendant', JSON.stringify(attendant.loginAttendant));
  } else {
    localStorage.removeItem('loginAttendant');
  }

  window.loginAttendant = attendant.loginAttendant
})