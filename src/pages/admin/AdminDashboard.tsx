import styled from "styled-components";
import AdminCard from "../../components/admin/AdminCard";

/**
 * 관리자 메인 대시보드
 */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const AdminDashboard = () => {
  return (
    <Grid>
      <AdminCard title="오늘 뉴스" value="6개" />
      <AdminCard title="총 유저" value="124명" />
      <AdminCard title="오늘 거래" value="89건" />
    </Grid>
  );
};

export default AdminDashboard;
