import React from "react";
import Link from "next/link";
import { IoIosWarning } from "react-icons/io";


const StartEnd = (props) => {
  return (
    <div className="container mx-auto mt-8 p-8 h-[40vh] flex flex-col justify-center">
      {!props.elStarted ? (
        <div>
          {!props.elEnded ? (
            <div>
              <div className="relative container w-[45vw] mx-auto p-4 space-y-4 py-6 bg-orange-100 rounded-xl shadow-lg flex flex-col items-center">
                
                <IoIosWarning className="absolute self-start text-3xl text-orange-500 -left-4 -top-4" />
                <h2 className="text-xl font-semibold font-serif text-red-900/75">Do not forget to Add Candidates</h2>
                <p className="text-lg font-semibold font-sans text-slate-700">
                  Go to{" "}
                  <Link href="/addCandidate" className="text-blue-500 underline">
                    Add Candidate
                  </Link>{" "}
                  page
                </p>
              </div>
              <div className="container mx-auto p-4 flex justify-center">
                <button
                  type="submit"
                  className="transition-transform duration-700 ease-in-out hover:scale-105 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 rounded-xl text-sm w-56 tracking-wider text-center py-4 mt-4 font-semibold text-white"
                >
                  Start Election {props.elEnded ? "Again" : null}
                </button>
              </div>
            </div>
          ) : (
            <div className="container mx-auto p-4">
              <center>
                <p>Re-deploy the contract to start election again.</p>
              </center>
            </div>
          )}
          {props.elEnded ? (
            <div className="container mx-auto p-4">
              <center>
                <p className="text-xl font-semibold">The election ended.</p>
              </center>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <div className="container mx-auto p-4">
            <center className="flex items-center justify-center">
            <IoIosWarning className=" mr-4 text-3xl text-orange-500" />
              
              <p className="text-xl font-semibold font-sans text-yellow-900">Clicking on End button will stop the election process, and it can not be started again. </p>
            </center>
          </div>
          <div className="container mx-auto p-4">
            <button
              type="button"
              onClick={props.endElFn}
              className="block py-4 px-8 m-2 w-[16vw] text-center mx-auto bg-red-500 text-white rounded-md"
            >
              End
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StartEnd;
