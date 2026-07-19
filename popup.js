import buildRow from "./ui/row.js";
import extractMetadataFromRawHTML from "./core/extractMetaDataFromRawHTML.js";
import {
  toMetaTag,
  toTitleTag,
  toLinkTag,
  escapeHtml,
} from "./core/formatToTag.js";
import getState from "./core/getState.js";
import { getSectionList } from "./ui/section.js";
import { getStateHelp } from "./ui/chip.js";

const LANGUAGE_STORAGE_KEY = "meta-checker-language";
const DISPLAY_STORAGE_KEY = "meta-checker-visible-items";
const supportedLocales = new Set(["en", "ko", "ja", "es", "pt_BR"]);
const storedLocale = localStorage.getItem(LANGUAGE_STORAGE_KEY);
const locale = supportedLocales.has(storedLocale) ? storedLocale : "en";
document.documentElement.lang = locale === "pt_BR" ? "pt-BR" : locale;

const messages = {
  en: {
    reload: "Reload",
    unableToInspect: "Unable to inspect tab",
    noMetadata: "No Metadata",
    basic: "Basic",
    document: "Document",
    languages: "Languages",
    openGraph: "Open Graph",
    etc: "Etc",
    httpResponse: "HTTP Response",
    jsonLdSummary: "JSON-LD Summary",
    title: "title",
    metaTitle: "meta title",
    metaDescription: "meta description",
    canonicalUrl: "canonical url",
    charset: "charset",
    viewport: "viewport",
    favicon: "favicon",
    themeColor: "theme-color",
    htmlLang: "html lang",
    hreflang: "hreflang",
    blocks: "blocks",
    valid: "valid",
    invalid: "invalid",
    types: "@type",
    parseErrors: "parse errors",
    raw: "Raw",
    noValidJsonLd: "No valid JSON-LD",
    status: "status",
    finalUrl: "final url",
    redirected: "redirected",
    contentType: "content-type",
    xRobotsTag: "x-robots-tag",
    error: "error",
    yes: "Yes",
    no: "No",
    stateHelp: "State help",
    stateHelpTitle: "Metadata state guide",
    stateHelpIntro:
      "States compare metadata in the current DOM with the original HTML response.",
    close: "Close",
    displaySettings: "Display settings",
    displaySettingsTitle: "Choose visible metadata",
    displaySettingsIntro:
      "Select an entire section or choose individual items to show.",
    save: "Apply",
    resetDefaults: "Reset defaults",
    inspectionStatus: "Inspection status",
    message: "message",
    protectedPageMessage:
      "Chrome-protected pages cannot be inspected. Open a regular website and try again.",
    inspectionFailedMessage: "Metadata could not be read from this page.",
    noJsonLd: "No JSON-LD",
    loadingMetadata: "Loading metadata…",
  },
  ko: {
    reload: "새로고침",
    unableToInspect: "탭을 확인할 수 없음",
    noMetadata: "메타데이터 없음",
    basic: "기본 정보",
    document: "문서 정보",
    languages: "다국어 정보",
    openGraph: "오픈 그래프",
    etc: "기타",
    httpResponse: "HTTP 응답",
    jsonLdSummary: "JSON-LD 요약",
    title: "제목",
    metaTitle: "메타 제목",
    metaDescription: "메타 설명",
    canonicalUrl: "대표 URL",
    charset: "문자 인코딩",
    viewport: "뷰포트",
    favicon: "파비콘",
    themeColor: "테마 색상",
    htmlLang: "문서 언어",
    hreflang: "대체 언어",
    blocks: "전체 블록",
    valid: "정상",
    invalid: "오류",
    types: "@type",
    parseErrors: "파싱 오류",
    raw: "원문",
    noValidJsonLd: "정상 JSON-LD 없음",
    status: "상태",
    finalUrl: "최종 URL",
    redirected: "리디렉션",
    contentType: "콘텐츠 유형",
    xRobotsTag: "X-Robots-Tag",
    error: "오류",
    yes: "예",
    no: "아니요",
    stateHelp: "상태 도움말",
    stateHelpTitle: "메타데이터 상태 안내",
    stateHelpIntro:
      "현재 DOM의 메타데이터를 최초 HTML 응답과 비교한 결과입니다.",
    close: "닫기",
    displaySettings: "표시 설정",
    displaySettingsTitle: "표시할 메타데이터 선택",
    displaySettingsIntro:
      "섹션 전체 또는 화면에 표시할 개별 항목을 선택하세요.",
    save: "적용",
    resetDefaults: "기본값 복원",
    inspectionStatus: "검사 상태",
    message: "안내",
    protectedPageMessage:
      "Chrome 보호 페이지는 확장 프로그램에서 검사할 수 없습니다. 일반 웹사이트를 열고 다시 시도하세요.",
    inspectionFailedMessage: "이 페이지에서 메타데이터를 읽지 못했습니다.",
    noJsonLd: "JSON-LD 없음",
    loadingMetadata: "메타데이터 불러오는 중…",
  },
  ja: {
    reload: "再読み込み",
    unableToInspect: "タブを検査できません",
    noMetadata: "メタデータなし",
    basic: "基本情報",
    document: "ドキュメント情報",
    languages: "言語情報",
    openGraph: "Open Graph",
    etc: "その他",
    httpResponse: "HTTP レスポンス",
    jsonLdSummary: "JSON-LD サマリー",
    title: "タイトル",
    metaTitle: "メタタイトル",
    metaDescription: "メタディスクリプション",
    canonicalUrl: "正規 URL",
    charset: "文字エンコーディング",
    viewport: "ビューポート",
    favicon: "ファビコン",
    themeColor: "テーマカラー",
    htmlLang: "ドキュメント言語",
    hreflang: "代替言語",
    blocks: "ブロック数",
    valid: "有効",
    invalid: "エラー",
    types: "@type",
    parseErrors: "解析エラー",
    raw: "生データ",
    noValidJsonLd: "有効な JSON-LD なし",
    status: "ステータス",
    finalUrl: "最終 URL",
    redirected: "リダイレクト",
    contentType: "コンテンツタイプ",
    xRobotsTag: "X-Robots-Tag",
    error: "エラー",
    yes: "はい",
    no: "いいえ",
    stateHelp: "状態ヘルプ",
    stateHelpTitle: "メタデータ状態ガイド",
    stateHelpIntro:
      "現在の DOM のメタデータを元の HTML レスポンスと比較した結果です。",
    close: "閉じる",
    displaySettings: "表示設定",
    displaySettingsTitle: "表示するメタデータを選択",
    displaySettingsIntro:
      "セクション全体または表示する個別項目を選択してください。",
    save: "適用",
    resetDefaults: "初期設定に戻す",
    inspectionStatus: "検査ステータス",
    message: "メッセージ",
    protectedPageMessage:
      "Chrome の保護ページは拡張機能で検査できません。通常のウェブサイトを開いて再試行してください。",
    inspectionFailedMessage: "このページのメタデータを読み取れませんでした。",
    noJsonLd: "JSON-LD なし",
    loadingMetadata: "メタデータを読み込み中…",
  },
  es: {
    reload: "Actualizar",
    unableToInspect: "No se puede inspeccionar la pestaña",
    noMetadata: "Sin metadatos",
    basic: "Información básica",
    document: "Documento",
    languages: "Idiomas",
    openGraph: "Open Graph",
    etc: "Otros",
    httpResponse: "Respuesta HTTP",
    jsonLdSummary: "Resumen JSON-LD",
    title: "título",
    metaTitle: "meta título",
    metaDescription: "meta descripción",
    canonicalUrl: "URL canónica",
    charset: "codificación",
    viewport: "viewport",
    favicon: "favicon",
    themeColor: "color del tema",
    htmlLang: "idioma del documento",
    hreflang: "idiomas alternativos",
    blocks: "bloques",
    valid: "válidos",
    invalid: "errores",
    types: "@type",
    parseErrors: "errores de análisis",
    raw: "Original",
    noValidJsonLd: "No hay JSON-LD válido",
    status: "estado",
    finalUrl: "URL final",
    redirected: "redirección",
    contentType: "tipo de contenido",
    xRobotsTag: "X-Robots-Tag",
    error: "error",
    yes: "Sí",
    no: "No",
    stateHelp: "Ayuda de estados",
    stateHelpTitle: "Guía de estados de metadatos",
    stateHelpIntro:
      "Los estados comparan los metadatos del DOM actual con la respuesta HTML original.",
    close: "Cerrar",
    displaySettings: "Configuración de visualización",
    displaySettingsTitle: "Elegir metadatos visibles",
    displaySettingsIntro:
      "Selecciona una sección completa o los elementos individuales que quieras mostrar.",
    save: "Aplicar",
    resetDefaults: "Restaurar valores predeterminados",
    inspectionStatus: "Estado de inspección",
    message: "mensaje",
    protectedPageMessage:
      "Las páginas protegidas de Chrome no se pueden inspeccionar. Abre un sitio web normal e inténtalo de nuevo.",
    inspectionFailedMessage: "No se pudieron leer los metadatos de esta página.",
    noJsonLd: "Sin JSON-LD",
    loadingMetadata: "Cargando metadatos…",
  },
  pt_BR: {
    reload: "Atualizar",
    unableToInspect: "Não foi possível inspecionar a guia",
    noMetadata: "Sem metadados",
    basic: "Informações básicas",
    document: "Documento",
    languages: "Idiomas",
    openGraph: "Open Graph",
    etc: "Outros",
    httpResponse: "Resposta HTTP",
    jsonLdSummary: "Resumo JSON-LD",
    title: "título",
    metaTitle: "meta título",
    metaDescription: "meta descrição",
    canonicalUrl: "URL canônica",
    charset: "codificação",
    viewport: "viewport",
    favicon: "favicon",
    themeColor: "cor do tema",
    htmlLang: "idioma do documento",
    hreflang: "idiomas alternativos",
    blocks: "blocos",
    valid: "válidos",
    invalid: "erros",
    types: "@type",
    parseErrors: "erros de análise",
    raw: "Original",
    noValidJsonLd: "Nenhum JSON-LD válido",
    status: "status",
    finalUrl: "URL final",
    redirected: "redirecionamento",
    contentType: "tipo de conteúdo",
    xRobotsTag: "X-Robots-Tag",
    error: "erro",
    yes: "Sim",
    no: "Não",
    stateHelp: "Ajuda de estados",
    stateHelpTitle: "Guia de estados dos metadados",
    stateHelpIntro:
      "Os estados comparam os metadados do DOM atual com a resposta HTML original.",
    close: "Fechar",
    displaySettings: "Configurações de exibição",
    displaySettingsTitle: "Escolher metadados visíveis",
    displaySettingsIntro:
      "Selecione uma seção inteira ou os itens individuais que deseja exibir.",
    save: "Aplicar",
    resetDefaults: "Restaurar padrões",
    inspectionStatus: "Status da inspeção",
    message: "mensagem",
    protectedPageMessage:
      "As páginas protegidas do Chrome não podem ser inspecionadas. Abra um site comum e tente novamente.",
    inspectionFailedMessage: "Não foi possível ler os metadados desta página.",
    noJsonLd: "Sem JSON-LD",
    loadingMetadata: "Carregando metadados…",
  },
};

