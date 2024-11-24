---
author: limkhl
pubDatetime: 2024-11-25T01:50:00+09:00
title: "swr를 tanstack query로 이관하기"
slug: migrate-swr-to-tanstack-query
featured: true
draft: false
tags:
  - swr
  - tanstack-query
  - 기술
description: 팀에서 사용하는 swr를 tanstack query로 이관하면서 느낀 점을 담았습니다.
---

우리 팀은 data fetching 라이브러리로 swr를 사용하고 있다. 언젠가부터 tanstack query가 프론트엔드 업계 표준처럼 여겨지고 있다. 이런 상황에서 swr를 계속 고수한 이유는 단순히 지금 이상의 기능이 필요하지 않았기 때문이다. 이전에도 tanstack query로 갈아타자는 논의가 있었지만 왜 갈아타야하는지에 대한 근거가 마땅치 않아서 swr를 계속 쓰고 있었다. 하지만 지금 작업하고 있는 새 프로젝트에서는 swr를 tanstack query로 바꾸기로 했다.

## Table of contents

## swr를 tanstack query로 이관하게 된 이유

가장 직접적인 이유는 swr의 `useSWRInfinite`에 여러 이슈가 있어서이다. 내가 직접 밟았던 이슈는 [이 이슈](https://github.com/vercel/swr/issues/3015)였다. swr은 `mutate(() => true)` 와 같이 호출하면 전체 swr을 mutate 할 수 있다. 단, `useSWRInfinite`와 `useSWRSubscription`로 정의한 swr은 빼고. 로그아웃을 하고 다른 계정으로 로그인했는데 `useSWRInfinite`로 fetch한 데이터는 이전 계정 데이터를 보여주는 문제가 있어서 알게 된 이슈다. `unstable_serialize`를 이용하면 `useSWRInfinite` 까지 포함해 mutate 할 수 있다고는 하는데… `unstable_serialize`도 NextJS edge runtime에서는 동작을 안하는 [이슈](https://github.com/vercel/swr/issues/3030)가 있는 듯 하다. 아무튼 [swr 이슈 목록](https://github.com/vercel/swr/issues)을 보면 `useSWRInfinite`와 관련된 여러 이슈들이 있다는 걸 알 수 있다. 그런데 이슈 관리가 잘 안되고 있는 듯 하다. 인용한 이슈는 최근 이슈지만 사실 오래 전부터 이슈 해결이 잘 안되고 있는 듯 하다. 결정적으로 2022년에 올라온 issue의 글쓴이가 남긴 “we migrated to react-query”라는 [코멘트](https://github.com/vercel/swr/issues/1767#issuecomment-1179690411)를 보고 swr의 관리가 잘 안되고 있다고 느꼈다. 그래서 장기적으로 봤을 때 프로젝트를 안정적으로 유지보수하기 위해서는 이슈 관리가 더 활발히 이뤄지고 있는 tanstack query로 이관하는 게 좋겠다고 판단했다.

## swr와 tanstack query의 공통점

이제까지 tanstack query를 써본 적이 없었다. 사실상 쓰는 방식이 거의 동일할 거라는 얘기를 많이 들어서 이관하는 데에 드는 비용이 적을 거라고 예상했다. 실제로 Provider로 감싸서 세팅하는 방식도 같고, 사용하는 형식도 비슷하다. 우리는 swr을 주로 아래와 같은 방식으로 사용하고 있는데

```tsx
const { data, mutate } = useSWR(key, fetcher, config)
```

tanstack query로는 같은 형식으로 아래처럼 바꿔주기만 하면 동일하게 동작한다.

```tsx
const { data, refetch } = useQuery({ queryKey, queryFn, ...config }) 
```

하지만 차이도 작지 않다. 개인적으로 이관하면서 느낀 swr와 tanstack query의 차이점을 남겨본다.


## swr와 tanstack query의 차이점

### middleware

기능적 차이를 짚자면, swr에는 middleware 기능이 있으나 tanstack query에는 middleware 기능이 없다. swr의 middleware 기능은 모든 swr를 실행하기 전에 일괄적으로 해당 로직을 거쳐가도록 설정할 수 있는 기능이다. 우리는 토큰이 필요한 api 요청을 보낼 때, 토큰이 없다면 실제로는 api 요청을 보내지 않도록 하는 로직을 swr middleware에 정의해뒀었다. 

tanstack query에는 `QueryClientProvider`의 `client` 인자로 `queryClient`를 넘겨주게끔 되어 있는데 이때 `defaultOptions` property로 기본 `queryFn`이나 `enabled` 등을 설정해줄 수 있다. 하지만 `useQuery()` 호출부에서 `queryFn`이나 `enabled`를 정의하면 덮어씌워지기 때문에 실제로 middleware 처럼 쓸 수는 없었다. 

claude에게 계속 물었더니 tanstack query에서는 인증 관련 로직 등을 `queryClient`에 정의하는 것보다 `useAuthQuery` 같이 래핑된 커스텀 훅을 하나 더 만들어서 토큰이 필요한 api에 대해서 해당 커스텀 훅을 쓰는 방식으로 처리하는 것을 권장한다는 식으로 답변해줬다. 래핑 커스텀 훅을 쓰면 토큰이 필요한 api에 대해서만 해당 로직을 실행할 수 있기 때문에 더 경제적이다. 하지만 `useAuthQuery`를 써야 하는데 그냥 `useQuery`를 쓴다든지 실수할 수 있는 부분이 있고, 솔직하게 말하면 좀 귀찮은 부분이 있기 때문에 일단 tanstack query 단이 아닌 다른 곳에서 처리해주는 방식으로 수정했다.

### Light vs Featureful

swr에는 없지만 tanstack query에는 있는 기능은 훨씬 많을 것이다. 하지만 아직 tanstack query의 기능을 살펴볼 겨를은 없었기 때문에 그에 대한 설명은 생략하겠다. 이번에 tanstack query로 이관을 하면서 아이러니하게도 swr을 왜 쓰는지 이유를 알게 됐다. swr의 장점은 경량화에 있다. 많은 기능이 필요하지 않은 프로젝트라면 굳이 많은 기능이 있는 라이브러리를 선택할 필요도 없는 것이다.

### mutate에 대한 관점

swr와 tanstack query는 둘다 mutate 라는 단어를 사용하고 있지만 개념이 다르다. swr은 데이터를 새로 fetch 해야할 때 mutate를 사용한다. tanstack query의 refetch와 동일한 기능이다. tanstack query에는 `useMutation` 훅이 있는데, 서버의 데이터를 업데이트해야 할 때, 즉, post, patch, put, delete api를 요청할 때 사용한다. 이 부분에서 개인적으로 swr와 tanstack query가 어떤 데이터 저장소를 원천으로 보고 있는지 관점의 차이가 있다고 느꼈다. swr은 서버의 응답이 담긴 클라이언트 단에 있는 데이터 저장소를 보고 있고, 데이터를 새로 받아와 이 저장소를 갈아 끼우는 걸 mutate라고 부르는 느낌? tanstack query는 서버의 데이터 저장소를 보고 있고, 그 저장소의 데이터를 수정하는 걸 mutate로 부르는 느낌이다. 그냥 뇌피셜이기 때문에 정확한 정보는 아니다.

mutate 관련해서 데이터 변경 이후 새로 받아오는 주체를 어디에 두는 게 적절한지에 대한 논의가 있었다. 우리 팀은 그동안 `useSWR`의 호출 결과로 반환된 `mutate`를 이용해 데이터를 변경하는 api 호출 다음 줄에 `mutate`를 호출하는 식으로 데이터를 새로 받아오고 있었다. 기존에 tanstack query를 쓰고 계셨던 동료 분께서 tanstack query에서는 `useMutation`의 `onSuccess` property로 `queryClient.invalidateQueries(['queryKey'])` 하는 방식을 주로 쓴다는 리뷰를 주셨다. 안그래도 데이터를 새로 받아오기 위해 `mutate`를 호출하는 게 번거롭게 느껴질 때가 있었고, 여기저기 산재해있는 `mutate` 때문에 알아보기 힘들 때가 있었다. 데이터 변경을 만들어내는 쪽에서 데이터를 새로 불러오도록 처리하면 훨씬 깔끔하게 처리할 수 있겠다는 인사이트를 얻을 수 있었다. 다만 `useMutation` 를 꼭 써야 하는지에 대한 의문이 있어 이번 이관 때는 적용하지 않고 점진적으로 적용하기로 했다.

### key

swr에서는 key가 요청을 구분하기 위한 용도로만 쓰이는데, tanstack query는 `queryKey`로 계층을 줄 수 있다는 점이 흥미로웠다. post에 대한 수정 요청을 보낼 때, 목록 뿐만 아니라 상세 정보도 업데이트가 필요하다면 `queryClient.invalidateQueries([’post’])` 와 같은 방식으로 post 하위 계층의 데이터를 한번에 불러올 수 있다.


## 이관 시 고려한 것

### tanstack query v5의 브라우저 최소 지원 버전

swr는 브라우저 최소 지원 버전 같은 게 따로 없는데 tanstack query는 모던 브라우저만 지원한다. [[관련 문서](https://tanstack.com/query/latest/docs/framework/react/installation#requirements)] 특히 v5는 iOS와 Safari를 15 이상부터 지원한다. 최소 지원 버전을 15로 정하기는 부담스러울 수 있는데, 그럼 선택할 수 있는 방법이 2가지 있다. tanstack query v4와 같은 하위 버전을 사용하거나 Next.js라면 next.config.js에 `transpilePackages: ['@tanstack/react-query', '@tanstack/query-core']` 를 추가하면 된다. 우리 팀은 후자를 선택했다.

### 추상화

기존에 get api를 `useSWR` 로 감싼 커스텀 훅들을 모아놓은 파일의 이름을 `swr.ts` 로 사용하고 있었다. 라이브러리의 이름을 그대로 쓰고 있다 보니 해당 파일의 이름들도 바꿔줘야 하는 이슈가 생겼다. 이번엔 라이브러리 이름을 사용하지 말고 좀 더 범용적인 이름으로 지어 라이브러리 의존성을 없애자는 의견이 있었다. 하지만 적절한 이름을 떠올리지 못해 `queries.ts` 로 정했다. queries도 범용적 개념이기 때문에 라이브러리가 바뀌더라도 이 이름을 바꿀 필요는 없을 거라는 판단도 있었다. 또 라이브러리가 변경될 가능성이 있으니 라이브러리 의존성을 줄이기 위해 우리가 필요한 interface를 정의해 이를 반환하는 래핑 커스텀 훅을 만들어 사용하자는 의견이 있었다. 하지만 사실 tanstack query가 업계 표준에 가까운 만큼 우리가 정의한 interface로 사용하면 오히려 혼란을 야기할 수 있다는 점 때문에 추상화하지 않기로 했다.

## 소감

이전에도 swr를 tanstack query로 바꾸자는 논의가 몇 번 있었는데 tanstack query를 사용해 본 적이 없는 터라 구체적으로 어떤 차이가 있는지 모르겠어서 의견을 적극적으로 내지 못했다. 이번에 두 라이브러리는 어떤 차이점이 있는지 제대로 살펴볼 수 있어서 좋았다. tanstack query를 기존에 쓰고 계시던 분께 리뷰를 받을 수 있을 때 이관한 게 시기를 잘 맞췄다는 생각이 들었다. swr만 쓰고 있을 때는 익숙해서 인지하지 못했던 문제들을 해결할 수 있는 실마리를 발견할 수 있어서 좋았다. 하지만 swr도 확실히 강점이 있는 라이브러리다. 여유가 있을 때 swr의 `useSWRInfinite`의 이슈를 해결하는 데에 기여해보는 것도 좋을 것 같다.