/**
 * 📦 localStorage 유틸 함수 모음
 */

/**
 * 🔹 데이터 가져오기
 */
export const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);

    if (!item || item === "undefined") return defaultValue;

    return JSON.parse(item) as T;
  } catch (error) {
    console.error("getStorage error:", error);
    return defaultValue;
  }
};

/**
 * 🔹 데이터 저장
 */
export const setStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("setStorage error:", error);
  }
};

/**
 * 🔹 데이터 삭제
 */
export const removeStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("removeStorage error:", error);
  }
};
