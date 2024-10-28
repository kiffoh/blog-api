if (process.env.DATABASE_URL === undefined) {
    // Environment config
    const dotenv = require('dotenv');
    const path = require('path')
  
    // Determine which .env file to load based on NODE_ENV
    const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
  
    // Load the environment variables
    dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  
    console.log(`Current environment: ${process.env.NODE_ENV || 'default'}`);
  
    console.log("Database URL: ", process.env.FRONTEND_URL)
  }


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    console.log('Fake data deleted successfully');
}

main()
    .catch((error) => {
    console.error('Error seeding data:', error);
    process.exit(1);
    })
    .finally(async () => {
    await prisma.$disconnect();
    });