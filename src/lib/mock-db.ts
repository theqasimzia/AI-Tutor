import fs from 'fs';
import path from 'path';

// Define Types
export type User = { id: string; name: string; email: string; password: string; role: 'PARENT' | 'ADMIN' };
export type Student = { id: string; parentId: string; name: string; grade: string; xp: number };

// Paths
const DATA_FILE = path.join(process.cwd(), 'data.json');

// Initialize Data if not exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], students: [] }, null, 2));
}

// Helpers
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeData = (data: any) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

export const db = {
    user: {
        findUnique: async ({ where }: { where: { email: string } }) => {
            const data = readData();
            return data.users.find((u: User) => u.email === where.email) || null;
        },
        create: async ({ data }: { data: Omit<User, 'id'> }) => {
            const dbData = readData();
            const newUser = { ...data, id: Math.random().toString(36).substr(2, 9) };
            dbData.users.push(newUser);
            writeData(dbData);
            return newUser;
        },
        count: async () => {
            const data = readData();
            return data.users.length;
        }
    },
    student: {
        create: async ({ data }: { data: Omit<Student, 'id' | 'xp'> }) => {
            const dbData = readData();
            const newStudent = { ...data, id: Math.random().toString(36).substr(2, 9), xp: 0 };
            dbData.students.push(newStudent);
            writeData(dbData);
            return newStudent;
        }
    },
    $transaction: async (fn: (tx: any) => Promise<any>) => {
        return await fn(db); // Pass self as transaction context
    }
};

export default db;
