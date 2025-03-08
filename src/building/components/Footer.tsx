"use client"

export function Footer() {
    return (
        <footer className="w-full border-t py-4 text-sm">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-1 mb-4 md:mb-0">
          <span className="font-medium bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(45.89deg, #FFC6E9 6.48%, #FF6FC8 43.92%, #FFFFFF 100%)" }}>
            Taiko Speed Comparison Demo
          </span>
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 items-center text-gray-600">
                    <a
                        href="https://taiko.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#FF6FC8] transition-colors"
                    >
                        Taiko Website
                    </a>
                    <a
                        href="https://taiko.xyz/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#FF6FC8] transition-colors"
                    >
                        Documentation
                    </a>
                    <a
                        href="https://github.com/taikoxyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#FF6FC8] transition-colors"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://discord.gg/taikoxyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#FF6FC8] transition-colors"
                    >
                        Discord
                    </a>
                </div>
            </div>
        </footer>
    )
}