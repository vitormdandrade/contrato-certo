import Link from "next/link";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import { SERVICE_TYPES, PRICES } from "@/lib/contract-data";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Contrato de prestação de serviços
            <br />
            <span className="text-yellow-300">em 2 minutos.</span>
          </h1>
          <p className="text-xl text-blue-100 mb-4 max-w-2xl mx-auto">
            Válido juridicamente. R$39,90 por contrato ou R$29,90/mês no plano ilimitado.
          </p>
          <p className="text-sm text-blue-200 mb-8">
            Baseado no Código Civil Brasileiro • Revisado por advogados
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/criar"
              className="inline-flex items-center justify-center bg-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-lg text-lg hover:bg-yellow-300 transition-colors shadow-lg"
            >
              Criar meu contrato — R$39,90
            </Link>
            <Link
              href="/criar?plan=pro"
              className="inline-flex items-center justify-center bg-white/10 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-colors"
            >
              Plano Pro — R$29,90/mês
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Para todos os tipos de serviço
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SERVICE_TYPES.map((type) => (
            <Link
              key={type}
              href={`/criar?tipo=${encodeURIComponent(type)}`}
              className="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-gray-700 font-medium text-sm text-center"
            >
              {type === "Design gráfico" && "🎨 "}
              {type === "Desenvolvimento de software" && "💻 "}
              {type === "Fotografia" && "📸 "}
              {type === "Consultoria" && "📊 "}
              {type === "Marketing digital" && "📱 "}
              {type === "Aulas particulares" && "📚 "}
              {type === "Outros" && "📋 "}
              {type}
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
            Contrato seguro e confiável
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-3">⚖️</div>
              <h3 className="font-bold text-gray-800 mb-2">
                Baseado no Código Civil
              </h3>
              <p className="text-gray-600 text-sm">
                Elaborado conforme os artigos 593 a 609 do Código Civil Brasileiro, que
                regulam a prestação de serviços.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-gray-800 mb-2">Revisado por advogados</h3>
              <p className="text-gray-600 text-sm">
                Nossos modelos são revisados por profissionais jurídicos para garantir
                validade e segurança.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">⏱️</div>
              <h3 className="font-bold text-gray-800 mb-2">Em apenas 2 minutos</h3>
              <p className="text-gray-600 text-sm">
                Preencha os dados, revise e faça o download do seu contrato em PDF
                profissional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Escolha seu plano
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* One-time */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Contrato Avulso
            </h3>
            <p className="text-gray-500 text-sm mb-4">Ideal para uso esporádico</p>
            <div className="text-4xl font-bold text-blue-800 mb-6">
              R$39,90
              <span className="text-base font-normal text-gray-500">
                /contrato
              </span>
            </div>
            <ul className="text-sm text-gray-600 space-y-2 mb-8 flex-1">
              <li>✅ Contrato em PDF profissional</li>
              <li>✅ Personalizado com seus dados</li>
              <li>✅ Download imediato</li>
              <li>✅ Cláusulas adicionais</li>
            </ul>
            <Link
              href="/criar"
              className="block text-center bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Criar contrato
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-xl p-8 flex flex-col relative">
            <div className="absolute -top-3 right-6 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
              MAIS POPULAR
            </div>
            <h3 className="text-lg font-bold mb-1">Plano Pro</h3>
            <p className="text-blue-200 text-sm mb-4">
              Para freelancers ativos
            </p>
            <div className="text-4xl font-bold text-yellow-300 mb-6">
              R$29,90
              <span className="text-base font-normal text-blue-200">
                /mês
              </span>
            </div>
            <ul className="text-sm text-blue-100 space-y-2 mb-8 flex-1">
              <li>✅ Contratos ilimitados</li>
              <li>✅ PDF profissional</li>
              <li>✅ Download imediato</li>
              <li>✅ Todas as cláusulas</li>
              <li>✅ Cancele quando quiser</li>
            </ul>
            <Link
              href="/criar?plan=pro"
              className="block text-center bg-yellow-400 text-blue-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Assinar Pro
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <LegalDisclaimer />
        </div>
      </section>
    </div>
  );
}
