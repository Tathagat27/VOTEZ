import React from "react";
import Link from "next/link";

const StartEnd = (props) => {
  return (
    <div className="container mx-auto border-t mt-0 p-8 h-[40vh] flex flex-col justify-center">
      {!props.elStarted ? (
        <div>
          {!props.elEnded ? (
            <div>
              <div className="container mx-auto p-4 bg-yellow-100 rounded-md flex flex-col items-center">
                <h2 className="text-lg font-semibold">Do not forget to add candidates.</h2>
                <p>
                  Go to{" "}
                  <Link href="/addCandidate" className="text-blue-500 underline">
                    Add Candidate
                  </Link>{" "}
                  page.
                </p>
              </div>
              <div className="container mx-auto p-4 flex justify-center">
                <button
                  type="submit"
                  className="block py-4 px-8 m-2 w-80 text-center bg-blue-500 hover:bg-blue-600 text-white rounded-md"
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
            <center>
              <p className="text-xl font-semibold">The election started.</p>
            </center>
          </div>
          <div className="container mx-auto p-4">
            <button
              type="button"
              onClick={props.endElFn}
              className="block py-4 px-8 m-2 w-80 text-center mx-auto bg-red-500 text-white rounded-md"
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
