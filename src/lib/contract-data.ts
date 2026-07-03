export interface ContractData {
  // Service type
  serviceType: string;

  // Contractor (freelancer) info
  contractorName: string;
  contractorDocument: string;
  contractorAddress: string;
  contractorEmail: string;

  // Client info
  clientName: string;
  clientDocument: string;
  clientAddress: string;
  clientEmail: string;

  // Service details
  serviceDescription: string;
  deliveryDeadline: string;
  serviceValue: string;
  paymentMethod: string;

  // Additional clauses
  confidentiality: boolean;
  nonCompete: boolean;
  intellectualProperty: boolean;

  // Plan
  plan: 'one_time' | 'pro';
}

export const SERVICE_TYPES = [
  'Design gráfico',
  'Desenvolvimento de software',
  'Fotografia',
  'Consultoria',
  'Marketing digital',
  'Aulas particulares',
  'Outros',
];

export const PAYMENT_METHODS = [
  'PIX',
  'Transferência bancária',
  'Boleto',
  'Cartão de crédito',
  'Dinheiro',
];

export const PRICES = {
  one_time: 3990, // R$39,90 in cents
  pro: 2990, // R$29,90/month in cents
};

export const LEGAL_DISCLAIMER =
  'As informações disponibilizadas neste site têm caráter meramente informativo e não substituem a consulta a um advogado. Recomendamos a revisão do documento por um profissional jurídico antes da utilização.';
