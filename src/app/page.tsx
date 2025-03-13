import Link from 'next/link'
import { WikiLayout } from '@/components/layout/WikiLayout'

export default function Home() {
  return (
    <WikiLayout>
      <div className="relative py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Welcome to the <span className="text-blue-600 dark:text-blue-400">Company Wiki</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your centralized resource for documentation, HIPAA compliance, and standard operating procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Company Wiki Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Company Wiki</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              General company information, team structure, and organizational resources.
            </p>
            <Link 
              href="/wiki/company-wiki"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              Browse Company Wiki →
            </Link>
          </div>

          {/* HIPAA Documentation Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">HIPAA Compliance</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Comprehensive HIPAA compliance documentation, technical requirements, and implementation guides.
            </p>
            <Link 
              href="/wiki/hipaa"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              Browse HIPAA Documentation →
            </Link>
          </div>

          {/* SOPs Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Standard Operating Procedures</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Standardized processes and procedures for engineering, compliance, and operational tasks.
            </p>
            <Link 
              href="/wiki/sop"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              Browse SOPs →
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 p-6 border border-blue-100 dark:border-blue-800">
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">Recent Updates</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 mr-2 text-sm">
                •
              </span>
              <div>
                <p className="text-gray-800 dark:text-gray-200">Added HIPAA compliance documentation — March 10, 2025</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 mr-2 text-sm">
                •
              </span>
              <div>
                <p className="text-gray-800 dark:text-gray-200">Created Company Wiki — March 13, 2025</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </WikiLayout>
  )
}
