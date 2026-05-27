import Activity from '../models/Activity.js'

const activities = [
  // gym
  { name: 'Weight training',       category: 'gym',    MET: 6.0 },
  { name: 'HIIT',                  category: 'gym',    MET: 10.0 },
  { name: 'Cardio (treadmill)',    category: 'gym',    MET: 8.0 },
  { name: 'Cycling (stationary)', category: 'gym',    MET: 7.0 },
  { name: 'Pull-ups / push-ups',  category: 'gym',    MET: 5.0 },
  { name: 'Stretching / yoga',    category: 'gym',    MET: 2.5 },

  // cardio
  { name: 'Running (6 min/km)',   category: 'cardio', MET: 10.0 },
  { name: 'Running (8 min/km)',   category: 'cardio', MET: 8.0 },
  { name: 'Jump rope',            category: 'cardio', MET: 11.0 },
  { name: 'Swimming',             category: 'cardio', MET: 7.0 },
  { name: 'Cycling (outdoor)',    category: 'cardio', MET: 8.0 },
  { name: 'Stair climbing',       category: 'cardio', MET: 9.0 },

  // daily life
  { name: 'Walking',              category: 'daily',  MET: 3.5 },
  { name: 'Commute (standing)',   category: 'daily',  MET: 2.5 },
  { name: 'Cooking',              category: 'daily',  MET: 2.0 },
  { name: 'Desk work / sitting',  category: 'daily',  MET: 1.5 },
  { name: 'Sleeping',             category: 'daily',  MET: 0.9 },
  { name: 'Household chores',     category: 'daily',  MET: 3.0 },

  // sports
  { name: 'Cricket',              category: 'sports', MET: 5.0 },
  { name: 'Football',             category: 'sports', MET: 7.0 },
  { name: 'Badminton',            category: 'sports', MET: 5.5 },
  { name: 'Basketball',           category: 'sports', MET: 6.5 },
]

export const seedActivities = async () => {
  try {
    const existing = await Activity.countDocuments({ isCustom: false })
    if (existing > 0) {
      console.log(`Activities already seeded (${existing} found), skipping`)
      return
    }

    const seeded = activities.map(a => ({ ...a, isCustom: false }))
    await Activity.insertMany(seeded)
    console.log(`${seeded.length} activities seeded successfully`)
  } catch (err) {
    console.error('Activity seed failed:', err.message)
  }
}