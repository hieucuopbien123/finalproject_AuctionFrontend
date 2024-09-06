import { Container, Divider, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import UserActivity from "./UserActivity";
import UserCreated from "./UserCreated";
import UserBidded from "./UserBidded";
import UserCollected from "./usercollected";

const UserTabs = () => {
  const [userTab, setUserTab] = useState("0");
  return (
    <>
      <Container maxWidth="xxl">
        <Tabs
          value={userTab}
          textColor="secondary"
          indicatorColor="secondary"
          onChange={(_, v) => setUserTab(v)}
        >
          <Tab sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value="0" label="Collected"/>
          <Tab sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value="1" label="Created"/>
          <Tab sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value="2" label="Bidded"/>
          <Tab sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value="3" label="Activity" />
        </Tabs>
      </Container>
      <Divider/>
      { userTab == "0" && <UserCollected/> }
      { userTab == "1" && <UserCreated/> }
      { userTab == "2" && <UserBidded/> }
      { userTab == "3" && <UserActivity/> }
    </>
  )
}

export default UserTabs;
