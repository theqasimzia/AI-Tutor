import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        const userCount = await prisma.user.count();
        console.log(`✅ Success! Database Connected.`);
        console.log(`Total users in DB: ${userCount}`);
    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
