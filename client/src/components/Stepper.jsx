import * as React from "react";
import Stepper from "@mui/joy/Stepper";
import Step, { stepClasses } from "@mui/joy/Step";
import StepIndicator, { stepIndicatorClasses } from "@mui/joy/StepIndicator";
import Typography, { typographyClasses } from "@mui/joy/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";

export default function StepperComponent({ steps, stepsCompleted }) {
  return (
    <Stepper
      orientation="vertical"
      sx={{
        "--Stepper-verticalGap": "2.5rem",
        "--StepIndicator-size": "2.5rem",
        "--Step-gap": "1rem",
        "--Step-connectorInset": "0.5rem",
        "--Step-connectorRadius": "1rem",
        "--Step-connectorThickness": "4px",
        "--joy-palette-success-solidBg": "var(--joy-palette-success-400)",
        [`& .${stepClasses.completed}`]: {
          "&::after": { bgcolor: "success.solidBg" },
        },
        [`& .${stepClasses.active}`]: {
          [`& .${stepIndicatorClasses.root}`]: {
            border: "4px solid",
            borderColor: "#fff",
            boxShadow: (theme) =>
              `0 0 0 1px ${theme.vars.palette.primary[500]}`,
          },
        },
        [`& .${stepClasses.disabled} *`]: {
          color: "neutral.softDisabledColor",
        },
        [`& .${typographyClasses["title-sm"]}`]: {
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontSize: "10px",
        },
      }}
    >
      {steps.map((step, index) => {
        return (
          <Step
            key={"step-" + index}
            className="pl-12"
            completed={index < stepsCompleted}
            active={index === stepsCompleted}
            disabled={index > stepsCompleted}
            indicator={
              <StepIndicator
                variant="solid"
                color={
                  (index < stepsCompleted && "success") ||
                  (index === stepsCompleted && "primary") ||
                  ""
                }
              >
                {index < stepsCompleted && <CheckRoundedIcon />}
                {index === stepsCompleted && <AppRegistrationRoundedIcon />}
                {index > stepsCompleted && index + 1}
              </StepIndicator>
            }
          >
            <div>
              <Typography level="title-sm">Step {index + 1}</Typography>
              {step}
            </div>
          </Step>
        );
      })}
    </Stepper>
  );
}
