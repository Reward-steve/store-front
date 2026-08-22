"use client";

import { useCallback, useState } from "react";
import { checkSlugAvailable } from "../../actions/settings";
import { generateSlug } from "../../lib/utils";

export function useSlugAvailability() {
  const [slug, setSlug] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  // Call whenever the shop name changes — keeps the link in sync automatically.
  const updateFromName = useCallback((name: string) => {
    setSlug(generateSlug(name));
    setAvailable(null);
    setError("");
  }, []);

  // Call on blur (or whenever you want to verify the current slug is free).
  const check = useCallback(async (value: string) => {
    if (!value) return;
    setChecking(true);
    try {
      const ok = await checkSlugAvailable(value);
      setAvailable(ok);
      setError(
        ok
          ? ""
          : "Someone already uses this link. Try changing your shop name slightly.",
      );
    } catch {
      setError(
        "We couldn't check your link right now. You can still continue.",
      );
    } finally {
      setChecking(false);
    }
  }, []);

  return { slug, available, checking, error, updateFromName, check };
}
