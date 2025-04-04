import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <section className="flex items-center h-full p-16  dark:text-gray-800">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-400">
            <span className="sr-only">Error</span>401
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">
            Maaf,Anda tidak memiliki akses halaman yang dituju.
          </p>
          <p className="mt-4 mb-8 dark:text-gray-600">
            Jangan khawatir, Anda dapat menemukan banyak hal lain di halaman
            beranda.
          </p>
          <Link
            to="/"
            rel="noopener noreferrer"
            href="#"
            className="px-8 py-3 font-semibold rounded dark:bg-violet-600 dark:text-gray-50"
          >
            Beranda
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Unauthorized;
