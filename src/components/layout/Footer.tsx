import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
                                <span className="font-bold leading-none tracking-tighter">TH</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">TechieHub</span>
                        </Link>
                        <p className="mt-4 max-w-md text-sm text-gray-500 leading-relaxed">
                            The premier discovery platform for technology events, hackathons, and developer meetups in Karachi, Pakistan.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Platform</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="/home" className="text-sm text-gray-500 hover:text-black transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="text-sm text-gray-500 hover:text-black transition-colors">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link href="/communities" className="text-sm text-gray-500 hover:text-black transition-colors">
                                    Communities
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/about"
                                    className="text-sm text-gray-500 hover:text-black transition-colors"
                                >
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="/privacy" className="text-sm text-gray-500 hover:text-black transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-gray-500 hover:text-black transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} TechieHub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
