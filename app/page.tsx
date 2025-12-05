"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon, User, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#008f80]/70 via-[#008f80]/10 to-gray-50">

      {/* Main Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">

        {/* Left Column: Logo & Welcome */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative w-80 h-70">
              <Image
                src="/logo-gimnasios.png"
                alt="Gimnasios Unidos del Estado de México Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bienvenido</h1>
              <p className="text-gray-500">
                Acceder a GUEM
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#008f80]/90">
          <div className="space-y-6">

            <div className="relative py-2">
              <div className="relative flex justify-center">
                <span className="px-3 text-white text-xl font-medium">Iniciar Sesión</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Correo electrónico</Label>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder="m@ejemplo.com"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-11 pl-10 focus-visible:ring-[#00a896] focus-visible:border-[#00a896]"
                  />
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white font-medium">Contraseña</Label>
                  <Link href="#" className="text-xs text-white hover:text-gray-200 font-medium">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="bg-white border-gray-300 text-gray-400 h-11 pl-10 pr-10 focus-visible:ring-[#00a896] focus-visible:border-[#00a896]"
                  />
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button className="w-full bg-[#0ac5b2]/90 hover:bg-[#008f80]/70 text-white font-bold h-11 shadow-lg shadow-[#00a896]/20 rounded-lg transition-all mt-2">
                Ingresar
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-200">
            <p className=" transition-colors">Powered by Next.js</p>
          </div>
        </div>

      </div>
    </div>
  );
}
