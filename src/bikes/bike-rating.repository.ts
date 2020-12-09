import { EntityRepository, Repository } from 'typeorm';
import { BikeRating } from './bike-rating.entity';

@EntityRepository(BikeRating)
export class BikeRatingRepository extends Repository<BikeRating> {}
