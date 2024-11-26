import { FilesEntity } from './product.entity';

export interface IdeasEntity {
  id?: string;
  name_ru: string;
  name_uz: string;
  description_ru?: string;
  description_uz?: string;
  image?: FilesEntity;
  group_id?: string;
  created_at?: Date;
  is_deleted?: boolean;
}

export interface IdeasFiltersEntity {
  id?: string;
  idea_id: string;
  filter_value_id: string;
}
