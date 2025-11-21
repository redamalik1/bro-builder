export interface ExampleCard {
  id: string;
  emoji: string;
  title: string;
  description: string;
  prompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SeoStat {
  value: string;
  label: string;
}

export interface SeoCategory {
  title: string;
  items: string[];
  gradient: string;
}

export interface ShowcaseApp {
  id: string;
  title: string;
  description: string;
  prompt: string;
  previewGradient: string;
  previewIcon: string;
}