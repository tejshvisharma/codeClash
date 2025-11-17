export const languageDisplayNames = {
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  JAVA: "Java",
  CPP: "C++",
};
export const getJudge0LanguageId = (language) => {
  const langMap = {
    PYTHON: 71,
    JAVA: 62,
    CPP: 54,
    JAVASCRIPT: 63,
  };
  return langMap[language.toUpperCase()] || null;
};