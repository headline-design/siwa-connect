import { IconCheckCircle } from "@/icons/check-circle";
import { IconInformation } from "@/icons/information";
import { IconStop } from "@/icons/stop";
import { IconWarning } from "@/icons/warning";
import React from "react";

interface AlertProps {
  children: React.ReactNode;
  variant: "success" | "error" | "warning" | "info";
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, variant, className }) => {
  const variantStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-ds-red-200 border-ds-red-100 border text-ds-red-900",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div
      className={`border rounded-[10px] py-2 px-3 ${variantStyles[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-center m-0 gap-3">
        {variant === "success" ? (
          <IconCheckCircle className="w-4 h-4 inline-block flex-shrink-0" />
        ) : variant === "error" ? (
          <IconStop className="w-4 h-4 inline-block flex-shrink-0" />
        ) : variant === "warning" ? (
          <IconWarning className="w-4 h-4 inline-block flex-shrink-0" />
        ) : variant === "info" ? (
          <IconInformation className="w-4 h-4 inline-block flex-shrink-0" />
        ) : null}
        <div className="flex flex-col text-sm">{children}</div>
      </div>
    </div>
  );
};
