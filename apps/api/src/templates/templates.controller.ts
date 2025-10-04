import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators/api-common-responses.decorator';

@ApiTags('Templates')
@Controller('templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  // CREATE endpoint - only for Salon owners
  @Post()
  @ApiOperation({ summary: 'Create a new template (Salon owners only)' })
  @ApiResponse({ status: 201, description: 'The template has been successfully created.' })
  @ApiCommonResponses()
  @Roles('salon')
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.create(createTemplateDto);
  }

  // READ (List) endpoint - for everyone (Stylists and Salons)
  @Get()
  @ApiOperation({ summary: 'Get a list of templates with optional pagination and tag filtering' })
  @ApiResponse({ status: 200, description: 'A list of templates.' })
  @ApiCommonResponses()
  @Roles('stylist', 'salon')
  findAll(@Query() paginationDto: PaginationDto, @Query('tags') tags?: string) {
    const tagArray = tags ? tags.split(',') : undefined;
    return this.templatesService.findAll(paginationDto, tagArray);
  }

  // READ (Single) endpoint - for everyone
  @Get(':id')
  @ApiOperation({ summary: 'Get a single template by ID' })
  @ApiResponse({ status: 200, description: 'The requested template.' })
  @ApiCommonResponses()
  @Roles('stylist', 'salon')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.templatesService.findOne(id);
  }

  // UPDATE endpoint - only for Salon owners
  @Patch(':id')
  @ApiOperation({ summary: 'Update a template (Salon owners only)' })
  @ApiResponse({ status: 200, description: 'The template has been successfully updated.' })
  @ApiCommonResponses()
  @Roles('salon')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templatesService.update(id, updateTemplateDto);
  }

  // DELETE endpoint - only for Salon owners
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a template (Salon owners only)' })
  @ApiResponse({ status: 200, description: 'The template has been successfully deleted.' })
  @ApiCommonResponses()
  @Roles('salon')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.templatesService.remove(id);
  }
}
