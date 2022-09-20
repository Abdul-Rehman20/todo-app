import { Expose } from 'class-transformer';

export class userDto {
  @Expose()
  username: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
