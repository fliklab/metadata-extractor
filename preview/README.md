# Meta Checker UI Preview

실제 확장 프로그램을 빌드하지 않고 `popup.html`을 목업 데이터로 확인하는
개발용 프리뷰입니다.

```sh
node tools/preview-popup.mjs
```

브라우저에서 `http://127.0.0.1:4173/`을 열고, 우측 하단의 `SCENARIO`
버튼으로 데이터와 언어를 변경합니다.

프리뷰는 실제 `popup.html`과 `popup.js`를 그대로 사용합니다. Chrome API만
`chrome-mock.js`로 대체하므로 팝업 UI 변경 사항이 별도 복사 없이 반영됩니다.

포트를 바꾸려면 다음과 같이 실행합니다.

```sh
node tools/preview-popup.mjs --port=8765
```

`preview/`와 `tools/`는 배포용 ZIP의 파일 목록에 포함되지 않습니다.
