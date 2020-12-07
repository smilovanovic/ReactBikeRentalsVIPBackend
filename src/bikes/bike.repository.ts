import { EntityRepository, Repository } from 'typeorm';
import { Bike } from './bike.entity';

@EntityRepository(Bike)
export class BikeRepository extends Repository<Bike> {}
