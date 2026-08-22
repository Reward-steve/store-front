"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import { createShop } from "../actions/settings";
import { STEPS } from "./_config/steps";
import { useSlugAvailability } from "./_hooks/useSlugAvailability";
import { usePhoneNumber } from "./_hooks/usePhoneNumber";
import ProgressHeader from "./_components/ProgressHeader";
import StepIntro from "./_components/StepIntro";
import StepShopInfo from "./_components/StepShopInfo";
import StepContactInfo from "./_components/StepContactInfo";
import StepShopPhoto from "./_components/StepShopPhoto";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const slugState = useSlugAvailability();
  const phone = usePhoneNumber();

  const handleNameChange = (value: string) => {
    setShopName(value);
    slugState.updateFromName(value);
  };

  const handleNameBlur = () => {
    if (slugState.slug) slugState.check(slugState.slug);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!shopName.trim() || slugState.available === false) return;
    }
    if (step === 2) {
      if (!phone.validate()) return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    const whatsappNumber = phone.validate();
    if (!whatsappNumber) {
      setLoading(false);
      setStep(2);
      return;
    }
    try {
      await createShop({
        shopName,
        slug: slugState.slug,
        whatsappNumber,
        description,
        logoUrl,
      });
      // First-time-user flag the dashboard reads to trigger the welcome
      // confetti and adjust the greeting copy. Do not drop this param.
      router.push("/dashboard?new=true");
    } catch {
      setLoading(false);
    }
  };

  const current = STEPS[step - 1];

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col">
      <ProgressHeader
        step={step}
        totalSteps={STEPS.length}
        showBack={step > 1 && !loading}
        onBack={handleBack}
      />

      <div className="flex-1 flex flex-col max-w-lg w-full mx-auto px-4 py-8">
        <StepIntro
          Icon={current.Icon}
          title={current.title}
          hint={current.hint}
        />

        {step === 1 && (
          <StepShopInfo
            shopName={shopName}
            slug={slugState.slug}
            slugAvailable={slugState.available}
            checkingSlug={slugState.checking}
            slugError={slugState.error}
            onNameChange={handleNameChange}
            onNameBlur={handleNameBlur}
          />
        )}

        {step === 2 && (
          <StepContactInfo
            selectedCountry={phone.selected}
            countryCode={phone.countryCode}
            pickerOpen={phone.pickerOpen}
            onTogglePicker={() => phone.setPickerOpen((v) => !v)}
            onSelectCountry={(code) => {
              phone.setCountryCode(code);
              phone.setPickerOpen(false);
            }}
            localNumber={phone.localNumber}
            onLocalNumberChange={(v) => {
              phone.setLocalNumber(v);
              phone.setError("");
            }}
            phoneError={phone.error}
            description={description}
            onDescriptionChange={setDescription}
          />
        )}

        {step === 3 && (
          <StepShopPhoto logoUrl={logoUrl} onChange={setLogoUrl} />
        )}

        <div className="mt-8">
          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={
                step === 1 &&
                (!shopName.trim() || slugState.available === false)
              }
              className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] disabled:bg-surface disabled:border disabled:border-border disabled:text-text-muted text-white font-bold py-3 rounded-2xl transition-all"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={handleSubmit}
                loading={loading}
                className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] text-white font-bold py-3 rounded-2xl transition-all"
              >
                Create my shop <ArrowRight className="h-4 w-4" />
              </Button>
              {!loading && (
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <button
                    onClick={handleSubmit}
                    className="text-xs text-text-muted hover:text-text transition-colors px-2 py-1"
                  >
                    Skip photo for now
                  </button>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
