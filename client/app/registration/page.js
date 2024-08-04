"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar/Navigation";
import NavbarAdmin from "../Components/Navbar/NavigationAdmin";
import NotInit from "../Components/NotInit";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import Link from "next/link";
import { FaAngleDoubleDown } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Registration = () => {
  const [web3, setWeb3] = useState(null);
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isElStarted, setIsElStarted] = useState(false);
  const [isElEnded, setIsElEnded] = useState(false);
  const [voterCount, setVoterCount] = useState(undefined);
  const [voterName, setVoterName] = useState("");
  const [voterPhone, setVoterPhone] = useState("");
  const [voters, setVoters] = useState([]);
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
    const init = async () => {
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
          setIsAdmin(accounts[0] === admin);

          const start = await instance.methods.getStart().call();
          setIsElStarted(start);
          const end = await instance.methods.getEnd().call();
          setIsElEnded(end);

          const voterCount = await instance.methods.getTotalVoter().call();
          setVoterCount(voterCount);

          const voters = [];
          for (let i = 0; i < voterCount; i++) {
            const voterAddress = await instance.methods.voters(i).call();
            const voter = await instance.methods
              .voterDetails(voterAddress)
              .call();
            voters.push({
              address: voter.voterAddress,
              name: voter.name,
              phone: voter.phone,
              hasVoted: voter.hasVoted,
              isVerified: voter.isVerified,
              isRegistered: voter.isRegistered,
            });
          }
          setVoters(voters);

          const currentVoter = await instance.methods
            .voterDetails(accounts[0])
            .call();
          setCurrentVoter({
            address: currentVoter.voterAddress,
            name: currentVoter.name,
            phone: currentVoter.phone,
            hasVoted: currentVoter.hasVoted,
            isVerified: currentVoter.isVerified,
            isRegistered: currentVoter.isRegistered,
          });
          setIsLoaded(true);
        } catch (error) {
          console.error(error);
          alert(
            `Failed to load web3, accounts, or contract. Check console for details (f12).`
          );
        }
      };

      if (!isLoaded) {
        loadBlockchainData();
      }
    };
    init();
  }, [isLoaded]);

  const registerAsVoter = async () => {
    await ElectionInstance.methods
      .registerAsVoter(voterName, voterPhone)
      .send({ from: account, gas: 1000000 });
    window.location.reload();
  };

  const updateVoterName = (event) => setVoterName(event.target.value);
  const updateVoterPhone = (event) => setVoterPhone(event.target.value);

  const loadCurrentVoter = (voter, isRegistered) => (
    <div className="flex flex-col items-center justify-start mt-10">
      <div
        className={"container-item " + (isRegistered ? "success" : "attention")}
      >
        <center className="text-center text-xl font-mono font-semibold text-zinc-700 mb-6">
          Your Registeration Information
        </center>
      </div>
      <div
        className={
          "border-2 border-red-200 rounded-lg w-[50vw] h-[40vh] " +
          (isRegistered ? "bg-lime-100" : "bg-gray-100")
        }
      >
        <table className="w-full h-full rounded-lg shadow-xl text-sm font-sans">
          <tbody>
            <tr>
              <th className="text-red-900/90">Account Address</th>
              <td>{voter.address}</td>
            </tr>
            <tr>
              <th className="text-red-900/90">Name</th>
              <td className="font-serif capitalize">{voter.name}</td>
            </tr>
            <tr>
              <th className="text-red-900/90">Phone</th>
              <td>{voter.phone}</td>
            </tr>
            <tr>
              <th className="text-red-900/90">Voted</th>
              <td className="font-semibold">{voter.hasVoted ? "True" : "False"}</td>
            </tr>
            <tr>
              <th className="text-red-900/90">Verification</th>
              <td className="font-semibold">{voter.isVerified ? "True" : "False"}</td>
            </tr>
            <tr>
              <th className="text-red-900/90">Registered</th>
              <td className="font-semibold">{voter.isRegistered ? "True" : "False"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const loadAllVoters = (voters) => (
    <div className="flex flex-col items-center justify-start pt-4 w-[65vw] h-fit">
      <div className="container-item success">
        <center className="text-center text-2xl font-sans font-bold mb-4 text-zinc-700">
          List of voters
        </center>
      </div>
      <div className="border-2 border-orange-200 bg-orange-100/50 h-[62vh] w-full overflow-auto scroll-smooth flex flex-col items-center justify-start px-4 rounded-lg py-4 gap-10">
        {voters.map((voter, index) => (
          <div
            key={index}
            className=" rounded-lg w-[50vw] ring-2 ring-red-200 bg-white"
          >
            <table className="w-[50vw] h-[22vw] rounded-lg shadow-xl font-sans text-md text-zinc-700">
              <tbody>
                <tr>
                  <th>Account address</th>
                  <td>{voter.address}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td className="capitalize font-mono">{voter.name}</td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <td>{voter.phone}</td>
                </tr>
                <tr>
                  <th>Voted</th>
                  <td className="font-semibold">{voter.hasVoted ? "True" : "False"}</td>
                </tr>
                <tr>
                  <th>Verified</th>
                  <td className="font-semibold">{voter.isVerified ? "True" : "False"}</td>
                </tr>
                <tr>
                  <th>Registered</th>
                  <td className="font-semibold">{voter.isRegistered ? "True" : "False"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
      
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
    <main className=" h-screen w-full overflow-auto snap-y snap-mandatory flex flex-col gap-8 px-20 pt-8">
      <div className="self-center absolute w-fit ">
        {isAdmin ? <NavbarAdmin /> : <Navbar />}
      </div>
      <Link
        href="/home"
        className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
      >
        VOTEZ
      </Link>
      {!isElStarted && !isElEnded ? (
        <NotInit />
      ) : (
        <div className=" px-14  ">
          <div className="snap-end snap-always h-[80vh] flex flex-col items-center justify-start">
            <div className="container-item info mt-6">
              <p className="text-center text-3xl font-sans font-bold tracking-wide text-zinc-700">
                Total Registered Voters : <span className="text-green-500 text-4xl font-mono">{voters.length}</span>
              </p>
            </div>
            <div className=" ">
              {loadCurrentVoter(currentVoter, currentVoter.isRegistered)}
            </div>
            {
              (!currentVoter.isRegistered) &&
              (<p className="z-0 text-zinc-700 text-xl font-bold font-sans flex flex-col items-center justify-center mt-8">
                Scroll down for Registration

                <FaAngleDoubleDown className="text-3xl text-zinc-600 mt-2 animate-bounce" />

              </p>)
            }
          </div>
          
          {
            (!currentVoter.isRegistered) &&
          (<div className="snap-start snap-always h-[100vh] mt-14 pt-24 flex flex-col justify-start items-center">
              <p className="text-center text-xl font-mono text-orange-400 font-semibold my-4">
                Register to vote
              </p>
              <div className="bg-white ring-2 ring-red-200 shadow-xl rounded-xl text-md font-sans font-bold z-0 px-2 py-8 mb-4 w-[65vw] flex flex-col items-start select-none ">
                <form>
                  <div className="mx-auto w-fit text-red-900 ">
                    <div className="div-li">
                      <label className="text-center  mb-2 w-[55vw] flex justify-end gap-6 items-center  ">
                        Account Address
                        <input
                          className="bg-gray-50 ring-2 ring-zinc-200 text-sm rounded-lg focus:ring-zinc-300 w-[35vw] py-2 px-3 text-gray-700 mt-2 cursor-not-allowed"                          
                          type="text"
                          value={account}
                          readOnly
                        />{" "}
                      </label>
                    </div>
                    <div className="div-li">
                      <label className="text-center mb-2 w-[55vw] flex justify-end gap-6 items-center">
                        Name
                        <input
                          className="bg-gray-50 ring-2 ring-zinc-200 text-sm rounded-lg focus:ring-zinc-300 w-[35vw] py-2 px-3 text-gray-700 mt-2 "                          
                          type="text"
                          placeholder="John Doe"
                          value={voterName}
                          onChange={updateVoterName}
                        />{" "}
                      </label>
                    </div>
                    <div className="div-li">
                      <label className="text-center mb-2 w-[55vw] flex justify-end gap-2 items-center">
                        Phone number <span style={{ color: "tomato" }}>*</span>
                        <input
                          className="bg-gray-50 ring-2 ring-zinc-200 text-sm rounded-lg focus:ring-zinc-300 w-[35vw] py-2 px-3 text-gray-700 mt-2 "                          
                          type="tel"
                          placeholder="9841234567"
                          value={voterPhone}
                          onChange={updateVoterPhone}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="  flex flex-col">
                    <p className="flex gap-4 mx-8">
                      <span style={{ color: "tomato" }}> Note: </span>
                      <p className="text-sm font-sans font-semibold text-zinc-700">
                        <br />* Make sure your account address and Phone number
                        are correct. <br />* Admin might not approve your
                        account if the provided Phone number does not match the
                        account address registered in admin&apos;s catalog.
                      </p>
                    </p>
                    <button
                      className={`text-white ${
                        voterPhone.length !== 10 || currentVoter.isVerified
                          ? "bg-gray-100 text-zinc-400 cursor-not-allowed"
                          : "bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                      } font-medium font-sans rounded-lg px-5 text-sm w-72 text-center mx-auto py-4 mt-4`}
                      disabled={
                        voterPhone.length !== 10 || currentVoter.isVerified
                      }
                      onClick={registerAsVoter}
                    >
                      {currentVoter.isRegistered ? "Update" : "Register"}
                    </button>
                  </div>
                </form>
              </div>
            </div>)
          }
          {isAdmin && (
            <div className="snap-start snap-always flex flex-col items-center h-[100vh] mt-24 pt-28 pb-4">
              <small className="text-center text-xl font-mono font-bold text-zinc-700 ">
                Total Voters: {voters.length}
              </small>
              {loadAllVoters(voters)}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Registration;
