import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-4">



      {/* Main Card */}
      <div className="w-full max-w-1/4  space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center gap-3 text-gray-700">
          <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm">
            <span className="font-bold text-sm text-[#00a896]">FMG</span>
          </div>
          <div>
            <span className="font-medium text-lg">Federación Mexicana de Gimnasia</span>
          </div>

        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Bienvenido</h1>
          <p className="text-sm text-gray-500">
            Inicia sesión para acceder a la Intranet
          </p>
        </div>

        <div className="space-y-4">


          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Credenciales</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Correo electrónico</Label>
              <Input
                id="email"
                placeholder="m@ejemplo.com"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#00a896] focus-visible:border-[#00a896]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
                <Link href="#" className="text-xs text-gray-500 hover:text-[#00a896]">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                className="bg-white border-gray-300 text-gray-900 focus-visible:ring-[#00a896] focus-visible:border-[#00a896]"
              />
            </div>

            <Button className="w-full bg-[#00a896] hover:bg-[#008f80] text-white font-medium h-10 shadow-md shadow-[#00a896]/20">
              Ingresar
            </Button>
          </div>
        </div>

      </div>

      {/* Footer Legal */}
      <div className="mt-8 text-center text-xs text-gray-500 max-w-xs">
        <Link href="#" className="underline hover:text-gray-800">Powered by</Link>

        <Link href="#" className="underline hover:text-gray-800">Next.js</Link>.
      </div>
    </div>
  );
}
