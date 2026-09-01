import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk — Arsip Digital BPKAD Sulawesi Tengah',
  description: 'Login ke sistem Arsip Digital BPKAD Kantor Gubernur Sulawesi Tengah',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
