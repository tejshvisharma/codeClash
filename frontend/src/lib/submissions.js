export function calculateSuccessRate(submissions = []) {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return {
      successRate: 0,
      total: 0,
      accepted: 0,
    };
  }

  const total = submissions.length;

  const accepted = submissions.filter(
    (sub) => String(sub?.status).toUpperCase() === "ACCEPTED"
  ).length;

  const successRate = (accepted / total) * 100;
  const successRateReturn = Number(successRate.toFixed(2));
  return {
     successRateReturn
  };
}
