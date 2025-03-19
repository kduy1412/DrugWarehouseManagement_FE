import { MenuRoutes } from "../types/menuRoutes";

export const getVietnameseTranslations = (
  routes: MenuRoutes[]
): { [key: string]: string } => {
  const translations: { [key: string]: string } = {};

  const extractTranslations = (items: MenuRoutes[]) => {
    items.forEach((item) => {
      const key = item.key.split("/").pop() || "";
      translations[key] = item.label as string;
      if (item.children) {
        extractTranslations(item.children);
      }
    });
  };

  extractTranslations(routes);
  return translations;
};
