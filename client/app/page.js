"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Navbar from './Components/Navbar/Navigation';
import NavbarAdmin from './Components/Navbar/NavigationAdmin';
import UserHome from './Components/UserHome';
import StartEnd from './Components/StartEnd.js';
import ElectionStatus from './Components/ElectionStatus';
import getWeb3 from '../getWeb3';
import Election from '../contracts/Election.json';
import { FaAngleDoubleDown } from "react-icons/fa";

export default function page() {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [elStarted, setElStarted] = useState(false);
  const [elEnded, setElEnded] = useState(false);
  const [elDetails, setElDetails] = useState({});

  useEffect(() => {
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    } else {
      loadBlockchainData();
    }
  }, []);

  const loadBlockchainData = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(Election.abi, deployedNetwork && deployedNetwork.address);

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

      const electionDetails = await instance.methods.getElectionDetails().call();
      setElDetails({
        adminName: electionDetails.adminName,
        adminEmail: electionDetails.adminEmail,
        adminTitle: electionDetails.adminTitle,
        electionTitle: electionDetails.electionTitle,
        organizationTitle: electionDetails.organizationTitle,
      });
    } catch (error) {
      alert('Failed to load web3, accounts, or contract. Check console for details.');
      console.error(error);
    }
  };

  const endElection = async () => {
    await ElectionInstance.methods.endElection().send({ from: account, gas: 1000000 });
    window.location.reload();
  };

  const registerElection = async (data) => {
    await ElectionInstance.methods
      .setElectionDetails(
        data.adminFName.toLowerCase() + ' ' + data.adminLName.toLowerCase(),
        data.adminEmail.toLowerCase(),
        data.adminTitle.toLowerCase(),
        data.electionTitle.toLowerCase(),
        data.organizationTitle.toLowerCase()
      )
      .send({ from: account, gas: 1000000 });
    window.location.reload();
  };

  const AdminHome = () => {
    const { handleSubmit, register, formState: { errors } } = useForm();

    const onSubmit = (data) => {
      registerElection(data);
    };

    const EMsg = ({ msg }) => <span className="text-red-500">{msg}</span>;

    return (
      <div className='bg-transparent border-black'>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!elStarted && !elEnded ? (
            <div className="container mx-auto p-4  border-black">
              <div className=" border-black h-[80vh] flex flex-col items-center justify-center ">
                <h3 className="text-2xl font-semibold text-center mb-8">About Admin</h3>
                <div className="bg-white w-[50vw] shadow-md rounded px-8 py-6 text-sm">
                  <label className="block text-gray-700 text-sm font-bold my-2">
                    Full Name
                    {errors.adminFName && <EMsg msg=" *required" />}
                  </label>
                  <div className='flex items-center justify-evenly '>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="First Name"
                      {...register('adminFName', { required: true })}
                    />
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                      type="text"
                      placeholder="Last Name"
                      {...register('adminLName')}
                    />
                  </div>
                    

                  <label className="block text-gray-700 text-sm font-bold my-2">
                    Email
                    {errors.adminEmail && <EMsg msg={errors.adminEmail.message} />}
                  </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="eg. you@example.com"
                      {...register('adminEmail', {
                        required: ' *required',
                        pattern: {
                          value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                          message: ' *invalid',
                        },
                      })}
                    />

                  <label className="block text-gray-700 text-sm font-bold my-2">
                    Job Title or Position
                    {errors.adminTitle && <EMsg msg="*required" />}
                  </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="eg. HR Head"
                      {...register('adminTitle', { required: true })}
                    />
                </div>
              </div>

              <div className=" border-black h-[80vh] flex flex-col items-center justify-center ">
                <h3 className="text-2xl font-semibold text-center mb-8">About Election</h3>
                <div className="bg-white w-[50vw] shadow-md rounded px-8 py-6 text-sm">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Election Title
                    {errors.electionTitle && <EMsg msg=" *required" />}
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="eg. School Election"
                      {...register('electionTitle', { required: true })}
                    />
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Organization Name
                    {errors.organizationName && <EMsg msg=" *required" />}
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="eg. Lifeline Academy"
                      {...register('organizationTitle', { required: true })}
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : elStarted ? (
            <UserHome el={elDetails} />
          ) : null}
          <StartEnd elStarted={elStarted} elEnded={elEnded} endElFn={endElection} />
          <ElectionStatus elStarted={elStarted} elEnded={elEnded} />
        </form>
      </div>
    );
  };

  if (!web3) {
    return (
      <main className='h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8'>
        <div className='self-center absolute w-fit'>
          <Navbar />
        </div>
        <Link href="/" className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif">
          VOTEZ
        </Link>
        <div className='h-[80vh] flex justify-center items-center'>
          <p className="font-mono text-3xl font-extrabold">
            Loading Web3, accounts, and contract...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className='h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8'>
       
      <div className='self-center absolute w-fit '>
       {isAdmin ? <NavbarAdmin /> : <Navbar />} 
      </div>
      <Link href="/" className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif">
        VOTEZ
      </Link>
      
      <div className='px-14'>

      <div className="container mx-auto p-4 h-[80vh] border-black flex flex-col justify-center space-y-6">
        <div className="bg-white shadow-md rounded-xl p-16 mb-4 w-fit mx-auto">
          <div className="text-center text-lg font-semibold">Your account
          <div className='bg-gradient-to-tr from-red-600 via-yellow-600 to-orange-900 text-transparent bg-clip-text'>
            {account}
          </div> </div>
        </div>
        {!elStarted && !elEnded ? (
          <div className="bg-white shadow-md rounded p-8 mb-4">
            <center>
              <h3 className="text-lg font-semibold mb-4">The election has not been initialized</h3>
              {isAdmin ? <p className='animate-pulse text-2xl font-bold text-sans flex items-center justify-center'>Set up the Election <FaAngleDoubleDown className='text-2xl ml-2 animate-bounce' /></p> : <p className='animate-pulse text-xl font-bold text-sans'>Please wait..</p>}
            </center>
          </div>          
        ) : null}
      </div>
      {isAdmin ? (
        <AdminHome />
      ) : elStarted ? (
        <UserHome el={elDetails} />
      ) : !elStarted && elEnded ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <center>
            <p className="text-lg font-semibold">The Election ended.</p>
            <br />
            <Link href="/results" className="text-blue-500 underline">
              See results
            </Link>
          </center>
        </div>
      ) : null}
      </div>
    </main>
  );
}
