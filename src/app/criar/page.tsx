"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { ContractData } from "@/lib/contract-data";
import {
  SERVICE_TYPES,
  PAYMENT_METHODS,
  PRICES,
  LEGAL_DISCLAIMER,
} from "@/lib/contract-data";
import LegalDisclaimer from "@/components/LegalDisclaimer";

const STEPS = [
  "Tipo de Serviço",
  "Seus Dados",
  "Dados do Cliente",
  "Detalhes do Serviço",
  "Cláusulas",
  "Revisar",
];

const emptyData: ContractData = {
  serviceType: "",
  contractorName: "",
  contractorDocument: "",
  contractorAddress: "",
  contractorEmail: "",
  clientName: "",
  clientDocument: "",
  clientAddress: "",
  clientEmail: "",
  serviceDescription: "",
  deliveryDeadline: "",
  serviceValue: "",
  paymentMethod: "",
  confidentiality: false,
  nonCompete: false,
  intellectualProperty: false,
  plan: "one_time",
};

function CriarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan") as "one_time" | "pro" | null;
  const tipoFromUrl = searchParams.get("tipo");

  const [step, setStep] = useState(0);
  const [data, setData] = useState<ContractData>({
    ...emptyData,
    plan: planFromUrl === "pro" ? "pro" : "one_time",
    serviceType: tipoFromUrl && SERVICE_TYPES.includes(tipoFromUrl) ? tipoFromUrl : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field: keyof ContractData, value: any) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function prevStep() {
    if (step > 0) setStep(step - 1);
  }

  async function handleCheckout() {
    setIsSubmitting(true);
    try {
      // Store contract data in sessionStorage for retrieval after payment
      sessionStorage.setItem("contractData", JSON.stringify(data));

      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: data.plan,
          contractData: data,
        }),
      });

      const result = await response.json();
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert("Erro ao criar checkout: " + (result.error || "Tente novamente."));
      }
    } catch (error) {
      alert("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatPrice(plan: "one_time" | "pro") {
    const price = PRICES[plan] / 100;
    return `R$${price.toFixed(2).replace(".", ",")}`;
  }

  const isStepValid = () => {
    switch (step) {
      case 0:
        return data.serviceType !== "";
      case 1:
        return (
          data.contractorName.trim() !== "" &&
          data.contractorDocument.trim() !== "" &&
          data.contractorEmail.trim() !== ""
        );
      case 2:
        return (
          data.clientName.trim() !== "" &&
          data.clientDocument.trim() !== "" &&
          data.clientEmail.trim() !== ""
        );
      case 3:
        return (
          data.serviceDescription.trim() !== "" &&
          data.serviceValue.trim() !== ""
        );
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= step
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 ${
                    i < step ? "bg-blue-700" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          {STEPS.map((label, i) => (
            <span key={i} className={i === step ? "text-blue-700 font-semibold" : ""}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Plan badge */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm text-gray-600">Plano:</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            data.plan === "pro"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {data.plan === "pro"
            ? "Pro — Ilimitado"
            : `Avulso — ${formatPrice("one_time")}/contrato`}
        </span>
        {data.plan === "one_time" && (
          <Link
            href="/criar?plan=pro"
            className="text-xs text-blue-600 hover:underline"
          >
            Mudar para Pro
          </Link>
        )}
      </div>

      {/* Step 0: Service Type */}
      {step === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Tipo de Serviço
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Selecione o tipo de serviço que você presta
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SERVICE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => update("serviceType", type)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  data.serviceType === type
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Contractor Info */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Seus Dados (Contratado)
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Informe seus dados como prestador de serviço
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome / Razão Social *
            </label>
            <input
              type="text"
              value={data.contractorName}
              onChange={(e) => update("contractorName", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Seu nome completo ou razão social"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF / CNPJ *
            </label>
            <input
              type="text"
              value={data.contractorDocument}
              onChange={(e) => update("contractorDocument", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="000.000.000-00 ou 00.000.000/0001-00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              value={data.contractorAddress}
              onChange={(e) => update("contractorAddress", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Rua, número, bairro, cidade - UF, CEP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail *
            </label>
            <input
              type="email"
              value={data.contractorEmail}
              onChange={(e) => update("contractorEmail", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="seu@email.com"
            />
          </div>
        </div>
      )}

      {/* Step 2: Client Info */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Dados do Cliente (Contratante)
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Informe os dados de quem está contratando o serviço
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome / Razão Social *
            </label>
            <input
              type="text"
              value={data.clientName}
              onChange={(e) => update("clientName", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Nome completo ou razão social do cliente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF / CNPJ *
            </label>
            <input
              type="text"
              value={data.clientDocument}
              onChange={(e) => update("clientDocument", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="000.000.000-00 ou 00.000.000/0001-00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              value={data.clientAddress}
              onChange={(e) => update("clientAddress", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Rua, número, bairro, cidade - UF, CEP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail *
            </label>
            <input
              type="email"
              value={data.clientEmail}
              onChange={(e) => update("clientEmail", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="cliente@email.com"
            />
          </div>
        </div>
      )}

      {/* Step 3: Service Details */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Detalhes do Serviço
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Descreva o serviço, prazo e valores
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição do Serviço *
            </label>
            <textarea
              rows={4}
              value={data.serviceDescription}
              onChange={(e) => update("serviceDescription", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Descreva detalhadamente o serviço a ser prestado..."
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo de Entrega
              </label>
              <input
                type="date"
                value={data.deliveryDeadline}
                onChange={(e) => update("deliveryDeadline", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.serviceValue}
                onChange={(e) => update("serviceValue", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ex: 1500.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forma de Pagamento
            </label>
            <select
              value={data.paymentMethod}
              onChange={(e) => update("paymentMethod", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="">Selecione...</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 4: Additional Clauses */}
      {step === 4 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Cláusulas Adicionais
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Selecione as cláusulas que deseja incluir no contrato
          </p>
          <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.confidentiality}
              onChange={(e) => update("confidentiality", e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 rounded"
            />
            <div>
              <span className="font-medium text-gray-800">Confidencialidade</span>
              <p className="text-sm text-gray-500 mt-1">
                Cláusula de sigilo sobre informações compartilhadas durante a prestação do serviço.
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.nonCompete}
              onChange={(e) => update("nonCompete", e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 rounded"
            />
            <div>
              <span className="font-medium text-gray-800">Não-Concorrência</span>
              <p className="text-sm text-gray-500 mt-1">
                Impede que você preste serviços diretamente para clientes do contratante por 6 meses.
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.intellectualProperty}
              onChange={(e) => update("intellectualProperty", e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 rounded"
            />
            <div>
              <span className="font-medium text-gray-800">Propriedade Intelectual</span>
              <p className="text-sm text-gray-500 mt-1">
                Define que os direitos sobre o trabalho pertencem ao contratante após pagamento.
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Revisar Contrato
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Revise os dados antes de prosseguir para o pagamento
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Tipo de Serviço</span>
              <span className="font-medium">{data.serviceType}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Contratado</span>
              <span className="font-medium text-right">
                {data.contractorName}
                <br />
                <span className="text-gray-400 text-xs">{data.contractorDocument}</span>
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Contratante</span>
              <span className="font-medium text-right">
                {data.clientName}
                <br />
                <span className="text-gray-400 text-xs">{data.clientDocument}</span>
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Valor</span>
              <span className="font-medium text-green-700">
                {data.serviceValue
                  ? `R$ ${parseFloat(data.serviceValue).toFixed(2).replace(".", ",")}`
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Prazo</span>
              <span className="font-medium">
                {data.deliveryDeadline
                  ? data.deliveryDeadline.split("-").reverse().join("/")
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Cláusulas</span>
              <span className="font-medium">
                {[data.confidentiality && "Confidencialidade",
                  data.nonCompete && "Não-Concorrência",
                  data.intellectualProperty && "Propriedade Intelectual",
                ]
                  .filter(Boolean)
                  .join(", ") || "Nenhuma"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Plano</span>
              <span className="font-medium text-blue-700">
                {data.plan === "pro" ? "Pro — Ilimitado" : "Avulso"}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-700 font-bold">Total</span>
              <span className="font-bold text-lg">
                {formatPrice(data.plan)}
                {data.plan === "pro" && (
                  <span className="text-sm font-normal text-gray-500">/mês</span>
                )}
              </span>
            </div>
          </div>

          <LegalDisclaimer />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Voltar
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Próximo →
          </button>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting
              ? "Redirecionando..."
              : `Pagar ${formatPrice(data.plan)} →`}
          </button>
        )}
      </div>
    </div>
  );
}

export default function CriarPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
        </div>
      }
    >
      <CriarForm />
    </Suspense>
  );
}
