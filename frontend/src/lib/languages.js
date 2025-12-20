export const languageDisplayNames = {
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  JAVA: "Java",
  CPP: "C++",
  C: "C",
};
export const getJudge0LanguageId = (language) => {
  const langMap = {
    PYTHON: 71,
    JAVA: 62,
    CPP: 54,
    JAVASCRIPT: 63,
    C: 50,
  };
  return langMap[language.toUpperCase()] || null;
};

export const submissionCardLang = (language) => {
  const langMap = {
    PYTHON: "py",
    JAVA: "java",
    CPP: "cpp",
    JAVASCRIPT: "js",
    C: "c",
  };
  return langMap[language.toUpperCase()] || null;
};
