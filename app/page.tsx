import { redirect } from 'next/navigation';

export default function Home() {
  // Langsung arahkan user ke halaman login saat buka route '/'
  redirect('/Login');
}