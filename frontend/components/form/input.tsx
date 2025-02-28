import { inputStyle } from "@/frontend/styles"
import { cn } from "@/lib/element"
import React, { forwardRef } from "react"

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const FormInput = forwardRef<HTMLInputElement, Props>(function Component({ children, className, ...props }, ref) {
    return <input {...props} ref={ref} className={cn(className, inputStyle)} />
});

export default FormInput
