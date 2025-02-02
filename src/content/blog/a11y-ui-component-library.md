---
author: limkhl
pubDatetime: 2025-02-02T12:50:00+09:00
title: "웹 접근성으로 보는 오픈소스 1"
slug: a11y-ui-component-library
featured: true
draft: false
tags:
  - a11y
  - UI library
description: 2024 DevFest Incheon/Songo에서 웹 접근성으로 보는 오픈소스를 주제로 발표를 했습니다. 발표한 내용을 글로 옮겨 적습니다.
---

## Table of contents

2024 DevFest Incheon/Songo에서 웹 접근성으로 보는 오픈소스를 주제로 발표를 했습니다. 발표한 내용을 글로 옮겨 적습니다.

## 웹 접근성이란?

작년 12월 3일 밤 비상 계엄이 선포됐었죠. 저는 TV가 없어서 단체 톡방에서 처음으로 소식을 들었는데요. 계엄 선포가 된 거면 정말 큰 일인데 아무런 안내가 없어서 이게 진짜 맞나? 싶더라고요. 비상계엄 선포 방송 때도 수어통역이 없어서 농인들은 계엄 소식을 알 수가 없었다고 하더라고요. 계엄 해제가 안됐더라면 일상이 완전히 무너질 만한 중요한 일이었는데 정보 전달이 안돼서 대비할 새 없이 속수무책으로 당할 수 있었다고 생각하니 더 아찔하게 느껴졌습니다.

이번 일로 접근성의 중요성을 더 절감하게 됐는데요. 농인뿐만 아니라 집에 TV가 없는 저를 포함해 누구라도 정보에 접근할 수 있도록 보장하는 것을 접근성이라고 합니다. 웹사이트에 있는 정보를 누구나 접근 가능하게 만드는 것이 웹 접근성이고요.

웹의 창시자인 팀 버너스 리는 “웹의 힘은 보편성에 있다. 장애에 관계없이 모든 사람이 접근할 수 있도록 하는 것은 필수적인 요소이다.”라고 말했습니다. 저도 웹이야 말로 접근성을 확장하기에 가장 좋은 매체라고 생각해요. 그래서 웹 프론트엔드 개발자로서 누구나 접근 가능한 방식으로 웹을 만들기 위해 책임감을 가져야한다고 생각하고 있어요.

## 웹 프론트엔드 개발자가 접근성 대응하는 법

그럼 웹 프론트엔드 개발자는 어떻게 웹 접근성을 대응할 수 있을까요? 

1. **WAI-AREA**: 마크업 할 때 html 요소에 WAI-AREA 속성을 넣어주면 스크린리더에서 잘 읽어주도록 처리할 수 있습니다.
2. **Labeling**: 텍스트를 가지고 있지 않은 아이콘 같은 요소는 스크린리더가 읽지 않기 때문에 실제로 유저가 존재를 알아야 하는 요소라면 라벨링도 해줘야 하고요. 
3. **Keyboard navigation**: 키보드로만 요소를 이동할 수 있도록 대응해줘야 합니다.
4. **Mobile**: 모바일은 PC와 다르게 키보드가 없기 때문에 모바일 스크린 리더를 위해 따로 처리해줘야 하는 게 있습니니다. 
5. **Testing**: 실제로 스크린리더에서 잘 읽히는지 voiceover나 talkback과 같은 스크린리더로 테스팅도 해야 합니다. 

간단하게만 정리해봐도 정말 공수가 많이 들 것 같고 이걸 언제 다 대응하나 절망적이게 느껴지는데요. 1번부터 시도해보려고 해도 뭐부터 해줘야하나 막막한데요. 저는 어디 best practice라도 있다면 클론 코딩하면서 익히고 싶다는 생각부터 들더라고요. 저와 같은 분들을 위해 준비된 best pratice가 있습니다. 바로 오픈소스 UI 컴포넌트 라이브러리입니다.

## 오픈소스 UI Component library

UI 컴포넌트 라이브러리는 UI 하나하나 디자인하고 구현할 필요 없이 미리 만들어진 컴포넌트를 제공하는 라이브러리입니다. 전에는 부트스트랩을 많이 사용했었죠. 요새 웹 프론트엔드에는 정말 많은 UI 컴포넌트 라이브러리가 있습니다. 크게 4가지 분류로 나눠보았습니다.

### Headless

로직만 제공하고 스타일은 완전히 사용자가 정의하는 방식

- React Aria
- Radix UI Primitives

### Unstyled

최소한의 스타일만 제공하고, 사용자가 자유롭게 커스터마이징 가능한 방식

- Radix UI
- Headless UI
- React Aria Components

### Style Starter

기본 스타일이나 테마를 제공하는 방식

- Chakra UI
- shadcn

### Full UI Kit/Design System

