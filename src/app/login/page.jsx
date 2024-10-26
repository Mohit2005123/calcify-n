import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import Navbar from '@/components/landingpage/Navbar';

export default function Login() {
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
            
            <form>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-[#666666] mb-1 font-poppins text-[16px]">Email address</label>
                <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-[rgba(102,102,102,0.35)] rounded-md" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-[#666666] mb-1 font-poppins text-[16px]">Password</label>
                <input type="password" id="password" name="password" className="w-full px-3 py-2 border border-[rgba(102,102,102,0.35)] rounded-md" />
              </div>
              
              <div className="flex items-center justify-end mb-4">
                {/* <Checkbox>Remember me</Checkbox> */}
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
              </div>
            </form>
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
        
        <div className="mt-4 flex flex-col items-center">
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-full text-base font-semibold hover:bg-blue-700 transition duration-300 w-full max-w-sm">
            Log in
          </button>
          
          <div className="my-2 text-center text-gray-500">or</div>
          
          <button className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-full text-base font-semibold hover:bg-gray-50 transition duration-300 w-full max-w-sm">
            <FcGoogle className="mr-2 text-lg" />
            Continue with Google
          </button>
        </div>
      </div>
      
      <div className="absolute top-4 right-4">
        {/* Replace this comment with your actual SVG icon */}
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Add your SVG path here */}
        </svg>
      </div>
      
      <div className="absolute bottom-4 left-4">
        <select className="text-sm text-gray-600">
          <option>English (United States)</option>
          {/* Add more language options as needed */}
        </select>
      </div>
      
      <div className="absolute bottom-4 right-4 text-sm text-gray-600">
        <Link href="/help" className="mr-4 hover:underline">Help</Link>
        <Link href="/privacy" className="mr-4 hover:underline">Privacy</Link>
        <Link href="/terms" className="hover:underline">Terms</Link>
      </div>
    </div>
  );
}

