"use client"

interface EmpireStateProps {
    completedFloors: number;
    totalFloors: number;
}

export function EmpireState({ completedFloors, totalFloors }: EmpireStateProps) {
    // Calculate completion percentage for animation
    const completionPercentage = completedFloors / totalFloors;

    return (
        <div className="relative h-full w-full flex items-end justify-center">
            {/* Building shadow/reflection */}
            <div
                className="absolute bottom-[1%] left-1/2 w-[60%] h-[5px] bg-amber-950/20 blur-md rounded-full transform -translate-x-1/2 transition-opacity duration-1000 ease-in-out"
                style={{ opacity: completionPercentage }}
            />

            <div className="relative h-[98%] w-[30%] flex items-end justify-center">
                {/* Base/Lobby Section */}
                <div
                    className={`absolute bottom-0 w-full h-[10%] transition-all duration-300 ease-out
            ${completedFloors > 0 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{ transitionDelay: "25ms" }}
                >
                    {/* Main base structure */}
                    <div className="absolute inset-0 bg-amber-200 border-2 border-amber-950 overflow-hidden">
                        {/* Entrance details - appears after base */}
                        <div
                            className={`absolute bottom-0 left-[30%] right-[30%] h-[40%] border-t-2 border-l-2 border-r-2 border-amber-950 transition-opacity duration-300
                ${completedFloors > 1 ? "opacity-100" : "opacity-0"}`}
                            style={{ transitionDelay: "50ms" }}
                        ></div>

                        {/* Windows - appear after entrance */}
                        <div
                            className={`absolute top-[20%] left-[5%] right-[5%] h-[40%] flex transition-opacity duration-300
                ${completedFloors > 2 ? "opacity-100" : "opacity-0"}`}
                            style={{ transitionDelay: "75ms" }}
                        >
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={`base-window-${i}`}
                                    className="flex-1 border-l border-r border-amber-950"
                                    style={{
                                        transitionDelay: `${75 + (i * 10)}ms`,
                                        opacity: completedFloors > 2 ? "1" : "0",
                                        transition: "opacity 300ms ease-out"
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Base platform */}
                    <div
                        className={`absolute bottom-[-2px] left-[-10%] right-[-10%] h-[15%] bg-amber-300 border-2 border-amber-950 transition-all duration-300 ease-out
              ${completedFloors > 0 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ transitionDelay: "25ms" }}
                    ></div>
                </div>

                {/* Lower Main Tower (widest section) */}
                <div
                    className={`absolute bottom-[10%] w-[90%] h-[30%] transition-all duration-300 ease-out
            ${completedFloors > 3 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{ transitionDelay: "100ms" }}
                >
                    <div className="absolute inset-0 bg-amber-200 border-2 border-amber-950 overflow-hidden">
                        {/* Window grid pattern - each row appears as floors are completed */}
                        <div className="absolute inset-0 grid grid-cols-6 gap-[2px]">
                            {Array.from({ length: 42 }).map((_, i) => (
                                <div
                                    key={`lower-window-${i}`}
                                    className={`border border-amber-950/50 bg-amber-100/30 transition-opacity duration-300
                    ${completedFloors > 3 + Math.floor(i / 6) ? "opacity-100" : "opacity-0"}`}
                                    style={{ transitionDelay: `${(i * 20) + 100}ms` }}
                                ></div>
                            ))}
                        </div>

                        {/* Horizontal accent lines - appear one by one */}
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={`lower-accent-${i}`}
                                className={`absolute w-full h-[2px] bg-amber-950/50 transition-opacity duration-300
                  ${completedFloors > 4 + i ? "opacity-100" : "opacity-0"}`}
                                style={{
                                    top: `${(i + 1) * 25}%`,
                                    transitionDelay: `${(i * 50) + 150}ms`
                                }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Middle Tower Section */}
                <div
                    className={`absolute bottom-[40%] w-[80%] h-[35%] transition-all duration-300 ease-out
            ${completedFloors > 10 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{ transitionDelay: "300ms" }}
                >
                    <div className="absolute inset-0 bg-amber-200 border-2 border-amber-950 overflow-hidden">
                        {/* Window grid pattern - each row appears as floors are completed */}
                        <div className="absolute inset-0 grid grid-cols-5 gap-[2px]">
                            {Array.from({ length: 35 }).map((_, i) => (
                                <div
                                    key={`mid-window-${i}`}
                                    className={`border border-amber-950/50 bg-amber-100/30 transition-opacity duration-300
                    ${completedFloors > 10 + Math.floor(i / 5) ? "opacity-100" : "opacity-0"}`}
                                    style={{ transitionDelay: `${(i * 20) + 300}ms` }}
                                ></div>
                            ))}
                        </div>

                        {/* Horizontal accent lines - appear one by one */}
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={`mid-accent-${i}`}
                                className={`absolute w-full h-[2px] bg-amber-950/50 transition-opacity duration-300
                  ${completedFloors > 11 + i ? "opacity-100" : "opacity-0"}`}
                                style={{
                                    top: `${(i + 1) * 25}%`,
                                    transitionDelay: `${(i * 50) + 350}ms`
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Setback details on sides - appear after main structure */}
                    <div
                        className={`absolute bottom-0 left-[-5%] w-[5%] h-[20%] bg-amber-200 border-2 border-amber-950 transition-opacity duration-300
              ${completedFloors > 15 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "400ms" }}
                    ></div>
                    <div
                        className={`absolute bottom-0 right-[-5%] w-[5%] h-[20%] bg-amber-200 border-2 border-amber-950 transition-opacity duration-300
              ${completedFloors > 15 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "425ms" }}
                    ></div>
                </div>

                {/* Upper Tower Section */}
                <div
                    className={`absolute bottom-[75%] w-[60%] h-[15%] transition-all duration-300 ease-out
            ${completedFloors > 20 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{ transitionDelay: "500ms" }}
                >
                    <div className="absolute inset-0 bg-amber-200 border-2 border-amber-950 overflow-hidden">
                        {/* Window grid pattern - each row appears as floors are completed */}
                        <div className="absolute inset-0 grid grid-cols-4 gap-[2px]">
                            {Array.from({ length: 16 }).map((_, i) => (
                                <div
                                    key={`upper-window-${i}`}
                                    className={`border border-amber-950/50 bg-amber-100/30 transition-opacity duration-300
                    ${completedFloors > 20 + Math.floor(i / 4) ? "opacity-100" : "opacity-0"}`}
                                    style={{ transitionDelay: `${(i * 20) + 500}ms` }}
                                ></div>
                            ))}
                        </div>

                        {/* Horizontal accent lines - appear one by one */}
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div
                                key={`upper-accent-${i}`}
                                className={`absolute w-full h-[2px] bg-amber-950/50 transition-opacity duration-300
                  ${completedFloors > 21 + i ? "opacity-100" : "opacity-0"}`}
                                style={{
                                    top: `${(i + 1) * 33}%`,
                                    transitionDelay: `${(i * 50) + 550}ms`
                                }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Crown Section */}
                <div
                    className={`absolute bottom-[90%] w-[40%] h-[5%] transition-all duration-300 ease-out
            ${completedFloors > 28 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{ transitionDelay: "700ms" }}
                >
                    <div className="absolute inset-0 bg-amber-300 border-2 border-amber-950">
                        {/* Crown details - appear one by one */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={`crown-detail-${i}`}
                                className={`absolute w-full h-[2px] bg-amber-950/70 transition-opacity duration-300
                  ${completedFloors > 28 + Math.floor(i / 2) ? "opacity-100" : "opacity-0"}`}
                                style={{
                                    top: `${(i + 1) * 16}%`,
                                    transitionDelay: `${(i * 30) + 725}ms`
                                }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Observation Deck */}
                <div
                    className={`absolute bottom-[95%] w-[25%] h-[3%] transition-all duration-300 ease-out
            ${completedFloors > 30 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{ transitionDelay: "800ms" }}
                >
                    <div className="absolute inset-0 bg-amber-400 border-2 border-amber-950 rounded-sm"></div>
                </div>

                {/* Spire/Antenna */}
                <div
                    className={`absolute bottom-[98%] w-[5%] h-[10%] transition-all duration-700 ease-out
            ${completedFloors >= totalFloors ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
                    style={{
                        transformOrigin: "bottom",
                        transitionDelay: "900ms"
                    }}
                >
                    {/* Main spire */}
                    <div
                        className={`absolute bottom-0 left-0 right-0 h-[30%] bg-amber-400 border border-amber-950 transition-opacity duration-300
              ${completedFloors >= totalFloors - 1 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "925ms" }}
                    ></div>

                    {/* Antenna */}
                    <div
                        className={`absolute bottom-[30%] left-1/2 w-[2px] h-[70%] bg-amber-950 transform -translate-x-1/2 transition-opacity duration-300
              ${completedFloors >= totalFloors ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "950ms" }}
                    ></div>

                    {/* Beacon light */}
                    <div
                        className={`absolute bottom-[100%] left-1/2 w-[4px] h-[4px] bg-red-500 rounded-full transform -translate-x-1/2 animate-pulse transition-opacity duration-300
              ${completedFloors >= totalFloors ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "975ms" }}
                    ></div>
                </div>

                {/* Side setbacks - these create the distinctive Empire State Building profile */}
                {/* Lower setbacks */}
                <div
                    className={`absolute bottom-[10%] left-[90%] w-[10%] h-[10%] bg-amber-200 border-2 border-t-0 border-l-0 border-amber-950 transition-opacity duration-300`}
                    style={{
                        opacity: completedFloors > 8 ? "1" : "0",
                        transitionDelay: "250ms"
                    }}
                ></div>
                <div
                    className={`absolute bottom-[10%] right-[90%] w-[10%] h-[10%] bg-amber-200 border-2 border-t-0 border-r-0 border-amber-950 transition-opacity duration-300`}
                    style={{
                        opacity: completedFloors > 9 ? "1" : "0",
                        transitionDelay: "275ms"
                    }}
                ></div>

                {/* Middle setbacks */}
                <div
                    className={`absolute bottom-[40%] left-[80%] w-[10%] h-[10%] bg-amber-200 border-2 border-t-0 border-l-0 border-amber-950 transition-opacity duration-300`}
                    style={{
                        opacity: completedFloors > 17 ? "1" : "0",
                        transitionDelay: "450ms"
                    }}
                ></div>
                <div
                    className={`absolute bottom-[40%] right-[80%] w-[10%] h-[10%] bg-amber-200 border-2 border-t-0 border-r-0 border-amber-950 transition-opacity duration-300`}
                    style={{
                        opacity: completedFloors > 18 ? "1" : "0",
                        transitionDelay: "475ms"
                    }}
                ></div>

                {/* Upper setbacks */}
                <div
                    className={`absolute bottom-[75%] left-[60%] w-[10%] h-[10%] bg-amber-200 border-2 border-t-0 border-l-0 border-amber-950 transition-opacity duration-300`}
                    style={{
                        opacity: completedFloors > 24 ? "1" : "0",
                        transitionDelay: "600ms"
                    }}
                ></div>
                <div
                    className={`absolute bottom-[75%] right-[60%] w-[10%] h-[10%] bg-amber-200 border-2 border-t-0 border-r-0 border-amber-950 transition-opacity duration-300`}
                    style={{
                        opacity: completedFloors > 25 ? "1" : "0",
                        transitionDelay: "625ms"
                    }}
                ></div>
            </div>
        </div>
    );
}