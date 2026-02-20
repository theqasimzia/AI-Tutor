"use client";

import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Current value, 0‑100 (default 0) */
    value?: number;
    /** Maximum value (default 100) */
    max?: number;
    /** Additional Tailwind classes */
    className?: string;
}

/**
 * Simple, premium‑looking progress bar.
 * Usage example:
 *   <Progress value={45} className="h-2 w-full" />
 */
export function Progress({
    value = 0,
    max = 100,
    className = "",
    ...props
}: ProgressProps) {
    const percent = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            className={`relative overflow-hidden rounded-full bg-gray-200 ${className}`}
            {...props}
        >
            <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}
