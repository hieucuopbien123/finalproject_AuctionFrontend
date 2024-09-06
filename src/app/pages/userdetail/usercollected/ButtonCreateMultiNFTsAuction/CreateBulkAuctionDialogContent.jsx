import { Box, Button, Step, StepButton, StepLabel, Stepper, Typography } from "@mui/material";
import React, { useState } from "react";
import AuctionCreation from "../../../../components/auctioncreation";
import { useCallback } from "react";
import { check1155Type } from "src/api/contracts/interaction/NFTCoreContract";
import { useEffect } from "react";
import ActionSelectNFTs from "./ActionSelectNFTs";
import ActionApproveNFTs from "./ActionApproveNFTs";

const steps = ['Set nfts amount', 'Approve NFTs', 'Create an auction'];

const CreateBulkAuctionDialogContent = (
  {data, writeContract, isLoading, setAuctionType, setBulkChosen, setDialogOpen}
) => {
  const [isFetchingType, setFetchingType] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [nftAmount, setNFTAmount] = useState({});
  const [isApprovedAll, setIsApprovedAll] = useState(false);
  const distinctAddresses = data.reduce((d, current) => {
    const x = d.find(item => item.token_address === current.token_address);
    if (!x) {
      return d.concat([current]);
    } else {
      return d;
    }
  }, []);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  const fetchType = useCallback(async() => {
    setFetchingType(true);
    for(let i = 0; i < data.length; i++) {
      if(data[i].contract_type == "ERC1155" || parseInt(data[i].amount) > 1){
        data[i].contractType = 1;
        continue;
      }
      if(data[i].contract_type == "ERC721") {
        data[i].contractType = 0;
        continue;
      }
      if(await check1155Type(data[i].token_address)){
        data[i].contractType = 1;
        continue;
      }
      if(await check721Type(data[i].token_address)){
        data[i].contractType = 1;
        continue;
      }
      setHasError(true);
    }
    setFetchingType(false);
  }, [data]);
  useEffect(() => {
    fetchType();
  }, [fetchType]);
  return (
    <Box pt={2}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepButton onClick={handleStep(index)}>
                <StepLabel>{label}</StepLabel>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      <Box>
        {
          activeStep == 0 && (
            <Box pt={3}>
              <ActionSelectNFTs {...{data, nftAmount, setNFTAmount}} />
            </Box>
          )
        }
        {
          activeStep == 1 && (
            <Box pt={3}>
              {
                hasError ? (
                  <>
                    <Typography>Invalid NFTs type</Typography>
                  </>
                ) : (
                  isFetchingType ? (
                    <Typography>Loading</Typography>
                  ) : (
                    <ActionApproveNFTs {...{data, setIsApprovedAll, distinctAddresses}}/>
                  )
                )
              }
            </Box>
          )
        }
        {
          activeStep == 2 && (
            <Box pt={1}>
              <AuctionCreation {...{nftAmount, data, writeContract, isLoading, setAuctionType, callback: () => {
                // setDialogOpen(false);
                // setBulkChosen([]);
              }}}/>
            </Box>
          )
        }
        {
          activeStep <= 1 &&
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext} disabled={
              (activeStep == 0 && Object.values(nftAmount).some(value => value <= 0)) 
              || 
              (activeStep == 1 && !(!hasError && (isApprovedAll || (!isApprovedAll && distinctAddresses.length == 1 && data[0].contractType == 1))))
            }>
              Next
            </Button>
          </Box>
        }
      </Box>
    </Box>
  )
}

export default CreateBulkAuctionDialogContent;