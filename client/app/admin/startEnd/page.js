"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navigation";
import NavbarAdmin from "../../Components/Navbar/NavigationAdmin";
import AdminOnly from "../../Components/AdminOnly";
import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const StartEnd = () => {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [elStarted, setElStarted] = useState(false);
  const [elEnded, setElEnded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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
        if (accounts[0] === admin) {
          setIsAdmin(true);
        }

        const start = await instance.methods.getStart().call();
        setElStarted(start);
        const end = await instance.methods.getEnd().call();
        setElEnded(end);
        setIsLoaded(true);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    if (!isLoaded) {
      loadBlockchainData();
    }
  }, [isLoaded]);

  const startElection = async () => {
    await ElectionInstance.methods
      .startElection()
      .send({ from: account, gas: 1000000 });
    window.location.reload();
  };

  const endElection = async () => {
    await ElectionInstance.methods
      .endElection()
      .send({ from: account, gas: 1000000 });
    window.location.reload();
  };

  if (!web3) {
    return (
      <main className=" h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
        <div className="self-center absolute w-fit ">
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

  if (!isAdmin) {
    return (
      <main className=" h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
        <div className="self-center absolute w-fit ">
          <Navbar />
        </div>
        <Link
          href="/home"
          className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
        >
          VOTEZ
        </Link>
        <AdminOnly page="Start and end election page." />
      </main>
    );
  }

  return (
    <main className="h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
      <div className="self-center absolute w-fit ">
        <NavbarAdmin />
      </div>
      <Link
        href="/home"
        className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
      >
        VOTEZ
      </Link>
      {!elStarted && !elEnded && (
        <div className="container-item info">
          <center>The election has never been initiated.</center>
        </div>
      )}
      <div className="container-main">
        <h3 className="text-center">Start or end election</h3>
        {!elStarted ? (
          <>
            <div className="container-item flex justify-center">
              <button onClick={startElection} className="btn-start">
                Start {elEnded ? "Again" : null}
              </button>
            </div>
            {elEnded && (
              <div className="container-item">
                <center>
                  <p>The election ended.</p>
                </center>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="container-item">
              <center>
                <p>The election started.</p>
              </center>
            </div>
            <div className="container-item flex justify-center">
              <button onClick={endElection} className="btn-end">
                End
              </button>
            </div>
          </>
        )}
        <div className="container-item flex justify-center">
          <div className="election-status">
            <p>Started: {elStarted ? "True" : "False"}</p>
            <p>Ended: {elEnded ? "True" : "False"}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StartEnd;
