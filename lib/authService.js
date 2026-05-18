import { nanoid } from 'nanoid';
import { readJson, writeJson } from './jsonStore.js';

const defaultUser = {
  id: 'demo-user',
  name: 'Demo Provider',
  email: 'provider@quotegate.test',
  password: 'password123',
  role: 'provider',
  createdAt: '2026-05-18T12:00:00.000Z',
};

export async function seedUsers() {
  const users = await readJson('users.json');
  if (!users.length) await writeJson('users.json', [defaultUser]);
}

export async function listUsers() {
  await seedUsers();
  return readJson('users.json');
}

export async function loginUser(email, password) {
  await seedUsers();
  const users = await readJson('users.json');
  const user = users.find((item) => item.email.toLowerCase() === String(email || '').trim().toLowerCase() && item.password === password);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }
  const { password: _password, ...safeUser } = user;
  return {
    user: safeUser,
    token: `test-session-${nanoid(18)}`,
  };
}

export async function createUser(input) {
  const users = await listUsers();
  const email = String(input.email || '').trim().toLowerCase();
  if (!email || !input.password || !input.name) {
    const error = new Error('Name, email, and password are required');
    error.status = 400;
    throw error;
  }
  if (users.some((user) => user.email.toLowerCase() === email)) {
    const error = new Error('A user with that email already exists');
    error.status = 400;
    throw error;
  }
  const user = {
    id: nanoid(12),
    name: String(input.name).trim(),
    email,
    password: String(input.password),
    role: 'provider',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeJson('users.json', users);
  const { password: _password, ...safeUser } = user;
  return safeUser;
}
