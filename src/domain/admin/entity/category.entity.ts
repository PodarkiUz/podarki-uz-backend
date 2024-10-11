export interface CategoryEntity {
  id?: string;
  name_ru: string;
  name_uz: string;
  description: string;
  image: string;
  avif_image: string;
  created_at?: Date;
  is_deleted?: boolean;
}
