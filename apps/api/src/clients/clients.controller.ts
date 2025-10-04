import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from 'src/auth/decorators/current-user.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators/api-common-responses.decorator';

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes in this controller
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'The client has been successfully created.' })
  @ApiCommonResponses()
  @Roles('stylist', 'salon') // Both stylists and salon owners can create clients
  create(@Body() createClientDto: CreateClientDto, @CurrentUser() user: AuthenticatedUser) {
    return this.clientsService.create(createClientDto, user.salonId);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of clients' })
  @ApiResponse({ status: 200, description: 'A paginated list of clients.' })
  @ApiCommonResponses()
  @Roles('stylist', 'salon')
  findAll(@Query() paginationDto: PaginationDto, @CurrentUser() user: AuthenticatedUser) {
    return this.clientsService.findAll(paginationDto, user.salonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponse({ status: 200, description: 'The client details.' })
  @ApiCommonResponses()
  @Roles('stylist', 'salon')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.clientsService.findOne(id, user.salonId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client by ID' })
  @ApiResponse({ status: 200, description: 'The client has been successfully updated.' })
  @ApiCommonResponses()
  @Roles('stylist', 'salon')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientsService.update(id, updateClientDto, user.salonId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client by ID' })
  @ApiResponse({ status: 200, description: 'The client has been successfully deleted.' })
  @ApiCommonResponses()
  @Roles('salon') //only salon owners can delete clients
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.clientsService.remove(id, user.salonId);
  }
}
