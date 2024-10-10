import Link from 'next/link';

const Visualiser = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Navigate to Different Pages</h1>
      <div className="space-y-4">
        <Link href="/visualiser/sorting" passHref>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ease-in-out">
            Go to Page 1
          </button>
        </Link>
        <Link href="/visualiser/binarytree" passHref>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out">
            Go to Page 2
          </button>
        </Link>
        <Link href="/page3" passHref>
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out">
            Go to Page 3
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Visualiser;
