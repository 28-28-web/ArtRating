"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function onLogin() {
    const res = await signIn("credentials", { phone, password, redirect: false });
    if (res?.ok) {
      setStatus("লগইন সফল");
      router.push("/");
    } else {
      setStatus("ফোন বা পাসওয়ার্ড সঠিক নয়");
    }
  }

  return (
    <main className="mx-auto w-full max-w-md space-y-4 p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold">লগইন</h1>
      <section className="rounded-3xl card-glow p-4 sm:p-6">
        <div className="space-y-3">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" placeholder="মোবাইল নম্বর" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" placeholder="পাসওয়ার্ড" />
          <button onClick={onLogin} className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(34,197,94,0.14)]">লগইন করুন</button>
          {status ? <p className="text-sm font-bold text-zinc-300">{status}</p> : null}
        </div>
      </section>
    </main>
  );
}
