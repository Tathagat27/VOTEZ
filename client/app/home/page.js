"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Navbar from "../Components/Navbar/Navigation";
import NavbarAdmin from "../Components/Navbar/NavigationAdmin";
import UserHome from "../Components/UserHome";
import StartEnd from "../Components/StartEnd.js";
import ElectionStatus from "../Components/ElectionStatus";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import { FaAngleDoubleDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Page() {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [elStarted, setElStarted] = useState(false);
  const [elEnded, setElEnded] = useState(false);
  const [elDetails, setElDetails] = useState({});

  const [isLoaded, setIsLoaded] = useState(false);

  const adminInfoRef = useRef(null);
  const electionInfoRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      loadBlockchainData();
    }
  }, [isLoaded]);

  const loadBlockchainData = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      setWeb3(web3);
      setElectionInstance(instance);
      setAccount(accounts[0]);

      const admin = await instance.methods.getAdmin().call();
      console.log(accounts[0], " ", admin);
      if (accounts[0] === admin) {
        setIsAdmin(true);
      }

      const start = await instance.methods.getStart().call();
      setElStarted(start);
      const end = await instance.methods.getEnd().call();
      setElEnded(end);

      const electionDetails = await instance.methods
        .getElectionDetails()
        .call();
      setElDetails({
        adminName: electionDetails.adminName,
        adminEmail: electionDetails.adminEmail,
        adminTitle: electionDetails.adminTitle,
        electionTitle: electionDetails.electionTitle,
        organizationTitle: electionDetails.organizationTitle,
      });

      setIsLoaded(true);
    } catch (error) {
      alert(
        "Failed to load web3, accounts, or contract. Check console for details."
      );
      console.error(error);
    }
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const endElection = async () => {
    await ElectionInstance.methods
      .endElection()
      .send({ from: account, gas: 1000000 });
    window.location.reload();
  };

  const registerElection = async (data) => {
    await ElectionInstance.methods
      .setElectionDetails(
        data.adminFName.toLowerCase() + " " + data.adminLName.toLowerCase(),
        data.adminEmail.toLowerCase(),
        data.adminTitle.toLowerCase(),
        data.electionTitle.toLowerCase(),
        data.organizationTitle.toLowerCase()
      )
      .send({ from: account, gas: 1000000 });
    window.location.reload();
  };

  const AdminHome = () => {
    const {
      handleSubmit,
      register,
      formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
      registerElection(data);
    };

    const EMsg = ({ msg }) => <span className="text-red-500">{msg}</span>;

    return (
      <div className="bg-transparent border-black">
        <form onSubmit={handleSubmit(onSubmit)}>
          {!elStarted && !elEnded ? (
            <div className="container mx-auto p-4  border-black">
              <div ref={adminInfoRef} className="snap-start snap-always border-black h-[100vh] flex flex-col items-center justify-center ">
                <h3 className="text-2xl font-bold font-mono tracking-tight text-zinc-700 text-center mb-8 mt-6">
                  About Admin
                </h3>
                <div className="bg-white/75 w-[45vw] shadow-md rounded-xl px-8 pt-8 pb-14 text-sm">
                  <label className="block text-gray-700 text-sm font-bold my-2 ">
                    Full Name
                    {errors.adminFName && <EMsg msg=" *required" />}
                  </label>
                  <div className="flex items-center justify-evenly ">
                    <input
                      className="bg-gray-50 ring-2 ring-zinc-200 text-sm rounded-lg focus:ring-zinc-300 w-full py-2 px-3 text-gray-700 "
                      type="text"
                      placeholder="First Name"
                      {...register("adminFName", { required: true })}
                    />
                    <input
                      className="bg-gray-50 ring-2 ring-zinc-200 text-sm rounded-lg focus:ring-zinc-300 w-full py-2 px-3 text-gray-700 ml-2"
                      type="text"
                      placeholder="Last Name"
                      {...register("adminLName")}
                    />
                  </div>

                  <label className="block text-gray-700 text-sm font-bold mb-2 mt-6">
                    Email
                    {errors.adminEmail && (
                      <EMsg msg={errors.adminEmail.message} />
                    )}
                  </label>
                  <input
                    className="bg-gray-50 ring-2 ring-zinc-200 text-sm rounded-lg focus:ring-zinc-300 w-full py-2 px-3 text-gray-700 "
                    placeholder="you@example.com"
                    {...register("adminEmail", {
                      required: " *required",
                      pattern: {
                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        message: " *invalid",
                      },
                    })}
                  />

                  <label className="block text-gray-700 text-sm font-bold mb-2 mt-6">
                    Job Title or Position
                    {errors.adminTitle && <EMsg msg="*required" />}
                  </label>
                  <input
                    className="bg-gray-50 ring-2 ring-zinc-200 text-sm rounded-lg focus:ring-zinc-300 w-full py-2 px-3 text-gray-700"
                    type="text"
                    placeholder="HR Head"
                    {...register("adminTitle", { required: true })}
                  />
                </div>
              </div>

              <div ref={electionInfoRef} className="snap-start snap-always border-black h-[100vh] flex flex-col items-center justify-center ">
                <p className="text-2xl font-bold font-mono tracking-tight text-zinc-700 text-center mb-8">
                  About Election
                </p>
                <div className="bg-white w-[45vw] shadow-md rounded-xl px-8 py-10 text-sm">
                  <label className="block text-gray-700 text-sm font-bold mb-6">
                    Election Title
                    {errors.electionTitle && <EMsg msg=" *required" />}
                    <input
                      className="bg-gray-50 ring-2 ring-zinc-200 text-sm rounded-lg focus:ring-zinc-300 w-full py-2 px-3 text-gray-700 mt-2 "
                      type="text"
                      placeholder="School Election"
                      {...register("electionTitle", { required: true })}
                    />
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Organization Name
                    {errors.organizationName && <EMsg msg=" *required" />}
                    <input
                      className="bg-gray-50 ring-2 ring-zinc-200 text-sm rounded-lg focus:ring-zinc-300 w-full py-2 px-3 text-gray-700 mt-2"
                      type="text"
                      placeholder="Lifeline Academy"
                      {...register("organizationTitle", { required: true })}
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : elStarted ? (
            <UserHome el={elDetails} />
          ) : null}
          <StartEnd
            elStarted={elStarted}
            elEnded={elEnded}
            endElFn={endElection}
          />
          <ElectionStatus elStarted={elStarted} elEnded={elEnded} />
        </form>
      </div>
    );
  };

  if (!web3) {
    return (
      <main className="h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
        <div className="self-center absolute w-fit">
          <Navbar />
        </div>
        <Link
          href="/home"
          className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
        >
          VOTEZ
        </Link>
        <div className="h-[80vh] flex flex-col justify-center items-center text-zinc-700">
          <p className="font-mono text-3xl font-extrabold mb-8">
            Loading Web3, Accounts, and Contract
          </p>
          <AiOutlineLoading3Quarters className="text-4xl animate-spin font-extrabold" />

        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full overflow-auto snap-y snap-mandatory scroll-smooth flex flex-col gap-8 px-20 pt-8">
      <div className="self-center absolute w-fit ">
        {isAdmin ? <NavbarAdmin /> : <Navbar />}
      </div>
      <Link
        href="/home"
        className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
      >
        VOTEZ
      </Link>

      <div className="px-14">
        <div className="snap-end snap-always container mx-auto p-4 h-[80vh] border-black flex flex-col justify-center space-y-6">
          <div className="bg-white shadow-md rounded-2xl p-16 mb-4 w-fit mx-auto">
            <div className="text-center text-lg font-semibold font-mono text-zinc-700">
              Your account
              <div className="bg-gradient-to-tr from-red-600 via-yellow-600 to-orange-900 text-transparent bg-clip-text">
                {account}
              </div>{" "}
            </div>
          </div>
          {!elStarted && !elEnded ? (
            <div className=" p-8 mb-4">
              <center>
                <p className="text-3xl font-serif tracking-wider  mb-4">
                  The election has not been initialized
                </p>
                {isAdmin ? (
                  <p className="z-0 text-zinc-700 text-xl font-bold font-sans flex flex-col items-center justify-center mt-8">
                    Set up the Election

                    <FaAngleDoubleDown onClick={() => scrollToSection(adminInfoRef)} className="text-3xl text-zinc-600 mt-5 cursor-pointer animate-bounce" />

                  </p>
                ) : (
                  <p className="animate-pulse text-xl font-bold text-sans">
                    Please wait..
                  </p>
                )}
              </center>
            </div>
          ) : (
            (elStarted && !elEnded) ? (
            <div className=" p-8 mb-4">
              <center>
                <p className="text-3xl font-serif tracking-wider  mb-4">
                The election is currently being conducted
                </p>
               
                  <p className="z-0 text-zinc-700 text-xl font-bold font-sans flex flex-col items-center justify-center mt-8">
                    Scroll down to see details

                    <FaAngleDoubleDown className="text-3xl text-zinc-600 mt-5 cursor-pointer animate-bounce" />

                  </p>
               
              </center>
            </div>
            ) : (
                <div className=" px-8 pt-6 pb-8 mb-4">
                    <center>
                    <p className="text-3xl font-serif tracking-wider  mb-4 text-red-800">The Election has been Ended</p>
                    <br />
                    <Link href="/results" className="p-4 rounded-lg text-sm font-sans text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                        See Results
                    </Link>
                    </center>
                </div>
            )
          )}
        </div>
        {isAdmin ? (
          <AdminHome />
        ) : elStarted && (
          <UserHome el={elDetails} />
        ) 
        }
      </div>
    </main>
  );
}
