"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import Navbar from '@/components/landingpage/Navbar';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import { db } from '../../lib/firebase';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Check if the user exists in the database
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        router.push('/'); // Redirect to dashboard if user is found
      } else {
        setError('User not found in the database.');
        await auth.signOut(); // Sign out if user not in the database
      }
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
    }
  };
  
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Check if the user exists in the database
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        router.push('/');
      } else {
        // Create a new user in the database if not found
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          // Add any other user information you want to store
        });
        router.push('/'); // Redirect to dashboard after creating the user
      }
    } catch (error) {
        console.log(error);
      setError('Failed to log in with Google.');
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
              <h1 className="text-2xl font-poppins text-[#333333]">Log in to your account</h1>
            </div>
            
            <p className="mb-4 font-poppins text-[#333333] text-sm">
              Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
            </p>
            
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <form onSubmit={handleLogin}>
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
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-[#666666] mb-1 font-poppins text-[16px]">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[rgba(102,102,102,0.35)] rounded-md" 
                  required
                />
              </div>
              
              <div className="flex items-center justify-end mb-4">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
              </div>

              <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-full text-base font-semibold hover:bg-blue-700 transition duration-300 w-full max-w-sm">
                Log in
              </button>
            </form>

            <div className="my-4 text-center text-gray-500">or</div>
            
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-full text-base font-semibold hover:bg-gray-50 transition duration-300 w-full max-w-sm"
            >
              <FcGoogle className="mr-2 text-lg" />
              Continue with Google
            </button>
          </div>
          
          <div className="flex items-center justify-center ml-6 flex-grow">
            <Image
              src="/signup/icon.svg"
              alt="Login Illustration"
              width={250}
              height={250}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
