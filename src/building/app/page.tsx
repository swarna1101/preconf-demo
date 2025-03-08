"use client"

import { BuildingConstruction } from "../components/BuildingConstruction"
import { Footer } from "../components/Footer"

export default function BuildingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pink-50">
            <div className="container mx-auto px-3 py-8 max-w-7xl flex-grow">
                <header className="flex flex-col justify-center items-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(45.89deg, #FFC6E9 6.48%, #FF6FC8 43.92%, #FFFFFF 100%)" }}>
                        Taiko Network Speed Comparison
                    </h1>
                    <p className="text-center text-gray-600 max-w-2xl">
                        Experience the dramatic difference between Taiko's Preconf Devnet (~800ms) and Hekla (~2000ms)
                        by visualizing how these speeds would affect the construction of famous landmarks.
                    </p>
                </header>

                <BuildingConstruction />

                <div className="mt-8 bg-white p-4 rounded-lg shadow-sm" style={{ border: "1px solid", borderImageSlice: 1, borderImageSource: "linear-gradient(45.89deg, #FFC6E9 6.48%, #FF6FC8 43.92%, #FFFFFF 100%)" }}>
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

                <div className="mt-8 p-4 rounded-lg bg-white shadow-sm" style={{ border: "1px solid", borderImageSlice: 1, borderImageSource: "linear-gradient(45.89deg, #FFC6E9 6.48%, #FF6FC8 43.92%, #FFFFFF 100%)" }}>
                    <h2 className="text-xl font-semibold mb-3 text-[#FF6FC8]">Why Block Speed Matters</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded">
                            <h3 className="font-medium mb-2">Improved User Experience</h3>
                            <p className="text-sm text-gray-700">
                                Faster block times mean quicker transaction confirmations, resulting in more
                                responsive dApps and a smoother user experience that feels more like traditional web applications.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <h3 className="font-medium mb-2">Higher Throughput</h3>
                            <p className="text-sm text-gray-700">
                                With 2.5× faster block times, Preconf Devnet can process more transactions per second
                                than Hekla, enabling more scalable applications and services.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <h3 className="font-medium mb-2">Reduced Waiting Times</h3>
                            <p className="text-sm text-gray-700">
                                Just like in our building demonstration, faster blocks dramatically reduce waiting times
                                for transaction confirmations, making applications more interactive.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <h3 className="font-medium mb-2">Better Developer Experience</h3>
                            <p className="text-sm text-gray-700">
                                Developers can test and iterate on their applications faster, leading to
                                more rapid development cycles and improved productivity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}