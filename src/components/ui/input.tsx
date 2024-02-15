"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/cn";

import { useHoverBackground } from "./hooks/use-hover-background";

export const Input = forwardRef<
  HTMLInputElement,
  // Force controlled component
  Omit<React.ComponentProps<"input">, "defaultValue" | "value" | "onChange"> & {
    value?: string;
    onValueChange?: (val: string) => void;
  }
>(function Input(
  { className, type, disabled, value, onValueChange, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-bg-darker backdrop-blur",
        disabled ? "opacity-50" : "hover-bg recessed",
      )}
      {...useHoverBackground({})}
    >
      <input
        type={type}
        className={cn(
          "peer bg-transparent py-[9px] px-4 caret-blue placeholder:font-medium placeholder:text-text-secondary",
          // type === "file" ? "py-[6px] pl-[7px]" : "py-[9px] pl-4",
          // "file:rounded-full file:border-none file:bg-bg-idle file:px-3 file:py-1 file:text-sm file:text-text-primary file:transition-colors file:active:bg-bg-active",
          // https://stackoverflow.com/a/27935448
          "[&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
          "[&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none",
          "[appearance:textfield]",
          className,
        )}
        disabled={disabled}
        {...props}
      />
    </div>
  );
});
