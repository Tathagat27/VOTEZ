"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Components/Navbar/Navigation";
import NavbarAdmin from "../Components/Navbar/NavigationAdmin";
import NotInit from "../Components/NotInit";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import Link from "next/link";

const Result = () => {
  const router = useRouter();
  const [web3, setWeb3] = useState(null);
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidateCount, setCandidateCount] = useState(undefined);
  const [candidates, setCandidates] = useState([]);
  const [isElStarted, setIsElStarted] = useState(false);
  const [isElEnded, setIsElEnded] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!window.location.hash) {
        window.location = window.location + "#loaded";
        window.location.reload();
      }
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

        const candidates = [];
        for (let i = 1; i <= candidateCount; i++) {
          const candidate = await instance.methods
            .candidateDetails(i - 1)
            .call();
          candidates.push({
            id: candidate.candidateId,
            header: candidate.header,
            slogan: candidate.slogan,
            voteCount: candidate.voteCount,
          });
        }
        setCandidates(candidates);

        const admin = await instance.methods.getAdmin().call();
        if (accounts[0] === admin) {
          setIsAdmin(true);
        }
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  const displayWinner = (candidates) => {
    const getWinner = (candidates) => {
      let maxVoteRecived = 0;
      let winnerCandidate = [];
      candidates.forEach((candidate) => {
        if (candidate.voteCount > maxVoteRecived) {
          maxVoteRecived = candidate.voteCount;
          winnerCandidate = [candidate];
        } else if (candidate.voteCount === maxVoteRecived) {
          winnerCandidate.push(candidate);
        }
      });
      return winnerCandidate;
    };

    const renderWinner = (winner) => (
      <div className="container-winner" key={winner.id}>
        <div className="winner-info">
          <p className="winner-tag">Winner!</p>
          <h2>{winner.header}</h2>
          <p className="winner-slogan">{winner.slogan}</p>
        </div>
        <div className="winner-votes">
          <div className="votes-tag">Total Votes: </div>
          <div className="vote-count">{winner.voteCount}</div>
        </div>
      </div>
    );

    const winnerCandidate = getWinner(candidates);
    return <>{winnerCandidate.map(renderWinner)}</>;
  };

  const displayResults = (candidates) => {
    const renderResults = (candidate) => (
      <tr key={candidate.id}>
        <td>{+candidate.id + 1}.</td>
        <td>{candidate.header}</td>
        <td>{candidate.voteCount}</td>
      </tr>
    );

    return (
      <>
        {candidates.length > 0 ? (
          <div className="container-main">{displayWinner(candidates)}</div>
        ) : null}
        <div className="container-main" style={{ borderTop: "1px solid" }}>
          <h2>Results</h2>
          <small>Total candidates: {candidates.length}</small>
          {candidates.length < 1 ? (
            <div className="container-item attention">
              <center>No candidates.</center>
            </div>
          ) : (
            <>
              <div className="container-item">
                <table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Candidate</th>
                      <th>Votes</th>
                    </tr>
                  </thead>
                  <tbody>{candidates.map(renderResults)}</tbody>
                </table>
              </div>
              <div
                className="container-item"
                style={{ border: "1px solid black" }}
              >
                <center>That is all.</center>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  if (!web3) {
    return (
      <main className=" h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
        <div className="self-center absolute w-fit ">
          <Navbar />
        </div>
        <Link
          href="/"
          className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
        >
          VOTEZ
        </Link>
        <div className="h-[80vh] flex justify-center items-center">
          <p className="font-mono text-3xl font-extrabold">
            Loading Web3, accounts, and contract...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className=" h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
      <div className="self-center absolute w-fit ">
        {isAdmin ? <NavbarAdmin /> : <Navbar />}
      </div>
      <Link
        href="/"
        className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
      >
        VOTEZ
      </Link>
      <div className="px-14 border-2 border-black  h-fit py-8 flex flex-col">
        {!isElStarted && !isElEnded ? (
          <NotInit />
        ) : isElStarted && !isElEnded ? (
          <div className="  flex flex-col text-xl bg-gray-50 rounded-lg border-2 border-zinc-700 py-16 font-semibold ">
            <center>
              <h3>The election is being conducted at the moment.</h3>
              <p>Result will be displayed once the election has ended.</p>
              <p>Go ahead and cast your vote {"(if not already)"}</p>
              <br />
              <button
                onClick={() => router.push("/voting")}
                className="p-4 rounded-lg text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
              >
                Voting Page
              </button>
            </center>
          </div>
        ) : (
          !isElStarted && isElEnded && displayResults(candidates)
        )}
      </div>
    </main>
  );
};

export default Result;
