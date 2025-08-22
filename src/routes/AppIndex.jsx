import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavMenu from "../componets/NavMenu";
// import NavigationMenu from "../Components/NavigationMenu";
export default function AppIndex() {
  return (
    <div className="m-0">
      <div className="">
        <NavMenu />
      </div>

      <div className="p-0">
        <Outlet />
      </div>
    </div>
  );
}
