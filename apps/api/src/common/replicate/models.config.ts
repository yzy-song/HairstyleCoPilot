// in: apps/api/src/consultations/models.config.ts

import type { HairstyleTemplate } from '@repo/db';

// This is the data our service will PROVIDE to the formatter.
export interface ModelInput {
  sourceImageUrl: string;
  template: HairstyleTemplate;
}

// The configuration for a single AI model.
export interface ModelConfig {
  id: string; // The full Replicate model ID (e.g., user/model:version)
  formatInput: (input: ModelInput, options?: Record<string, any>) => Record<string, any>;
}

export const MODELS: Record<string, ModelConfig> = {
  // --- Model 1: Your core "template-style" model ---
  'style-your-hair': {
    id: 'cjwbw/style-your-hair:c4c7e5a657e2e1abccd57625093522a9928edeccee77e3f55d57c664bcd96fa2',
    formatInput: ({ sourceImageUrl, template }) => ({
      // This model applies the style from the 'source' to the 'target'.
      source_image: sourceImageUrl, // The user's photo is the target to apply the style onto.
      target_image: template.imageUrl, // The template's photo provides the hair style.
    }),
  },

  // --- Model 2: The flexible "multi-modal" model ---
  hairclip: {
    id: 'wty-ustc/hairclip:b95cb2a16763bea87ed7ed851d5a3ab2f4655e94bcfb871edba029d4814fa587',
    formatInput: ({ sourceImageUrl, template }) => {
      // This function gets additional parameters from the template's `aiParameters` field.
      const params = template.aiParameters as {
        editing_type?: 'both' | 'hairstyle' | 'haircolor';
        color_description?: string;
        hairstyle_description?: string;
      };

      return {
        image: sourceImageUrl,
        ...params, // Spread the specific parameters from the database template
      };
    },
  },

  // --- Model 3: The "option-based" model ---
  'change-haircut': {
    id: 'flux-kontext-apps/change-haircut:9c5081907a71f01c7c9360cd753f191757a3e79043e06173a0a65b210287a151',
    formatInput: ({ sourceImageUrl, template }) => {
      // This function also gets its specific options from the template's `aiParameters`.
      const params = template.aiParameters as {
        gender?: 'none' | 'male' | 'female';
        haircut?: string; // e.g., "Long Wavy", "Bob", "Random"
        hair_color?: string; // e.g., "Blonde", "Red", "Random"
      };

      return {
        input_image: sourceImageUrl,
        aspect_ratio: 'match_input_image', // A sensible default
        output_format: 'png',
        ...params, // Spread the specific options from the database template
      };
    },
  },
};