const t = (key) => messages[locale][key] ?? key;
const sourceValue = (current, original) => original ?? current;

const defaultVisibleItems = new Set([
  "basic.title",
  "basic.meta-description",
  "basic.canonical-url",
  "open-graph.og-title",
  "open-graph.og-description",
  "open-graph.og-url",
  "open-graph.og-image",
  "etc.robots",
  "http-response.status",
  "http-response.final-url",
  "http-response.x-robots-tag",
  "http-response.error",
  "jsonld.blocks",
  "jsonld.invalid",
  "jsonld.types",
]);

function getDisplaySections() {
  return [
    {
      id: "basic",
      label: t("basic"),
      items: [
        ["title", t("title")],
        ["meta-title", t("metaTitle")],
        ["meta-description", t("metaDescription")],
        ["canonical-url", t("canonicalUrl")],
      ],
    },
    {
      id: "languages",
      label: t("languages"),
      items: [
        ["html-lang", t("htmlLang")],
        ["hreflang", t("hreflang")],
      ],
    },
    {
      id: "open-graph",
      label: t("openGraph"),
      items: [
        ["og-title", "og:title"],
        ["og-description", "og:description"],
        ["og-type", "og:type"],
        ["og-site-name", "og:site_name"],
        ["og-url", "og:url"],
        ["og-image", "og:image"],
      ],
    },
    {
      id: "etc",
      label: t("etc"),
      items: [
        ["robots", "robots"],
        ["storebot-google", "Storebot-Google"],
      ],
    },
    {
      id: "http-response",
      label: t("httpResponse"),
      items: [
        ["status", t("status")],
        ["final-url", t("finalUrl")],
        ["redirected", t("redirected")],
        ["content-type", t("contentType")],
        ["x-robots-tag", t("xRobotsTag")],
        ["error", t("error")],
      ],
    },
    {
      id: "jsonld",
      label: t("jsonLdSummary"),
      items: [
        ["blocks", t("blocks")],
        ["valid", t("valid")],
        ["invalid", t("invalid")],
        ["types", t("types")],
        ["parse-errors", t("parseErrors")],
      ],
    },
    {
      id: "document",
      label: t("document"),
      items: [
        ["charset", t("charset")],
        ["viewport", t("viewport")],
        ["favicon", t("favicon")],
        ["theme-color", t("themeColor")],
      ],
    },
  ];
}

function loadVisibleItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(DISPLAY_STORAGE_KEY));
    return Array.isArray(saved) ? new Set(saved) : new Set(defaultVisibleItems);
  } catch {
    return new Set(defaultVisibleItems);
  }
}

const visibleItems = loadVisibleItems();

function filterVisibleRows(sectionId, rows) {
  return rows.filter((row) => visibleItems.has(`${sectionId}.${row.id}`));
}

function getVisibleSection(sectionId, title, rows, defaultCollapsed = false) {
  const visibleRows = filterVisibleRows(sectionId, rows);
  return visibleRows.length
    ? getSectionList(
        title,
        visibleRows,
        getSectionOptions(sectionId, defaultCollapsed)
      )
    : null;
}

function getSectionOptions(id, defaultCollapsed = false) {
  const saved = localStorage.getItem(`meta-checker-section-${id}`);
  return {
    id,
    collapsed: saved == null ? defaultCollapsed : saved === "true",
  };
}

function isProtectedBrowserPage(url = "") {
  return /^(chrome|chrome-extension|edge|about):/i.test(url);
}

function getInspectionErrorRows(url) {
  return [
    {
      key: t("message"),
      value: isProtectedBrowserPage(url)
        ? t("protectedPageMessage")
        : t("inspectionFailedMessage"),
    },
  ];
}

