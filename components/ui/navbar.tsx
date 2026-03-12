import Link from "next/link";

export const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white shadow">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
                <Link href="/" className="hover:text-blue-600">
                    3D Prints
                </Link>
                <div className="hidden md:flex space-x-6">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <Link href="/prints" className="hover:text-blue-600">Prints</Link>
                </div>
            </div>
        </nav>
    );
}