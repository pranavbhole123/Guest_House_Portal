import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const credentialSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
    contact: "",
    role: "",
  },
  reducers: {
    setCredentialSlice: (state, action) => {
      const { name, contact, role, email } = action.payload;
      state.name = name;
      state.role = role;
      state.contact = contact;
      state.email = email;
    },
  },
});

export const { setCredentialSlice } = credentialSlice.actions;
export default credentialSlice.reducer;
