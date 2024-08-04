// Node module
import React from "react";

const NotInit = () => {
  // Component: Displaying election not initialize message.
  return (
    <div className="h-[80vh] py-8 container-item flex flex-col justify-center items-center">
      
        <p className="text-center text-3xl font-serif tracking-wider mb-4 text-red-800 ">The election has not been initialized.</p>
        <p className="text-center text-2xl font-sans font-semibold animate-pulse mt-8">Please Wait...</p>

    </div>
  );
};
export default NotInit;
