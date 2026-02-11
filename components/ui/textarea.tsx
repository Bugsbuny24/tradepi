import * as React from "react";

export function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full border px-3 py-2 rounded ${className}`}
      {...props}
    />
  );
}