function formatHreflang(items) {
  if (!items?.length) return null;
  return items.map(({ language, href }) => `${language}: ${href}`).join("\n");
}

function toHtmlLangTag(language) {
  return language == null
    ? null
    : escapeHtml(`<html lang="${language}">`);
}

function toCharsetTag(charset) {
  return charset == null
    ? null
    : escapeHtml(`<meta charset="${charset}">`);
}

function toHreflangTags(items) {
  if (!items?.length) return null;
  return items
    .map(({ language, href }) =>
      escapeHtml(
        `<link rel="alternate" hreflang="${language}" href="${href}">`
      )
    )
    .join("\n");
}

function collectJsonLdTypes(jsonldData) {
  const types = new Set();

  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") return;

    const type = value["@type"];
    if (Array.isArray(type)) type.forEach((item) => types.add(String(item)));
    else if (type) types.add(String(type));

    Object.values(value).forEach(visit);
  };

  visit(jsonldData);
  return Array.from(types);
}

function bindCodeToggles(container) {
  container.querySelectorAll(".code-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      const shouldOpen = target.style.display !== "block";
      target.style.display = shouldOpen ? "block" : "none";
      button.setAttribute("aria-expanded", String(shouldOpen));
      button.closest(".row")?.classList.toggle("expanded", shouldOpen);
    });
  });
}

function bindSectionToggles(container) {
  container.querySelectorAll(".section-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.closest(".section");
      if (!section) return;

      const collapsed = section.classList.toggle("collapsed");
      button.setAttribute("aria-expanded", String(!collapsed));
      const sectionId = section.dataset.sectionId;
      if (sectionId) {
        localStorage.setItem(
          `meta-checker-section-${sectionId}`,
          String(collapsed)
        );
      }
    });
  });
}

let stateHelpTrigger = null;

function openStateHelpModal(trigger) {
  const modal = document.getElementById("stateHelpModal");
  if (!modal) return;
  stateHelpTrigger = trigger || document.activeElement;
  modal.hidden = false;
  modal.querySelector(".modal-close")?.focus();
}

function closeStateHelpModal() {
  const modal = document.getElementById("stateHelpModal");
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  stateHelpTrigger?.focus?.();
  stateHelpTrigger = null;
}

function initializeStateHelpModal() {
  const modal = document.getElementById("stateHelpModal");
  const title = document.getElementById("stateHelpTitle");
  const intro = document.getElementById("stateHelpIntro");
  const content = document.getElementById("stateHelpContent");
  const closeButton = modal?.querySelector(".modal-close");
  const help = getStateHelp(locale);

  if (!modal || !title || !intro || !content || !closeButton) return;
  title.textContent = t("stateHelpTitle");
  intro.textContent = t("stateHelpIntro");
  closeButton.setAttribute("aria-label", t("close"));
  content.innerHTML = ["same", "new", "changed", "removed"]
    .map(
      (state) => `<div class="state-help-row">
        <span class="chip ${
          state === "changed"
            ? "warn"
            : state === "new"
            ? "info"
            : state === "removed"
            ? "danger"
            : ""
        }">${help[state].label}</span>
        <p>${help[state].description}</p>
      </div>`
    )
    .join("");

  document.getElementById("stateHelp")?.addEventListener("click", (event) => {
    openStateHelpModal(event.currentTarget);
  });
  closeButton.addEventListener("click", closeStateHelpModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeStateHelpModal();
  });
  document.addEventListener("click", (event) => {
    const chip = event.target.closest?.(".chip[data-state-help]");
    if (chip) openStateHelpModal(chip);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeStateHelpModal();
  });
}

