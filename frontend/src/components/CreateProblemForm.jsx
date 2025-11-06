import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
    Plus,
    Trash2,
    Code2,
    CheckCircle2,
    FileText,
    Lightbulb,
    BookOpen,
    Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { languageDisplayNames } from "../lib/languages";
const problemSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    constraints: z.string().min(1, "Constraints are required"),
    hints: z.string().optional(),
    editorial: z.string().optional(),
    testCases: z
        .array(
            z.object({
                input: z.string().min(1, "Input is required"),
                output: z.string().min(1, "Output is required"),
            })
        )
        .min(1, "At least one test case is required"),
    examples: z.object({
        JAVASCRIPT: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional(),
        }),
        PYTHON: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional(),
        }),
        JAVA: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional(),
        }),
        CPP: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional(),
        }),
    }),
    codeSnippets: z.object({
        JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
        PYTHON: z.string().min(1, "Python code snippet is required"),
        JAVA: z.string().min(1, "Java code snippet is required"),
        CPP: z.string().min(1, "C++ code snippet is required"),
    }),
    referenceSolutions: z.object({
        JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
        PYTHON: z.string().min(1, "Python solution is required"),
        JAVA: z.string().min(1, "Java solution is required"),
        CPP: z.string().min(1, "C++ solution is required"),
    }),
});

const sampledpData = {
    title: "Climbing Stairs",
    category: "dp", // Dynamic Programming
    description:
        "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "EASY",
    tags: ["Dynamic Programming", "Math", "Memoization"],
    constraints: "1 <= n <= 45",
    hints:
        "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
    editorial:
        "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
    testCases: [
        { input: "2", output: "2" },
        { input: "3", output: "3" },
        { input: "4", output: "5" },
    ],
    examples: {
        JAVASCRIPT: {
            input: "n = 2",
            output: "2",
            explanation:
                "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
        },
        PYTHON: {
            input: "n = 3",
            output: "3",
            explanation:
                "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
        },
        JAVA: {
            input: "n = 4",
            output: "5",
            explanation:
                "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
        },
        CPP: {
            input: "n = 4",
            output: "5",
            explanation:
                "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
        },
    },
    codeSnippets: {
        JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
        PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
        JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
        CPP: `#include <bits/stdc++.h>
using namespace std;

int climbStairs(int n) {
    // Write your code here
    return 0;
}

int main() {
    int n;
    cin >> n;
    cout << climbStairs(n) << endl;
    return 0;
}`,
    },
    referenceSolutions: {
        JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
if (n <= 2) return n;

let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];
}

const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);
console.log(result);
rl.close();
});`,
        PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      if n <= 2:
          return n
      dp = [0] * (n + 1)
      dp[1], dp[2] = 1, 2
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      return dp[n]

if __name__ == "__main__":
  import sys
  n = int(sys.stdin.readline().strip())
  sol = Solution()
  print(sol.climbStairs(n))`,
        JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      if (n <= 2) return n;
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      return dp[n];
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      Main main = new Main();
      System.out.println(main.climbStairs(n));
      scanner.close();
  }
}`,
        CPP: `#include <bits/stdc++.h>
using namespace std;

