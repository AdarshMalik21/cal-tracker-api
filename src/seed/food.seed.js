import Food from '../models/Food.js'

const foods = [
  // --- PROTEIN ---
  { name: 'Boiled egg', unit: 'egg', kcal: 70, protein: 6, carbs: 1, fat: 5, tag: 'protein', aliases: ['anda', 'egg'] },
  { name: 'Chicken breast', unit: '100g', kcal: 165, protein: 31, carbs: 0, fat: 4, tag: 'protein', aliases: ['chicken', 'murga'] },
  { name: 'Paneer', unit: '100g', kcal: 265, protein: 18, carbs: 3, fat: 20, tag: 'protein', aliases: ['cottage cheese', 'paneer'] },
  { name: 'Paneer bhurji', unit: '100g', kcal: 220, protein: 18, carbs: 6, fat: 14, tag: 'protein', aliases: ['bhurji'] },
  { name: 'Dal tadka', unit: 'bowl', kcal: 220, protein: 12, carbs: 30, fat: 6, tag: 'protein', aliases: ['dal', 'daal', 'lentil'] },
  { name: 'Moong dal', unit: 'bowl', kcal: 180, protein: 12, carbs: 28, fat: 2, tag: 'protein', aliases: ['moong', 'green lentil'] },
  { name: 'Rajma', unit: 'bowl', kcal: 210, protein: 13, carbs: 35, fat: 2, tag: 'protein', aliases: ['kidney beans', 'rajma'] },
  { name: 'Chana dal', unit: 'bowl', kcal: 190, protein: 11, carbs: 30, fat: 3, tag: 'protein', aliases: ['chana', 'chickpea'] },
  { name: 'Sambar', unit: 'bowl', kcal: 150, protein: 8, carbs: 22, fat: 3, tag: 'protein', aliases: ['sambar'] },
  { name: 'Besan chilla', unit: 'piece', kcal: 120, protein: 7, carbs: 14, fat: 4, tag: 'protein', aliases: ['chilla', 'besan', 'gram flour pancake'] },
  { name: 'Whey protein shake', unit: 'scoop', kcal: 130, protein: 25, carbs: 5, fat: 2, tag: 'supplements', aliases: ['whey', 'protein shake', 'shake'] },
  { name: 'Palak paneer', unit: 'bowl', kcal: 240, protein: 14, carbs: 10, fat: 16, tag: 'protein', aliases: ['palak', 'spinach paneer'] },
  { name: 'Egg omelette', unit: 'piece', kcal: 100, protein: 7, carbs: 1, fat: 8, tag: 'protein', aliases: ['omelette', 'anda'] },
  { name: 'Peanut butter', unit: 'tbsp', kcal: 95, protein: 4, carbs: 3, fat: 8, tag: 'fats', aliases: ['pb', 'peanut butter', 'mungfali'] },
  { name: 'Almonds', unit: '20g', kcal: 120, protein: 4, carbs: 4, fat: 12, tag: 'fats', aliases: ['badam', 'almonds'] },

  // --- CARBS ---
  { name: 'Chapati', unit: 'piece', kcal: 90, protein: 3, carbs: 18, fat: 1, tag: 'carbs', aliases: ['roti', 'chapati', 'phulka'] },
  { name: 'White rice', unit: 'bowl', kcal: 200, protein: 4, carbs: 45, fat: 0, tag: 'carbs', aliases: ['rice', 'chawal', 'white rice'] },
  { name: 'Brown rice', unit: 'bowl', kcal: 185, protein: 5, carbs: 40, fat: 1, tag: 'carbs', aliases: ['brown rice'] },
  { name: 'Oats', unit: '50g', kcal: 190, protein: 7, carbs: 33, fat: 4, tag: 'carbs', aliases: ['oats', 'oatmeal', 'daliya'] },
  { name: 'Sweet potato', unit: '150g', kcal: 120, protein: 3, carbs: 28, fat: 0, tag: 'carbs', aliases: ['shakarkandi', 'sweet potato'] },
  { name: 'Banana', unit: 'piece', kcal: 90, protein: 1, carbs: 27, fat: 0, tag: 'fruits', aliases: ['kela', 'banana'] },
  { name: 'Brown bread', unit: '2 slices', kcal: 140, protein: 6, carbs: 24, fat: 2, tag: 'carbs', aliases: ['bread', 'brown bread'] },
  { name: 'Idli', unit: '2 pieces', kcal: 140, protein: 4, carbs: 28, fat: 1, tag: 'carbs', aliases: ['idli'] },
  { name: 'Dosa', unit: 'piece', kcal: 170, protein: 4, carbs: 30, fat: 5, tag: 'carbs', aliases: ['dosa'] },
  { name: 'Poha', unit: 'bowl', kcal: 200, protein: 4, carbs: 38, fat: 5, tag: 'carbs', aliases: ['poha', 'flattened rice'] },
  { name: 'Aloo sabzi', unit: 'bowl', kcal: 180, protein: 3, carbs: 30, fat: 7, tag: 'carbs', aliases: ['aloo', 'potato curry'] },
  { name: 'Puri', unit: '2 pieces', kcal: 200, protein: 4, carbs: 28, fat: 9, tag: 'carbs', aliases: ['puri', 'poori'] },
  { name: 'Paratha', unit: 'piece', kcal: 200, protein: 4, carbs: 28, fat: 8, tag: 'carbs', aliases: ['paratha', 'parantha'] },

  // --- DAIRY ---
  { name: 'Whole milk', unit: '250ml', kcal: 160, protein: 8, carbs: 12, fat: 9, tag: 'dairy', aliases: ['milk', 'doodh'] },
  { name: 'Curd', unit: 'bowl', kcal: 90, protein: 6, carbs: 8, fat: 4, tag: 'dairy', aliases: ['dahi', 'curd', 'yogurt'] },
  { name: 'Buttermilk', unit: '250ml', kcal: 50, protein: 3, carbs: 5, fat: 2, tag: 'dairy', aliases: ['chaas', 'lassi', 'buttermilk'] },
  { name: 'Ghee', unit: 'tsp', kcal: 45, protein: 0, carbs: 0, fat: 5, tag: 'fats', aliases: ['ghee', 'clarified butter'] },

  // --- FRUITS & VEG ---
  { name: 'Apple', unit: 'piece', kcal: 80, protein: 0, carbs: 21, fat: 0, tag: 'fruits', aliases: ['apple', 'seb'] },
  { name: 'Mango', unit: '100g', kcal: 60, protein: 1, carbs: 15, fat: 0, tag: 'fruits', aliases: ['aam', 'mango'] },
  { name: 'Spinach', unit: '100g', kcal: 23, protein: 3, carbs: 4, fat: 0, tag: 'vegetables', aliases: ['palak', 'spinach'] },
  { name: 'Broccoli', unit: '100g', kcal: 34, protein: 3, carbs: 7, fat: 0, tag: 'vegetables', aliases: ['broccoli'] },
]

export const seedFoods = async () => {
  try {
    const existing = await Food.countDocuments({ isCustom: false })
    if (existing > 0) {
      console.log(`Foods already seeded (${existing} found), skipping`)
      return
    }

    const seeded = foods.map(f => ({ ...f, isCustom: false, category: 'indian' }))
    await Food.insertMany(seeded)
    console.log(`${seeded.length} foods seeded successfully`)
  } catch (err) {
    console.error('Food seed failed:', err.message)
  }
}