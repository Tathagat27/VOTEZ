"use client"
import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-fit flex items-center justify-between z-20 bg-white text-black rounded-full h-12  drop-shadow-2xl">
     
      <ul
        className={`flex items-center justify-between gap-2 text-sm fixed inset-y-0 right-0 w-1/2 rounded-full h-11 mx-6 px-2 text-black md:static md:flex md:space-x-6 md:w-auto md:transform-none`}
      >
        <li className="hover:bg-violet-600 active:bg-blue-700 ">
          <Link href="/registration" className=" py-2 pl-2 hover:text-gray-500 font-semibold">
            Registration
          </Link>
        </li>
        <li>
          <Link href="/voting" className=" py-2 pl-2 hover:text-gray-500 font-semibold">
             Voting
          </Link>
        </li>
        <li>
          <Link href="/results" className=" py-2 pl-2 hover:text-gray-500 font-semibold">
             Results
          </Link>
        </li>
      </ul>
    </nav>
  );
}