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

@UseGuards(JwtAuthGuard)
@Controller('bikes')
export class BikesController {
  constructor(private bikesService: BikesService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.CLIENT)
  @Get('')
  async getBikes(@Query() searchBikesDto: SearchBikesDto) {
    const { count, bikes } = await this.bikesService.search(searchBikesDto);
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
  @Roles(UserRole.MANAGER)
  @Get('rents')
  getRents(@Query() searchRentsDto: SearchRentsDto) {
    return this.bikesService.rents(searchRentsDto);
  }

  @UsePipes(ValidatePipe)
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Post()
  create(@Body() createBikeDataDto: CreateBikeDataDto) {
    return this.bikesService.create(createBikeDataDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Get(':id')
  async getBike(@Param('id') id: string) {
    const bike = await this.bikesService.findOne({ id });
    if (!bike) {
      throw new NotFoundException('Bike not found');
    }
    return omit(bike, ['password']);
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
}
