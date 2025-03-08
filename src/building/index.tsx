"use client"

import { BuildingConstruction } from "./components/BuildingConstruction"

export default function BuildingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
            <div className="container mx-auto px-3 py-8 max-w-7xl">
                <header className="flex flex-col justify-center items-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent mb-2" style={{ backgroundImage: "linear-gradient(45.89deg, #FFC6E9 6.48%, #FF6FC8 43.92%, #FFFFFF 100%)" }}>
                        Taiko Network Speed Comparison
                    </h1>
                    <p className="text-center text-gray-600 max-w-2xl">
                        Experience the dramatic difference between Taiko's Preconf Devnet (~800ms) and Hekla (~2000ms)
                        by visualizing how these speeds would affect the construction of famous landmarks.
                    </p>
                </header>

                <BuildingConstruction />

                <div className="mt-8 bg-white p-4 rounded-lg border shadow-sm" style={{ borderImage: "linear-gradient(45.89deg, #FFC6E9 6.48%, #FF6FC8 43.92%, #FFFFFF 100%) 1" }}>
                    <h2 className="text-xl font-semibold mb-3 text-[#FF6FC8]">About This Visualization</h2>
                    <p className="text-gray-700 mb-2">
                        This demonstration helps visualize the performance difference between Taiko's networks by showing how iconic landmarks would be constructed at different speeds.
                    </p>
                    <p className="text-gray-700 mb-2">
                        <span className="font-medium">Preconf Devnet</span> processes blocks in approximately 800ms, while
                        <span className="font-medium"> Taiko Hekla</span> processes blocks in around 2000ms.
                    </p>
                    <p className="text-gray-700">
                        This 2.5× speed improvement makes a dramatic difference in application responsiveness and user experience -
                        just as it would dramatically accelerate construction timelines in our building visualization.
                    </p>
                </div>

                <footer className="mt-12 text-center text-sm text-gray-500">
                    <p>Created to demonstrate the speed difference between Taiko networks</p>
                    <div className="flex justify-center mt-2 space-x-4">
                        <a
                            href="https://taiko.xyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF6FC8] hover:underline"
                        >
                            taiko.xyz
                        </a>
                        <a
                            href="https://discord.gg/taikoxyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF6FC8] hover:underline"
                        >
                            Discord
                        </a>
                        <a
                            href="https://github.com/taikoxyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF6FC8] hover:underline"
                        >
                            GitHub
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    )
}