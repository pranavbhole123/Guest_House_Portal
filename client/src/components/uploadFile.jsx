import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DoneIcon from "@mui/icons-material/Done";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload({ onFileUpload }) {
  // const onFileChange = (event) => {
  //   const files = event.target.files;
  //   if (files) {
  //     const maxSize = 1024 * 1024 * 5; // 5MB
  //     const isValid = Array.from(files).every((file) => file.size <= maxSize);
  //     if (!isValid) {
  //       alert("File size should be less than 5MB");
  //       return;
  //     }
  //     onFileUpload(files);
  //   }
  // };
  const onFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      const maxSizeInBytes = 1024 * 1024 * 2; // 2MB max file size
      const maxFiles=7;
      if (files.length > maxFiles) {
        // alert(`You can only upload a maximum of ${maxFiles} files at a time.`);
        toast.error(`You can only upload a maximum of ${maxFiles} files at a time.`);
        return;
      }
      const filesToUpload = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size <= maxSizeInBytes) {
          filesToUpload.push(file);
        } else {
          toast.error(`File "${file.name}" exceeds the maximum size limit (2MB)`);
          return;
        }
      }
      // Pass only valid files to the onFileUpload handler
      onFileUpload(filesToUpload);
    }
  };
  return (
    <Button
      component="label"
      role={undefined}
      className="w-fit"
      variant="contained"
      tabIndex={-1}
      // startIcon={}
    >
      <div className="flex py-2 gap-4 items-center">
        <CloudUploadIcon />
        <div className="font-semibold font-['Dosis']">Upload file</div>
        <VisuallyHiddenInput type="file" multiple onChange={onFileChange} />
      </div>
    </Button>
  );
}
