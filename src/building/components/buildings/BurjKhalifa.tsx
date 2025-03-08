"use client"

interface BurjKhalifaProps {
    completedFloors: number;
    totalFloors: number;
}

export function BurjKhalifa({ completedFloors, totalFloors }: BurjKhalifaProps) {
    return (
        <div className="relative h-full w-full flex items-end justify-center">
            {/* Building shadow/reflection */}
            <div
                className="absolute bottom-[1%] left-1/2 w-[60%] h-[5px] bg-sky-950/20 blur-md rounded-full transform -translate-x-1/2 transition-opacity duration-1000 ease-in-out"
                style={{
                    opacity: completedFloors / totalFloors
                }}
            />

            <div className="relative h-[98%] w-[25%] flex items-end justify-center">
                {/* Base Section - Widest part with 3 tiers */}
                <div className="absolute bottom-0 w-full h-[20%]">
                    {/* First tier - widest */}
                    <div
                        className={`absolute bottom-0 w-full h-[30%] transition-all duration-300 ease-out
              ${completedFloors > 0 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "25ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Horizontal lines */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={`base-h-${i}`} className="absolute w-full h-[1px] bg-sky-900/20" style={{ top: `${(i + 1) * 25}%` }} />
                            ))}
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>

                    {/* Second tier */}
                    <div
                        className={`absolute bottom-[30%] w-[85%] left-[7.5%] h-[30%] transition-all duration-300 ease-out
              ${completedFloors > 2 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "75ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Horizontal lines */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={`base2-h-${i}`} className="absolute w-full h-[1px] bg-sky-900/20" style={{ top: `${(i + 1) * 25}%` }} />
                            ))}
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>

                    {/* Third tier */}
                    <div
                        className={`absolute bottom-[60%] w-[70%] left-[15%] h-[40%] transition-all duration-300 ease-out
              ${completedFloors > 4 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "125ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Horizontal lines */}
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={`base3-h-${i}`} className="absolute w-full h-[1px] bg-sky-900/20" style={{ top: `${(i + 1) * 20}%` }} />
                            ))}
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>
                </div>

                {/* Middle Section - 3 cylindrical sections with mechanical band */}
                <div className="absolute bottom-[20%] w-[60%] h-[30%]">
                    {/* First cylindrical section */}
                    <div
                        className={`absolute bottom-0 w-full h-[30%] transition-all duration-300 ease-out
              ${completedFloors > 6 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "175ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Horizontal lines */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={`mid1-h-${i}`} className="absolute w-full h-[1px] bg-sky-900/20" style={{ top: `${(i + 1) * 25}%` }} />
                            ))}
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>

                    {/* Mechanical band */}
                    <div
                        className={`absolute bottom-[30%] w-full h-[5%] bg-sky-800 border-t border-b border-sky-900 transition-all duration-300 ease-out
              ${completedFloors > 9 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "225ms" }}
                    />

                    {/* Second cylindrical section */}
                    <div
                        className={`absolute bottom-[35%] w-full h-[30%] transition-all duration-300 ease-out
              ${completedFloors > 10 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "250ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Horizontal lines */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={`mid2-h-${i}`} className="absolute w-full h-[1px] bg-sky-900/20" style={{ top: `${(i + 1) * 25}%` }} />
                            ))}
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>

                    {/* Mechanical band */}
                    <div
                        className={`absolute bottom-[65%] w-full h-[5%] bg-sky-800 border-t border-b border-sky-900 transition-all duration-300 ease-out
              ${completedFloors > 13 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "325ms" }}
                    />

                    {/* Third cylindrical section */}
                    <div
                        className={`absolute bottom-[70%] w-full h-[30%] transition-all duration-300 ease-out
              ${completedFloors > 14 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "350ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Horizontal lines */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={`mid3-h-${i}`} className="absolute w-full h-[1px] bg-sky-900/20" style={{ top: `${(i + 1) * 25}%` }} />
                            ))}
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>
                </div>

                {/* Upper Section - 3 cylindrical sections with mechanical bands */}
                <div className="absolute bottom-[50%] w-[45%] h-[30%]">
                    {/* First cylindrical section */}
                    <div
                        className={`absolute bottom-0 w-full h-[30%] transition-all duration-300 ease-out
              ${completedFloors > 17 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "425ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Horizontal lines */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={`upper1-h-${i}`} className="absolute w-full h-[1px] bg-sky-900/20" style={{ top: `${(i + 1) * 25}%` }} />
                            ))}
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>

                    {/* Mechanical band */}
                    <div
                        className={`absolute bottom-[30%] w-full h-[5%] bg-sky-800 border-t border-b border-sky-900 transition-all duration-300 ease-out
              ${completedFloors > 20 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "500ms" }}
                    />

                    {/* Second cylindrical section */}
                    <div
                        className={`absolute bottom-[35%] w-full h-[30%] transition-all duration-300 ease-out
              ${completedFloors > 21 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "525ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Horizontal lines */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={`upper2-h-${i}`} className="absolute w-full h-[1px] bg-sky-900/20" style={{ top: `${(i + 1) * 25}%` }} />
                            ))}
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>

                    {/* Mechanical band */}
                    <div
                        className={`absolute bottom-[65%] w-full h-[5%] bg-sky-800 border-t border-b border-sky-900 transition-all duration-300 ease-out
              ${completedFloors > 24 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "600ms" }}
                    />

                    {/* Third cylindrical section */}
                    <div
                        className={`absolute bottom-[70%] w-full h-[30%] transition-all duration-300 ease-out
              ${completedFloors > 25 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "625ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Horizontal lines */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={`upper3-h-${i}`} className="absolute w-full h-[1px] bg-sky-900/20" style={{ top: `${(i + 1) * 25}%` }} />
                            ))}
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>
                </div>

                {/* Top Section - 3 smaller cylindrical sections */}
                <div className="absolute bottom-[80%] w-[30%] h-[15%]">
                    {/* First cylindrical section */}
                    <div
                        className={`absolute bottom-0 w-full h-[30%] transition-all duration-300 ease-out
              ${completedFloors > 28 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "700ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>

                    {/* Second cylindrical section */}
                    <div
                        className={`absolute bottom-[30%] w-[80%] left-[10%] h-[30%] transition-all duration-300 ease-out
              ${completedFloors > 30 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "750ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>

                    {/* Third cylindrical section */}
                    <div
                        className={`absolute bottom-[60%] w-[60%] left-[20%] h-[40%] transition-all duration-300 ease-out
              ${completedFloors > 32 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "800ms" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-300 border border-sky-900/50 rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex">
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full border-r border-sky-900/30" />
                                <div className="w-1/3 h-full" />
                            </div>
                            {/* Sparkle texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-sky-100/10 [background-size:8px_8px]" />
                        </div>
                    </div>
                </div>

                {/* Spire */}
                <div
                    className={`absolute bottom-[95%] left-1/2 w-[2px] h-[15%] bg-sky-900 transform -translate-x-1/2
            transition-all duration-700 ease-out
            ${completedFloors >= totalFloors ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
                    style={{
                        transformOrigin: "bottom",
                        transitionDelay: "850ms"
                    }}
                />
            </div>
        </div>
    );
}