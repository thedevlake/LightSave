import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={`relative inline-flex h-6 w-10 rounded-full bg-gray-200 transition-colors data-[state=checked]:bg-teal-500 ${className}`}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb className="block w-5 h-5 bg-white rounded-full shadow transform transition-transform data-[state=checked]:translate-x-4" />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";
