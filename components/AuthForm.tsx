'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginDemoAccount, registerDemoAccount } from '@/lib/demo-auth';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const registering = mode === 'register';
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');
    setError('');
    submitting.current = true;
    setBusy(true);
    try {
      if (registering) {
        if (password !== data.get('confirmation')) throw new Error('Konfirmasi password belum sama.');
        await registerDemoAccount({ email, password, name: String(data.get('name') || ''), phone: String(data.get('phone') || '') });
      } else {
        await loginDemoAccount(email, password);
      }
      router.replace('/customer');
    } catch (err) {
      setError(err instanceof Error && !(err instanceof DOMException) ? err.message : 'Akun belum dapat diproses. Pastikan penyimpanan browser tersedia, lalu coba lagi.');
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return <main className="auth-page">
    <section className="auth-story" aria-label="Salon di rumah">
      <img src="/images/hero/spa-treatment.jpg" alt="Perawatan wajah profesional" className="auth-photo" />
      <div className="auth-shade" />
      <Link href="/login" className="auth-brand">Salon <span>/ at home</span></Link>
      <div className="auth-story-copy"><p>PERAWATAN YANG LEBIH PERSONAL</p><h2>Waktu untukmu.<br />Nyaman di rumah.</h2><span>Temukan layanan dan produk pilihan untuk rutinitas perawatanmu.</span></div>
    </section>
    <section className="auth-content">
      <div className="auth-form-wrap">
        <Link href="/login" className="auth-mobile-brand">Salon <span>/ at home</span></Link>
        <div className="auth-tabs" aria-label="Akses akun"><Link href="/login" aria-current={!registering ? 'page' : undefined}>Masuk</Link><Link href="/register" aria-current={registering ? 'page' : undefined}>Daftar</Link></div>
        <header className="mb-7"><h1 className="text-3xl font-serif">{registering ? 'Mulai merawat dirimu.' : 'Selamat datang kembali.'}</h1><p className="text-sm text-text-secondary mt-3 leading-relaxed">{registering ? 'Buat akun untuk memesan layanan dan menyimpan alamatmu.' : 'Masuk untuk melanjutkan pemesanan dan melihat aktivitas akunmu.'}</p></header>
        <form onSubmit={submit} className="auth-form">
          {error && <p ref={errorRef} tabIndex={-1} role="alert" className="auth-error">{error}</p>}
          <fieldset disabled={busy} className="space-y-5">
            {registering && <label htmlFor="name">Nama lengkap<input id="name" name="name" autoComplete="name" placeholder="Nama lengkapmu" required maxLength={100} pattern=".*\S.*" /></label>}
            <label htmlFor="email">Email<input id="email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" required maxLength={254} /></label>
            {registering && <label htmlFor="phone">Nomor telepon<input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="0812 3456 7890" required pattern="[+0-9 ()-]{8,20}" title="Masukkan 8–20 karakter nomor telepon." /></label>}
            <label htmlFor="password">Password<div className="auth-password"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={registering ? 'new-password' : 'current-password'} placeholder={registering ? 'Minimal 8 karakter' : 'Masukkan password'} minLength={registering ? 8 : undefined} maxLength={128} required aria-describedby={registering ? 'password-help' : undefined} /><button type="button" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} aria-pressed={showPassword} onClick={() => setShowPassword(s => !s)}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>
            {registering && <><p id="password-help" className="text-xs text-text-secondary !mt-2">Gunakan minimal 8 karakter untuk password akun demo.</p><label htmlFor="confirmation">Konfirmasi password<input id="confirmation" name="confirmation" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Ulangi password" required maxLength={128} /></label></>}
            <button type="submit" className="auth-submit">{busy ? <><Loader2 size={18} className="animate-spin" />Memproses...</> : <>{registering ? 'Buat akun' : 'Masuk'}<ArrowRight size={18} /></>}</button>
          </fieldset>
        </form>
        <p className="text-sm text-text-secondary text-center mt-6">{registering ? 'Sudah punya akun?' : 'Belum punya akun?'} <Link href={registering ? '/login' : '/register'} className="text-primary font-semibold underline underline-offset-4">{registering ? 'Masuk' : 'Daftar sekarang'}</Link></p>
        <div className="auth-demo"><p>Akun demo tersimpan di browser ini.</p><Link href="/demo">Coba akun contoh tanpa mendaftar <ArrowRight size={14} /></Link></div>
      </div>
    </section>
  </main>;
}
