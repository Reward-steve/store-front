import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-surface-alt flex items-center justify-center">
      <SignUp fallbackRedirectUrl="/onboarding" signInUrl="/login" />
    </div>
  );
}
