import { Box, Container } from "@mui/material";
import UserHeader from "./UserHeader";
import UserTabs from "./UserTabs";

const UserDetail = () => {  
  return (
    <Box className="animate__animated animate__fadeIn" pt={2}>
      <Container maxWidth="xxl">
        <UserHeader/>
      </Container>
      <UserTabs/>
    </Box>
  )
}

export default UserDetail;