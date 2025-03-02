---
author: limkhl
pubDatetime: 2025-03-02T23:10:00+09:00
title: "textarea 내 텍스트 하이라이트 구현하기"
slug: highlight-in-textarea
featured: true
draft: false
tags:
  - textarea
  - UI
description: textarea 내 텍스트를 선택하고 하이라이트하는 방법을 살펴봅니다.
---

textarea는 웹 개발에서 사용자가 여러 줄의 텍스트를 입력할 수 있는 중요한 요소지만, 안타깝게도 내부 텍스트에 스타일을 적용하거나 하이라이트하는 기능은 기본적으로 제공하지 않습니다. 이 글에서는 이러한 제약을 극복하고 textarea 내 텍스트를 선택하고 하이라이트하는 방법을 살펴보겠습니다.

## Table of contents

## textarea의 한계

웹 개발자라면 아시겠지만, textarea 요소는 HTML 태그를 그대로 텍스트로 표시합니다. 즉, `<mark>하이라이트</mark>`와 같은 마크업을 넣으면 태그 자체가 텍스트로 보이게 됩니다. 이러한 한계 때문에 직접적인 스타일링이 불가능합니다.

## 해결 접근법: 겹치는 레이어 사용하기

이 문제를 해결하기 위한 가장 효과적인 방법은 textarea 뒤에 위치한 div를 활용하는 것입니다. 이 접근법의 핵심 아이디어는 다음과 같습니다.

- textarea와 동일한 크기의 div를 그 뒤에 배치합니다.
- textarea에 입력된 텍스트를 JavaScript를 통해 div에 복사합니다.
- div 내의 텍스트에 하이라이트 마크업을 추가합니다.
- textarea의 배경을 투명하게 만들어 뒤에 있는 하이라이트된 텍스트가 보이도록 합니다.
- 두 요소의 스크롤을 동기화합니다.

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

textarea 내에서 텍스트 하이라이트를 구현하는 것은 직접적으로는 불가능하지만, 창의적인 HTML/CSS/JavaScript 조합을 통해 사용자에게 원활한 경험을 제공할 수 있습니다. 이 글에서 설명한 접근법을 통해 다양한 응용이 가능합니다.

- 코드 에디터의 구문 강조
- 검색어 하이라이트
- 텍스트 번역 도구
- 맞춤법 검사기

이러한 기술은 웹 애플리케이션에서 더 풍부한 텍스트 상호작용을 만들어내는 데 큰 도움이 됩니다.

---

**참고 문헌**
- [Highlight Text Inside a Textarea](https://codersblock.com/blog/highlight-text-inside-a-textarea/)