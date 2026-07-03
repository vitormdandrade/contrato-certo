import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { ContractData } from '@/lib/contract-data';

// Register a standard font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
    borderBottom: '2 solid #1a365d',
    paddingBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1a365d',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#4a5568',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 8,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  value: {
    flex: 1,
    color: '#4a5568',
  },
  clause: {
    marginBottom: 5,
    paddingLeft: 10,
    borderLeft: '2 solid #e2e8f0',
  },
  signatureBlock: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureColumn: {
    width: '45%',
    alignItems: 'center',
  },
  signatureLine: {
    borderTop: '1 solid #1a365d',
    width: '100%',
    marginBottom: 5,
    marginTop: 50,
  },
  disclaimer: {
    marginTop: 30,
    padding: 8,
    backgroundColor: '#fffbeb',
    border: '1 solid #f59e0b',
    borderRadius: 4,
    fontSize: 8,
    color: '#92400e',
    textAlign: 'center',
  },
});

function formatDate(dateStr: string): string {
  if (!dateStr) return '___/___/______';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function formatCurrency(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return 'R$ ______';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
}

export default function ContractPDF({ data }: { data: ContractData }) {
  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Contrato de Prestação de Serviços</Text>
          <Text style={styles.subtitle}>
            Contrato particular firmado em {today}
          </Text>
        </View>

        {/* Parties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. DAS PARTES</Text>
          <View style={styles.row}>
            <Text style={styles.label}>CONTRATANTE:</Text>
            <Text style={styles.value}>
              {data.clientName || '______________________'}, inscrito(a) no{' '}
              {data.clientDocument.startsWith('2.') || data.clientDocument.length === 14
                ? 'CNPJ'
                : 'CPF'}{' '}
              sob o nº {data.clientDocument || '______________________'}, residente em{' '}
              {data.clientAddress || '______________________'}, e-mail:{' '}
              {data.clientEmail || '______________________'}.
            </Text>
          </View>
          <View style={{ marginTop: 6 }}>
            <View style={styles.row}>
              <Text style={styles.label}>CONTRATADO(A):</Text>
              <Text style={styles.value}>
                {data.contractorName || '______________________'}, inscrito(a) no{' '}
                {data.contractorDocument.startsWith('2.') || data.contractorDocument.length === 14
                  ? 'CNPJ'
                  : 'CPF'}{' '}
                sob o nº {data.contractorDocument || '______________________'}, residente em{' '}
                {data.contractorAddress || '______________________'}, e-mail:{' '}
                {data.contractorEmail || '______________________'}.
              </Text>
            </View>
          </View>
        </View>

        {/* Object */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. DO OBJETO</Text>
          <Text style={styles.value}>
            O presente contrato tem como objeto a prestação de serviços de{' '}
            {data.serviceType || '______________________'}, conforme descrição abaixo:
          </Text>
          <View style={{ marginTop: 8, paddingHorizontal: 10 }}>
            <Text style={{ color: '#4a5568', fontStyle: 'italic' }}>
              {data.serviceDescription || 'Descrição do serviço a ser detalhada.'}
            </Text>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. DO PREÇO E FORMA DE PAGAMENTO</Text>
          <Text>
            O CONTRATANTE pagará ao CONTRATADO o valor de{' '}
            {formatCurrency(data.serviceValue)} (valor total), a ser pago via{' '}
            {data.paymentMethod || '______________________'}.
          </Text>
        </View>

        {/* Term */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. DO PRAZO</Text>
          <Text>
            O serviço será executado no prazo estipulado, com entrega prevista para{' '}
            {formatDate(data.deliveryDeadline)}. O prazo poderá ser prorrogado mediante
            acordo entre as partes.
          </Text>
        </View>

        {/* Additional Clauses */}
        {(data.confidentiality || data.nonCompete || data.intellectualProperty) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. CLÁUSULAS ADICIONAIS</Text>

            {data.confidentiality && (
              <View style={styles.clause}>
                <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>
                  5.1 Confidencialidade
                </Text>
                <Text>
                  As partes se comprometem a manter o mais absoluto sigilo sobre todas as
                  informações, dados, documentos e especificações técnicas e comerciais
                  que venham a ter conhecimento em decorrência deste contrato, não podendo
                  divulgá-los a terceiros.
                </Text>
              </View>
            )}

            {data.nonCompete && (
              <View style={styles.clause}>
                <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>
                  5.2 Não-Concorrência
                </Text>
                <Text>
                  Durante a vigência deste contrato e pelo período de 6 (seis) meses após
                  seu término, o CONTRATADO se compromete a não prestar serviços
                  similares diretamente para clientes do CONTRATANTE que tenham sido
                  apresentados durante a execução deste contrato.
                </Text>
              </View>
            )}

            {data.intellectualProperty && (
              <View style={styles.clause}>
                <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>
                  5.3 Propriedade Intelectual
                </Text>
                <Text>
                  Todos os direitos de propriedade intelectual sobre os trabalhos
                  desenvolvidos no âmbito deste contrato pertencerão ao CONTRATANTE, após
                  o pagamento integral do valor acordado. O CONTRATADO cede e transfere
                  todos os direitos patrimoniais de autor sobre as obras criadas.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Forum */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. DO FORO</Text>
          <Text>
            Fica eleito o foro da comarca da residência do CONTRATADO para dirimir
            quaisquer dúvidas oriundas deste contrato, com renúncia expressa de qualquer
            outro, por mais privilegiado que seja.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureBlock}>
          <View style={styles.signatureColumn}>
            <Text style={styles.signatureLine} />
            <Text style={{ fontSize: 9 }}>
              {data.clientName || 'CONTRATANTE'}
            </Text>
          </View>
          <View style={styles.signatureColumn}>
            <Text style={styles.signatureLine} />
            <Text style={{ fontSize: 9 }}>
              {data.contractorName || 'CONTRATADO'}
            </Text>
          </View>
        </View>

        {/* Date */}
        <View style={{ marginTop: 15, textAlign: 'center' }}>
          <Text style={{ fontSize: 9, color: '#4a5568' }}>
            {today}
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text>
            Este documento tem caráter informativo. Recomenda-se revisão por profissional
            jurídico. As informações disponibilizadas não substituem a consulta a um
            advogado.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
