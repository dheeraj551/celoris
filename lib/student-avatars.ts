/**
 * Original student display pictures and avatar resolver for Celoris Teach.
 * Resolves original uploaded profile pictures directly from Celoris Supabase Storage (public.users).
 */

// Original uploaded user profile pictures directly from Celoris Supabase Storage
const ORIGINAL_USER_AVATARS: Record<string, string> = {
  // 1. Harshit Kumar (username: fairjade52733a3b)
  'harshit kumar': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/9004d5d8-fe4f-404f-a2e1-fc17bf31f4a3/profile-photo.jpg?t=1791467438646',
  'harshit': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/9004d5d8-fe4f-404f-a2e1-fc17bf31f4a3/profile-photo.jpg?t=1791467438646',
  'fairjade52733a3b': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/9004d5d8-fe4f-404f-a2e1-fc17bf31f4a3/profile-photo.jpg?t=1791467438646',

  // 2. Tanu chaudhary / Tanu Chaudhary (username: Tanu)
  'tanu chaudhary': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/9c3aac60-d696-41b7-a71f-a908df1000fe/profile-photo.jpg?t=1791459751998',
  'tanu': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/9c3aac60-d696-41b7-a71f-a908df1000fe/profile-photo.jpg?t=1791459751998',

  // 3. Ranjan Verma (username: mildrock29739578)
  'ranjan verma': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/c1553dea-c2e9-4f62-b3e1-f03eb6f0e6a7/profile-photo.jpg?t=1791459246233',
  'ranjan': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/c1553dea-c2e9-4f62-b3e1-f03eb6f0e6a7/profile-photo.jpg?t=1791459246233',
  'mildrock29739578': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/c1553dea-c2e9-4f62-b3e1-f03eb6f0e6a7/profile-photo.jpg?t=1791459246233',

  // 4. Jahnvi Arora / Janhvi Arora (username: Jarora)
  'jahnvi arora': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/02f6d976-8a3f-4ed8-a92c-d0887b399525/profile-photo.jpg?t=1791458723614',
  'janhvi arora': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/02f6d976-8a3f-4ed8-a92c-d0887b399525/profile-photo.jpg?t=1791458723614',
  'jahnvi': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/02f6d976-8a3f-4ed8-a92c-d0887b399525/profile-photo.jpg?t=1791458723614',
  'janhvi': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/02f6d976-8a3f-4ed8-a92c-d0887b399525/profile-photo.jpg?t=1791458723614',
  'jarora': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/02f6d976-8a3f-4ed8-a92c-d0887b399525/profile-photo.jpg?t=1791458723614',

  // 5. Samriddhi Mehta (username: gladstar3973e09c)
  'samriddhi mehta': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/dee97775-3a5f-4ab1-8b9d-a8c1040c7949/profile-photo.jpg?t=1791227502172',
  'samriddhi': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/dee97775-3a5f-4ab1-8b9d-a8c1040c7949/profile-photo.jpg?t=1791227502172',
  'gladstar3973e09c': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/dee97775-3a5f-4ab1-8b9d-a8c1040c7949/profile-photo.jpg?t=1791227502172',

  // 6. Pallavi Joshi (username: truewave6441aa48)
  'pallavi joshi': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/c851ca47-46e0-43c7-9017-a29186417a93/profile-photo.jpg?t=1791227242407',
  'pallavi': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/c851ca47-46e0-43c7-9017-a29186417a93/profile-photo.jpg?t=1791227242407',
  'truewave6441aa48': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/c851ca47-46e0-43c7-9017-a29186417a93/profile-photo.jpg?t=1791227242407',

  // 7. Priyanka Sood / Priyanka (username: priyanka)
  'priyanka sood': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/d48ebcde-3706-4e02-b98a-eb3f1c0a7987/profile-photo.jpg?t=1791226783003',
  'priyanka': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/d48ebcde-3706-4e02-b98a-eb3f1c0a7987/profile-photo.jpg?t=1791226783003',

  // 8. Aditi Sharma (username: aditi)
  'aditi sharma': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/649ca675-59a4-407c-b6eb-6ad0ca590a13/profile-photo.jpg?t=1791225768375',
  'aditi': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/649ca675-59a4-407c-b6eb-6ad0ca590a13/profile-photo.jpg?t=1791225768375',

  // 9. Kanika Jain (username: Kanika)
  'kanika jain': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/e4d39054-1643-42fa-a3d6-e9cf1c82de28/profile-photo.jpg?t=1791224904399',
  'kanika': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/e4d39054-1643-42fa-a3d6-e9cf1c82de28/profile-photo.jpg?t=1791224904399',

  // 10. Jitesh Kumar / Jitesh kumar (username: jitesh)
  'jitesh kumar': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/be377b3e-0aad-4fba-9559-2dc435669c2d/profile-photo.jpg?t=1791224299972',
  'jitesh': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/be377b3e-0aad-4fba-9559-2dc435669c2d/profile-photo.jpg?t=1791224299972',

  // 11. Mehanaz Iqbal (username: Mehanaz)
  'mehanaz iqbal': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/9e62d01c-3b67-4ddf-9bc0-d586492de1e2/profile-photo.jpg?t=1791223025964',
  'mehanaz': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/9e62d01c-3b67-4ddf-9bc0-d586492de1e2/profile-photo.jpg?t=1791223025964',

  // 12. Madhurima Boral (username: Madhurima)
  'madhurima boral': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/36f987be-210d-4c24-8dd5-4428106750b5/profile-photo.jpg?t=1791199512491',
  'madhurima': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/36f987be-210d-4c24-8dd5-4428106750b5/profile-photo.jpg?t=1791199512491',

  // 13. Kashish Anand (username: Kashish)
  'kashish anand': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/80b368d5-5428-450b-80cf-a0421aff1ea0/profile-photo.jpg?t=1791196025798',
  'kashish': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/80b368d5-5428-450b-80cf-a0421aff1ea0/profile-photo.jpg?t=1791196025798',

  // 14. Zeeshan Shaquib / Zeeshan (username: Zeeshan21)
  'zeeshan shaquib': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/69fdb85b-a8db-4401-ade2-0d412bf3285c/profile-photo.jpg?t=1791193287878',
  'zeeshan': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/69fdb85b-a8db-4401-ade2-0d412bf3285c/profile-photo.jpg?t=1791193287878',
  'zeeshan21': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/69fdb85b-a8db-4401-ade2-0d412bf3285c/profile-photo.jpg?t=1791193287878',

  // 15. Himansu Kumar / Himanshu Kumar (username: Himansu)
  'himansu kumar': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/05442a22-80f7-4834-a51d-69a216c12f2a/profile-photo.jpg?t=1791131797953',
  'himanshu kumar': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/05442a22-80f7-4834-a51d-69a216c12f2a/profile-photo.jpg?t=1791131797953',
  'himansu': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/05442a22-80f7-4834-a51d-69a216c12f2a/profile-photo.jpg?t=1791131797953',
  'himanshu': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/05442a22-80f7-4834-a51d-69a216c12f2a/profile-photo.jpg?t=1791131797953',

  // 16. Chetan Arora (username: chetan)
  'chetan arora': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/5eb202e2-a585-4d26-9bd4-7a903b87e2ee/profile-photo.jpg?t=1790797803462',
  'chetan': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/5eb202e2-a585-4d26-9bd4-7a903b87e2ee/profile-photo.jpg?t=1790797803462',

  // 17. Yashvi Sharma (username: यशवी शर्मा)
  'yashvi sharma': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/b6b9a5fb-73fe-4406-b336-73901fed5ffe/profile-photo.jpg?t=1790075351518',
  'yashvi': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/b6b9a5fb-73fe-4406-b336-73901fed5ffe/profile-photo.jpg?t=1790075351518',

  // 18. Aarav Sharma (username: AaravSharma)
  'aarav sharma': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/0813b740-89ab-4ed5-992d-bcf551b7c537/profile-photo.jpg?t=1790760951940',
  'aarav': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/0813b740-89ab-4ed5-992d-bcf551b7c537/profile-photo.jpg?t=1790760951940',

  // 19. Nitish Kumar (username: nitish.luck99)
  'nitish kumar': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/37956594-d8bb-4be8-b07d-523905cc12e9/profile-photo.jpeg?t=1774783468624',
  'nitish': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/37956594-d8bb-4be8-b07d-523905cc12e9/profile-photo.jpeg?t=1774783468624',

  // 20. Priya Mehta (username: Priya21)
  'priya mehta': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/620cf39a-9b8e-47d5-b9ed-d539abcdd2d5/profile-photo.jpg?t=1790765265130',

  // 21. Jatin Arora (username: jatin9921)
  'jatin arora': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/5d696f40-793b-4c43-9205-a54c19d0f8a7/profile-photo.png?t=1774624804727',
  'jatin': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/5d696f40-793b-4c43-9205-a54c19d0f8a7/profile-photo.png?t=1774624804727',

  // 22. Riya Sharma (username: riya__sharma066)
  'riya sharma': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/avatars/86aab718-370b-4c1a-845a-563ebde24213/profile-photo.jpg',
  'riya': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/avatars/86aab718-370b-4c1a-845a-563ebde24213/profile-photo.jpg',

  // 23. Shreya Singh (username: singh.sreya321)
  'shreya singh': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/avatars/5e5894d1-dcea-4566-83ef-1c3274060204/profile-photo.jpg',
  'shreya': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/avatars/5e5894d1-dcea-4566-83ef-1c3274060204/profile-photo.jpg',

  // 24. Kritika Sharma (username: kriti3456)
  'kritika sharma': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/avatars/d1eaf34c-946c-4d6c-9ee2-7e50eb227863/profile-photo.jpg',
  'kritika': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/avatars/d1eaf34c-946c-4d6c-9ee2-7e50eb227863/profile-photo.jpg',

  // 25. Ananya Chatterjee (username: Ananya Chatterjee)
  'ananya chatterjee': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/avatars/5f10cf43-c915-404c-9bf3-8af2c5a578f8/profile-photo.jpg',

  // 26. Advika Sharma (username: advika911)
  'advika sharma': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/avatars/40eec20a-4d92-41cd-aeb0-d3064efdd2a4/profile-photo.jpg',
  'advika': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/avatars/40eec20a-4d92-41cd-aeb0-d3064efdd2a4/profile-photo.jpg',

  // 27. Ankit (username: ankit911k)
  'ankit': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/35949c32-c37a-4c7c-a72f-f952b79fa98e/profile-photo.jpg?t=1770570168605',

  // 28. Rahul Singh (username: rahulsong911)
  'rahul singh': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/8a46acaa-5c59-4bcc-ac0c-f7136a4b9c7b/profile-photo.jpg?t=1769161877697',
  'rahul': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/8a46acaa-5c59-4bcc-ac0c-f7136a4b9c7b/profile-photo.jpg?t=1769161877697',

  // 29. Sonia Sharma (username: apkisoni56 / soniyaa3366)
  'sonia sharma': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/dee10ad5-a7cd-422b-b688-96847e5b4e69/profile-photo.png?t=1774886979110',
  'sonia': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/dee10ad5-a7cd-422b-b688-96847e5b4e69/profile-photo.png?t=1774886979110',

  // 30. Bhoomi Sharma (username: bhoomi.sharma)
  'bhoomi sharma': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/5a210034-6771-4ce9-a057-9afc28582cfa/profile-photo.jpg?t=1777393509191',
  'bhoomi': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/5a210034-6771-4ce9-a057-9afc28582cfa/profile-photo.jpg?t=1777393509191',

  // 31. Prabha Singh (username: prabha.s)
  'prabha singh': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/f93e9a8f-14a2-453c-9761-cd65a042efa3/profile-photo.png?t=1789034558744',
  'prabha': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/f93e9a8f-14a2-453c-9761-cd65a042efa3/profile-photo.png?t=1789034558744',

  // 32. Suchi Gupta (username: aokisuchi321)
  'suchi gupta': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/97adb8e7-6c11-44a7-aa07-fd23048f39b9/profile-photo.jpg?t=1775069030738',
  'suchi': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/97adb8e7-6c11-44a7-aa07-fd23048f39b9/profile-photo.jpg?t=1775069030738',

  // 33. Kushum Singh (username: kusum)
  'kushum singh': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/717f8c77-9b7d-444e-8cd6-2245088ba957/profile-photo.jpg?t=1775139648325',
  'kusum': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/717f8c77-9b7d-444e-8cd6-2245088ba957/profile-photo.jpg?t=1775139648325',

  // 34. Alok Kumar (username: alok.ku9988)
  'alok kumar': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/bb196185-1560-4401-86bd-27aea01a60fa/profile-photo.jpg?t=1775227505720',
  'alok': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/bb196185-1560-4401-86bd-27aea01a60fa/profile-photo.jpg?t=1775227505720',

  // 35. Archana Verma (username: archi.v)
  'archana verma': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/b73abb38-b871-45f9-a191-846539b5a6d3/profile-photo.jpg?t=1775389667618',
  'archana': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/b73abb38-b871-45f9-a191-846539b5a6d3/profile-photo.jpg?t=1775389667618',

  // 36. Priya Sharma (username: priya.s)
  'priya sharma': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/92fbe528-10ca-4b97-b967-baf0891cd784/profile-photo.jpg?t=1784992747967',

  // 37. Savarna Rai (username: Swarna_Rai)
  'savarna rai': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/e24cd08b-3310-442d-b9b7-0c0559a0db2e/profile-photo.jpg?t=1789220517927',
  'swarna rai': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/e24cd08b-3310-442d-b9b7-0c0559a0db2e/profile-photo.jpg?t=1789220517927',

  // 38. Yash Kumar (username: yash.k)
  'yash kumar': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/fd385edc-9509-466e-b853-e85dcddd9c18/profile-photo.jpg?t=1789240600971',
  'yash': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/fd385edc-9509-466e-b853-e85dcddd9c18/profile-photo.jpg?t=1789240600971',

  // 39. Dheeraj Kushwaha (username: dheeraj.k)
  'dheeraj kushwaha': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/66988399-252d-4e7c-88a3-d10515e2a2d5/profile-photo.jpeg?t=1775931433649',
  'dheeraj': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/66988399-252d-4e7c-88a3-d10515e2a2d5/profile-photo.jpeg?t=1775931433649',

  // 40. Ananya Jairath (username: ananyajairath)
  'ananya jairath': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/d30e2e38-866b-416b-b4ef-8b2e876f2f19/profile-photo.png?t=1770990036133',
  'ananya': 'https://suaqywhmaheoansrinzw.supabase.co/storage/v1/object/public/avatars/d30e2e38-866b-416b-b4ef-8b2e876f2f19/profile-photo.png?t=1770990036133',
};

