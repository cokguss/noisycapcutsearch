import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service - Noisy",
  description:
    "The rules for using Noisy: free non-commercial search, no abuse, no affiliation with CapCut, content stays with its creators. Available in English and Indonesian.",
};

export default function TermsPage() {
  return <LegalPage docKey="terms" />;
}
