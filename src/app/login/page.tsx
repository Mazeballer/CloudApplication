import { LoginForm } from "@/components/login-form"
import { Car } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-12 flex flex-col justify-between text-white">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">AutoCare+</span>
        </Link>

        <div className="my-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Welcome back to smarter vehicle care
          </h1>
          <p className="text-lg text-slate-300 max-w-md text-pretty leading-relaxed">
            Access your vehicle dashboard, maintenance schedule, and service history all in one place.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
            <div>
              <p className="font-semibold">Cloud-powered insights</p>
              <p className="text-sm text-slate-400">AWS-backed intelligence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm type="driver" />
        </div>
      </div>
    </div>
  )
}
