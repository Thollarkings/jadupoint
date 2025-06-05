
import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface Step {
  id: string
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, className }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)}>
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    index < currentStep
                      ? "border-coral-500 bg-coral-500 text-white"
                      : index === currentStep
                      ? "border-coral-500 bg-coral-500 text-white"
                      : "border-gray-300 bg-white text-gray-500"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      index <= currentStep ? "text-white" : "text-gray-400"
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-400 mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-0.5 w-16 transition-colors",
                    index < currentStep ? "bg-coral-500" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }
)
Stepper.displayName = "Stepper"

export { Stepper }
