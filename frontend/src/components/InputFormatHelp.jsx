import React from "react";
import { X, BookOpen, AlertTriangle, CheckCircle, Info } from "lucide-react";

const InputFormatHelp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            How to Provide Input
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Rule 1: Remove Interactive Prompts */}
          <section className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Rule #1: Remove Interactive Prompts
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Online compilers work in <strong>batch mode</strong>, not
              interactive mode. All input must be provided upfront!
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 p-4 rounded border-l-4 border-red-500">
                <div className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-1">
                  ❌ Don't Do This:
                </div>
                <pre className="text-xs bg-red-50 dark:bg-red-950/30 p-3 rounded overflow-x-auto">
                  {`cout << "Enter n: ";
cin >> n;
cout << "Enter elements: ";
for(int i = 0; i < n; i++) {
    cin >> arr[i];
}`}
                </pre>
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  ⚠️ Prompts like "Enter n:" are useless in online compilers
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-4 rounded border-l-4 border-green-500">
                <div className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-1">
                  ✅ Do This Instead:
                </div>
                <pre className="text-xs bg-green-50 dark:bg-green-950/30 p-3 rounded overflow-x-auto">
                  {`cin >> n;  // Just read directly
for(int i = 0; i < n; i++) {
    cin >> arr[i];
}
// No prompts needed!`}
                </pre>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  ✅ Clean and works perfectly in online compilers
                </p>
              </div>
            </div>
          </section>

          {/* Rule 2: Provide All Input Upfront */}
          <section className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Rule #2: Provide All Input Upfront
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Enter all inputs in the <strong>"Custom Input"</strong> box before
              running. Each value on a new line or space-separated.
            </p>

            <div className="bg-white dark:bg-gray-900 p-4 rounded">
              <div className="text-sm font-semibold mb-3">
                Example: Array Input
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">
                    Code:
                  </div>
                  <pre className="text-xs bg-gray-50 dark:bg-gray-950 p-3 rounded overflow-x-auto border border-gray-200 dark:border-gray-700">
                    {`int n;
cin >> n;
int arr[n];
for(int i=0; i<n; i++) {
    cin >> arr[i];
}`}
                  </pre>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">
                    Input (in Custom Input box):
                  </div>
                  <pre className="text-xs bg-blue-50 dark:bg-blue-950/30 p-3 rounded overflow-x-auto border border-blue-300 dark:border-blue-700">
                    {`5
10 20 30 40 50`}
                  </pre>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                    <div>📌 Line 1: n = 5</div>
                    <div>📌 Line 2: array elements</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Common Input Patterns */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Common Input Patterns
            </h3>

            <div className="space-y-3">
              {/* Pattern 1 */}
              <details className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <summary className="cursor-pointer font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400">
                  📊 Single Integer
                </summary>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="text-xs">
                    <span className="font-semibold">Input:</span>{" "}
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      42
                    </code>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Code:</span>{" "}
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      cin &gt;&gt; n;
                    </code>
                  </div>
                </div>
              </details>

              {/* Pattern 2 */}
              <details className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <summary className="cursor-pointer font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400">
                  📊 Multiple Values on One Line
                </summary>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="text-xs">
                    <span className="font-semibold">Input:</span>{" "}
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      10 20 30
                    </code>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Code:</span>{" "}
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      cin &gt;&gt; a &gt;&gt; b &gt;&gt; c;
                    </code>
                  </div>
                </div>
              </details>

              {/* Pattern 3 */}
              <details className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <summary className="cursor-pointer font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400">
                  📊 Array (Size + Elements)
                </summary>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-semibold mb-1">Input:</div>
                      <pre className="text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded">
                        {`3
10 20 30`}
                      </pre>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-1">Code:</div>
                      <pre className="text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded">
                        {`int n;
cin >> n;
for(int i=0; i<n; i++) {
    cin >> arr[i];
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </details>

              {/* Pattern 4 */}
              <details className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <summary className="cursor-pointer font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400">
                  📊 Matrix (2D Array)
                </summary>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-semibold mb-1">Input:</div>
                      <pre className="text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded">
                        {`2 3
1 2 3
4 5 6`}
                      </pre>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-1">Code:</div>
                      <pre className="text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded">
                        {`int r, c;
cin >> r >> c;
for(int i=0; i<r; i++) {
    for(int j=0; j<c; j++) {
        cin >> mat[i][j];
    }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </details>

              {/* Pattern 5 */}
              <details className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <summary className="cursor-pointer font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400">
                  📊 String Input
                </summary>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-semibold mb-1">Input:</div>
                      <pre className="text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded">
                        {`Hello
World`}
                      </pre>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-1">
                        Code (C++):
                      </div>
                      <pre className="text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded">
                        {`string s1, s2;
cin >> s1 >> s2;
// or
getline(cin, line);`}
                      </pre>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </section>

          {/* Quick Tips */}
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold mb-3">💡 Quick Tips</h3>
            <ul className="text-sm space-y-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">
                  ✓
                </span>
                <span>
                  Use the <strong>"Load Sample"</strong> button to see working
                  examples
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">
                  ✓
                </span>
                <span>Test with simple inputs first before complex ones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">
                  ✓
                </span>
                <span>
                  Check the <strong>"Errors"</strong> tab if something goes
                  wrong
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">
                  ✓
                </span>
                <span>
                  Each language reads input slightly differently (Python uses{" "}
                  <code className="text-xs bg-white dark:bg-gray-900 px-1 rounded">
                    input()
                  </code>
                  , Java uses{" "}
                  <code className="text-xs bg-white dark:bg-gray-900 px-1 rounded">
                    Scanner
                  </code>
                  )
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">
                  ✓
                </span>
                <span>
                  Space-separated values can be read in one line:{" "}
                  <code className="text-xs bg-white dark:bg-gray-900 px-1 rounded">
                    10 20 30
                  </code>
                </span>
              </li>
            </ul>
          </section>

          {/* Language-Specific Notes */}
          <section>
            <h3 className="text-lg font-semibold mb-3">
              🌐 Language-Specific Input
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-sm mb-2">Python</div>
                <pre className="text-xs bg-white dark:bg-gray-950 p-2 rounded">
                  {`n = int(input())
arr = list(map(int, input().split()))`}
                </pre>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-sm mb-2">Java</div>
                <pre className="text-xs bg-white dark:bg-gray-950 p-2 rounded">
                  {`Scanner sc = new Scanner(System.in);
int n = sc.nextInt();`}
                </pre>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-sm mb-2">
                  JavaScript (Node.js)
                </div>
                <pre className="text-xs bg-white dark:bg-gray-950 p-2 rounded">
                  {`const input = require('fs')
  .readFileSync(0, 'utf8')
  .trim().split('\\n');`}
                </pre>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-sm mb-2">C</div>
                <pre className="text-xs bg-white dark:bg-gray-950 p-2 rounded">
                  {`int n;
scanf("%d", &n);`}
                </pre>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 text-center">
          <button onClick={onClose} className="btn btn-primary px-6">
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputFormatHelp;
