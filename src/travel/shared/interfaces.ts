import { StatusEnum } from './enums';

export interface ILanguage {
  en?: string;
  uz: string;
  ru?: string;
}

export enum Language {
  'uz' = 'uz',
  'ru' = 'ru',
  'en' = 'en',
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
  search?: string;
  status?: StatusEnum[];
}
