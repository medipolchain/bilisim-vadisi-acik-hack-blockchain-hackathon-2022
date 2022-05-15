import React from "react";

import { MdDangerous } from "react-icons/md";

const RestrictedArea = () => {
  return (
    <div className="flex m-auto flex-col">
      <p className="m-auto text-light text-2xl montserrat font-bold tracking-wider">
        Restricted Area
      </p>
      <MdDangerous className="text-6xl m-auto" color="red" />
    </div>
  );
};

export default RestrictedArea;
