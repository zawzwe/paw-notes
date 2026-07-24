"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "paw-notes-onboarding-done";

export function useOnboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      setShow(true);
    }
  }, []);

  const next = useCallback(() => {
    setStep((s) => s + 1);
  }, []);

  const finish = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  }, []);

  const skip = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  }, []);

  return { show, step, next, finish, skip };
}
