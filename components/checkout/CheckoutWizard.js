import StepLabel from "@mui/material/StepLabel";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import Box from "@mui/material/Box";

function CheckoutWizard({ activeStep = 0 }) {
  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {["Login", "Shipping Address", "Payment Method", "Place Order"].map(
          step => (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          )
        )}
      </Stepper>
    </Box>
  );
}

export default CheckoutWizard;
