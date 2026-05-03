import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('开始创建测试数据...');

  // 创建一个测试沙龙
  const salon = await prisma.salon.upsert({
    where: { email: 'salon@example.com' },
    update: {},
    create: {
      email: 'salon@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      salonName: '测试沙龙',
    },
  });

  console.log('创建沙龙:', salon);

  // 创建一个测试发型师
  const stylist = await prisma.stylist.upsert({
    where: { email: 'stylist@example.com' },
    update: {},
    create: {
      email: 'stylist@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      name: '测试发型师',
      salonId: salon.id,
    },
  });

  console.log('创建发型师:', stylist);

  // 创建发型模板
  const templates = [
    {
      name: 'Blonde Bob',
      description: 'A chic blonde bob haircut',
      imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400',
      modelKey: 'style-your-hair',
      aiParameters: {},
      tags: ['blonde', 'bob', 'short'],
    },
    {
      name: 'Long Wavy Brunette',
      description: 'Elegant long wavy brown hair',
      imageUrl: 'https://images.unsplash.com/photo-1554519934-e32b1629d9ee?w=400',
      modelKey: 'hairclip',
      aiParameters: {
        editing_type: 'both',
        color_description: 'Rich chocolate brown with subtle caramel highlights',
        hairstyle_description: 'Long flowing waves with soft layers',
      },
      tags: ['brunette', 'wavy', 'long'],
    },
    {
      name: 'Platinum Pixie',
      description: 'Bold platinum blonde pixie cut',
      imageUrl: 'https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?w=400',
      modelKey: 'change-haircut',
      aiParameters: {
        gender: 'female',
        haircut: 'Pixie Cut',
        hair_color: 'Platinum Blonde',
      },
      tags: ['blonde', 'pixie', 'short'],
    },
    {
      name: 'Red Curly Layers',
      description: 'Vibrant red curly hair with layers',
      imageUrl: 'https://images.unsplash.com/photo-1605980776566-2046abf57c5e?w=400',
      modelKey: 'hairclip',
      aiParameters: {
        editing_type: 'both',
        color_description: 'Vibrant copper red',
        hairstyle_description: 'Voluminous curly layers',
      },
      tags: ['red', 'curly', 'medium'],
    },
    {
      name: 'Classic Taper Fade',
      description: 'Clean and sharp taper fade for men',
      imageUrl: 'https://images.unsplash.com/photo-1621605815975-5c40c4c7f23b?w=400',
      modelKey: 'change-haircut',
      aiParameters: {
        gender: 'male',
        haircut: 'Taper Fade',
        hair_color: 'Natural Dark Brown',
      },
      tags: ['male', 'fade', 'short'],
    },
  ];

  for (const template of templates) {
    const { tags, ...data } = template;
    await prisma.hairstyleTemplate.create({
      data: {
        ...data,
        tags: {
          connectOrCreate: tags.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });
    console.log(`创建模板: ${template.name}`);
  }

  console.log('测试数据创建完成！');
  console.log('你可以使用以下账号登录:');
  console.log('沙龙账号: salon@example.com / password123');
  console.log('发型师账号: stylist@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });