import React from 'react'
import  useProblemStore  from "../store/useProblemStore";
import ProblemTable from '../components/ProblemTable';
const HomePage = () => {
  const { problems, getAllProblems, isProblemsLoading } = useProblemStore();

  React.useEffect(() => {
    if (problems.length === 0) {
      getAllProblems();
    }
  }, [getAllProblems, problems.length]);
  return (
    <div className="min-h-screen flex flex-col items-center mt-14 px-4">
      <div className="absolute top-16 left-0 w-1/3 h-1/3 bg-primary opacity-30 blur-3xl rounded-md bottom-9"></div>
      <h1 className="text-4xl font-extrabold z-10 text-center">
        Welcome to{" "}
        <span className=" font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          CodeClash
        </span>
      </h1>

      <p className="mt-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10">
        A Platform Inspired by Leetcode which helps you to prepare for coding
        interviews and helps you to improve your coding skills by solving coding
        problems
      </p>

      <div className="mt-8 z-10">
        <a
          href="/runcode"
          className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-primary rounded-lg hover:bg-primary/80 focus:ring-4 focus:ring-primary/30"
        >
          Run Code Now
          <svg
            className="w-3.5 h-3.5 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
      {/* Problem Table */}
      <div className="w-full max-w-7xl z-10">
        <ProblemTable problems={problems} isLoading={isProblemsLoading} />
      </div>
    </div>
  );
}

export default HomePage