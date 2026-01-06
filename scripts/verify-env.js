/**
 * Script de vérification des variables d'environnement
 * À utiliser pendant le build pour debugger
 */

console.log('🔍 Vérification des variables d\'environnement:');
console.log('');
console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL || '(non définie - utilisera http://localhost:8000)');
console.log('NEXT_PUBLIC_AUTH_COOKIE_NAME:', process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || '(non définie)');
console.log('NODE_ENV:', process.env.NODE_ENV || '(non définie)');
console.log('PORT:', process.env.PORT || '(non définie)');
console.log('');

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.warn('⚠️  ATTENTION: NEXT_PUBLIC_API_BASE_URL n\'est pas définie!');
  if (process.env.NODE_ENV === 'production') {
    console.log('   ℹ️  Mode Production détecté: Utilisation du fallback https://d-agri-market-back.onrender.com');
  } else {
    console.warn('   L\'application utilisera http://localhost:8000 par défaut.');
  }
} else {
  console.log('✅ NEXT_PUBLIC_API_BASE_URL est correctement configurée:', process.env.NEXT_PUBLIC_API_BASE_URL);
}