let displaySettingsTrigger = null;

function closeDisplaySettingsModal() {
  const modal = document.getElementById("displaySettingsModal");
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  displaySettingsTrigger?.focus?.();
  displaySettingsTrigger = null;
}

function updateSectionCheckbox(content, sectionId) {
  const sectionCheckbox = content.querySelector(
    `[data-section-check="${sectionId}"]`
  );
  const itemCheckboxes = Array.from(
    content.querySelectorAll(`[data-section="${sectionId}"][data-item-check]`)
  );
  if (!sectionCheckbox || !itemCheckboxes.length) return;

  const checkedCount = itemCheckboxes.filter((item) => item.checked).length;
  sectionCheckbox.checked = checkedCount === itemCheckboxes.length;
  sectionCheckbox.indeterminate = checkedCount > 0 && !sectionCheckbox.checked;
}

function renderDisplaySettingsChecklist(content, selectedItems) {
  content.innerHTML = getDisplaySections()
    .map(
      (section) => `<div class="settings-section">
        <label class="settings-section-label">
          <input type="checkbox" data-section-check="${section.id}">
          <span>${section.label}</span>
        </label>
        <div class="settings-items">
          ${section.items
            .map(
              ([itemId, label]) => `<label class="settings-item-label">
                <input type="checkbox" data-section="${
                  section.id
                }" data-item-check="${section.id}.${itemId}" ${
                selectedItems.has(`${section.id}.${itemId}`) ? "checked" : ""
              }>
                <span>${label}</span>
              </label>`
            )
            .join("")}
        </div>
      </div>`
    )
    .join("");

  getDisplaySections().forEach((section) =>
    updateSectionCheckbox(content, section.id)
  );
}

function openDisplaySettingsModal(trigger) {
  const modal = document.getElementById("displaySettingsModal");
  const content = document.getElementById("displaySettingsContent");
  if (!modal || !content) return;
  displaySettingsTrigger = trigger || document.activeElement;
  renderDisplaySettingsChecklist(content, visibleItems);
  modal.hidden = false;
  modal.querySelector(".modal-close")?.focus();
}

function initializeDisplaySettingsModal() {
  const modal = document.getElementById("displaySettingsModal");
  const title = document.getElementById("displaySettingsTitle");
  const intro = document.getElementById("displaySettingsIntro");
  const content = document.getElementById("displaySettingsContent");
  const closeButton = modal?.querySelector(".modal-close");
  const saveButton = document.getElementById("saveDisplaySettings");
  const resetButton = document.getElementById("resetDisplaySettings");
  const settingsButton = document.getElementById("displaySettings");

  if (
    !modal ||
    !title ||
    !intro ||
    !content ||
    !closeButton ||
    !saveButton ||
    !resetButton ||
    !settingsButton
  ) {
    return;
  }

  title.textContent = t("displaySettingsTitle");
  intro.textContent = t("displaySettingsIntro");
  closeButton.setAttribute("aria-label", t("close"));
  saveButton.textContent = t("save");
  resetButton.textContent = t("resetDefaults");
  settingsButton.setAttribute("aria-label", t("displaySettings"));

  settingsButton.addEventListener("click", (event) =>
    openDisplaySettingsModal(event.currentTarget)
  );
  closeButton.addEventListener("click", closeDisplaySettingsModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeDisplaySettingsModal();
  });
  content.addEventListener("change", (event) => {
    const checkbox = event.target;
    const sectionId = checkbox.dataset.sectionCheck;
    if (sectionId) {
      content
        .querySelectorAll(`[data-section="${sectionId}"][data-item-check]`)
        .forEach((item) => {
          item.checked = checkbox.checked;
        });
      checkbox.indeterminate = false;
      return;
    }

    if (checkbox.dataset.section) {
      updateSectionCheckbox(content, checkbox.dataset.section);
    }
  });
  resetButton.addEventListener("click", () => {
    renderDisplaySettingsChecklist(content, defaultVisibleItems);
  });
  saveButton.addEventListener("click", () => {
    const selected = Array.from(
      content.querySelectorAll("[data-item-check]:checked")
    ).map((item) => item.dataset.itemCheck);
    localStorage.setItem(DISPLAY_STORAGE_KEY, JSON.stringify(selected));
    window.location.reload();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDisplaySettingsModal();
  });
}