int climbStairs(int n) {
    if (n <= 2) return n;
    vector<int> dp(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

int main() {
    int n;
    cin >> n;
    cout << climbStairs(n) << endl;
    return 0;
}`,
    },
};

// Sample problem data for another type of question
const sampleStringProblem = {
    title: "Valid Palindrome",
    description:
        "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
    difficulty: "EASY",
    tags: ["String", "Two Pointers"],
    constraints:
        "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
    hints:
        "Consider using two pointers, one from the start and one from the end, moving towards the center.",
    editorial:
        "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
    testCases: [
        { input: "A man, a plan, a canal: Panama", output: "true" },
        { input: "race a car", output: "false" },
        { input: " ", output: "true" },
    ],
    examples: {
        JAVASCRIPT: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        PYTHON: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        JAVA: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        CPP: {
            input: "A man, a plan, a canal: Panama",
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
    },
    codeSnippets: {
        JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  rl.on('line', (line) => {
    const result = isPalindrome(line);
    console.log(result ? "true" : "false");
    rl.close();
  });`,
        PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Write your code here
          pass
  
  if __name__ == "__main__":
      import sys
      s = sys.stdin.readline().strip()
      sol = Solution()
      result = sol.isPalindrome(s)
      print(str(result).lower())`,
        JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
       
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}`,
        CPP: `#include <bits/stdc++.h>
using namespace std;

string preprocess(string s) {
    string res = "";
    for (char c : s) {
        if (isalnum(c)) res += tolower(c);
    }
    return res;
}

bool isPalindrome(string s) {
    s = preprocess(s);
    int l = 0, r = s.size() - 1;
    while (l < r) {
        if (s[l] != s[r]) return false;
        l++;
        r--;
    }
    return true;
}

int main() {
    string s;
    getline(cin, s);
    cout << (isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}`,
    },
    referenceSolutions: {
        JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = s.length - 1;
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  rl.on('line', (line) => {
    const result = isPalindrome(line);
    console.log(result ? "true" : "false");
    rl.close();
  });`,
        PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          filtered = [c.lower() for c in s if c.isalnum()]
          return filtered == filtered[::-1]
  
  if __name__ == "__main__":
      import sys
      s = sys.stdin.readline().strip()
      sol = Solution()
      print(str(sol.isPalindrome(s)).lower())`,
        JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}`,
        CPP: `#include <bits/stdc++.h>
using namespace std;

string preprocess(string s) {
    string res = "";
    for (char c : s) {
        if (isalnum(c)) res += tolower(c);
    }
    return res;
}

bool isPalindrome(string s) {
    s = preprocess(s);
    int l = 0, r = s.size() - 1;
    while (l < r) {
        if (s[l] != s[r]) return false;
        l++;
        r--;
    }
    return true;
}

int main() {
    string s;
    getline(cin, s);
    cout << (isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}`,
    },
};

// Reusable Collapsible Section Component
const CollapsibleSection = ({ id, title, color, children, isOpen, onToggle }) => {
  return (
    <div id={`section-${id}`} className="card bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "text-gray-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-6 pt-0">{children}</div>
      </div>
    </div>
  );
};

const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState("DP");
  const navigation = useNavigate();

  const [openSections, setOpenSections] = useState({
    basic: true,
    tags: false,
    testCases: false,
    JAVASCRIPT: false,
    PYTHON: false,
    JAVA: false,
    CPP: false,
    additional: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => {
      const newState = { ...prev, [section]: !prev[section] };
      if (!prev[section]) {
        setTimeout(() => {
          const el = document.getElementById(`section-${section}`);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
      return newState;
    });
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testCases: [{ input: "", output: "" }],
      tags: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
        CPP: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
        CPP: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    // Write your code here\n    return 0;\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
        CPP: "// Add your reference solution here",
      },
    },
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replaceTestCases,
  } = useFieldArray({
    control,
    name: "testCases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log(data);
      const res = await axiosInstance.post("/problems/create-problem", data);
      if (res.data.success) {
        toast.success(res.data.message || "Problem created successfully 🔥");
        console.log(res.data);
        navigation("/");
      }
      else {
        toast.error(res.data.error || "Error creating problem 😔");
      }
      
    } catch (err) {
      console.log("Error creating problem: ", err.message);
      toast.error("Error creating problem 😔");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;
    replaceTags(sampleData.tags.map((tag) => tag));
    replaceTestCases(sampleData.testCases.map((tc) => tc));
    reset(sampleData);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header Card */}
      <div className="card bg-black/30 shadow-xl backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="card-body p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Create Problem
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="join">
                <button
                  type="button"
                  className={`join-item btn btn-sm ${
                    sampleType === "DP" ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setSampleType("DP")}
                >
                  DP Problem
                </button>
                <button
                  type="button"
                  className={`join-item btn btn-sm ${
                    sampleType === "string" ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setSampleType("string")}
                >
                  String Problem
                </button>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm gap-2"
                onClick={loadSampleData}
              >
                <Download className="w-4 h-4" />
                Load Sample
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
        {/* Basic Info */}
        <CollapsibleSection
          id="basic"
          title="Basic Information"
          icon={FileText}
          color="text-primary"
          isOpen={openSections.basic}
          onToggle={toggleSection}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-base-100/50 border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                {...register("title")}
                placeholder="e.g. Climbing Stairs"
              />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.title.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Difficulty</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100/50 border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                {...register("difficulty")}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              {errors.difficulty && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.difficulty.message}</span>
                </label>
              )}
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered min-h-[120px] w-full bg-base-100/50 border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4"
                {...register("description")}
                placeholder="Describe the problem clearly..."
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.description.message}</span>
                </label>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Tags */}
        <CollapsibleSection
          id="tags"
          title="Tags"
          icon={BookOpen}
          color="text-secondary"
          isOpen={openSections.tags}
          onToggle={toggleSection}
        >
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-xl gap-1"
              onClick={() => appendTag("")}
            >
              <Plus className="w-4 h-4" /> Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {tagFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="input input-bordered input-sm bg-base-100/50 border-white/20 rounded-xl w-32"
                  {...register(`tags.${index}`)}
                  placeholder="Tag"
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm p-2 rounded-xl text-error hover:bg-error/10"
                  onClick={() => removeTag(index)}
                  disabled={tagFields.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {errors.tags && (
            <div className="mt-3">
              <span className="text-error text-sm">{errors.tags.message}</span>
            </div>
          )}
        </CollapsibleSection>

        {/* Test Cases */}
        <CollapsibleSection
          id="testCases"
          title="Test Cases"
          icon={CheckCircle2}
          color="text-success"
          isOpen={openSections.testCases}
          onToggle={toggleSection}
        >
          <div className="flex justify-end mb-4">
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-xl gap-1"
              onClick={() => appendTestCase({ input: "", output: "" })}
            >
              <Plus className="w-4 h-4" /> Add Test Case
            </button>
          </div>
          <div className="space-y-4">
            {testCaseFields.map((field, index) => (
              <div key={field.id} className="card bg-base-100/30 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-primary">Test Case #{index + 1}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm p-1 h-auto text-error hover:bg-error/10"
                    onClick={() => removeTestCase(index)}
                    disabled={testCaseFields.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label p-0 mb-2">
                      <span className="text-xs text-gray-400">Input</span>
                    </label>
                    <textarea
                      className="textarea textarea-sm bg-base-100/50 border-white/20 rounded-xl p-3 min-h-[80px]"
                      {...register(`testCases.${index}.input`)}
                      placeholder="Input for test"
                    />
                    {errors.testCases?.[index]?.input && (
                      <span className="text-error text-xs mt-1">{errors.testCases[index].input.message}</span>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label p-0 mb-2">
                      <span className="text-xs text-gray-400">Expected Output</span>
                    </label>
                    <textarea
                      className="textarea textarea-sm bg-base-100/50 border-white/20 rounded-xl p-3 min-h-[80px]"
                      {...register(`testCases.${index}.output`)}
                      placeholder="Expected output"
                    />
                    {errors.testCases?.[index]?.output && (
                      <span className="text-error text-xs mt-1">{errors.testCases[index].output.message}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.testCases && !Array.isArray(errors.testCases) && (
            <div className="mt-3">
              <span className="text-error text-sm">{errors.testCases.message}</span>
            </div>
          )}
        </CollapsibleSection>

        {/* Language Sections */}
        {["JAVASCRIPT", "PYTHON", "JAVA", "CPP"].map((language) => (
          <CollapsibleSection
            key={language}
            id={language}
            title={languageDisplayNames[language]}
            icon={Code2}
            color="text-secondary"
            isOpen={openSections[language]}
            onToggle={toggleSection}
          >
            <div className="space-y-6">
              {/* Starter Code */}
              <div className="card bg-base-100/30 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h4 className="font-medium text-primary flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> Starter Code Template
                  </h4>
                </div>
                <div className="p-1">
                  <Controller
                    name={`codeSnippets.${language}`}
                    control={control}
                    render={({ field }) => (
                      <Editor
                        height="280px"
                        language={language.toLowerCase()}
                        theme="vs-dark"
                        value={field.value}
                        onChange={field.onChange}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: "on",
                          roundedSelection: false,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          fontFamily: "'Fira Code', monospace",
                        }}
                      />
                    )}
                  />
                </div>
                {errors.codeSnippets?.[language] && (
                  <div className="px-4 py-2">
                    <span className="text-error text-sm">{errors.codeSnippets[language].message}</span>
                  </div>
                )}
              </div>

              {/* Reference Solution */}
              <div className="card bg-base-100/30 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h4 className="font-medium text-success flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Reference Solution
                  </h4>
                </div>
                <div className="p-1">
                  <Controller
                    name={`referenceSolutions.${language}`}
                    control={control}
                    render={({ field }) => (
                      <Editor
                        height="280px"
                        language={language.toLowerCase()}
                        theme="vs-dark"
                        value={field.value}
                        onChange={field.onChange}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: "on",
                          roundedSelection: false,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          fontFamily: "'Fira Code', monospace",
                        }}
                      />
                    )}
                  />
                </div>
                {errors.referenceSolutions?.[language] && (
                  <div className="px-4 py-2">
                    <span className="text-error text-sm">{errors.referenceSolutions[language].message}</span>
                  </div>
                )}
              </div>

              {/* Example */}
              <div className="card bg-base-100/30 border border-white/10 rounded-xl p-4">
                <h4 className="font-medium mb-4 text-secondary flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Example
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label p-0 mb-2">
                      <span className="text-xs text-gray-400">Input</span>
                    </label>
                    <textarea
                      className="textarea textarea-sm bg-base-100/50 border-white/20 rounded-xl p-3 min-h-[70px]"
                      {...register(`examples.${language}.input`)}
                      placeholder="Input"
                    />
                    {errors.examples?.[language]?.input && (
                      <span className="text-error text-xs mt-1">{errors.examples[language].input.message}</span>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label p-0 mb-2">
                      <span className="text-xs text-gray-400">Output</span>
                    </label>
                    <textarea
                      className="textarea textarea-sm bg-base-100/50 border-white/20 rounded-xl p-3 min-h-[70px]"
                      {...register(`examples.${language}.output`)}
                      placeholder="Output"
                    />
                    {errors.examples?.[language]?.output && (
                      <span className="text-error text-xs mt-1">{errors.examples[language].output.message}</span>
                    )}
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label p-0 mb-2">
                      <span className="text-xs text-gray-400">Explanation (Optional)</span>
                    </label>
                    <textarea
                      className="textarea textarea-sm bg-base-100/50 border-white/20 rounded-xl p-3 min-h-[80px]"
                      {...register(`examples.${language}.explanation`)}
                      placeholder="Explain this example..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        ))}

        {/* Additional Info */}
        <CollapsibleSection
          id="additional"
          title="Additional Information"
          icon={Lightbulb}
          color="text-warning"
          isOpen={openSections.additional}
          onToggle={toggleSection}
        >
          <div className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Constraints</span>
              </label>
              <textarea
                className="textarea textarea-bordered min-h-[100px] w-full bg-base-100/50 border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4"
                {...register("constraints")}
                placeholder="e.g. 1 <= n <= 10^5"
              />
              {errors.constraints && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.constraints.message}</span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Hints (Optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered min-h-[100px] w-full bg-base-100/50 border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4"
                {...register("hints")}
                placeholder="Helpful hints for solvers..."
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Editorial (Optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered min-h-[120px] w-full bg-base-100/50 border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4"
                {...register("editorial")}
                placeholder="Explain the optimal approach..."
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg rounded-xl gap-2 px-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Create Problem
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblemForm;
