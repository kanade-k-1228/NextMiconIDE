export type Registory = RegistoryItem[];

export type RegistoryItem = {
  owner: string;
  pack: string;
  version: string;
  description: string;
  keywords: string[];
};
