import Supplement from '../models/Supplement.js'

const supplements = [
  { name: 'Whey protein',  dose: '1 scoop (30g)', timing: 'post-workout'    },
  { name: 'Creatine',      dose: '5g',            timing: 'any time daily'  },
  { name: 'Multivitamin',  dose: '1 tablet',      timing: 'with breakfast'  },
  { name: 'Fish oil',      dose: '1 capsule',     timing: 'with meal'       },
]

export const seedSupplements = async () => {
  try {
    const existing = await Supplement.countDocuments({ isCustom: false })
    if (existing > 0) {
      console.log(`Supplements already seeded (${existing} found), skipping`)
      return
    }

    await Supplement.insertMany(supplements.map(s => ({ ...s, isCustom: false })))
    console.log(`${supplements.length} supplements seeded successfully`)
  } catch (err) {
    console.error('Supplement seed failed:', err.message)
  }
}