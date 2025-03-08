"use client"

interface EiffelTowerProps {
    completedFloors: number;
    totalFloors: number;
}

export function EiffelTower({ completedFloors, totalFloors }: EiffelTowerProps) {
    // Calculate completion percentage for animation
    const completionPercentage = completedFloors / totalFloors;

    return (
        <div className="relative h-full w-full flex items-end justify-center">
            {/* Tower shadow/reflection */}
            <div
                className="absolute bottom-[1%] left-1/2 w-[60%] h-[5px] bg-zinc-950/20 blur-md rounded-full transform -translate-x-1/2 transition-opacity duration-1000 ease-in-out"
                style={{ opacity: completionPercentage }}
            />

            {/* Main Tower Structure */}
            <div className="relative h-[98%] w-[35%] flex items-end justify-center">
                {/* Base section with legs and arch */}
                <div
                    className={`absolute bottom-0 w-full h-[25%] transition-all duration-300 ease-out rotate-180
            ${completedFloors > 0 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{ transitionDelay: "25ms" }}
                >
                    {/* Left leg */}
                    <div
                        className={`absolute bottom-0 left-0 w-[30%] h-full transition-opacity duration-300
              ${completedFloors > 1 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "50ms" }}
                    >
                        <div className="absolute bottom-0 w-full h-full bg-zinc-800 border-2 border-zinc-900 transform origin-bottom skew-x-[12deg]"></div>
                    </div>

                    {/* Right leg */}
                    <div
                        className={`absolute bottom-0 right-0 w-[30%] h-full transition-opacity duration-300
              ${completedFloors > 2 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "75ms" }}
                    >
                        <div className="absolute bottom-0 w-full h-full bg-zinc-800 border-2 border-zinc-900 transform origin-bottom skew-x-[-12deg]"></div>
                    </div>

                    {/* Arch */}
                    <div
                        className={`absolute bottom-0 left-[30%] right-[30%] h-[50%] overflow-hidden transition-opacity duration-300
              ${completedFloors > 3 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "100ms" }}
                    >
                        <div className="absolute bottom-[-35%] left-[-25%] right-[-25%] h-[200%] border-b-0 border-4 border-zinc-900 rounded-[50%] bg-transparent "></div>
                    </div>

                    {/* Cross beams in base */}
                    <div
                        className={`absolute bottom-[25%] left-[25%] right-[25%] h-[25%] transition-opacity duration-300
              ${completedFloors > 4 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "125ms" }}
                    >
                        <div
                            className={`absolute inset-x-0 top-0 h-[20%] border-t-2 border-zinc-900 transition-opacity duration-300
                ${completedFloors > 4 ? "opacity-100" : "opacity-0"}`}
                            style={{ transitionDelay: "150ms" }}
                        ></div>
                        <div
                            className={`absolute inset-x-0 bottom-0 h-[20%] border-b-2 border-zinc-900 transition-opacity duration-300
                ${completedFloors > 5 ? "opacity-100" : "opacity-0"}`}
                            style={{ transitionDelay: "175ms" }}
                        ></div>
                    </div>

                    {/* First platform/observation deck */}
                    <div
                        className={`absolute bottom-0 left-[-5%] right-[-5%] h-[8%] bg-zinc-800 border-t-2 border-b-2 border-zinc-900 transition-opacity duration-300
              ${completedFloors > 8 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "250ms" }}
                    ></div>
                </div>

                {/* Middle-lower section */}
                <div
                    className={`absolute bottom-[25%] w-[60%] h-[30%] transition-all duration-300 ease-out rotate-180
            ${completedFloors > 9 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{ transitionDelay: "275ms" }}
                >
                    {/* Left side */}
                    <div
                        className={`absolute bottom-0 left-0 w-[10%] h-full bg-zinc-800 border-2 border-zinc-900 transform origin-bottom skew-x-[5deg] transition-opacity duration-300
              ${completedFloors > 10 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "300ms" }}
                    ></div>

                    {/* Right side */}
                    <div
                        className={`absolute bottom-0 right-0 w-[10%] h-full bg-zinc-800 border-2 border-zinc-900 transform origin-bottom skew-x-[-5deg] transition-opacity duration-300
              ${completedFloors > 11 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "325ms" }}
                    ></div>

                    {/* Simple cross pattern */}
                    <div className="absolute inset-y-0 left-[10%] right-[10%]">
                        {/* Horizontal lines */}
                        <div
                            className={`absolute top-[33%] inset-x-0 h-[2px] bg-zinc-900 transition-opacity duration-300
                ${completedFloors > 12 ? "opacity-100" : "opacity-0"}`}
                            style={{ transitionDelay: "350ms" }}
                        ></div>
                        <div
                            className={`absolute top-[66%] inset-x-0 h-[2px] bg-zinc-900 transition-opacity duration-300
                ${completedFloors > 13 ? "opacity-100" : "opacity-0"}`}
                            style={{ transitionDelay: "375ms" }}
                        ></div>
                    </div>

                    {/* Second platform/observation deck */}
                    <div
                        className={`absolute bottom-0 left-[-5%] right-[-5%] h-[5%] bg-zinc-800 border-t-2 border-b-2 border-zinc-900 transition-opacity duration-300
              ${completedFloors > 17 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "550ms" }}
                    ></div>
                </div>

                {/* Middle-upper section */}
                <div
                    className={`absolute bottom-[55%] w-[35%] h-[30%] transition-all duration-300 ease-out
            ${completedFloors > 18 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{ transitionDelay: "575ms" }}
                >
                    {/* Main structure */}
                    <div className="absolute inset-0 bg-zinc-800 border-2 border-zinc-900">
                        {/* Simple diamond pattern - resembling the second reference image */}
                        <div className="absolute inset-0 flex flex-col">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={`diamond-${i}`}
                                    className="flex-1 border-zinc-900 border-b border-t relative"
                                    style={{
                                        transitionDelay: `${600 + (i * 25)}ms`,
                                        opacity: completedFloors > 18 + i ? "1" : "0",
                                        transition: "opacity 300ms ease-out"
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                            className="w-[70%] h-[60%] border-2 border-zinc-900 rotate-45 bg-zinc-700/10"
                                            style={{
                                                transitionDelay: `${625 + (i * 25)}ms`,
                                                opacity: completedFloors > 18 + i ? "1" : "0",
                                                transition: "opacity 300ms ease-out"
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Third platform/observation deck */}
                    <div
                        className={`absolute bottom-0 left-[-7%] right-[-7%] h-[5%] bg-zinc-800 border-t-2 border-b-2 border-zinc-900 transition-opacity duration-300
              ${completedFloors > 22 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "700ms" }}
                    ></div>
                </div>

                {/* Top section */}
                <div
                    className={`absolute bottom-[85%] w-[15%] h-[15%] transition-all duration-300 ease-out
            ${completedFloors > 23 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{ transitionDelay: "725ms" }}
                >
                    {/* Top structure - simplified like in the references */}
                    <div className="absolute inset-0">
                        <div
                            className={`absolute inset-x-0 bottom-0 h-[70%] bg-zinc-800 border-2 border-zinc-900 transition-opacity duration-300
                ${completedFloors > 24 ? "opacity-100" : "opacity-0"}`}
                            style={{ transitionDelay: "750ms" }}
                        >
                            {/* Simplified pattern */}
                            <div className="absolute inset-0 flex flex-col justify-around">
                                <div
                                    className={`w-full h-[2px] bg-zinc-900 transition-opacity duration-300
                    ${completedFloors > 25 ? "opacity-100" : "opacity-0"}`}
                                    style={{ transitionDelay: "775ms" }}
                                ></div>
                                <div
                                    className={`w-full h-[2px] bg-zinc-900 transition-opacity duration-300
                    ${completedFloors > 26 ? "opacity-100" : "opacity-0"}`}
                                    style={{ transitionDelay: "800ms" }}
                                ></div>
                            </div>
                        </div>

                        {/* Top cap/platform */}
                        <div
                            className={`absolute bottom-[70%] inset-x-[20%] h-[15%] bg-zinc-800 border-2 border-zinc-900 transition-opacity duration-300
                ${completedFloors > 27 ? "opacity-100" : "opacity-0"}`}
                            style={{ transitionDelay: "825ms" }}
                        ></div>

                        {/* Spire base */}
                        <div
                            className={`absolute bottom-[85%] inset-x-[40%] h-[15%] bg-zinc-800 border-2 border-zinc-900 transition-opacity duration-300
                ${completedFloors > 28 ? "opacity-100" : "opacity-0"}`}
                            style={{ transitionDelay: "850ms" }}
                        ></div>
                    </div>
                </div>

                {/* Spire */}
                <div
                    className={`absolute bottom-[100%] w-[5%] h-[10%] transition-all duration-700 ease-out
            ${completedFloors >= totalFloors - 1 ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
                    style={{
                        transformOrigin: "bottom",
                        transitionDelay: "875ms"
                    }}
                >
                    {/* Simple spire design */}
                    <div
                        className={`absolute bottom-0 inset-x-[35%] h-full bg-zinc-900 transition-opacity duration-300
              ${completedFloors >= totalFloors - 1 ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "900ms" }}
                    ></div>

                    {/* Beacon light */}
                    <div
                        className={`absolute bottom-[100%] left-1/2 w-[6px] h-[6px] bg-amber-500 rounded-full transform -translate-x-1/2 animate-pulse shadow-amber-300 shadow-md transition-opacity duration-300
              ${completedFloors >= totalFloors ? "opacity-100" : "opacity-0"}`}
                        style={{ transitionDelay: "925ms" }}
                    ></div>
                </div>
            </div>
        </div>
    );
}