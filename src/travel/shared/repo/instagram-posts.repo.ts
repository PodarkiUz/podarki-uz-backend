import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';

export class InstagramPostEntity {
  id?: string;
  username: string;
  post_id: string;
  response_json: any;
  attempt: number;
  processed?: boolean;
  created_at?: Date;
}

@Injectable()
export class InstagramPostsRepo extends BaseRepo<InstagramPostEntity> {
  constructor() {
    super('instagram_posts');
  }
}
