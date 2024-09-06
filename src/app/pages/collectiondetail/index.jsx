import { Box, Container } from "@mui/material";
import CollectionHeader from "./CollectionHeader";
import CollectionTabs from "./CollectionTabs";

const CollectionDetail = () => {  
  return (
    <Box className="animate__animated animate__fadeIn" pt={2}>
      <Container maxWidth="xxl">
        <CollectionHeader/>
      </Container>
      <CollectionTabs/>
    </Box>
  )
}

export default CollectionDetail;