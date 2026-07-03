import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PRICES } from '@/lib/contract-data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan, contractData } = body;

    const priceId = plan === 'pro' ? PRICES.pro : PRICES.one_time;
    const planName =
      plan === 'pro' ? 'Plano Pro — Contratos Ilimitados' : 'Contrato Avulso';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: plan === 'pro' ? 'subscription' : 'payment',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: planName,
              description: `Contrato de prestação de serviços — ${contractData?.serviceType || 'Serviço'}`,
            },
            unit_amount: priceId,
            ...(plan === 'pro' && {
              recurring: {
                interval: 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan,
        contractData: JSON.stringify(contractData || {}),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/criar`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar checkout' },
      { status: 500 }
    );
  }
}
