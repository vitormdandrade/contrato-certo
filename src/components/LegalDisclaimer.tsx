import { LEGAL_DISCLAIMER } from '@/lib/contract-data';

export default function LegalDisclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
      <p className="font-semibold mb-1">⚠️ Aviso Legal</p>
      <p>{LEGAL_DISCLAIMER}</p>
    </div>
  );
}