function renderJsonLd({ jsonldData, jsonldErrors, jsonldTotal }) {
  const container = document.getElementById("jsonld");
  if (!container) return;

  const data = jsonldData || [];
  const errors = jsonldErrors || [];
  const types = collectJsonLdTypes(data);
  const total = jsonldTotal ?? data.length + errors.length;
  const rawId = `jsonld-${Math.random().toString(36).slice(2, 7)}`;
  const sectionOptions = getSectionOptions("jsonld");
  const summaryRows = [
    { id: "blocks", key: t("blocks"), value: total },
    { id: "valid", key: t("valid"), value: data.length },
    { id: "invalid", key: t("invalid"), value: errors.length },
    {
      id: "types",
      key: t("types"),
      value: types.length ? types.join(", ") : null,
      code: types.length ? escapeHtml(types.join("\n")) : null,
    },
    {
      id: "parse-errors",
      key: t("parseErrors"),
      value: errors.length ? errors.join("\n") : null,
      code: errors.length ? escapeHtml(errors.join("\n")) : null,
    },
  ];
  const pretty = data.length
    ? escapeHtml(JSON.stringify(data, null, 2))
    : t("noValidJsonLd");

  const visibleRows = filterVisibleRows("jsonld", summaryRows);
  if (!visibleRows.length) {
    container.hidden = true;
    return;
  }

  container.hidden = false;
  container.dataset.sectionId = sectionOptions.id;
  container.classList.toggle("collapsed", sectionOptions.collapsed);

  if (total === 0) {
    container.innerHTML = `
      <div class="section-header">
        <button class="section-toggle" type="button" aria-expanded="${String(
          !sectionOptions.collapsed
        )}">
          <span class="section-chevron" aria-hidden="true">›</span>
          <span class="section-title">${t("jsonLdSummary")}</span>
        </button>
      </div>
      <div class="list">
        <div class="empty-state">${t("noJsonLd")}</div>
      </div>
    `;
    bindSectionToggles(container);
    return;
  }

  container.innerHTML = `
    <div class="section-header">
      <button class="section-toggle" type="button" aria-expanded="${String(
        !sectionOptions.collapsed
      )}">
        <span class="section-chevron" aria-hidden="true">›</span>
        <span class="section-title">${t("jsonLdSummary")}</span>
      </button>
      <div class="tools">
        ${
          data.length
            ? `<button class="code-btn" data-target="${rawId}" aria-expanded="false">${t(
                "raw"
              )}</button>`
            : ""
        }
      </div>
    </div>
    <div class="list">
      ${visibleRows.map((row) => buildRow(row)).join("")}
      <div class="row">
        <pre id="${rawId}" class="code jsonld">${pretty}</pre>
      </div>
    </div>
  `;

  bindCodeToggles(container);
  bindSectionToggles(container);
}

function requestMetadataFromTab(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(
      tabId,
      { action: "getCurrentMetadata" },
      (data) => {
        const messageError = chrome.runtime.lastError;
        resolve(messageError ? null : data || null);
      }
    );
  });
}

async function loadMetadataFromTab(tabId) {
  const currentData = await requestMetadataFromTab(tabId);
  if (currentData) return currentData;

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"],
    });
  } catch {
    return null;
  }

  return requestMetadataFromTab(tabId);
}

