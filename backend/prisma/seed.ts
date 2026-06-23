import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js';

const prisma = new PrismaClient();

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

async function main() {
  await prisma.bid.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await hashPassword('senha1234');

  const [maria, joao, leiloeiroSul, leiloeiroImoveis] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Maria Silva',
        email: 'maria@auctionhub.com',
        cpf: '11111111111',
        password: defaultPassword,
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'João Pereira',
        email: 'joao@auctionhub.com',
        cpf: '22222222222',
        password: defaultPassword,
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Casa de Leilões Sul',
        email: 'leiloeiro1@auctionhub.com',
        cpf: '33333333333',
        password: defaultPassword,
        role: 'AUCTIONEER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Leilões Imóveis & Cia',
        email: 'leiloeiro2@auctionhub.com',
        cpf: '44444444444',
        password: defaultPassword,
        role: 'AUCTIONEER',
      },
    }),
  ]);

  const now = Date.now();

  const auctionDefs = [
    {
      title: 'Apartamento 3 quartos - Zona Sul',
      description: 'Apartamento de 90m² com vista para o parque, 2 vagas de garagem, reformado.',
      category: 'IMOVEL' as const,
      city: 'São Paulo',
      state: 'SP',
      startPrice: 350000,
      currentBid: 412000,
      appraisal: 520000,
      startsAt: new Date(now - 2 * DAY),
      endsAt: new Date(now + 6 * HOUR),
      status: 'LIVE' as const,
      auctioneerId: leiloeiroImoveis.id,
    },
    {
      title: 'Casa térrea com quintal - Bairro Jardins',
      description: 'Casa de 150m², 4 quartos, quintal amplo, próxima a escolas e comércio.',
      category: 'IMOVEL' as const,
      city: 'Curitiba',
      state: 'PR',
      startPrice: 280000,
      currentBid: 280000,
      appraisal: 410000,
      startsAt: new Date(now + 1 * DAY),
      endsAt: new Date(now + 8 * DAY),
      status: 'UPCOMING' as const,
      auctioneerId: leiloeiroImoveis.id,
    },
    {
      title: 'Sala comercial - Centro',
      description: 'Sala de 45m² em prédio comercial, pronta para uso, com vaga de garagem.',
      category: 'IMOVEL' as const,
      city: 'Belo Horizonte',
      state: 'MG',
      startPrice: 120000,
      currentBid: 145000,
      appraisal: 190000,
      startsAt: new Date(now - 10 * DAY),
      endsAt: new Date(now - 2 * DAY),
      status: 'CLOSED' as const,
      auctioneerId: leiloeiroImoveis.id,
    },
    {
      title: 'Terreno 500m² - Condomínio fechado',
      description: 'Terreno plano, documentação regularizada, pronto para construir.',
      category: 'IMOVEL' as const,
      city: 'Porto Alegre',
      state: 'RS',
      startPrice: 95000,
      currentBid: 95000,
      appraisal: 140000,
      startsAt: new Date(now + 3 * DAY),
      endsAt: new Date(now + 10 * DAY),
      status: 'UPCOMING' as const,
      auctioneerId: leiloeiroImoveis.id,
    },
    {
      title: 'Honda Civic 2021 - Único dono',
      description: 'Honda Civic EXL 2021, 32.000km, revisões na concessionária, IPVA pago.',
      category: 'VEICULO' as const,
      city: 'São Paulo',
      state: 'SP',
      startPrice: 85000,
      currentBid: 97500,
      appraisal: 120000,
      startsAt: new Date(now - 1 * DAY),
      endsAt: new Date(now + 3 * HOUR),
      status: 'LIVE' as const,
      auctioneerId: leiloeiroSul.id,
    },
    {
      title: 'Fiat Strada 2019 - Cabine dupla',
      description: 'Fiat Strada Freedom 2019, diesel, ar condicionado, pneus novos.',
      category: 'VEICULO' as const,
      city: 'Campinas',
      state: 'SP',
      startPrice: 60000,
      currentBid: 68000,
      appraisal: 82000,
      startsAt: new Date(now - 5 * DAY),
      endsAt: new Date(now - 1 * DAY),
      status: 'CLOSED' as const,
      auctioneerId: leiloeiroSul.id,
    },
    {
      title: 'Yamaha MT-07 2022',
      description: 'Moto com 8.000km, revisões em dia, único dono, documentação ok.',
      category: 'VEICULO' as const,
      city: 'Rio de Janeiro',
      state: 'RJ',
      startPrice: 35000,
      currentBid: 35000,
      appraisal: 48000,
      startsAt: new Date(now + 2 * DAY),
      endsAt: new Date(now + 9 * DAY),
      status: 'UPCOMING' as const,
      auctioneerId: leiloeiroSul.id,
    },
    {
      title: 'Toyota Corolla 2020 - GLi',
      description: 'Corolla GLi 2020, automático, completo, baixa quilometragem.',
      category: 'VEICULO' as const,
      city: 'Florianópolis',
      state: 'SC',
      startPrice: 90000,
      currentBid: 104000,
      appraisal: 130000,
      startsAt: new Date(now - 3 * DAY),
      endsAt: new Date(now + 12 * HOUR),
      status: 'LIVE' as const,
      auctioneerId: leiloeiroSul.id,
    },
    {
      title: 'Lote de eletrônicos diversos',
      description: 'Notebooks, monitores e periféricos recondicionados, lote único.',
      category: 'OUTROS' as const,
      city: 'São Paulo',
      state: 'SP',
      startPrice: 8000,
      currentBid: 9200,
      appraisal: 14000,
      startsAt: new Date(now - 4 * DAY),
      endsAt: new Date(now + 5 * HOUR),
      status: 'LIVE' as const,
      auctioneerId: leiloeiroSul.id,
    },
    {
      title: 'Maquinário industrial - Marcenaria',
      description: 'Conjunto de máquinas de marcenaria, revisadas, prontas para uso.',
      category: 'MAQUINA' as const,
      city: 'Joinville',
      state: 'SC',
      startPrice: 22000,
      currentBid: 22000,
      appraisal: 35000,
      startsAt: new Date(now + 4 * DAY),
      endsAt: new Date(now + 11 * DAY),
      status: 'UPCOMING' as const,
      auctioneerId: leiloeiroSul.id,
    },
    {
      title: 'Galpão logístico 1.200m² - Distrito Industrial',
      description: 'Galpão com pé-direito alto, docas para carga, escritório e estacionamento.',
      category: 'GALPAO' as const,
      city: 'Guarulhos',
      state: 'SP',
      startPrice: 480000,
      currentBid: 540000,
      appraisal: 720000,
      startsAt: new Date(now - 2 * DAY),
      endsAt: new Date(now + 9 * HOUR),
      status: 'LIVE' as const,
      auctioneerId: leiloeiroImoveis.id,
    },
    {
      title: 'Galpão comercial 600m² - Rod. Anhanguera',
      description: 'Galpão comercial com mezanino, ideal para estoque ou distribuição.',
      category: 'GALPAO' as const,
      city: 'Cajamar',
      state: 'SP',
      startPrice: 300000,
      currentBid: 300000,
      appraisal: 450000,
      startsAt: new Date(now + 2 * DAY),
      endsAt: new Date(now + 9 * DAY),
      status: 'UPCOMING' as const,
      auctioneerId: leiloeiroImoveis.id,
    },
    {
      title: 'Escavadeira hidráulica CAT 320',
      description: 'Escavadeira Caterpillar 320, 6.500h, manutenção em dia, pronta para operar.',
      category: 'MAQUINA' as const,
      city: 'Betim',
      state: 'MG',
      startPrice: 180000,
      currentBid: 210000,
      appraisal: 280000,
      startsAt: new Date(now - 1 * DAY),
      endsAt: new Date(now + 7 * HOUR),
      status: 'LIVE' as const,
      auctioneerId: leiloeiroSul.id,
    },
    {
      title: 'Lancha 28 pés - Bicombustível',
      description: 'Lancha 28 pés, motor revisado, capacidade para 10 pessoas, com reboque.',
      category: 'EMBARCACAO' as const,
      city: 'Angra dos Reis',
      state: 'RJ',
      startPrice: 220000,
      currentBid: 248000,
      appraisal: 320000,
      startsAt: new Date(now - 2 * DAY),
      endsAt: new Date(now + 11 * HOUR),
      status: 'LIVE' as const,
      auctioneerId: leiloeiroSul.id,
    },
    {
      title: 'Jet ski Sea-Doo GTI 130',
      description: 'Jet ski Sea-Doo GTI 130, baixas horas de uso, revisado, com reboque.',
      category: 'EMBARCACAO' as const,
      city: 'Florianópolis',
      state: 'SC',
      startPrice: 35000,
      currentBid: 35000,
      appraisal: 52000,
      startsAt: new Date(now + 1 * DAY),
      endsAt: new Date(now + 5 * DAY),
      status: 'UPCOMING' as const,
      auctioneerId: leiloeiroSul.id,
    },
    {
      title: 'Coleção de relógios vintage',
      description: 'Lote com 6 relógios de pulso vintage, restaurados, com certificado.',
      category: 'OUTROS' as const,
      city: 'Rio de Janeiro',
      state: 'RJ',
      startPrice: 4000,
      currentBid: 5400,
      appraisal: 7000,
      startsAt: new Date(now - 8 * DAY),
      endsAt: new Date(now - 3 * DAY),
      status: 'CLOSED' as const,
      auctioneerId: leiloeiroImoveis.id,
    },
  ];

  const auctions = [];

  for (const def of auctionDefs) {
    const auction = await prisma.auction.create({
      data: {
        title: def.title,
        description: def.description,
        category: def.category,
        images: [],
        city: def.city,
        state: def.state,
        startPrice: def.startPrice,
        currentBid: def.currentBid,
        appraisal: def.appraisal,
        startsAt: def.startsAt,
        endsAt: def.endsAt,
        status: def.status,
        auctioneerId: def.auctioneerId,
      },
    });
    auctions.push(auction);
  }

  const bidders = [maria, joao];

  for (const auction of auctions) {
    if (auction.status === 'UPCOMING') continue;

    const startPrice = Number(auction.startPrice);
    const finalBid = Number(auction.currentBid);
    const steps = 3;
    const increment = (finalBid - startPrice) / steps;

    for (let i = 1; i <= steps; i++) {
      const bidder = bidders[i % bidders.length]!;
      await prisma.bid.create({
        data: {
          value: Math.round(startPrice + increment * i),
          userId: bidder.id,
          auctionId: auction.id,
          createdAt: new Date(auction.startsAt.getTime() + i * HOUR),
        },
      });
    }
  }

  await prisma.favorite.createMany({
    data: [
      { userId: maria.id, auctionId: auctions[0]!.id },
      { userId: maria.id, auctionId: auctions[4]!.id },
      { userId: joao.id, auctionId: auctions[7]!.id },
    ],
  });

  console.log(`Seed complete: ${auctions.length} auctions, 4 users.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
