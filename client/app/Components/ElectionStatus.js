import React from "react";

const ElectionStatus = (props) => {
  return (
    <div className="container mx-auto border-t mt-0 h-[40vh]">
      <h3 className="text-2xl font-semibold text-center my-8 ">Election Status</h3>
      <div className="p-3 m-2 w-full border border-tomato mx-auto text-center rounded-lg flex overflow-auto items-center justify-around">
        <p className="text-lg font-semibold text-center mb-8">Started: <span className={`${props.elStarted} ? text-green-400 : text-red-400`}>{props.elStarted ? "True" : "False"}</span></p>
        <p className="text-lg font-semibold text-center mb-8">Ended: <span className={`${props.elEnded} ? text-green-400 : text-red-400`}>{props.elEnded ? "True" : "False"}</span></p>
      </div>
      <div className="container-item"></div>
    </div>
  );
};

export default ElectionStatus;
