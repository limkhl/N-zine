import type { FontStyle, FontWeight } from "satori";

export type FontOptions = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight | undefined;
  style: FontStyle | undefined;
};

async function loadPretendardFont(variant: string): Promise<ArrayBuffer> {
  const API = `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/${variant}.otf`;

  const font = await await fetch(API).then(res => res.arrayBuffer());
  return font;
}

async function loadPretendardFonts(): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: "Pretendard",
      variant: "Pretendard-Medium",
      weight: 400,
      style: "normal",
    },
    {
      name: "Pretendard",
      variant: "Pretendard-Bold",
      weight: 700,
      style: "bold",
    },
    {
      name: "Pretendard",
      variant: "Pretendard-ExtraBold",
      weight: 800,
      style: "extra-bold",
    },
  ];

  const fonts = await Promise.all(
    fontsConfig.map(async ({ name, variant, weight, style }) => {
      const data = await loadPretendardFont(variant);
      return { name, data, weight, style };
    })
  );

  return fonts;
}

export default loadPretendardFonts;
