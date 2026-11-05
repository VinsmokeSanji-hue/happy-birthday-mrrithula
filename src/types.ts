export type ScreenType = 'landing' | 'scrapbook' | 'letter' | 'cake' | 'final';

export interface BirthdayConfig {
  herName: string;
  birthdayDate: string;
  birthdayMonth: string;
  birthdayYear: number;
  birthdayDay: number;
  landingHeading: string;
  landingSubtitle: string;
  scrapbookGreeting: string;
  scrapbookSpecialTag: string;
  letterTitle: string;
  letterGreeting: string;
  letterParagraph1: string;
  letterParagraph2: string;
  letterSignoff: string;
  finalTopNote: string;
  finalMainNote: string;
  finalCaptions: string[];
  finalDateLabel: string;
}
