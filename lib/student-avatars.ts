/**
 * Curated student display pictures and deterministic avatar resolver.
 * Provides authentic, high-quality display pictures for student leads and enquiries in Celoris Teach.
 */

// Curated authentic student portraits mapped directly to student names
const KNOWN_STUDENT_AVATARS: Record<string, string> = {
  // 1. Harshit Kumar - Spoken English
  'harshit kumar': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80',
  'harshit': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80',

  // 2. Tanu chaudhary - Fashion Illustrations
  'tanu chaudhary': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
  'tanu': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',

  // 3. Ranjan Verma - Adobe Premier
  'ranjan verma': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
  'ranjan': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',

  // 4. Jahnvi Arora - Microsoft Excel
  'jahnvi arora': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80',
  'jahnvi': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80',

  // 5. Samriddhi Mehta - Digital Marketing
  'samriddhi mehta': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80',
  'samriddhi': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80',

  // 6. Pallavi Joshi - Microsoft Excel
  'pallavi joshi': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&h=160&q=80',
  'pallavi': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&h=160&q=80',

  // 7. Priyanka Sood - Adobe Premier
  'priyanka sood': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80',
  'priyanka': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80',

  // 8. Aditi Sharma - Video Editing
  'aditi sharma': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=160&h=160&q=80',
  'aditi': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=160&h=160&q=80',

  // 9. Kanika Jain - Shopify Website Development
  'kanika jain': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&h=160&q=80',
  'kanika': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&h=160&q=80',

  // 10. Jitesh Kumar - Microsoft Excel
  'jitesh kumar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80',
  'jitesh': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80',

  // 11. Mehanaz Iqbal - Graphic Design
  'mehanaz iqbal': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80',
  'mehanaz': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80',

  // 12. Kashish Anand - Digital Marketing
  'kashish anand': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=160&h=160&q=80',
  'kashish': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=160&h=160&q=80',

  // 13. Zeeshan Shaquib - Video Editing
  'zeeshan shaquib': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80',
  'zeeshan': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80',

  // 14. Himansu Kumar - Digital Marketing
  'himansu kumar': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80',
  'himansu': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80',

  // 15. Bipin Kumar Paswan - Digital Marketing Training
  'bipin kumar paswan': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80',
  'bipin': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80',

  // 16. Deeva Gulia
  'deeva gulia': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80',
  'deeva': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80',
}

// Fallback pool of high quality female student portraits
const FEMALE_STUDENT_POOL = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=160&h=160&q=80',
]

// Fallback pool of high quality male student portraits
const MALE_STUDENT_POOL = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80',
]

const FEMALE_NAME_HINTS = [
  'tanu', 'jahnvi', 'samriddhi', 'pallavi', 'priyanka', 'aditi', 'kanika', 'mehanaz',
  'kashish', 'pooja', 'riya', 'ananya', 'sneha', 'neha', 'priya', 'simran', 'shreya',
  'aarti', 'divya', 'deeva', 'mansi', 'muskan', 'swati', 'sakshi', 'ishita', 'anushka',
  'komal', 'radha', 'shital', 'shivani', 'deepika', 'nikita', 'kavita', 'nisha'
]

function getSimpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Returns a photorealistic, high quality student display picture URL.
 */
export function getStudentDisplayPicture(student?: {
  name?: string | null
  email?: string | null
  avatar_url?: string | null
} | null): string {
  if (!student) {
    return MALE_STUDENT_POOL[0]
  }

  // 1. If student already has an explicit avatar URL
  if (student.avatar_url && typeof student.avatar_url === 'string' && student.avatar_url.trim().length > 5) {
    return student.avatar_url
  }

  const rawName = (student.name || '').trim().toLowerCase()
  const firstName = rawName.split(' ')[0] || ''

  // 2. Check direct known mappings
  if (KNOWN_STUDENT_AVATARS[rawName]) {
    return KNOWN_STUDENT_AVATARS[rawName]
  }
  if (KNOWN_STUDENT_AVATARS[firstName]) {
    return KNOWN_STUDENT_AVATARS[firstName]
  }

  // 3. Deterministic pool based on name/email hash
  const seedString = (student.email || student.name || 'student').trim().toLowerCase()
  const hash = getSimpleHash(seedString)

  const isLikelyFemale = FEMALE_NAME_HINTS.some(h => firstName.includes(h) || rawName.includes(h))
  if (isLikelyFemale) {
    return FEMALE_STUDENT_POOL[hash % FEMALE_STUDENT_POOL.length]
  }

  return MALE_STUDENT_POOL[hash % MALE_STUDENT_POOL.length]
}
