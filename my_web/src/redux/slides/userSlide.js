import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  avatar: "",
  access_token: "",
  id: "",
  isAdmin: false,
  city: "",
  refreshToken: "",
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      console.log("🧠 REDUX ACTION:", action.type);
      console.log("📦 PAYLOAD:", action.payload);

      const payload = action.payload || {};

      state.name = payload.name ?? state.name;
      state.email = payload.email ?? state.email;
      state.address = payload.address ?? state.address;
      state.phone = payload.phone ?? state.phone;
      state.avatar = payload.avatar ?? state.avatar;

      state.id = payload.id || payload._id || state.id;
      state.access_token = payload.access_token ?? state.access_token;

      if (typeof payload.isAdmin === "boolean") {
        state.isAdmin = payload.isAdmin;
      }

      state.city = payload.city ?? state.city;
      state.refreshToken = payload.refreshToken ?? state.refreshToken;

      console.log("✅ NEW STATE:", state);
    },

    resetUser: (state) => {
      console.log("🔄 RESET USER");

      Object.assign(state, initialState);

      console.log("🧹 STATE AFTER RESET:", state);
    },
  },
});

export const { updateUser, resetUser } = userSlide.actions;

export default userSlide.reducer;
