// 📍 src/components/WalletBalanceBar.tsx 새로 만들기

import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const WalletBalanceBar = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <WalletRow>
      <WalletItem onClick={() => navigate("/history?tab=KR")}>
        <WalletFlag>🇰🇷</WalletFlag>
        <WalletAmount>{user.money.toLocaleString()}원</WalletAmount>
      </WalletItem>
      <WalletDivider />
      <WalletItem onClick={() => navigate("/history?tab=US")}>
        <WalletFlag>🇺🇸</WalletFlag>
        <WalletAmount $isDollar>
          ${(user.dollars ?? 0).toLocaleString()}
        </WalletAmount>
      </WalletItem>
    </WalletRow>
  );
};

export default WalletBalanceBar;

const borderPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0px transparent; }
  50% { box-shadow: 0 0 6px 2px rgba(99, 179, 237, 0.7); }
`;

const WalletRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  animation: ${borderPulse} 2s ease-in-out infinite;
`;

const WalletItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
  cursor: pointer;
  &:active {
    opacity: 0.7;
  }
`;

const WalletFlag = styled.span`
  font-size: 16px;
`;

const WalletAmount = styled.span<{ $isDollar?: boolean }>`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme, $isDollar }) =>
    $isDollar ? theme.colors.accentGreen : theme.colors.primary};
`;

const WalletDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 8px;
`;
