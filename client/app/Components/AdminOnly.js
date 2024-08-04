
import React from "react";
import { MdDoNotTouch } from "react-icons/md";

const AdminOnly = (props) => {
  return (
    <div className="px-14 h-[80vh] flex flex-col items-center justify-start py-14 space-y-6  mb-24">


        <p className="z-0 text-zinc-700 text-2xl font-bold font-sans mt-8">{props.page}</p>

        <MdDoNotTouch className="text-8xl border-8 border-zinc-700 rounded-full p-2" />
        <p className="z-0 text-zinc-700 text-4xl font-bold font-sans mt-8">Admin Access Only</p>

    </div>
  );
};

export default AdminOnly;
