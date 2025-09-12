"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface HintLabelProps {
  label: string | null;
  children: React.ReactNode;
  asChild?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
}

export default function HintLabel({
  label,
  children,
  asChild = true,
  side,
  align,
  className,
}: HintLabelProps) {
  return (
    <>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger className="" asChild={asChild}>
            {children}
          </TooltipTrigger>
          <TooltipContent
            className="text-white"
            side={side}
            align={align}
          >
            <p className={cn("text-white text-sm", className)}>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
