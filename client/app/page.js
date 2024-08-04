"use client";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { FaGithub } from "react-icons/fa";

export default function Page() {
  const router = useRouter();

  return (
    <main className="h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
      <div className="absolute self-end w-fit">
        <Link href={"https://github.com/Tathagat27/VOTEZ"}>
          <FaGithub className="text-2xl text-zinc-800 cursor-pointer" />
        </Link>
      </div>
      <Link
        href="/"
        className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
      >
        VOTEZ
      </Link>
      <div className="h-[80vh] flex flex-col justify-center items-center">
        <div className="text-7xl font-serif mb-4 mt-12 ">
          The Future of Secure Voting
        </div>
        <div className="text-xl mb-6 font-sans">
          Discover the power of truly free & fair elections with our
          decentralized, tamper-proof voting platform.
        </div>
        <div className="w-full flex justify-center items-center ">
          <button
            onClick={() => router.push("/home")}
            className="transition-transform duration-700 ease-in-out hover:scale-105 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 rounded-full text-sm w-56 tracking-wider text-center py-4 mt-4 font-semibold text-white"
          >
            Connect your wallet
          </button>
          <button
            className="transition-transform duration-700 ease-in-out hover:scale-105 bg-zinc-800 hover:bg-zinc-600 rounded-full text-sm w-44 tracking-wider text-center py-4 mt-4 font-semibold text-white ml-6 cursor-not-allowed"
            disabled
          >
            Demo video
          </button>
        </div>
      </div>
    </main>
  );
}
