'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { pdf } from '@react-pdf/renderer';
import ContractPDF from '@/components/ContractPDF';
import LegalDisclaimer from '@/components/LegalDisclaimer';
import type { ContractData } from '@/lib/contract-data';

function SucessoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // In production, fetch contract data from session
    // For MVP, we retrieve from sessionStorage (stored before redirect)
    const stored = sessionStorage.getItem('contractData');
    if (stored) {
      try {
        setContractData(JSON.parse(stored));
      } catch {
        setError('Dados do contrato não encontrados.');
      }
    }
    setLoading(false);
  }, []);

  async function handleDownload() {
    if (!contractData) return;
    setDownloading(true);
    try {
      const blob = await pdf(<ContractPDF data={contractData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contrato-${contractData.serviceType?.toLowerCase().replace(/\s+/g, '-') || 'servico'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setDownloading(false);
    }
  }

  function handleEmail() {
    if (!contractData) return;
    const subject = encodeURIComponent('Seu contrato de prestação de serviços');
    const body = encodeURIComponent(
      `Olá!\n\nSegue em anexo o contrato de prestação de serviços gerado pelo Contrato Certo.\n\nAtenciosamente,\n${contractData.contractorName}`
    );
    window.open(`mailto:${contractData.clientEmail}?subject=${subject}&body=${body}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-red-600 text-5xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">{error}</h1>
        <Link
          href="/criar"
          className="inline-block mt-4 text-blue-700 hover:underline"
        >
          Voltar e criar novo contrato
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Contrato gerado com sucesso!
        </h1>
        <p className="text-gray-600">
          Seu pagamento foi confirmado. O contrato está pronto para download.
        </p>
        {sessionId && (
          <p className="text-xs text-gray-400 mt-2">
            ID da sessão: {sessionId}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-4 mb-8">
        <button
          onClick={handleDownload}
          disabled={downloading || !contractData}
          className="w-full flex items-center justify-center gap-3 bg-blue-700 text-white font-bold py-4 rounded-xl hover:bg-blue-800 disabled:opacity-50 transition-colors"
        >
          <span>📥</span>
          {downloading ? 'Gerando PDF...' : 'Baixar Contrato em PDF'}
        </button>

        <button
          onClick={handleEmail}
          disabled={!contractData}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <span>📧</span>
          Enviar por E-mail
        </button>

        <Link
          href="/criar"
          className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <span>📝</span>
          Criar Outro Contrato
        </Link>
      </div>

      {/* Cross-sell */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🧾</span>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">
              Precisa emitir Nota Fiscal?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Conheça o <strong>Oráculo do MEI</strong> — a plataforma completa para
              microempreendedores. Emita notas fiscais, gerencie seu CNPJ e muito mais.
            </p>
            <a
              href="https://oraculodomei.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-purple-700 font-semibold text-sm hover:underline"
            >
              Acessar Oráculo do MEI →
            </a>
          </div>
        </div>
      </div>

      <LegalDisclaimer />
    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
        </div>
      }
    >
      <SucessoContent />
    </Suspense>
  );
}
