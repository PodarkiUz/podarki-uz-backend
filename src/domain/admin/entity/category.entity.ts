export interface CategoryEntity {
  id?: string;
  name_ru: string;
  name_uz: string;
  description: string;
  image: string;
  parent_id?: string;
  group_id?: string;
  parent_hierarchy?: string;
  created_at?: Date;
  is_deleted?: boolean;
}
