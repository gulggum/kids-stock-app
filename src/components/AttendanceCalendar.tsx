import styled from "styled-components";
import { useAttendance } from "../context/AttendanceContext";
import { getDateKey } from "./utils/date";

/**
 * 📅 월간 출석 달력
 * - 출석한 날짜는 체크 표시
 * - 숫자만 보여주는 단순 UI
 */

const AttendanceCalendar = () => {
  const { checkedDates } = useAttendance();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // 이번 달 날짜 수
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <Calendar>
      {Array.from({ length: daysInMonth }, (_, i) => {
        const date = getDateKey(new Date(year, month, i + 1));

        const checked = checkedDates.includes(date);

        return (
          <Day key={i} $checked={checked}>
            {i + 1}
          </Day>
        );
      })}
    </Calendar>
  );
};
const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

const Day = styled.div<{ $checked: boolean }>`
  height: 32px;
  border-radius: 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  font-weight: 700;

  background: ${({ $checked, theme }) =>
    $checked ? theme.colors.primary : theme.colors.surface};

  color: ${({ $checked }) => ($checked ? "#fff" : "inherit")};
`;

export default AttendanceCalendar;
