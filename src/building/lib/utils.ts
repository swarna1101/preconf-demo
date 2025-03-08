/**
 * Utility functions for the building components
 */

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind classes
 * @param inputs - Array of class values
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a time duration into a readable format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
    if (seconds < 60) {
        return `${seconds.toFixed(1)}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
        return `${minutes}m`;
    }

    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
}

/**
 * Calculate the speed multiplier between two time values
 * @param slower - The slower time value
 * @param faster - The faster time value
 * @returns Speed multiplier
 */
export function calculateSpeedMultiplier(slower: number, faster: number): number {
    return slower / faster;
}

/**
 * Calculate how long a task would take at a different speed
 * @param originalTime - Original time (in months)
 * @param speedMultiplier - Speed multiplier
 * @returns New time (in months)
 */
export function calculateAdjustedTime(originalTime: number, speedMultiplier: number): number {
    return originalTime / speedMultiplier;
}