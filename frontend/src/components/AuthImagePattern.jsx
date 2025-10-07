import { useState, useEffect } from "react";
import {
  Code,
  CheckCircle,
  Timer,
  BarChart3,
  Play,
  Loader2,
  Trophy,
} from "lucide-react";

// Typing animation hook
const useTypingAnimation = (fullText, delay = 50) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex >= fullText.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(fullText.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, delay, fullText]);

  return { displayedText, isComplete };
};

const AuthImagePattern = () => {
  const codeSnippet = `def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i`;

  const { displayedText, isComplete } = useTypingAnimation(codeSnippet, 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async () => {
    if (!isComplete || isSubmitting) return;

    setIsSubmitting(true);
    setShowResult(false);
    setShowConfetti(false);

    // Simulate API call / code execution
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setShowResult(true);
    setShowConfetti(true);

    // Auto-hide confetti after 3s
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-8 relative overflow-hidden">
      {/* Confetti Animation (Simple CSS-based) */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-sm animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/5 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary/5 animate-pulse-slow"></div>

      <div className="relative z-10 text-center max-w-lg px-4">
        {/* App Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full mb-6 border border-primary/20">
          <Code className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary">CodeClash</span>
        </div>

        <h1 className="text-4xl font-bold text-base-content mb-2">
          Master Coding Interviews
        </h1>
        <p className="text-lg text-base-content/80 mb-8">
          Practice 500+ real-world problems. Compete, learn, and land your dream
          job.
        </p>

        {/* Code Editor */}
        <div className="bg-base-100 dark:bg-base-200 border border-base-content/10 dark:border-base-content/20 rounded-xl p-4 text-left max-w-md mx-auto shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-base-content/60 ml-2 font-mono">
              two-sum.py
            </span>
          </div>

          <pre className="text-sm font-mono text-base-content/90 leading-relaxed whitespace-pre-wrap min-h-[140px]">
            <code>{displayedText || " "}</code>
          </pre>

          {/* Submit Button - appears after typing */}
          {isComplete && !showResult && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-4 w-full flex items-center justify-center gap-2 btn btn-primary btn-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Submit Code
                </>
              )}
            </button>
          )}

          {/* Result - appears after submission */}
          {showResult && (
            <div className="mt-4 p-3 bg-success/10 dark:bg-success/20 rounded-lg border border-success/30 animate-fade-in">
              <div className="flex items-center gap-2 text-success font-medium">
                <CheckCircle className="w-4 h-4" />
                Accepted!
              </div>
              <p className="text-sm mt-1 text-base-content/80">
                Your solution passed all 21 test cases.
              </p>
            </div>
          )}
        </div>

        {/* Greeting Message - appears with result */}
        {showResult && (
          <div className="mt-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full mb-3">
              <Trophy className="w-4 h-4" />
              <span className="font-bold">First Solve!</span>
            </div>
            <p className="text-lg font-medium text-base-content">
              Great job, <span className="text-primary font-bold"></span>!
              🎉
            </p>
            <p className="text-base-content/70 mt-1">
              You're on your way to mastering DSA!
            </p>
          </div>
        )}

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-5">
          {[
            {
              icon: CheckCircle,
              label: "500+ Problems",
              color: "text-green-500",
            },
            { icon: Timer, label: "Timed Contests", color: "text-amber-500" },
            {
              icon: BarChart3,
              label: "Track Progress",
              color: "text-blue-500",
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-3 border border-gray-200 dark:border-gray-700 group-hover:scale-110 transition-transform duration-300 ${item.color}`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center px-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
