/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /**
   * OpenRouter API kaliti — примерка generatsiyasi uchun (`features/garderob/api`).
   *
   * `VITE_` prefiksi bu qiymatni build natijasiga qo'shadi, ya'ni u brauzerda
   * OCHIQ turadi. Ommaviy ishga tushirishda chaqiruvni serverga ko'chirish kerak.
   */
  readonly VITE_OPENROUTER_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
