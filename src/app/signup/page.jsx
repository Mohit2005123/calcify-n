"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox } from "@nextui-org/react";
import { FcGoogle } from 'react-icons/fc';
import Navbar from '@/components/landingpage/Navbar';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import {doc, setDoc, getDoc} from 'firebase/firestore';
import {db} from '../../lib/firebase';
export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const addUserToFirestore = async (userId, firstName, lastName, email) => {
    const userDoc = doc(db, "users", userId); // Document path: 'users/{userId}'
    await setDoc(userDoc, { firstName, lastName, email }, { merge: true });
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
  
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Save additional user info in Firestore
      await addUserToFirestore(user.uid, firstName, lastName, email);
  
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Check if user data already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Store user info if it's a new Google signup
        await addUserToFirestore(user.uid, user.displayName.split(" ")[0], user.displayName.split(" ")[1] || "", user.email);
      }
  
      router.push('/');
    } catch (error) {
      setError('Failed to sign up with Google.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Navbar />
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl flex flex-col">
        <div className="flex">
          <div className="w-full max-w-sm">
            <div className="flex flex-col items-start mb-4">
              <Image
                src="/signup/circle.svg"
                alt="User Icon"
                width={40}
                height={40}
                className="mb-2"
              />
              <h1 className="text-2xl font-poppins text-[#333333]">Create an account</h1>
            </div>
            
            <p className="mb-4 font-poppins text-[#333333] text-sm">
              Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
            </p>
            
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <form onSubmit={handleSignUp}>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#666666] mb-1 font-poppins text-[16px]">First name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-[rgba(102,102,102,0.35)] rounded-md" 
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#666666] mb-1 font-poppins text-[16px]">Last name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-[rgba(102,102,102,0.35)] rounded-md" 
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-[#666666] mb-1 font-poppins text-[16px]">Email address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[rgba(102,102,102,0.35)] rounded-md" 
                  required
                />
              </div>
              
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label htmlFor="password" className="block text-sm font-medium text-[#666666] mb-1 font-poppins text-[16px]">Password</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="password" 
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-[rgba(102,102,102,0.35)] rounded-md" 
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#666666] mb-1 font-poppins text-[16px]">Confirm your password</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-[rgba(102,102,102,0.35)] rounded-md" 
                    required
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">Use 8 or more characters with a mix of letters, numbers & symbols</p>
              
              <div className="flex items-center mb-4">
                <Checkbox isSelected={showPassword} onValueChange={setShowPassword}>Show password</Checkbox>
              </div>
        
              <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-full text-base font-semibold hover:bg-blue-700 transition duration-300 w-full max-w-sm">
                Create an account
              </button>
            </form>
          </div>
          
          <div className="flex items-center justify-center ml-6 flex-grow">
            <Image
              src="/signup/icon.svg"
              alt="Signup Illustration"
              width={250}
              height={250}
            />
          </div>
        </div>
        
        <div className="mt-4 flex flex-col items-center">
          <div className="my-2 text-center text-gray-500">or</div>
          
          <button 
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-full text-base font-semibold hover:bg-gray-50 transition duration-300 w-full max-w-sm"
          >
            <FcGoogle className="mr-2 text-lg" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
