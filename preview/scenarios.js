const PAGE_URL = "https://example.com/guides/metadata-audit";

const baseMetadata = {
  title: "Metadata Audit Guide",
  metaTitle: null,
  metaDescription:
    "Inspect live metadata, heading structure, and structured data before publishing.",
  canonicalUrl: PAGE_URL,
  language: "ko",
  charset: "UTF-8",
  viewport: "width=device-width, initial-scale=1",
  favicon: "https://example.com/favicon.ico",
  themeColor: "#0b0c0f",
  hreflang: [],
  ogTitle: "Metadata Audit Guide",
  ogDescription:
    "Inspect live metadata, heading structure, and structured data before publishing.",
  ogType: "article",
  ogSiteName: "Example Guides",
  ogUrl: PAGE_URL,
  ogImage: "https://example.com/images/metadata-audit.png",
  metaRobots: "index, follow",
  metaStorebotGoogle: null,
  headings: [],
};

const defaultHttpInfo = {
  status: 200,
  statusText: "OK",
  finalUrl: PAGE_URL,
  redirected: false,
  contentType: "text/html; charset=utf-8",
  xRobotsTag: null,
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "메타데이터 점검을 위한 실전 가이드",
  description:
    "검색 엔진과 AI 크롤러가 읽는 페이지 정보를 점검하는 방법을 소개합니다.",
  image: "https://example.com/images/metadata-audit.png",
  datePublished: "2026-07-24",
  dateModified: "2026-07-30",
  author: {
    "@type": "Person",
    name: "Flik",
  },
  publisher: {
    "@type": "Organization",
    name: "Example Guides",
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Meta Checker Pro",
  description: "Metadata inspection toolkit for publishing teams.",
  image: "https://example.com/images/meta-checker-pro.png",
  sku: "MC-PRO-2026",
  brand: {
    "@type": "Brand",
    name: "Meta Checker",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "128",
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "29.00",
    availability: "https://schema.org/InStock",
  },
};

const graphJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      name: "Example Guides",
      url: "https://example.com/",
    },
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      name: "Example",
      url: "https://example.com/",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://example.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guides",
          item: "https://example.com/guides",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Metadata Audit",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

const commonHeadings = [
  { index: 0, level: 1, text: "Meta Checker로 페이지 진단하기" },
  { index: 1, level: 2, text: "메타데이터가 중요한 이유" },
  { index: 2, level: 3, text: "검색 엔진이 읽는 정보" },
  { index: 3, level: 3, text: "현재 DOM과 원본 HTML 비교" },
  { index: 4, level: 2, text: "검사 결과 이해하기" },
  { index: 5, level: 3, text: "상태별 의미" },
  { index: 6, level: 4, text: "변경된 메타 태그" },
  { index: 7, level: 2, text: "배포 전 체크리스트" },
];

const manyHeadings = Array.from({ length: 28 }, (_, index) => {
  const pattern = [1, 2, 3, 3, 4, 2, 3];
  const level = pattern[index % pattern.length];
  return {
    index,
    level,
    text:
      index === 12
        ? ""
        : `${index + 1}. ${
            level === 1
              ? "페이지의 핵심 주제"
              : level === 2
              ? "주요 검사 항목"
              : level === 3
              ? "세부 메타데이터 확인 방법"
              : "아주 긴 제목이 팝업 너비에서 어떻게 잘리는지 확인하는 테스트 항목"
          }`,
  };
});

export const previewScenarios = {
  article: {
    label: "Article",
    description: "Article JSON-LD와 일반적인 제목 구조",
    pageUrl: PAGE_URL,
    metadata: {
      ...baseMetadata,
      title: "메타데이터 점검을 위한 실전 가이드",
      ogTitle: "메타데이터 점검을 위한 실전 가이드",
      headings: commonHeadings,
    },
    originalMetadata: {
      ...baseMetadata,
      headings: commonHeadings,
    },
    jsonldData: [articleJsonLd],
    jsonldErrors: [],
    jsonldTotal: 1,
    httpInfo: defaultHttpInfo,
  },
  product: {
    label: "Product",
    description: "가격, 재고, 평점이 포함된 Product 데이터",
    pageUrl: "https://example.com/products/meta-checker-pro",
    metadata: {
      ...baseMetadata,
      title: "Meta Checker Pro",
      canonicalUrl: "https://example.com/products/meta-checker-pro",
      ogTitle: "Meta Checker Pro",
      ogType: "product",
      ogUrl: "https://example.com/products/meta-checker-pro",
      headings: [
        { index: 0, level: 1, text: "Meta Checker Pro" },
        { index: 1, level: 2, text: "주요 기능" },
        { index: 2, level: 2, text: "사용자 평가" },
        { index: 3, level: 2, text: "가격 안내" },
      ],
    },
    jsonldData: [productJsonLd],
    jsonldErrors: [],
    jsonldTotal: 1,
    httpInfo: {
      ...defaultHttpInfo,
      finalUrl: "https://example.com/products/meta-checker-pro",
    },
  },
  graph: {
    label: "@graph",
    description: "여러 엔티티와 Breadcrumb가 연결된 데이터",
    pageUrl: PAGE_URL,
    metadata: {
      ...baseMetadata,
      headings: commonHeadings.slice(0, 5),
    },
    jsonldData: [graphJsonLd, articleJsonLd],
    jsonldErrors: [],
    jsonldTotal: 2,
    httpInfo: defaultHttpInfo,
  },
  "many-headings": {
    label: "긴 제목 구조",
    description: "H1–H4가 많고 긴 제목과 빈 제목이 포함된 페이지",
    pageUrl: "https://example.com/long-document",
    metadata: {
      ...baseMetadata,
      title: "Long-form document",
      canonicalUrl: "https://example.com/long-document",
      headings: manyHeadings,
    },
    jsonldData: [],
    jsonldErrors: [],
    jsonldTotal: 0,
    httpInfo: defaultHttpInfo,
  },
  "jsonld-error": {
    label: "JSON-LD 오류",
    description: "정상 블록과 파싱 오류가 함께 있는 상태",
    pageUrl: PAGE_URL,
    metadata: {
      ...baseMetadata,
      headings: commonHeadings.slice(0, 4),
    },
    jsonldData: [articleJsonLd],
    jsonldErrors: [
      "Block 2: Expected ',' or '}' after property value at position 184",
    ],
    jsonldTotal: 2,
    httpInfo: defaultHttpInfo,
  },
  empty: {
    label: "빈 페이지",
    description: "메타데이터, 제목, JSON-LD가 거의 없는 상태",
    pageUrl: "https://example.com/empty",
    metadata: {
      ...baseMetadata,
      title: "",
      metaDescription: null,
      canonicalUrl: null,
      ogTitle: null,
      ogDescription: null,
      ogType: null,
      ogSiteName: null,
      ogUrl: null,
      ogImage: null,
      metaRobots: null,
      headings: [],
    },
    originalMetadata: {},
    jsonldData: [],
    jsonldErrors: [],
    jsonldTotal: 0,
    httpInfo: {
      ...defaultHttpInfo,
      finalUrl: "https://example.com/empty",
    },
  },
};

export const defaultPreviewScenario = "article";

export function getPreviewScenario(id) {
  return (
    previewScenarios[id] || previewScenarios[defaultPreviewScenario]
  );
}
