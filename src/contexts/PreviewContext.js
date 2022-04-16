import React, { createContext, useContext, useReducer, useState } from "react";
import PreviewReducer, { initialState } from "./PreviewReducer";

const PreviewContext = createContext({
  state: initialState,
  dispatch: ({ type, payload }) => {
    {
      type, payload;
    }
  },
});

export function usePreview() {
  return useContext(PreviewContext);
}

const PreviewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PreviewReducer, initialState);
  const value = {
    state,
    dispatch,
  };
  return (
    <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
  );
};

export default PreviewProvider;
