# Meta Checker

Meta Checker is a Chrome extension that inspects webpage metadata and compares
the live DOM with the original HTML response. It helps you quickly identify
metadata that is unchanged, newly added, modified, or removed.

[Chrome Web Store에서 설치하기](https://chromewebstore.google.com/detail/metadata-extractor/pdikiboojnhoacoknfdpndeddocnbmop)

![Meta Checker metadata comparison](docs/images/meta-checker-overview.png)

![Meta Checker state guide](docs/images/meta-checker-state-guide.png)

## 주요 기능

- 현재 DOM과 최초 HTML 응답의 메타데이터 비교
- `Same`, `New`, `Changed`, `Removed` 상태 표시
- `<title>`과 `<meta name="title">`을 별도 항목으로 확인
- 기본 메타 태그, Open Graph, robots 및 다국어 정보 확인
- HTTP 응답 상태와 JSON-LD 요약 확인
- 섹션과 개별 항목의 표시 여부 설정
- English, 한국어, 日本語, Español, Português (Brasil) 지원

## 사용 방법

1. 확인하려는 웹페이지를 엽니다.
2. 브라우저 도구 모음에서 Meta Checker를 실행합니다.
3. 메타데이터와 상태 칩을 확인합니다.
4. 상태 칩이나 우측 상단의 `?` 버튼을 누르면 상태 설명을 볼 수 있습니다.
5. 설정 버튼을 누르면 화면에 표시할 섹션과 항목을 선택할 수 있습니다.

확장 프로그램을 설치하거나 로컬에서 다시 로드한 직후 이미 열려 있던
페이지라면, 해당 페이지를 한 번 새로고침한 후 Meta Checker를 실행하세요.

## 로컬 설치

1. 저장소를 다운로드하거나 복제합니다.
2. Chrome 주소창에서 `chrome://extensions`를 엽니다.
3. 우측 상단의 **개발자 모드**를 켭니다.
4. **압축해제된 확장 프로그램을 로드합니다**를 선택합니다.
5. `manifest.json`이 있는 저장소 루트 폴더를 선택합니다.
6. 브라우저 도구 모음의 확장 프로그램 목록에서 Meta Checker를 고정합니다.

## Version

Current release: `1.1.0`
