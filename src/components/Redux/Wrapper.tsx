"use client"
import { store } from "@/Redux/Store";
import React from "react";
import { Provider } from "react-redux";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Wrapper;
