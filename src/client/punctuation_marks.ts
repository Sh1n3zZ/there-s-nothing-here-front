/**
 * Pause symbols (逗号、句号)
 * These are the basic pause symbols in both Chinese and English
 */
export const pause_symbols: string[] = [
  "，", // Chinese comma
  ",", // English comma
  "。", // Chinese period
  ".", // English period
  "、", // Chinese enumeration comma
];

/**
 * All punctuation marks
 * This includes pause_symbols and other punctuation marks
 */
export const punctuation_marks: string[] = [
  // Pause symbols
  ...pause_symbols,
  // Exclamation marks
  "！", // Chinese exclamation
  "!", // English exclamation
  // Question marks
  "？", // Chinese question mark
  "?", // English question mark
  // Semicolons
  "；", // Chinese semicolon
  ";", // English semicolon
  // Colons
  "：", // Chinese colon
  ":", // English colon
  // Quotation marks
  "\u201C", // Left double quotation mark
  "\u201D", // Right double quotation mark
  "\u2018", // Left single quotation mark
  "\u2019", // Right single quotation mark / apostrophe
  // Parentheses
  "（", // Chinese left parenthesis
  "(", // English left parenthesis
  "）", // Chinese right parenthesis
  ")", // English right parenthesis
  // Square brackets
  "【", // Chinese left square bracket
  "[", // English left square bracket
  "】", // Chinese right square bracket
  "]", // English right square bracket
  // Angle brackets
  "《", // Chinese left angle bracket
  "<", // English left angle bracket
  "》", // Chinese right angle bracket
  ">", // English right angle bracket
  // Other punctuation
  "…", // Ellipsis
  "—", // Em dash
  "–", // En dash
  "-", // Hyphen
  "·", // Middle dot
];
