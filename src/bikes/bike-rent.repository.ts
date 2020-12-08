import { EntityRepository, Repository } from 'typeorm';
import { BikeRent } from './bike-rent.entity';

@EntityRepository(BikeRent)
export class BikeRentRepository extends Repository<BikeRent> {}
