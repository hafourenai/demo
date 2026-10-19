import useAppStore from './store';
import { Customer } from './types';

// Browser-only demo credentials. This is not a server authentication boundary.
const KEY = 'salon-demo-credentials-v1';
type Credential = { customerId: string; salt: string; hash: string };
const credentials = (): Credential[] => JSON.parse(localStorage.getItem(KEY) || '[]');
const hex = (bytes: Uint8Array) => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');

async function derive(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 210000 }, key, 256);
  return hex(new Uint8Array(bits));
}

export async function registerDemoAccount(data: { name: string; email: string; phone: string; password: string }) {
  const email = data.email.trim().toLowerCase();
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  const hash = await derive(data.password, salt);
  const store = useAppStore.getState();
  if (store.customers.some(c => c.email.toLowerCase() === email)) throw new Error('Email sudah terdaftar. Gunakan email lain atau masuk ke akunmu.');
  const customer: Customer = {
    id: crypto.randomUUID(), name: data.name.trim(), email, phone: data.phone.trim(),
    role: 'customer', createdAt: new Date(), addresses: [], wishlist: [], reviews: [],
  };
  localStorage.setItem(KEY, JSON.stringify([...credentials(), { customerId: customer.id, salt, hash }]));
  useAppStore.setState({ customers: [...store.customers, customer] });
  store.login(customer);
}

export async function loginDemoAccount(email: string, password: string) {
  const customer = useAppStore.getState().customers.find(c => c.email.toLowerCase() === email.trim().toLowerCase());
  const credential = credentials().find(c => c.customerId === customer?.id);
  if (!customer || !credential || await derive(password, credential.salt) !== credential.hash) {
    throw new Error('Email atau password tidak sesuai. Coba periksa kembali.');
  }
  useAppStore.getState().login(customer);
}
