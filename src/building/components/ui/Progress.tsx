"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, max = 100, ...props }, ref) => {
        const percentage = (value / max) * 100;

        return (
            <div
                ref={ref}
                className={cn(
                    "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
                    className
                )}
                {...props}
            >
                <div
                    className="h-full w-full flex-1 transition-all"
                    style={{
                        transform: `translateX(-${100 - percentage}%)`,
                        background: "var(--progress-color, #FF6FC8)"
                    }}
                />
            </div>
        );
    }
);

Progress.displayName = "Progress";