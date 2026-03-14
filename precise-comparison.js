// Precise character-by-character comparison
console.log('🔍 PRECISE PROJECT ID COMPARISON');
console.log('=====================================');

const jwtProject = 'suaqywhmaheoanrinzwp';
const urlProject = 'suaqywhmaheoansrinzw';

console.log('JWT Project:', jwtProject);
console.log('URL Project:', urlProject);
console.log('');

console.log('Character-by-character comparison:');
for (let i = 0; i < Math.max(jwtProject.length, urlProject.length); i++) {
  const jwtChar = jwtProject[i] || '∅';
  const urlChar = urlProject[i] || '∅';
  const match = jwtChar === urlChar ? '✅' : '❌';
  console.log(`Position ${i+1}: JWT='${jwtChar}' URL='${urlChar}' ${match}`);
}

console.log('');
console.log('📊 SUMMARY:');
console.log('JWT Length:', jwtProject.length);
console.log('URL Length:', urlProject.length);
console.log('Lengths match:', jwtProject.length === urlProject.length);
console.log('Content matches:', jwtProject === urlProject);

if (jwtProject !== urlProject) {
  console.log('');
  console.log('❌ DIFFERENCES FOUND:');
  for (let i = 0; i < Math.min(jwtProject.length, urlProject.length); i++) {
    if (jwtProject[i] !== urlProject[i]) {
      console.log(`Position ${i+1}: JWT has '${jwtProject[i]}' but URL has '${urlChar}'`);
    }
  }
}

// Let's also check the exact characters at positions where differences might be
console.log('');
console.log('🔍 DETAILED CHARACTER ANALYSIS:');
console.log('Position 11 (0-indexed 10): JWT has', jwtProject[10], ', URL has', urlProject[10]);
console.log('Position 12 (0-indexed 11): JWT has', jwtProject[11], ', URL has', urlProject[11]);

const jwtSub = jwtProject.substring(10, 13);
const urlSub = urlProject.substring(10, 13);
console.log('JWT substring (10-13):', jwtSub);
console.log('URL substring (10-13):', urlSub);
