export interface AuthToken {
  id?: string;
  created_at?: Date;
  user_id?: string;
  access_token?: string;
  expires_at?: Date;
  is_deleted: boolean;
  is_expired?: true;
}
