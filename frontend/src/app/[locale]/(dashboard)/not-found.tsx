import Link from "next/link"
import { BookOpen, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-200 rounded-full mb-4">
            <BookOpen className="w-10 h-10 text-neutral-600" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-neutral-800 mb-2">404</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-neutral-700 mb-4">Page Not Found</h2>

        {/* Description */}
        <p className="text-neutral-600 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist in our library. It might have been moved, deleted, or you entered
          the wrong URL.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Library
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="javascript:history.back()">Go Back</Link>
          </Button>
        </div>

        {/* Footer text */}
        <p className="text-sm text-neutral-500 mt-8">Need help? Contact our support team.</p>
      </div>
    </div>
  )
}
