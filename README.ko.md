# Meta Checker

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md)

**GEO와 SEO를 위한 메타데이터 메이트.**

Meta Checker는 현재 DOM과 최초 HTML 응답의 메타데이터를 비교하는 Chrome
확장 프로그램입니다. 검색엔진과 AI 크롤러가 확인할 수 있는 정보를
이해하고, 페이지 로딩 후 추가·변경·제거된 값을 빠르게 찾을 수 있습니다.

[Chrome Web Store에서 설치하기](https://chromewebstore.google.com/detail/metadata-extractor/pdikiboojnhoacoknfdpndeddocnbmop)

![Meta Checker 메타데이터 비교](docs/images/meta-checker-overview.png)

![Meta Checker 상태 안내](docs/images/meta-checker-state-guide.png)

## 확인할 수 있는 정보

- 페이지 제목, 메타 제목, 메타 설명 및 대표 URL
- Open Graph 제목, 설명, 유형, 사이트 이름, URL 및 이미지
- robots 지시문, 문서 언어 및 대체 언어 링크
- HTTP 상태, 최종 URL, 리디렉션, 콘텐츠 유형 및 `X-Robots-Tag`
- JSON-LD 블록 수, 검증 오류 및 감지된 `@type`
- 코드 버튼을 통한 원본 태그 확인

섹션을 접거나 펼칠 수 있으며, 표시 설정에서 섹션 전체 또는 개별 항목을
선택할 수 있습니다. 팝업은 영어, 한국어, 일본어, 스페인어 및 브라질
포르투갈어를 지원합니다.

## GEO 및 SEO 활용

- 서버가 전달한 최초 HTML에 어떤 메타데이터가 있는지 확인합니다.
- 프레임워크, 스크립트 또는 태그 관리자가 실행 중 변경한 값을 찾습니다.
- canonical, 언어, robots, Open Graph, HTTP 및 JSON-LD 신호를 한 번에 점검합니다.
- 최초 응답과 사용자 또는 실행 가능한 크롤러가 보는 페이지의 차이를 조사합니다.

Meta Checker는 기술적인 메타데이터 점검 도구이며 검색 순위나 AI 답변 노출을
예측하거나 보장하지 않습니다.

## 메타데이터 상태

| 상태 | 의미 |
| --- | --- |
| `Same` | 현재 DOM이 최초 HTML 응답과 같습니다. |
| `New` | 현재 DOM에는 있지만 최초 응답에는 없는 값입니다. |
| `Changed` | 현재 DOM 값이 최초 응답과 다릅니다. |
| `Removed` | 최초 응답에는 있지만 현재 DOM에는 없는 값입니다. |

상태 칩이나 우측 상단의 `?` 버튼을 누르면 상태 설명을 볼 수 있습니다.

## 사용 방법

1. 확인하려는 일반 웹페이지를 엽니다.
2. Chrome 도구 모음에서 Meta Checker를 실행합니다.
3. 메타데이터 값과 상태 칩을 확인합니다.
4. 코드 버튼을 눌러 해당 값의 전체 원본 태그를 확인합니다.
5. 표시 설정에서 화면에 보여줄 섹션과 항목을 선택합니다.
6. 언어 메뉴에서 인터페이스 언어를 선택합니다.

일반 웹페이지에서는 확장 프로그램을 설치하거나 다시 로드하기 전에 열려 있던
탭도 Meta Checker가 메타데이터 리더를 자동으로 다시 연결합니다.
`chrome://extensions` 같은 Chrome 보호 페이지는 검사할 수 없습니다.

## 로컬 설치

1. 저장소를 다운로드하거나 복제합니다.
2. Chrome에서 `chrome://extensions`를 엽니다.
3. **개발자 모드**를 켭니다.
4. **압축해제된 확장 프로그램을 로드합니다**를 선택합니다.
5. `manifest.json`이 있는 저장소 루트 폴더를 선택합니다.
6. Chrome 도구 모음의 확장 프로그램 메뉴에서 Meta Checker를 고정합니다.

## 버전

현재 릴리스: `1.1.1`
