// Minimal starter code templates for each supported language
export const starterCodeTemplates = {
  javascript: `console.log("Hello, World!");`,

  python: `print("Hello, World!")`,

  java: `class Main { public static void main(String[] args) { System.out.println("Hello, World!"); } }`,

  cpp: `#include <iostream>
int main() { std::cout << "Hello, World!"; }`,

  c: `#include <stdio.h>
int main() { printf("Hello, World!"); }`,
};

// Get starter code for a specific language
export const getStarterCode = (language) => {
  return (
    starterCodeTemplates[language.toLowerCase()] ||
    starterCodeTemplates.javascript
  );
};
