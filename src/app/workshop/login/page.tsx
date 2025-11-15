import { LoginForm } from "@/components/login-form"
import { Wrench } from 'lucide-react'
import Link from 'next/link'

export default function WorkshopLoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="flex-1 bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 p-8 lg:p-12 flex flex-col justify-between text-white">
        <Link href="/" className="flex items-center gap-2">
          <Wrench className="h-8 w-8 text-amber-400" />
          <span className="text-2xl font-bold">AutoCare+ Workshop</span>
        </Link>

        <div className="my-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Streamline your workshop operations
          </h1>
          <p className="text-lg text-amber-100 max-w-md text-pretty leading-relaxed">
            Manage appointments, track customer vehicles, and deliver exceptional service with our workshop management platform.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-amber-400/20 flex items-center justify-center">
              <span className="text-2xl">🔧</span>
            </div>
            <div>
              <p className="font-semibold">Complete workshop management</p>
              <p className="text-sm text-amber-200">All tools in one place</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm type="workshop" />
        </div>
      </div>
    </div>
  )
}
