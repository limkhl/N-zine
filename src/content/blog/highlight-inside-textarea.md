---
author: limkhl
pubDatetime: 2025-03-16T23:50:00+09:00
title: "textarea 안에서 하이라이트 기능 구현하는 방법"
slug: highlight-inside-textarea
featured: true
draft: false
tags:
  - textarea
  - UI
description: textarea 내 텍스트를 선택하고 하이라이트하는 방법을 살펴봅니다.
---

사이드프로젝트에서 유저가 텍스트를 입력할 수 있는 textarea에서 일부 단어를 드래그한 뒤 특정 단어로 등록하면 하이라이팅해줘야 하는 요구사항이 있었습니다. 얼핏 보면 그다지 어려워보이지 않지만 textarea는 HTML 태그를 그대로 텍스트로 표시하기 때문에 처음 생각했던 것과는 다른 방식으로 구현해야 했습니다. textarea 안에서 하이라이트 기능을 구현하는 방법을 설명합니다.

## Table of contents

## textarea의 한계

textarea 요소는 HTML 태그를 그대로 텍스트로 표시합니다. 즉, `<mark>하이라이트</mark>`와 같은 마크업을 넣으면 태그 자체가 텍스트로 보이게 됩니다. 이러한 한계 때문에 textarea에서 특정 텍스트에 대한 직접적인 스타일링이 불가능합니다. 또한 유저에게는 하이라이팅을 위한 html을 노출하고 싶지 않습니다. 어떻게 해결할 수 있을까요?

## 해결 접근법: 겹치는 레이어 사용하기

이 문제를 해결하기 위한 가장 효과적인 방법은 textarea 뒤에 위치한 div를 활용하는 것입니다. 이 접근법의 핵심 아이디어는 다음과 같습니다.

- textarea와 동일한 크기의 div를 그 뒤에 배치합니다.
- textarea에 입력된 텍스트를 JavaScript를 통해 div에 복사합니다.
- div 내의 텍스트에 하이라이트 마크업을 추가합니다.
- textarea의 배경을 투명하게 만들어 뒤에 있는 하이라이트된 텍스트가 보이도록 합니다.
- 두 요소의 스크롤을 동기화합니다.

즉, 유저가 실시간으로 텍스트를 입력하고 수정할 수 있는 textarea 레이어 뒤에 똑같이 생긴 div 레이어를 두는 것입니다. 이렇게 하면 textarea value는 html이 포함되지 않은 순수 텍스트로 유지할 수 있고, div의 children에는 html 태그의 스타일을 적용할 수 있습니다.

이 방식을 구현할 때 몇 가지 중요한 세부 사항이 있습니다. 먼저, 두 요소의 스타일이 정확히 일치해야 합니다. 폰트 크기, 폰트 패밀리, 라인 높이, 패딩, 마진 등 모든 스타일 속성이 동일해야 텍스트가 정확히 겹쳐 보입니다. 작은 차이라도 있으면 하이라이트된 텍스트와 실제 입력 텍스트 사이에 어긋남이 발생할 수 있습니다.

또한 스크롤 동기화도 매우 중요합니다. 사용자가 textarea를 스크롤할 때 뒤에 있는 div도 정확히 같은 위치로 스크롤되어야 합니다. 이를 위해 JavaScript 이벤트 리스너를 사용하여 textarea의 스크롤 이벤트를 감지하고 div의 스크롤 위치를 동기화해야 합니다. 저같은 경우에도 스크롤 싱크를 맞추는 게 이슈가 되기도 했는데요. 이 부분은 직접 스타일을 조정해 싱크를 맞추는 수밖에 없습니다.

텍스트 입력 시 실시간으로 하이라이트를 적용하려면 textarea의 'input' 이벤트를 감지하여 div의 내용을 업데이트해야 합니다. 이때 하이라이트할 텍스트 패턴을 정규식이나 다른 방법으로 식별하고, 해당 부분에 <mark> 태그나 다른 스타일링 요소를 적용할 수 있습니다.

