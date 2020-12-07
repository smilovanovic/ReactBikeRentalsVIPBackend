export class SearchBikesDto {
  skip?: number;
  take?: number;
  order?: string;
  model?: string;
  color?: string;
  location?: string;
}
