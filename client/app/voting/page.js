"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Components/Navbar/Navigation";
import NavbarAdmin from "../Components/Navbar/NavigationAdmin";
import NotInit from "../Components/NotInit";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import Link from "next/link";
import { FaAngleDoubleDown } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Voting = () => {
  const router = useRouter();
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidateCount, setCandidateCount] = useState(undefined);
  const [candidates, setCandidates] = useState([]);
  const [isElStarted, setIsElStarted] = useState(false);
  const [isElEnded, setIsElEnded] = useState(false);
  const [currentVoter, setCurrentVoter] = useState({
    address: undefined,
    name: null,
    phone: null,
    hasVoted: false,
    isVerified: false,
    isRegistered: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
          const candidateCount = await instance.methods
            .getTotalCandidate()
            .call();
          setCandidateCount(candidateCount);
          const start = await instance.methods.getStart().call();
          setIsElStarted(start);
          const end = await instance.methods.getEnd().call();
          setIsElEnded(end);
          const loadedCandidates = [];
          for (let i = 1; i <= candidateCount; i++) {
            const candidate = await instance.methods
              .candidateDetails(i - 1)
              .call();
            loadedCandidates.push({
              id: candidate.candidateId,
              header: candidate.header,
              slogan: candidate.slogan,
            });
          }
          setCandidates(loadedCandidates);
          const voter = await instance.methods.voterDetails(accounts[0]).call();
          setCurrentVoter({
            address: voter.voterAddress,
            name: voter.name,
            phone: voter.phone,
            hasVoted: voter.hasVoted,
            isVerified: voter.isVerified,
            isRegistered: voter.isRegistered,
          });
          const admin = await instance.methods.getAdmin().call();
          if (accounts[0] === admin) {
            setIsAdmin(true);
          }
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
    };
    fetchData();
  }, [isLoaded]);

  const castVote = async (id) => {
    await ElectionInstance.methods
      .vote(id)
      .send({ from: account, gas: 1000000 });
    window.location.reload();
  };

  const confirmVote = (id, header) => {
    var r = window.confirm(
      "Vote for " + header + " with Id " + (+id+1) + ".\nAre you sure?"
    );
    if (r === true) {
      castVote(id);
    }
  };

  const renderCandidates = (candidate) => (
    <div
      className="relative border-4 border-neutral-100 text-zinc-700 bg-orange-100 select-none shadow-xl rounded-md w-[26vw] flex flex-col items-center justify-between p-4 gap-6"
      key={candidate.id}
    >
          <div className="absolute self-center left-6 text-xl font-sans font-bold border-2 border-red-200 rounded-full px-2 text-white bg-zinc-600">
            {+candidate.id + 1}
          </div>
        <p className="text-2xl font-serif bg-gradient-to-tr from-red-600 via-yellow-600 to-orange-900 text-transparent bg-clip-text capitalize">
          {candidate.header}
        </p>
        <p className="w-full max-w-full break-words overflow-hidden text-ellipsis p-2 text-md font-mono capitalize self-start border-t-2 border-white text-red-900/50">{candidate.slogan}</p>

      <button
        onClick={() => confirmVote(candidate.id, candidate.header)}
        className={`transition-transform duration-700 ease-in-out hover:scale-105 rounded-lg  h-[4vw] w-72 flex items-center justify-center text-semibold
           ${
             !currentVoter.isRegistered ||
             !currentVoter.isVerified ||
             currentVoter.hasVoted
               ? "bg-gray-100 text-gray-400 cursor-not-allowed"
               : "text-white cursor-pointer bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
           } font-medium px-5 text-sm text-center mx-auto py-4 mb-2 `}
        disabled={
          !currentVoter.isRegistered ||
          !currentVoter.isVerified ||
          currentVoter.hasVoted
        }
      >
        Vote
      </button>
    </div>
  );

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

  return (
    <main className="h-screen w-full overflow-auto snap-y snap-mandatory flex flex-col gap-8 px-20 pt-8 ">
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
        {!isElStarted && !isElEnded ? (
          <NotInit />
        ) : isElStarted && !isElEnded ? (
          <div className="  flex flex-col">
            {currentVoter.isRegistered ? (
              currentVoter.isVerified ? (
                currentVoter.hasVoted ? (
                  <div className=" snap-end snap-always h-[80vh] flex flex-col items-center justify-center ">
                    <p className="font-serif text-4xl text-red-800 mb-8">
                      You&apos;ve casted your vote
                    </p>
                    <button
                      onClick={() => router.push("/results")}
                      className="p-4 rounded-lg text-sm text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                    >
                      See Results
                    </button>
                  </div>
                ) : (
                  <div className=" snap-end snap-always h-[80vh] flex flex-col items-center justify-center ">
                    <center className="font-serif text-4xl text-red-800">
                      Go ahead and cast your vote.
                    </center>
                    <FaAngleDoubleDown className="text-3xl text-red-800 mt-2 animate-bounce" />
                  </div>
                )
              ) : (
                <div className=" snap-end snap-always h-[80vh] flex flex-col items-center justify-center ">
                  <center className="font-serif text-4xl text-red-800">
                    Please wait for admin to verify you.
                  </center>
                </div>
              )
            ) : (
              <>
                <div className=" snap-end snap-always h-[80vh] flex flex-col items-center justify-center ">
                  <center>
                    <p className="font-serif text-4xl text-red-800">You&apos;re not registered. Please register first.</p>
                    <br />
                    <button
                      onClick={() => router.push("/registration")}
                className="p-4 rounded-lg text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                      
                    >
                      Registration Page
                    </button>
                  </center>
                </div>
              </>
            )}
            <div className="snap-start snap-always h-[100vh] flex flex-col items-center justify-center mt-24 pt-20">
              <p className="text-center text-3xl font-sans font-bold tracking-wide mb-6 text-zinc-700">
                Total Candidates : <span className="text-green-500 text-4xl font-mono">{candidates.length}</span>
              </p>
              {candidates.length < 1 ? (
                <div className="container-item attention">
                  <center className="text-center text-normal font-sans font-semibold py-4">
                    No one to vote for.
                  </center>
                </div>
              ) : (
                <div className="border-2 border-orange-200 bg-orange-100/50 rounded-lg w-full h-[65vh] grid grid-cols-2 justify-items-center overflow-auto scroll-smooth gap-12 p-4">
                  {candidates.map(renderCandidates)}
                  <div className="w-[25vw] bg-white  rounded-md shadow-md col-span-2 py-2 mx-auto font-bold font-mono text-zinc-500">
                    <center>That&apos;s all</center>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : !isElStarted && isElEnded ? (
          <>
            <div className="h-[80vh] flex flex-col justify-center">
              <center>
              <p className="text-3xl font-serif tracking-wider  mb-4 text-red-800">The Election has been Ended</p>
                <br />
                <button
                  onClick={() => router.push("/results")}
                  className="p-4 rounded-lg text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                >
                  See results
                </button>
              </center>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
};

export default Voting;
