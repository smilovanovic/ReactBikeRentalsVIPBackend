import { IsString } from 'class-validator';

export class CreateBikeDataDto {
  @IsString()
  model: string;

  @IsString()
  color: string;

  @IsString()
  location: string;
}
