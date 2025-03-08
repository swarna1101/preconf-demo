"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { Progress } from "../components/ui/Progress"
import { BurjKhalifa } from "./buildings/BurjKhalifa"
import { EiffelTower } from "./buildings/EiffelTower"
import { EmpireState } from "./buildings/EmpireState"

interface Building {
    name: string;
    floors: number;
    height: number;
    color: string;
    accent: string;
    glass?: string;
    realConstructionTime: string; // human-readable construction time
    realConstructionMonths: number; // in months for calculations
}

// Define buildings
const buildings: Record<string, Building> = {
    burj: {
        name: "Burj Khalifa",
        floors: 40,
        height: 400,
        color: "from-sky-300 via-sky-400 to-sky-600",
        accent: "from-sky-200 to-sky-400",
        glass: "from-sky-200/30 to-sky-300/30",
        realConstructionTime: "6 years (2004-2010)",
        realConstructionMonths: 72, // 6 years
    },
    eiffel: {
        name: "Eiffel Tower",
        floors: 30,
        height: 300,
        color: "from-zinc-400 to-zinc-600",
        accent: "from-zinc-300 to-zinc-500",
        realConstructionTime: "2 years, 2 months, 5 days (1887-1889)",
        realConstructionMonths: 26, // 2 years, 2 months
    },
    empire: {
        name: "Empire State Building",
        floors: 35,
        height: 350,
        color: "from-amber-400 to-amber-600",
        accent: "from-amber-300 to-amber-500",
        realConstructionTime: "1 year and 45 days (1930-1931)",
        realConstructionMonths: 13, // 1 year and 45 days
    },
}

// Network configuration
const networks = {
    preconf: {
        name: "Preconf Devnet",
        blockTime: 800, // 800ms per block
        color: "bg-gradient-to-r from-[#FFC6E9] via-[#FF6FC8] to-white",
        borderColor: "border-[#FF6FC8]",
        textColor: "text-[#FF6FC8]"
    },
    hekla: {
        name: "Taiko Hekla",
        blockTime: 2000, // 2000ms per block
        color: "bg-gradient-to-r from-gray-300 to-gray-500",
        borderColor: "border-gray-500",
        textColor: "text-gray-600"
    }
}

