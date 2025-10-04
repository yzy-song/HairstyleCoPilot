import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationsService } from './consultations.service';
import { PrismaService } from '../prisma.service';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { ReplicateProvider } from '../common/replicate/providers/replicate.provider';

describe('ConsultationsService', () => {
  let service: ConsultationsService;
  let prismaService: PrismaService;
  let cloudinaryService: CloudinaryService;
  let replicateProvider: ReplicateProvider;

  const mockPrismaService = {
    client: {
      create: jest.fn(),
    },
    consultation: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    hairstyleTemplate: {
      findUnique: jest.fn(),
    },
    generatedImage: {
      create: jest.fn(),
    },
  };

  const mockCloudinaryService = {
    uploadImageFromBuffer: jest.fn(),
    uploadImageFromUrl: jest.fn(),
    optimizeCloudinaryUrl: jest.fn(),
  };

  const mockReplicateProvider = {
    run: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
        {
          provide: ReplicateProvider,
          useValue: mockReplicateProvider,
        },
      ],
    }).compile();

    service = module.get<ConsultationsService>(ConsultationsService);
    prismaService = module.get<PrismaService>(PrismaService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
    replicateProvider = module.get<ReplicateProvider>(ReplicateProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createQuickConsult', () => {
    it('should create a quick consultation with temporary client', async () => {
      const stylistId = 1;
      const salonId = 1;
      const mockClient = { id: 1, name: 'Walk-in Client - 10:00:00 AM', salonId };
      const mockConsultation = { id: 1, stylistId, clientId: 1, status: 'TEMPORARY' };

      mockPrismaService.client.create.mockResolvedValue(mockClient);
      mockPrismaService.consultation.create.mockResolvedValue(mockConsultation);

      const result = await service.createQuickConsult(stylistId, salonId);

      expect(mockPrismaService.client.create).toHaveBeenCalledWith({
        data: {
          name: expect.stringContaining('Walk-in Client -'),
          salonId,
        },
      });
      expect(mockPrismaService.consultation.create).toHaveBeenCalledWith({
        data: {
          stylistId,
          clientId: mockClient.id,
          status: 'TEMPORARY',
        },
      });
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('createForClient', () => {
    it('should create a consultation for a specific client', async () => {
      const createConsultationDto = { clientId: 1 };
      const stylistId = 1;
      const mockConsultation = { id: 1, clientId: 1, stylistId };

      mockPrismaService.consultation.create.mockResolvedValue(mockConsultation);

      const result = await service.createForClient(createConsultationDto, stylistId);

      expect(mockPrismaService.consultation.create).toHaveBeenCalledWith({
        data: {
          clientId: createConsultationDto.clientId,
          stylistId,
        },
      });
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('findOne', () => {
    it('should return a consultation with images and tags', async () => {
      const consultationId = 1;
      const salonId = 1;
      const mockConsultation = {
        id: consultationId,
        generatedImages: [{ id: 1, imageUrl: 'test.jpg' }],
        tags: [{ id: 1, name: 'test' }],
      };

      mockPrismaService.consultation.findFirst.mockResolvedValue(mockConsultation);

      const result = await service.findOne(consultationId, salonId);

      expect(mockPrismaService.consultation.findFirst).toHaveBeenCalledWith({
        where: { id: consultationId, client: { salonId }, deletedAt: null },
        include: { generatedImages: true, tags: true },
      });
      expect(result).toEqual(mockConsultation);
    });

    it('should throw NotFoundException if consultation not found', async () => {
      const consultationId = 1;
      const salonId = 1;

      mockPrismaService.consultation.findFirst.mockResolvedValue(null);

      await expect(service.findOne(consultationId, salonId)).rejects.toThrow(
        `Consultation with ID ${consultationId} not found.`,
      );
    });
  });
});
