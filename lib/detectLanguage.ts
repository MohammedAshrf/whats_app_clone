function detectLanguage(
  text: string,
): 'arabic' | 'english' | 'mixed' | 'unknown' {
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasEnglish = /[A-Za-z]/.test(text);

  if (hasArabic && hasEnglish) return 'mixed';
  if (hasArabic) return 'arabic';
  if (hasEnglish) return 'english';
  return 'unknown';
}

export default detectLanguage;
