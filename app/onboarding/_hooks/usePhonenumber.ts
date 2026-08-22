"use client";

import { useState } from "react";
import { COUNTRY_CODES } from "../../constant";

export function usePhoneNumber(initialCode = "+234") {
  const [countryCode, setCountryCode] = useState(initialCode);
  const [localNumber, setLocalNumber] = useState("");
  const [error, setError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const selected =
    COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0];

  // Returns the full number on success, or null (and sets an error) if invalid.
  const validate = () => {
    const digits = localNumber.replace(/\s/g, "");
    if (!digits || digits.length < 7) {
      setError("Please enter a valid phone number, e.g. 8012345678.");
      return null;
    }
    setError("");
    return `${countryCode.replace("+", "")}${digits}`;
  };

  return {
    countryCode,
    setCountryCode,
    localNumber,
    setLocalNumber,
    error,
    setError,
    pickerOpen,
    setPickerOpen,
    selected,
    validate,
  };
}
