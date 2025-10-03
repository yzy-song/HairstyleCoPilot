import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from 'src/auth/decorators/current-user.decorator';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes in this controller
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles('stylist', 'salon') // Both stylists and salon owners can create clients
  create(@Body() createClientDto: CreateClientDto, @CurrentUser() user: AuthenticatedUser) {
    return this.clientsService.create(createClientDto, user.salonId);
  }

  @Get()
  @Roles('stylist', 'salon')
  findAll(@Query() paginationDto: PaginationDto, @CurrentUser() user: AuthenticatedUser) {
    return this.clientsService.findAll(paginationDto, user.salonId);
  }

  @Get(':id')
  @Roles('stylist', 'salon')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.clientsService.findOne(id, user.salonId);
  }

  @Patch(':id')
  @Roles('stylist', 'salon')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientsService.update(id, updateClientDto, user.salonId);
  }

  @Delete(':id')
  @Roles('salon') //only salon owners can delete clients
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.clientsService.remove(id, user.salonId);
  }
}
