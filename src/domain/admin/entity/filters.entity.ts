export interface FiltersEntity {
  id?: string;
  name_ru: string;
  name_uz: string;
  created_at?: Date;
  is_deleted?: boolean;
}

export interface FilterValuesEntity {
  id?: string;
  filter_id: string;
  value_ru: string;
  value_uz: string;
  created_at?: Date;
  is_deleted?: boolean;
}
