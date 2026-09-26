import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy - Noisy",
  description:
    "What Noisy collects, what it does not, and how your searches, cookies, and third-party CDNs are handled. Available in English and Indonesian.",
};

export default function PrivacyPage() {
  return <LegalPage docKey="privacy" />;
}