function setLoadingState(loading) {
  const loadingState = document.getElementById("loadingState");
  if (loadingState) loadingState.hidden = !loading;
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const groups = document.getElementById("groups");
    const activeUrl = document.getElementById("activeUrl");

    if (!activeTab) {
      groups.innerHTML = getSectionList(
        t("unableToInspect"),
        [],
        getSectionOptions("error")
      );
      bindSectionToggles(groups);
      setLoadingState(false);
      return;
    }

    if (activeUrl) activeUrl.textContent = activeTab.url || "";

    chrome.runtime.sendMessage(
      { action: "getRawHTML", url: activeTab.url },
      (response) => {
        const rawMetadata = response?.html
          ? extractMetadataFromRawHTML(response.html, activeTab.url)
          : {};
        const httpInfo = response?.httpInfo;
        const fetchError = response?.error;

        loadMetadataFromTab(activeTab.id).then((data) => {
            const metadata = data?.metadata;
            const sections = [];
            const documentInfo = document.getElementById("documentInfo");

            if (metadata) {
              const basicList = [
                {
                  id: "title",
                  key: t("title"),
                  value: metadata.title,
                  original: rawMetadata.title,
                  code: toTitleTag(sourceValue(metadata.title, rawMetadata.title)),
                  state: getState(metadata.title, rawMetadata.title),
                },
                {
                  id: "meta-title",
                  key: t("metaTitle"),
                  value: metadata.metaTitle,
                  original: rawMetadata.metaTitle,
                  code: toMetaTag(
                    "title",
                    sourceValue(metadata.metaTitle, rawMetadata.metaTitle),
                    false
                  ),
                  state: getState(metadata.metaTitle, rawMetadata.metaTitle),
                },
                {
                  id: "meta-description",
                  key: t("metaDescription"),
                  value: metadata.metaDescription,
                  original: rawMetadata.metaDescription,
                  code: toMetaTag(
                    "description",
                    sourceValue(
                      metadata.metaDescription,
                      rawMetadata.metaDescription
                    ),
                    false
                  ),
                  state: getState(
                    metadata.metaDescription,
                    rawMetadata.metaDescription
                  ),
                },
                {
                  id: "canonical-url",
                  key: t("canonicalUrl"),
                  value: metadata.canonicalUrl,
                  original: rawMetadata.canonicalUrl,
                  code: toLinkTag(
                    "canonical",
                    sourceValue(metadata.canonicalUrl, rawMetadata.canonicalUrl)
                  ),
                  state: getState(
                    metadata.canonicalUrl,
                    rawMetadata.canonicalUrl
                  ),
                },
              ];

              const documentList = [
                {
                  id: "charset",
                  key: t("charset"),
                  value: metadata.charset,
                  original: rawMetadata.charset,
                  code: toCharsetTag(
                    sourceValue(metadata.charset, rawMetadata.charset)
                  ),
                  state: getState(
                    metadata.charset?.toLowerCase(),
                    rawMetadata.charset?.toLowerCase()
                  ),
                },
                {
                  id: "viewport",
                  key: t("viewport"),
                  value: metadata.viewport,
                  original: rawMetadata.viewport,
                  code: toMetaTag(
                    "viewport",
                    sourceValue(metadata.viewport, rawMetadata.viewport),
                    false
                  ),
                  state: getState(metadata.viewport, rawMetadata.viewport),
                },
                {
                  id: "favicon",
                  key: t("favicon"),
                  value: metadata.favicon,
                  original: rawMetadata.favicon,
                  code: toLinkTag(
                    "icon",
                    sourceValue(metadata.favicon, rawMetadata.favicon)
                  ),
                  state: getState(metadata.favicon, rawMetadata.favicon),
                },
                {
                  id: "theme-color",
                  key: t("themeColor"),
                  value: metadata.themeColor,
                  original: rawMetadata.themeColor,
                  code: toMetaTag(
                    "theme-color",
                    sourceValue(metadata.themeColor, rawMetadata.themeColor),
                    false
                  ),
                  state: getState(metadata.themeColor, rawMetadata.themeColor),
                },
              ];

              const currentHreflang = formatHreflang(metadata.hreflang);
              const originalHreflang = formatHreflang(rawMetadata.hreflang);
              const languageList = [
                {
                  id: "html-lang",
                  key: t("htmlLang"),
                  value: metadata.language,
                  original: rawMetadata.language,
                  code: toHtmlLangTag(
                    sourceValue(metadata.language, rawMetadata.language)
                  ),
                  state: getState(metadata.language, rawMetadata.language),
                },
                {
                  id: "hreflang",
                  key: t("hreflang"),
                  value: currentHreflang,
                  original: originalHreflang,
                  code: toHreflangTags(
                    rawMetadata.hreflang?.length
                      ? rawMetadata.hreflang
                      : metadata.hreflang
                  ),
                  state: getState(currentHreflang, originalHreflang),
                },
              ];

              const ogList = [
                ["og-title", "og:title", "ogTitle"],
                ["og-description", "og:description", "ogDescription"],
                ["og-type", "og:type", "ogType"],
                ["og-site-name", "og:site_name", "ogSiteName"],
                ["og-url", "og:url", "ogUrl"],
                ["og-image", "og:image", "ogImage"],
              ].map(([id, key, field]) => ({
                id,
                key,
                value: metadata[field],
                original: rawMetadata[field],
                code: toMetaTag(
                  key,
                  sourceValue(metadata[field], rawMetadata[field]),
                  true
                ),
                state: getState(metadata[field], rawMetadata[field]),
              }));

              const etcList = [
                {
                  id: "robots",
                  key: "robots",
                  value: metadata.metaRobots,
                  original: rawMetadata.metaRobots,
                  code: toMetaTag(
                    "robots",
                    sourceValue(metadata.metaRobots, rawMetadata.metaRobots),
                    false
                  ),
                  state: getState(metadata.metaRobots, rawMetadata.metaRobots),
                },
                {
                  id: "storebot-google",
                  key: "Storebot-Google",
                  value: metadata.metaStorebotGoogle,
                  original: rawMetadata.metaStorebotGoogle,
                  code: toMetaTag(
                    "Storebot-Google",
                    sourceValue(
                      metadata.metaStorebotGoogle,
                      rawMetadata.metaStorebotGoogle
                    ),
                    false
                  ),
                  state: getState(
                    metadata.metaStorebotGoogle,
                    rawMetadata.metaStorebotGoogle
                  ),
                },
              ];

              [
                getVisibleSection("basic", t("basic"), basicList),
                getVisibleSection(
                  "languages",
                  t("languages"),
                  languageList,
                  true
                ),
                getVisibleSection("open-graph", t("openGraph"), ogList),
                getVisibleSection("etc", t("etc"), etcList, true),
              ].forEach((section) => {
                if (section) sections.push(section);
              });

              if (documentInfo) {
                documentInfo.innerHTML =
                  getVisibleSection(
                    "document",
                    t("document"),
                    documentList,
                    true
                  ) || "";
                bindCodeToggles(documentInfo);
                bindSectionToggles(documentInfo);
              }
            } else {
              if (documentInfo) documentInfo.innerHTML = "";
              sections.push(
                getSectionList(
                  t("inspectionStatus"),
                  getInspectionErrorRows(activeTab.url),
                  getSectionOptions("inspection-status")
                )
              );
            }

            if (httpInfo) {
              const httpSection = getVisibleSection(
                "http-response",
                t("httpResponse"),
                [
                    {
                      id: "status",
                      key: t("status"),
                      value: `${httpInfo.status} ${httpInfo.statusText}`.trim(),
                    },
                    {
                      id: "final-url",
                      key: t("finalUrl"),
                      value: httpInfo.finalUrl,
                      code: httpInfo.finalUrl
                        ? escapeHtml(httpInfo.finalUrl)
                        : null,
                    },
                    {
                      id: "redirected",
                      key: t("redirected"),
                      value: httpInfo.redirected ? t("yes") : t("no"),
                    },
                    {
                      id: "content-type",
                      key: t("contentType"),
                      value: httpInfo.contentType,
                      code: httpInfo.contentType
                        ? escapeHtml(httpInfo.contentType)
                        : null,
                    },
                    {
                      id: "x-robots-tag",
                      key: t("xRobotsTag"),
                      value: httpInfo.xRobotsTag,
                      code: httpInfo.xRobotsTag
                        ? escapeHtml(httpInfo.xRobotsTag)
                        : null,
                    },
                ],
                true
              );
              if (httpSection) sections.push(httpSection);
            } else if (fetchError && metadata) {
              const errorSection = getVisibleSection(
                "http-response",
                t("httpResponse"),
                [
                    {
                      id: "error",
                      key: t("error"),
                      value: fetchError,
                      code: escapeHtml(fetchError),
                    },
                ],
                true
              );
              if (errorSection) sections.push(errorSection);
            }

            groups.innerHTML = sections.join("");
            bindCodeToggles(groups);
            bindSectionToggles(groups);
            renderJsonLd({
              jsonldData: data?.jsonldData,
              jsonldErrors: data?.jsonldErrors,
              jsonldTotal: data?.jsonldTotal,
            });
          }).finally(() => setLoadingState(false));
      }
    );
  });
});

const languageSelect = document.getElementById("languageSelect");
if (languageSelect) {
  languageSelect.value = locale;
  languageSelect.addEventListener("change", () => {
    const nextLocale = supportedLocales.has(languageSelect.value)
      ? languageSelect.value
      : "en";
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLocale);
    window.location.reload();
  });
}

const stateHelpButton = document.getElementById("stateHelp");
if (stateHelpButton) stateHelpButton.setAttribute("aria-label", t("stateHelp"));
initializeStateHelpModal();
initializeDisplaySettingsModal();

const loadingText = document.getElementById("loadingText");
if (loadingText) loadingText.textContent = t("loadingMetadata");

const refreshButton = document.getElementById("refreshPage");
if (refreshButton) refreshButton.textContent = t("reload");
refreshButton?.addEventListener("click", () => {
  window.location.reload();
});
