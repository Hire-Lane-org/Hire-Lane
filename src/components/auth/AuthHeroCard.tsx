"use client";

import React from "react";
import Image from "next/image";

interface AuthHeroCardProps {
  imageSrc: string;
}

export const AuthHeroCard: React.FC<AuthHeroCardProps> = ({ imageSrc }) => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-full h-[660px] max-w-[500px] rounded-3xl overflow-hidden shadow-2xl p-8 bg-slate-900">
      {/* Hero Photo with Gradient Overlay */}
      <Image
        src={imageSrc}
        alt="HireLane Workspace"
        fill
        className="object-cover object-center opacity-85"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* Top Brand Logo */}
      <div className="relative z-10">
        <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md shadow-sm">
          <Image
            src="/logo.png"
            alt="HireLane"
            width={110}
            height={24}
            className="h-6 w-auto object-contain"
          />
        </div>
      </div>

      {/* Bottom Tagline Overlay */}
      <div className="relative z-10 text-white space-y-3">
        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
          TRACK. PREPARE.<br />
          GET HIRED.
        </h2>
        <p className="text-sm text-white/80 font-normal leading-relaxed max-w-sm">
          Organize your applications, track interviews, and ace your dream job.
        </p>
      </div>
    </div>
  );
};
