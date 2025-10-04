import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Replicate from 'replicate';

@Injectable()
export class ReplicateService implements OnModuleInit {
  private replicate: Replicate;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // We initialize the client in onModuleInit to ensure ConfigService is ready.
    const apiToken = this.configService.get<string>('REPLICATE_API_TOKEN');

    if (!apiToken) {
      throw new Error('REPLICATE_API_TOKEN is not defined in the environment variables.');
    }

    this.replicate = new Replicate({ auth: apiToken });
  }

  /**
   * Runs a specified Replicate model with the given input.
   * @param model - The model identifier string (e.g., 'user/model:version').
   * @param input - The input object for the model.
   * @returns The output from the Replicate model.
   */
  async run(model: string, input: object): Promise<any> {
    try {
      const output = await this.replicate.run(model as any, { input });
      return output;
    } catch (error) {
      // Log the specific error for debugging purposes
      console.error('Replicate API Error:', error);
      // Throw a generic, user-friendly error to the calling service
      throw new InternalServerErrorException('An error occurred while communicating with the AI model provider.');
    }
  }
}