export function BuildingConstruction() {
    const [selectedBuilding, setSelectedBuilding] = useState("eiffel")
    const [preconfFloors, setPreconfFloors] = useState(0)
    const [heklaFloors, setHeklaFloors] = useState(0)

    const animationRef = useRef<number | null>(null)
    const startTimeRef = useRef<number | null>(null)

    const resetBuilding = useCallback(() => {
        setPreconfFloors(0)
        setHeklaFloors(0)
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
        }
        startTimeRef.current = null
    }, [])

    const animateBuilding = useCallback(() => {
        const now = performance.now()
        const elapsed = startTimeRef.current ? now - startTimeRef.current : 0

        // Calculate floors completed based on each network's block time
        const totalFloors = buildings[selectedBuilding as keyof typeof buildings].floors

        // Calculate floors completed
        const newPreconfFloors = Math.min(totalFloors, Math.floor(elapsed / networks.preconf.blockTime))
        const newHeklaFloors = Math.min(totalFloors, Math.floor(elapsed / networks.hekla.blockTime))

        setPreconfFloors(newPreconfFloors)
        setHeklaFloors(newHeklaFloors)

        if (newPreconfFloors < totalFloors || newHeklaFloors < totalFloors) {
            animationRef.current = requestAnimationFrame(animateBuilding)
        }
    }, [selectedBuilding])

    const startBuilding = useCallback(() => {
        resetBuilding()
        startTimeRef.current = performance.now()
        animateBuilding()
    }, [resetBuilding, animateBuilding])

    // Automatically start building when the selected building changes
    useEffect(() => {
        startBuilding()
    }, [selectedBuilding, startBuilding])

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    const buildingData = buildings[selectedBuilding as keyof typeof buildings]
    const totalFloors = buildingData.floors
    const preconfProgress = (preconfFloors / totalFloors) * 100
    const heklaProgress = (heklaFloors / totalFloors) * 100

    // Calculate real-world construction time comparison
    const getRealWorldComparison = () => {
        const realTime = buildingData.realConstructionMonths;

        // Format months into years and months
        const formatTime = (months: number) => {
            const years = Math.floor(months / 12);
            const remainingMonths = Math.round(months % 12);

            if (years === 0) {
                return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
            } else if (remainingMonths === 0) {
                return `${years} year${years !== 1 ? 's' : ''}`;
            } else {
                return `${years} year${years !== 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
            }
        };

        const traditionalTime = formatTime(realTime);
        const preconfTime = formatTime(realTime / (networks.hekla.blockTime / networks.preconf.blockTime));

        return {
            traditional: traditionalTime,
            preconf: preconfTime
        };
    };

    // Render the appropriate building based on selection
    const renderBuilding = (type: string, completedFloors: number) => {
        const building = buildings[type as keyof typeof buildings];

        switch (type) {
            case "burj":
                return <BurjKhalifa completedFloors={completedFloors} totalFloors={building.floors} />;
            case "eiffel":
                return <EiffelTower completedFloors={completedFloors} totalFloors={building.floors} />;
            case "empire":
                return <EmpireState completedFloors={completedFloors} totalFloors={building.floors} />;
            default:
                return null;
        }
    }

    const timeComparison = getRealWorldComparison();

    // Calculate current time based on completed floors
    const preconfCurrentTime = (preconfFloors * (networks.preconf.blockTime / 1000)).toFixed(1);
    const heklaCurrentTime = (heklaFloors * (networks.hekla.blockTime / 1000)).toFixed(1);

    const speedMultiplier = networks.hekla.blockTime / networks.preconf.blockTime;

    return (
        <div className="space-y-4">
            <Card className="border shadow-lg overflow-hidden" style={{ borderImage: "linear-gradient(45.89deg, #FFC6E9 6.48%, #FF6FC8 43.92%, #FFFFFF 100%) 1" }}>
                <CardContent className="p-4">
                    {/* Title with gradient matching Taiko's colors */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(45.89deg, #FFC6E9 6.48%, #FF6FC8 43.92%, #FFFFFF 100%)" }}>
                            If iconic landmarks were built with Taiko networks
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Visualizing the speed difference between Preconf Devnet (~800ms) and Hekla (~2000ms)
                        </p>
                    </div>

                    {/* Building selection buttons */}
                    <div className="mb-6 flex items-center justify-center">
                        <div className="flex gap-2 flex-wrap justify-center">
                            {Object.entries(buildings).map(([key, building]) => (
                                <Button
                                    key={key}
                                    variant={selectedBuilding === key ? "default" : "outline"}
                                    onClick={() => setSelectedBuilding(key)}
                                    className={`px-3 h-8 text-sm ${
                                        selectedBuilding === key
                                            ? "bg-gradient-to-r from-[#FFC6E9] to-[#FF6FC8] text-white border-0"
                                            : "border-[#FF6FC8] text-[#FF6FC8] hover:bg-pink-50"
                                    }`}
                                    size="sm"
                                >
                                    {building.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Buildings side by side */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-3">
                            <div className={`relative h-[300px] md:h-[450px] border-2 rounded-lg flex items-start justify-center p-3 pt-12 bg-gradient-to-b from-sky-50 via-sky-100 to-sky-200 dark:from-sky-900 dark:via-sky-800 dark:to-sky-950 overflow-hidden ${networks.preconf.borderColor}`}>
                                <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${networks.preconf.color} ${networks.preconf.textColor}`}>
                    {networks.preconf.name}
                  </span>
                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                    ~{networks.preconf.blockTime}ms blocks
                  </span>
                                </div>
                                {renderBuilding(selectedBuilding, preconfFloors)}
                            </div>
                            <div className="flex items-center justify-between">
                                <Progress
                                    value={preconfProgress}
                                    className="h-2 flex-1"
                                    style={{
                                        background: "linear-gradient(90deg, rgba(255,198,233,0.2) 0%, rgba(255,111,200,0.2) 100%)",
                                        '--progress-color': 'linear-gradient(90deg, #FFC6E9 0%, #FF6FC8 100%)'
                                    } as React.CSSProperties}
                                />
                                <span className="ml-2 text-xs font-medium">{preconfCurrentTime}s</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
                            <div className={`relative h-[300px] md:h-[450px] border-2 rounded-lg flex items-start justify-center p-3 pt-12 bg-gradient-to-b from-sky-50 via-sky-100 to-sky-200 dark:from-sky-900 dark:via-sky-800 dark:to-sky-950 overflow-hidden ${networks.hekla.borderColor}`}>
                                <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${networks.hekla.color} ${networks.hekla.textColor}`}>
                    {networks.hekla.name}
                  </span>
                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                    ~{networks.hekla.blockTime}ms blocks
                  </span>
                                </div>
                                {renderBuilding(selectedBuilding, heklaFloors)}
                            </div>
                            <div className="flex items-center justify-between">
                                <Progress
                                    value={heklaProgress}
                                    className="h-2 flex-1"
                                    style={{
                                        background: "linear-gradient(90deg, rgba(209,213,219,0.2) 0%, rgba(107,114,128,0.2) 100%)",
                                        '--progress-color': 'linear-gradient(90deg, #D1D5DB 0%, #6B7280 100%)'
                                    } as React.CSSProperties}
                                />
                                <span className="ml-2 text-xs font-medium">{heklaCurrentTime}s</span>
                            </div>
                        </div>
                    </div>

                    {/* Real-world construction time comparison */}
                    <div className="mt-6">
                        <div className="bg-gray-50 p-3 md:p-4 rounded-lg max-w-3xl mx-auto border border-gray-200">
                            <h3 className="text-sm md:text-base font-semibold mb-3 text-center">
                                Real-World Construction Comparison
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded-md border border-[#FFC6E9] shadow-sm">
                                    <div className="text-xs text-gray-500">With Preconf Devnet Speeds:</div>
                                    <div className="font-medium text-sm">
                                        The {buildingData.name} would only take <span className="text-[#FF6FC8] font-bold">{timeComparison.preconf}</span> to build
                                    </div>
                                </div>
                                <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                    <div className="text-xs text-gray-500">With Hekla Speeds:</div>
                                    <div className="font-medium text-sm">
                                        The {buildingData.name} would take <span className="text-gray-700 font-bold">{timeComparison.traditional}</span> to build
                                    </div>
                                </div>
                            </div>

                            <div className="text-center text-xs text-gray-500 mt-3">
                                That's a {speedMultiplier.toFixed(1)}× improvement in speed! What takes {networks.hekla.blockTime}ms on Hekla takes only {networks.preconf.blockTime}ms on Preconf Devnet.
                            </div>
                        </div>
                    </div>

                    {/* Reset/Restart button */}
                    <div className="mt-4 flex justify-center">
                        <Button
                            onClick={startBuilding}
                            className="bg-gradient-to-r from-[#FFC6E9] to-[#FF6FC8] hover:from-[#FFC6E9] hover:to-[#FF6FC8] text-white border-0"
                        >
                            Restart Animation
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}