이 접근법의 또 다른 장점은 사용자 경험을 해치지 않는다는 것입니다. 사용자는 일반적인 textarea처럼 텍스트를 입력하고 편집할 수 있으며, 동시에 특정 텍스트가 하이라이트되는 시각적 피드백을 받을 수 있습니다. 또한 textarea의 모든 기본 기능(복사, 붙여넣기, 실행 취소 등)이 그대로 유지됩니다.

구현 시 주의할 점은 모바일 환경에서의 호환성입니다. 모바일 기기에서는 가상 키보드가 나타날 때 레이아웃이 변경될 수 있으며, 터치 이벤트 처리 방식이 데스크톱과 다를 수 있습니다. 따라서 다양한 기기와 브라우저에서 테스트하여 일관된 사용자 경험을 제공하는 것이 중요합니다.

## 구현 방법

먼저 필요한 HTML 구조를 살펴보겠습니다.

```tsx
<div class="container">
  <div class="backdrop">
    <div class="highlights">
      <!-- 하이라이트 마크업이 추가된 텍스트가 들어갑니다 -->
    </div>
  </div>
  <textarea>
    <!-- 사용자 입력이 여기에 들어갑니다 -->
  </textarea>
</div>
```

CSS를 통해 요소들을 겹치게 배치합니다.

```css
.container {
  position: relative;
}

.backdrop, textarea {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

textarea {
  color: #333;
  background-color: transparent;
  z-index: 2;
}

.backdrop {
  z-index: 1;
  overflow: auto;
}

.highlights {
  white-space: pre-wrap;
  word-wrap: break-word;
  color: transparent;
}

mark {
  background-color: yellow;
  color: transparent;
}
```

JavaScript를 사용하여 텍스트 동기화와 하이라이트를 처리합니다.

```tsx
const textarea = document.querySelector('textarea');
const highlights = document.querySelector('.highlights');
const backdrop = document.querySelector('.backdrop');

textarea.addEventListener('input', updateHighlights);
textarea.addEventListener('scroll', syncScroll);

function updateHighlights() {
  const text = textarea.value;
  const highlightedText = applyHighlights(text);
  highlights.innerHTML = highlightedText;
}

function applyHighlights(text) {
  // 여기서 하이라이트 로직을 구현합니다
  return text
    .replace(/\n$/g, '\n\n')
    .replace(/특정단어/g, '<mark>특정단어</mark>');
}

function syncScroll() {
  backdrop.scrollTop = textarea.scrollTop;
  backdrop.scrollLeft = textarea.scrollLeft;
}
```

## 성능 최적화 고려사항

이러한 접근 방식을 구현할 때 몇 가지 성능 고려사항이 있습니다.

1. **불필요한 렌더링 방지**: 텍스트가 변경될 때만 하이라이트를 업데이트합니다.
2. **디바운싱 적용**: 입력이 빠른 경우 너무 자주 업데이트되지 않도록 합니다.
3. **큰 텍스트 처리**: 대용량 텍스트의 경우 부분적 렌더링을 고려해야 합니다.

## 결론

textarea 내에서 텍스트 하이라이트를 구현하는 것은 직접적으로는 불가능하지만, 레이어를 2개로 분리하는 UI 구조를 통해서 구현할 수 있습니다. 제시한 코드만 보면 간단하지만 이렇게 레이어를 2개로 분리하는 아이디어를 알기 전까지는 textarea 안에서 하이라이팅을 구현하기 위해서 고군분투해야 했습니다. 흔히 웹 프론트엔드에서 UI 구현은 가장 쉬운 일로 여겨지곤 합니다. 하지만 이번 기회에 UI를 우아하게 구현하기 위해서는 구조를 뒤트는 새로운 상상력이 필요하다는 점을 다시금 느낄 수 있었습니다. 앞으로도 더 복잡한 UI 요구사항을 만날 때 다른 방식으로 생각할 수 있는 힘을 길러야겠습니다.

---

**참고 문헌**
- [Highlight Text Inside a Textarea](https://codersblock.com/blog/highlight-text-inside-a-textarea/)