/**
 * Returns the authentic original user display picture URL from Supabase Storage.
 * If the user has not uploaded an avatar, returns null (so the green initial letter badge renders).
 */
export function getStudentDisplayPicture(student?: {
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  profile_pic_url?: string | null;
} | null): string | null {
  if (!student) {
    return null;
  }

  // 1. If student record already includes their original profile_pic_url or avatar_url
  if (student.profile_pic_url && typeof student.profile_pic_url === 'string' && student.profile_pic_url.trim().length > 10) {
    return student.profile_pic_url.trim();
  }
  if (student.avatar_url && typeof student.avatar_url === 'string' && student.avatar_url.trim().length > 10) {
    return student.avatar_url.trim();
  }

  const rawName = (student.name || '').trim().toLowerCase();
  if (!rawName) return null;

  // Direct exact match
  if (ORIGINAL_USER_AVATARS[rawName]) {
    return ORIGINAL_USER_AVATARS[rawName];
  }

  // Normalized (single space) match
  const normalizedName = rawName.replace(/\s+/g, ' ');
  if (ORIGINAL_USER_AVATARS[normalizedName]) {
    return ORIGINAL_USER_AVATARS[normalizedName];
  }

  // First name match
  const firstName = normalizedName.split(' ')[0];
  if (firstName && ORIGINAL_USER_AVATARS[firstName]) {
    return ORIGINAL_USER_AVATARS[firstName];
  }

  return null;
}
