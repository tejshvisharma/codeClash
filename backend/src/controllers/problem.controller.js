import { db } from "../libs/db.js";
import { getJudge0LanguageId, submitBatch, pollBatchResult } from "../libs/judge0.lib.js";
export const createProblem = async (req, res) => {
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = req.body;

    const  userId  = req.user?.id;

    if (req.user?.role !== "ADMIN") {
      return res
        .status(403)
        .json({
          success: false,
          error: "Unauthorized - Admin access required",
        });
    }
    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            
            const languageId = getJudge0LanguageId(language);
            if(!languageId) {
                return res
                  .status(400)
                  .json({
                    success: false,
                    error: `language ${language} is not supported`,
                  });
            }

            const submissions = testCases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));

            const submissionResult = await submitBatch(submissions);

            const tokens = submissionResult.map((res)=> res.token);

            const results = await pollBatchResult(tokens);

            for(let i = 0; i < results.length; i++){
                const result = results[i];
                if(result.status.id !== 3){
                    return res
                            .status(400)
                            .json({
                                success: false,
                                error:`Testcase ${i+1} failed for language ${language}`,
                            });
                }
            }

        }

            const newProblem = await db.problem.create({
                data: {
                    title,
                    description,
                    difficulty,
                    tags,
                    examples,
                    constraints,
                    hints,
                    editorial,
                    testCases,
                    codeSnippets,
                    referenceSolutions,
                    userId: userId,
                },
            });

          return res
                    .status(201)
                    .json({ 
                        success: true, 
                        message: "Problem created successfully", 
                        problem: newProblem 
                    });
        
    } 
    catch (err) {
        if(process.env.NODE_ENV === "development") console.log("Error creating problem: ", err);
        res.status(500).json({ success: false, message: "Error creating problem", err: err.message });
    }
};

export const getAllProblems = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const updateProblemById = async (req, res) => {};

export const deleteProblemById = async (req, res) => {};

export const getProblemsByUserId = async (req, res) => {};

export const getProblemsSolvedByUser = async (req, res) => {};

