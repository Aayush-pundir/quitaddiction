export type NicheId = 'quit-vaping' | 'quit-porn' | 'quit-sugar' | 'quit-smoking';

export interface QuizOption {
  id: string;
  label: string;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  type: 'single' | 'multi';
  options: QuizOption[];
}

export interface Milestone {
  id: string;
  hours: number;
  title: string;
  description: string;
  icon: string;
}

export interface RecoveryStage {
  hours: number;
  title: string;
  body: string;
}

export interface EducationLesson {
  id: string;
  unlockDay: number;
  title: string;
  icon: string;
  body: string;
}

export interface DistractionActivity {
  id: string;
  title: string;
  durationSeconds: number;
  instructions: string;
}

export interface MotivationalCard {
  id: string;
  text: string;
  author?: string;
}

export interface TagOption {
  id: string;
  label: string;
  icon: string;
}

export interface CalculatorConfig {
  currencySymbol: string;
  unitSingular: string;
  unitPlural: string;
  defaultCostPerUnit: number;
  defaultUnitsPerDay: number;
  costPerUnitQuestion: string;
  unitsPerDayQuestion: string;
  unitsAvoidedLabel: string;
  moneySavedLabel: string;
  /** 'currency' formats the second stat as {currencySymbol}{value}; 'hours' treats
   *  costPerUnit as minutes-per-unit and formats as rounded hours instead. */
  secondaryStatFormat: 'currency' | 'hours';
}

export interface PaywallConfig {
  trialDays: number;
  annualPrice: number;
  monthlyPrice: number;
  currencySymbol: string;
  headline: string;
  subheadline: string;
  features: string[];
  revenueCatEntitlementId: string;
  revenueCatOfferingId: string;
}

export interface NicheColors {
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  gradientStart: string;
  gradientEnd: string;
}

export interface NicheConfig {
  id: NicheId;
  appName: string;
  tagline: string;
  relapseTerm: string;
  relapseTermPast: string;
  streakNoun: string;
  colors: NicheColors;
  calculator: CalculatorConfig;
  onboardingQuiz: QuizQuestion[];
  whyMotivations: QuizOption[];
  milestones: Milestone[];
  recoveryTimeline: RecoveryStage[];
  education: EducationLesson[];
  distractionActivities: DistractionActivity[];
  motivationalCards: MotivationalCard[];
  triggerTags: TagOption[];
  emotionTags: TagOption[];
  paywall: PaywallConfig;
}
