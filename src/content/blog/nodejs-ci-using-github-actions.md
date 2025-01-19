---
author: limkhl
pubDatetime: 2025-01-19T23:50:00+09:00
title: "GitHub Actions로 Node.js 프로젝트 CI 구축하기"
slug: nodejs-ci-using-github-actions
featured: true
draft: false
tags:
  - CI
description: 사이드프로젝트를 할 때, main 브랜치에서도 빌드가 안 되는 경우가 종종 있었다. 그래서 PR을 올릴 때마다 `npm run build` 성공 여부를 확인하는 GitHub Action을 넣고 싶었다. 상세 설정 없이 정말 범용적으로 쓸 수 있는 기본 yml 코드를 작성하고 싶었다.
---

## Table of contents

사이드프로젝트를 하는데 급하게 작업하다 보니 main 브랜치에서도 빌드가 안 되는 경우가 종종 있었다. 그래서 PR을 올릴 때마다 `npm run build` 성공 여부를 확인하는 GitHub Action을 넣고 싶었다. 회사에서는 이런 저런 설정을 넣어서 쓰고 있지만 사이드프로젝트에서는 상세 설정 없이 정말 범용적으로 쓸 수 있는 기본 yml 코드를 작성하고 싶었다. 사이드프로젝트에서는 패키지매니저로 npm을 사용하고 있어서 npm 기준으로 코드가 작성되어 있다.

## 공식 문서에서 시작하기

GitHub docs의 GitHub Actions에서 [Node.js 프로젝트를 build 하는 CI 템플릿 가이드](https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs)가 잘 나와있다. CI를 추가하는 작업은 요약하면 build를 실행하는 jobs를 정의한 yml 파일을 만들어 `.github/workflows` 폴더 하위에 추가하는 작업이다. yml 코드만 잘 작성하면 된다. 아래는 내가 사이드프로젝트에 추가한 yml 코드이다.

```yaml
name: "build-test"

on:
  push:
    branches:
      - main
  pull_request:
    paths:
      - "**.ts"
      - "**.tsx"
      - "**.json"
      - ".github/workflows/**"
      - "package.json"
      - "package-lock.json"

jobs:
  build:
    runs-on: ubuntu-latest
    if: github.event.pull_request.draft == false
    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"

      - name: Get npm cache directory
        id: npm-cache-dir
        shell: bash
        run: echo "dir=$(npm config get cache)" >> ${GITHUB_OUTPUT}

      - uses: actions/cache@v4
        id: npm-cache
        with:
          path: |
            ${{ steps.npm-cache-dir.outputs.dir }}
            node_modules
          key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-npm-

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build --if-present
```

## 워크플로우 파일 구조

### **트리거 설정**

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    paths:
      - "**.ts"
      - "**.tsx"
      - "**.json"
      - ".github/workflows/**"
      - "package.json"
      - "package-lock.json"
```

워크플로우는 두 가지 경우에 실행되도록 설정했다.

- main 브랜치에 직접 push가 발생할 때
- Pull Request에서 특정 파일이 변경될 때

main에 push가 발생했을 때는 굳이 싶기도 하지만 사이드프로젝트를 급하게 작업하다보면 main에 바로 푸시하는 경우도 생겨서 추가했다. 특히 `paths` 설정을 통해 TypeScript 파일, JSON 파일, 워크플로우 파일, 패키지 관련 파일이 변경될 때만 CI가 실행되도록 최적화했다.

### **Draft PR 제외**

```yaml
if: github.event.pull_request.draft == false
```

Draft 상태의 PR에서는 불필요한 CI 실행을 방지해 GitHub Actions 사용량을 절약하게끔 했다.

### **Node.js 설정**

```yaml
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: "npm"
```

Node.js 22 버전을 사용하며, npm 캐시 기능을 활성화했다. 이는 기본적인 의존성 캐싱을 제공한다.

### **고급 캐싱 전략**

```yaml
- name: Get npm cache directory
  id: npm-cache-dir
  shell: bash
  run: echo "dir=$(npm config get cache)" >> ${GITHUB_OUTPUT}

- uses: actions/cache@v4
  id: npm-cache
  with:
    path: |
      ${{ steps.npm-cache-dir.outputs.dir }}
      node_modules
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

캐싱 전략은 두 가지 레벨로 구성된다.

1. npm 캐시 디렉토리
2. node_modules 디렉토리

캐시 키는 운영체제와 package-lock.json의 해시값을 조합하여 생성된다. `restore-keys`를 사용하여 정확한 캐시가 없을 때도 부분적으로 일치하는 이전 캐시를 활용할 수 있다.

### **의존성 설치와 빌드**

```yaml
- name: Install dependencies
  run: npm ci

- name: Build
  run: npm run build --if-present
```

`npm ci`는 CI 환경에 최적화된 설치 명령어로, package-lock.json을 엄격하게 따르며 항상 깨끗한 설치를 수행한다. `npm install`과 달리 package-lock.json을 수정하지 않고, node_modules를 완전히 제거 후 재설치하여 일관된 빌드 환경을 보장한다.

## **최적화 포인트**

- 필요한 파일 변경 시에만 CI 실행
- Draft PR 제외로 리소스 절약
- 이중 캐싱 전략으로 빌드 속도 최적화
- CI 전용 설치 명령어 사용

---

이렇게 작성한 워크플로우 코드는 기본적인 CI 요구사항을 충족하면서도, 캐시 최적화와 불필요한 실행 방지를 통해 효율적으로 동작한다. 테스트나 환경변수가 필요하다면 더 설정이 필요하겠지만 작은 프로젝트에서 PR에 대한 빌드 테스트만 빠르게 적용하고 싶을 때 도움이 되면 좋겠다.