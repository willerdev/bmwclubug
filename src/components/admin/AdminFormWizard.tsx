"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type WizardStep = {
  title: string;
  description: string;
};

export function AdminFormWizard({
  steps,
  current,
  maxVisited,
  onStepChange,
  children,
}: {
  steps: WizardStep[];
  current: number;
  maxVisited: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode;
}) {
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bmw-blue-light">
              Step {current + 1} of {steps.length}
            </p>
            <h2 className="text-xl font-bold mt-1">{steps[current].title}</h2>
            <p className="text-sm text-white/50 mt-1">{steps[current].description}</p>
          </div>
          <span className="text-sm font-semibold text-bmw-blue">{Math.round(progress)}%</span>
        </div>

        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
          <motion.div
            className="h-full bmw-m-stripe rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
          />
        </div>

        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((step, index) => {
            const complete = index < current;
            const available = index <= maxVisited;
            return (
              <button
                key={step.title}
                type="button"
                disabled={!available}
                onClick={() => available && onStepChange(index)}
                className={cn(
                  "min-w-0 rounded-xl border px-2 py-2.5 text-left transition-all",
                  index === current
                    ? "glass-panel border-bmw-blue/50 text-white"
                    : available
                      ? "glass-frosted border-white/10 text-white/60 hover:border-white/25"
                      : "border-white/5 text-white/25 cursor-not-allowed"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] border",
                      complete
                        ? "bg-bmw-blue border-bmw-blue text-white"
                        : index === current
                          ? "border-bmw-blue text-bmw-blue-light"
                          : "border-white/15"
                    )}
                  >
                    {complete ? <Check size={11} /> : index + 1}
                  </span>
                  <span className="text-xs font-medium truncate">{step.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 24, filter: "blur(3px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -18, filter: "blur(3px)" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function WizardActions({
  current,
  total,
  onBack,
  onNext,
  onCancel,
  nextLabel,
  busy,
}: {
  current: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  onCancel?: () => void;
  nextLabel?: string;
  busy?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 border-t border-white/10">
      <div className="flex gap-2">
        {current > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-full text-sm glass-frosted border border-white/10"
          >
            Back
          </button>
        )}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-full text-sm text-white/45 hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={onNext}
        className="px-6 py-2.5 rounded-full text-sm font-medium glass-panel border border-bmw-blue/40 glow-blue disabled:opacity-50"
      >
        {busy ? "Saving..." : nextLabel || (current === total - 1 ? "Save" : "Continue")}
      </button>
    </div>
  );
}
