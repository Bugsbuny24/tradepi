import * as React from "react";

export function Button({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-4 py-2 rounded bg-black text-white font-bold ${className}`}
      {...props}
    />
  );
}
