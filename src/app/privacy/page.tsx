import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | AI Tutor Academy",
    description:
        "Learn how AI Tutor Academy protects your data and your child's privacy. GDPR-compliant and built with privacy-first principles.",
}

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="mb-4">
                At AI Tutor Academy, we take your privacy seriously. This is a placeholder for the full privacy policy.
            </p>
            <p className="mb-4">
                We are committed to GDPR compliance and protecting the data of our students and parents.
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>Data Collection: We collecting minimal data required for educational purposes.</li>
                <li>Voice Data: Voice inputs are processed for the sole purpose of the tutoring session and are not stored permanently without consent.</li>
                <li>Parental Control: Parents have full access to their child&apos;s data and can request deletion at any time.</li>
            </ul>
        </div>
    )
}
