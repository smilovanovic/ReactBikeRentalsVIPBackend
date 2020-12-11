import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { omit } from 'lodash';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { BikesService } from './bikes.service';
import { ValidatePipe } from '../common/validate.pipe';
import { CreateBikeDataDto } from './dto/create-bike-data.dto';
import { SearchBikesDto } from './dto/search-bikes.dto';
import { SearchRentsDto } from './dto/search-rents.dto';
import { CreateRentDto } from './dto/create-rent.dto';

@UseGuards(JwtAuthGuard)
@Controller('bikes')
export class BikesController {
  constructor(private bikesService: BikesService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.CLIENT)
  @Get('')
  async getBikes(@Query() searchBikesDto: SearchBikesDto, @Request() req) {
    const { count, bikes } = await this.bikesService.search(
      searchBikesDto,
      req.user,
    );
    return {
      count,
      bikes,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.CLIENT)
  @Get('existing-values')
  getExistingValues() {
    return this.bikesService.existingValues();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.CLIENT)
  @Get('rents')
  async getRents(@Query() searchRentsDto: SearchRentsDto, @Request() req) {
    const rents = await this.bikesService.rents(searchRentsDto);
    if (!req.user.isManager()) {
      return rents.map((rent) =>
        omit({ ...rent, isMyRent: rent.user.id === req.user.id }, [
          'bike',
          'user',
        ]),
      );
    }
    return rents;
  }

  @UsePipes(ValidatePipe)
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Post()
  create(@Body() createBikeDataDto: CreateBikeDataDto) {
    return this.bikesService.create(createBikeDataDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.CLIENT)
  @Get(':id')
  async getBike(@Param('id') id: string) {
    const bike = await this.bikesService.findOne({ id });
    if (!bike) {
      throw new NotFoundException('Bike not found');
    }
    return bike;
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bikesService.delete(id);
  }

  @UsePipes(ValidatePipe)
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBikeDataDto: CreateBikeDataDto,
  ) {
    return this.bikesService.update(id, updateBikeDataDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  @Post(':id/ratings')
  async rate(
    @Param('id') id: string,
    @Body() data: { rating: number },
    @Request() req,
  ) {
    const bike = await this.bikesService.findOne({ id });
    if (!bike) {
      throw new NotFoundException('Bike not found');
    }
    return this.bikesService.rate(bike, req.user, data.rating);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  @Post(':id/rent')
  async rentBike(
    @Param('id') id: string,
    @Body() createRentDto: CreateRentDto,
    @Request() req,
  ) {
    const bike = await this.bikesService.findOne({ id });
    if (!bike) {
      throw new NotFoundException('Bike not found');
    }
    return this.bikesService.upsertRent(bike, req.user, createRentDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  @Delete(':id/rent/:rentId')
  async deleteRentBike(
    @Param('id') id: string,
    @Param('rentId') rentId: string,
    @Request() req,
  ) {
    return this.bikesService.deleteRent(id, req.user, rentId);
  }
}