스타일 완성도가 높고 완전한 UI 스타일을 제공하는 방식

- MUI
- React Spectrum
- daisyUI

<img width="1344" alt="npm-trends에서 라이브러리별 다운로드 수를 비교한 차트" src="https://github-production-user-asset-6210df.s3.amazonaws.com/84858773/408841596-366ca51a-888b-47b9-a3b2-73127e847145.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T035438Z&X-Amz-Expires=300&X-Amz-Signature=678a58d1406a09f37ecb1977da481635439d230f0bee0179a092f1fa39cfc382&X-Amz-SignedHeaders=host" />

[npm-trends](https://npmtrends.com/@adobe/react-spectrum-vs-@chakra-ui/react-vs-@headlessui/react-vs-@mui/material-vs-@radix-ui/primitive-vs-@radix-ui/rect-vs-ariakit-vs-daisyui-vs-react-aria-vs-shadcn)로 생태계 크기를 비교해봤는데요. 가장 큰 생태계는 radix, 다음은 mui, 다음은 headlessui, 다음은 react-aria, 다음은 chakra-ui입니다. 생태계가 큰 라이브러리부터 라이브러리 특징을 살펴보겠습니다.

## 라이브러리 별 특징

### Radix Primitives

Radix Primitives는 접근성을 우선시하는 철학을 갖고 있기 때문에 접근성의 우선순위가 높은 프로젝트에 좋은 라이브러리입니다. 또, 최소한의 스타일만 제공하는 unstyled 방식의 라이브러리이기 때문에 커스터마이징 하기 편하지만 스타일을 정의하는 과정이 필요하기 때문에 사용 편의성은 약간 낮은 편입니다.

Install 명령어를 보시면 특이한 점이 있는데 필요한 컴포넌트를 각각 설치하는 방식으로 사용합니다.

### Shadcn

Shadcn은 radix를 좀 더 편하게 사용할 수 있도록 기초 스타일을 입혀 래핑한 라이브러리라 사실상 radix 입니다. shadcn의 특징은 설치하는 방식 이외에도 코드 스니펫을 제공해 radix만 설치하고 shadcn의 컴포넌트 코드를 복사 붙여넣기 해서 사용할 수 있다는 점입니다. 기존에 정의된 스타일을 덮어쓸 필요 없이 그냥 복사한 코드를 바로 수정하면 된다는 점이 편리합니다. 따로 설치할 필요가 없으니 tailwind와 radix를 사용하고 있다면 바로 찍먹해볼 수 있습니다.

### MUI

MUI는 구글의 UI 컴포넌트 라이브러리입니다. 접근성 지원이 잘 되어 있고 디자인 시스템 방식의 라이브러리이기 때문에 커스터마이징 자유도는 조금 떨어지는 대신 스타일을 따로 정의할 필요 없이 바로 가져다 쓸 수 있어서 편의성이 높습니다. 유의할 점은 MUI는 emotion에 대한 의존성을 가지고 있다는 점입니다. 특히 SSR에서는 styled-component 대신 emotion을 사용하라고 강하게 권장하고 있습니다.

### Headless UI

Headless UI는 tailwind css 제작자가 개발한 UI 라이브러리입니다. 다른 unstyled 방식의 라이브러리와 비슷하게 최소한의 스타일만 있기 때문에 개발자가 커스터마이징하기 편리한 대신 사용 편의성은 조금 떨어집니다. 접근성 대응 수준은 높다고 하는데요. 실제로 Alert Dialog 컴포넌트를 voiceover로 읽었을 때는 좀 실망스러웠습니다.

### React aria / React aria components / React Spectrum

React aria는 adobe 사에서 만든 라이브러리입니다. 정확히는 headless 방식의 react aria, unstyled 방식의 react aria components, design system 방식의 react spectrum 라이브러리로 구분되어 있습니다. React-aria는 hook에서 반환한 prop을 개발자가 마크업한 요소에 넣어주는 방식으로 사용합니다. 최소 단위이기 때문에 사용하기에 러닝 커브가 좀 있는 반면에 자유롭게 커스터마이징이 가능하고요.

React aria components는 react-aria를 기반으로 최소한의 스타일로 컴포넌트를 구현한 unstyled 방식의 라이브러리입니다.

React Spectrum은 react aria component를 기반으로 구현된 adobe 사의 디자인 시스템입니다.

### Chakra UI

마지막으로 Chakra UI입니다. 간단한 스타일을 제공하는 style starter 방식으로 unstyled에 비하면 커스터마이징에 제약이 있지만 사용하기 편리하다는 장점이 있습니다. 접근성 대응 수준은 높다고 평가받고 있습니다.

---

라이브러리별 실제로 웹 접근성을 어떻게 대응하고 있는지는 다음 글에서 이어나가도록 하겠습니다.