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