import coinSound from "../../assets/sounds/coin.mp3";
import moneySound from "../../assets/sounds/money.mp3";

const DEFAULT_VOLUME = 0.5;

const playSound = (src: string, volume = DEFAULT_VOLUME) => {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play();
};

/**
 * 💰 돈 사용 사운드 (주식 구매)
 */
export const playMoneySound = () => {
  playSound(moneySound);
};

/**
 * 🪙 코인 사용/획득 사운드 (아이템)
 */
export const playCoinSound = () => {
  playSound(coinSound);
};
