export function generateCoachFeedback({ avgNetKcal, calorieGoal, avgProtein, proteinGoal, gymSessions, targetSessions, energyLevel }) {
  const feedback = []

  // calorie feedback
  const calDiff = avgNetKcal - calorieGoal
  if (calDiff < -300) {
    feedback.push(`You averaged ${Math.abs(Math.round(calDiff))} kcal below your goal. Add a high-calorie meal on rest days — peanut butter + milk + banana is an easy 500 kcal.`)
  } else if (calDiff > 600) {
    feedback.push(`You averaged ${Math.round(calDiff)} kcal above your goal. Slightly over is fine but watch it — excess will add fat, not muscle.`)
  } else {
    feedback.push(`Calories on point this week. Net average ${Math.round(avgNetKcal)} kcal vs ${calorieGoal} goal. Keep this up.`)
  }

  // protein feedback
  const protDiff = avgProtein - proteinGoal
  if (protDiff < -20) {
    feedback.push(`Protein was low — ${Math.round(avgProtein)}g average vs ${proteinGoal}g target. Add a curd + peanut butter snack on rest days to close the gap.`)
  } else if (protDiff >= -20) {
    feedback.push(`Protein solid at ${Math.round(avgProtein)}g average. Muscle repair is well fuelled.`)
  }

  // gym sessions feedback
  if (gymSessions >= targetSessions) {
    feedback.push(`${gymSessions}/${targetSessions} gym sessions completed. Consistency is everything — great week.`)
  } else if (gymSessions >= targetSessions - 1) {
    feedback.push(`${gymSessions}/${targetSessions} sessions — one short. Life happens, just don't let it become a habit.`)
  } else {
    feedback.push(`Only ${gymSessions}/${targetSessions} gym sessions this week. Training stimulus is the whole point — prioritise showing up next week.`)
  }

  // energy feedback
  if (energyLevel === 'low') {
    feedback.push(`Low energy reported. Check sleep hours and make sure you are eating enough carbs pre-workout. Could also be a sign of under-eating.`)
  } else if (energyLevel === 'high') {
    feedback.push(`High energy — your body is responding well. Good sign that recovery and nutrition are dialled in.`)
  }

  return feedback
}