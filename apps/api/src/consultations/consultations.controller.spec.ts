import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { AuthenticatedUser } from 'src/auth/decorators/current-user.decorator';

describe('ConsultationsController', () => {
  let controller: ConsultationsController;
  let consultationsService: ConsultationsService;
  let cloudinaryService: CloudinaryService;

  const mockConsultationsService = {
    createQuickConsult: jest.fn(),
    createForClient: jest.fn(),
    findOne: jest.fn(),
    createGeneratedImage: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadImageFromBuffer: jest.fn(),
    uploadImageFromUrl: jest.fn(),
    optimizeCloudinaryUrl: jest.fn(),
  };

  const mockUser: AuthenticatedUser = {
    id: 1,
    salonId: 1,
    email: 'test@example.com',
    role: 'stylist',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultationsController],
      providers: [
        {
          provide: ConsultationsService,
          useValue: mockConsultationsService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    controller = module.get<ConsultationsController>(ConsultationsController);
    consultationsService = module.get<ConsultationsService>(ConsultationsService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createQuickConsult', () => {
    it('should create a quick consultation', async () => {
      const mockConsultation = { id: 1, status: 'TEMPORARY' };
      mockConsultationsService.createQuickConsult.mockResolvedValue(mockConsultation);

      const result = await controller.createQuickConsult(mockUser);

      expect(mockConsultationsService.createQuickConsult).toHaveBeenCalledWith(mockUser.id, mockUser.salonId);
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('createForClient', () => {
    it('should create a consultation for a client', async () => {
      const createConsultationDto = { clientId: 1 };
      const mockConsultation = { id: 1, clientId: 1 };
      mockConsultationsService.createForClient.mockResolvedValue(mockConsultation);

      const result = await controller.createForClient(createConsultationDto, mockUser);

      expect(mockConsultationsService.createForClient).toHaveBeenCalledWith(createConsultationDto, mockUser.id);
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('findOne', () => {
    it('should return a consultation', async () => {
      const consultationId = 1;
      const mockConsultation = {
        id: consultationId,
        generatedImages: [{ id: 1, imageUrl: 'test.jpg' }],
        tags: [{ id: 1, name: 'test' }],
      };
      mockConsultationsService.findOne.mockResolvedValue(mockConsultation);

      const result = await controller.findOne(consultationId, mockUser);

      expect(mockConsultationsService.findOne).toHaveBeenCalledWith(consultationId, mockUser.salonId);
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('createGeneratedImage', () => {
    it('should create a generated image for a consultation', async () => {
      const consultationId = 1;
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      const createGeneratedImageDto = {
        templateId: 1,
        modelKey: 'test-model',
        options: {},
      };
      const mockGeneratedImage = { id: 1, imageUrl: 'generated.jpg' };
      mockConsultationsService.createGeneratedImage.mockResolvedValue(mockGeneratedImage);

      const result = await controller.createGeneratedImage(consultationId, mockFile, createGeneratedImageDto, mockUser);

      expect(mockConsultationsService.createGeneratedImage).toHaveBeenCalledWith(
        consultationId,
        mockFile,
        createGeneratedImageDto,
        mockUser,
      );
      expect(result).toEqual(mockGeneratedImage);
    });

    it('should throw BadRequestException when no image file is provided', async () => {
      const consultationId = 1;
      const createGeneratedImageDto = {
        templateId: 1,
        modelKey: 'test-model',
        options: {},
      };

      await expect(
        controller.createGeneratedImage(consultationId, undefined as any, createGeneratedImageDto, mockUser),
      ).rejects.toThrow('Image file is required.');
    });
  });
});
