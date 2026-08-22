import { Store, MessageCircle, ImagePlus } from "lucide-react";

// Edit copy here only — components read from this, nothing is hardcoded elsewhere.
export const STEPS = [
  {
    title: "Tell us about your shop",
    hint: "This is what customers will see first.",
    Icon: Store,
  },
  {
    title: "How do customers reach you?",
    hint: "We'll send new orders straight to this number.",
    Icon: MessageCircle,
  },
  {
    title: "Add a shop photo",
    hint: "Optional, but it builds trust with customers.",
    Icon: ImagePlus,
  },
] as const;
