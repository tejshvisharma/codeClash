// Input validation utility for online code runner
export const validateInput = (language, code, input) => {
  const warnings = [];

  // Check for interactive prompts that won't work in online compilers
  const interactivePatterns = {
    cpp: /cout\s*<<\s*["'].*[Ee]nter.*["']/gi,
    c: /printf\s*\(\s*["'].*[Ee]nter.*["']/gi,
    java: /System\.out\.print.*[Ee]nter/gi,
    python: /print\s*\(.*["'].*[Ee]nter.*["']\)/gi,
    javascript: /console\.log\s*\(.*["'].*[Ee]nter.*["']\)/gi,
  };

  const pattern = interactivePatterns[language.toLowerCase()];
  if (pattern && pattern.test(code)) {
    warnings.push({
      type: "interactive_prompt",
      message:
        '⚠️ Your code contains interactive prompts (like "Enter value"). These won\'t work in online compilers. Remove them and provide all input in the input box instead.',
      severity: "warning",
    });
  }

  // Check if input is needed but empty
  const inputPatterns = {
    cpp: /cin\s*>>/g,
    c: /scanf\s*\(/g,
    java: /(Scanner|BufferedReader)/g,
    python: /input\s*\(/g,
    javascript: /readFileSync.*stdin|readFileSync\(0/g,
  };

  const needsInput = inputPatterns[language.toLowerCase()]?.test(code);
  if (needsInput && !input.trim()) {
    warnings.push({
      type: "missing_input",
      message:
        '💡 Your code reads input but no input is provided. Add input in the "Custom Input" box below.',
      severity: "info",
    });
  }

  // Check for common mistakes

  // 1. Using getline/gets without proper input
  if (
    (language === "cpp" || language === "c") &&
    /getline|gets\s*\(/gi.test(code) &&
    !input.trim()
  ) {
    warnings.push({
      type: "string_input_needed",
      message:
        "💡 Your code uses string input functions. Make sure to provide text in the input box.",
      severity: "info",
    });
  }

  // 2. Check for multiple cin/scanf without enough input lines
  if (language === "cpp" || language === "c") {
    const inputPattern = language === "cpp" ? /cin\s*>>/g : /scanf\s*\(/g;
    const inputCount = (code.match(inputPattern) || []).length;
    const providedLines = input.trim() ? input.trim().split("\n").length : 0;

    if (inputCount > 1 && providedLines === 0) {
      warnings.push({
        type: "insufficient_input",
        message: `💡 Your code reads input ${inputCount} times. Make sure to provide enough lines/values in the input box.`,
        severity: "info",
      });
    }
  }

  return warnings;
};

// Helper to check if code has input statements
export const hasInputStatements = (language, code) => {
  const inputPatterns = {
    cpp: /cin\s*>>/g,
    c: /scanf\s*\(/g,
    java: /(Scanner|BufferedReader)/g,
    python: /input\s*\(/g,
    javascript: /readFileSync.*stdin|readFileSync\(0/g,
  };

  const pattern = inputPatterns[language.toLowerCase()];
  return pattern ? pattern.test(code) : false;
};
