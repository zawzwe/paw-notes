"use client";

import { useOnboarding } from "@/hooks/use-onboarding";
import { Onboarding } from "@/components/onboarding";

export function OnboardingWrapper() {
  const { show, step, next, skip, finish } = useOnboarding();

  if (!show) return null;

  return <Onboarding step={step} onNext={next} onSkip={skip} onFinish={finish} />;
}
