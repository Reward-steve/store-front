import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-surface-alt flex items-center justify-center">
      <SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/signup" />
    </div>
  );
}
