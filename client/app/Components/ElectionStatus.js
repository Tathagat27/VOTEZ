import React from "react";

const ElectionStatus = (props) => {
  return (
    <div className="snap-end container mx-auto border-t mt-6 h-[40vh]">
      <h3 className="text-3xl font-serif tracking-tight text-zinc-700 text-center mt-6 ">Election Status</h3>
      <div className="p-3 m-2 w-full border border-tomato mx-auto text-center rounded-lg flex overflow-auto items-center justify-around text-zinc-700">
        <p className="text-lg font-semibold text-center">Started: <span className={`${props.elStarted} ? text-green-400 : text-red-400`}>{props.elStarted ? "True" : "False"}</span></p>
        <p className="text-lg font-semibold text-center">Ended: <span className={`${props.elEnded} ? text-green-400 : text-red-400`}>{props.elEnded ? "True" : "False"}</span></p>
      </div>
      <div className="container-item"></div>
    </div>
  );
};

export default ElectionStatus;
