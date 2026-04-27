export const polos = [
  {
    id: 1,
    name: "Polo Barra Funda",
    slug: "barra-funda",
    city: "São Paulo",
    state: "SP",
    address: "Rua do Bosque, 1621 - Loja 2 - Barra Funda",
    fullAddress: "Rua do Bosque, 1621 - Loja 2 - Barra Funda, São Paulo - SP, 01136-001",
    phone: "(11) 97227-9419",
    academicPhone: "(11) 99279-3249",
    commercialPhone: "(11) 99267-9423",
    image: "/anhang Polo barra  funda.png",
    courses: ["Graduação", "Pós-Graduação", "EAD"],
    description: "O Polo Barra Funda está localizado em uma das regiões mais estratégicas de São Paulo, oferecendo fácil acesso através do transporte público. Nossa unidade conta com infraestrutura moderna e completa para proporcionar a melhor experiência educacional aos nossos alunos.",
    facilities: [
      "Salas de aula climatizadas",
      "Laboratório de informática",
      "Biblioteca com acervo digital",
      "Área de convivência",
      "Estacionamento",
      "Acessibilidade completa"
    ],
    coordinates: {
      lat: -23.5267,
      lng: -46.6658
    }
  },
  {
    id: 2,
    name: "Polo Santo Amaro", 
    slug: "santo-amaro",
    city: "São Paulo",
    state: "SP",
    address: "Lr. 13 de Maio, 520 - 1° andar/Sala 14 - Santo Amaro",
    fullAddress: "Largo 13 de Maio, 520 - 1° andar/Sala 14 - Santo Amaro, São Paulo - SP",
    phone: "(11) 97227-9419",
    academicPhone: "(11) 99279-3249",
    commercialPhone: "(11) 99267-9423",
    image: "/anhang Polo santo amaro.png",
    courses: ["Graduação", "Pós-Graduação"],
    description: "Localizado na zona sul de São Paulo, o Polo Santo Amaro oferece um ambiente acadêmico acolhedor e moderno. Com fácil acesso e infraestrutura de qualidade, proporcionamos aos nossos estudantes todas as condições necessárias para uma formação de excelência.",
    facilities: [
      "Salas de aula equipadas",
      "Centro de recursos digitais",
      "Espaço para estudos",
      "Cantina",
      "Segurança 24h",
      "Acessibilidade"
    ],
    coordinates: {
      lat: -23.6547,
      lng: -46.7056
    }
  },
  {
    id: 3,
    name: "Polo Itaquaquecetuba",
    slug: "itaquaquecetuba",
    city: "Itaquaquecetuba", 
    state: "SP",
    address: "Rua Acácia, 37 - 1° andar/Sala 40 - Jardim dos Ipês/Jardim Odete",
    fullAddress: "Rua Acácia, 37 - 1° andar/Sala 40 - Jardim dos Ipês/Jardim Odete, Itaquaquecetuba - SP, 08577-000",
    phone: "(11) 97227-9419",
    academicPhone: "(11) 99279-3249",
    commercialPhone: "(11) 99267-9423",
    image: "/anhang Polo itaqua.png",
    courses: ["Graduação", "EAD"],
    description: "O Polo Itaquaquecetuba atende a região do Alto Tietê com uma proposta educacional inovadora. Nossa unidade oferece cursos de graduação e EAD com toda a qualidade Anhanguera, em um ambiente preparado para o aprendizado e desenvolvimento profissional.",
    facilities: [
      "Salas multimídia",
      "Laboratório de práticas",
      "Biblioteca digital",
      "Área de convivência",
      "Estacionamento gratuito",
      "Acessibilidade total"
    ],
    coordinates: {
      lat: -23.4864,
      lng: -46.3483
    }
  },
  {
    id: 4,
    name: "Polo Campo Limpo",
    slug: "campo-limpo",
    city: "São Paulo",
    state: "SP", 
    address: "Avenida das Belezas, 704 - Campo Limpo/Vila Plana",
    fullAddress: "Avenida das Belezas, 704 - Campo Limpo/Vila Plana, São Paulo - SP, 05835-001",
    phone: "(11) 97227-9419",
    academicPhone: "(11) 99279-3249",
    commercialPhone: "(11) 99267-9423",
    image: "/anhang Polo campo limpo.png",
    courses: ["Graduação", "Pós-Graduação", "EAD"],
    description: "Situado na zona sul de São Paulo, o Polo Campo Limpo oferece uma ampla gama de cursos em um ambiente moderno e acolhedor. Nossa infraestrutura foi pensada para proporcionar a melhor experiência educacional, com tecnologia de ponta e espaços confortáveis.",
    facilities: [
      "Salas de aula modernas",
      "Laboratório de informática avançado",
      "Centro de estudos",
      "Auditório",
      "Área de alimentação",
      "Acessibilidade completa"
    ],
    coordinates: {
      lat: -23.6289,
      lng: -46.7664
    }
  },
  {
    id: 5,
    name: "Polo Osasco",
    slug: "osasco",
    city: "Osasco",
    state: "SP",
    address: "Avenida Cruzeiro do Sul, 1066 - Sala 2 - Rochdale",
    fullAddress: "Avenida Cruzeiro do Sul, 1066 - Sala 2 - Rochdale, Osasco - SP, 06226-000",
    phone: "(11) 97227-9419", 
    academicPhone: "(11) 99279-3249",
    commercialPhone: "(11) 99267-9423",
    image: "/anhang Polo osasco.png",
    courses: ["Graduação", "Pós-Graduação", "EAD"],
    description: "O Polo Osasco representa nossa presença na região metropolitana de São Paulo, oferecendo ensino de qualidade com infraestrutura completa. Localizado em área de fácil acesso, nosso polo proporciona um ambiente ideal para o desenvolvimento acadêmico e profissional.",
    facilities: [
      "Salas climatizadas e equipadas",
      "Laboratórios especializados",
      "Biblioteca com acervo físico e digital",
      "Espaços de convivência",
      "Estacionamento amplo",
      "Total acessibilidade"
    ],
    coordinates: {
      lat: -23.5329,
      lng: -46.7918
    }
  }
];

export const getPoloBySlug = (slug: string) => {
  return polos.find(polo => polo.slug === slug);
};