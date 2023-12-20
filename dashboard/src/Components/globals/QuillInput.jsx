import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React from "react";
import ReactQuill from "react-quill";
const QuillInput = ({
  value,
  label,
  error,
  touched,
  handleChange,
  handleBlur,
}) => {
  const { colors, customColors } = useTheme();
  return (
    <Box sx={{ position: "relative" }}>
      <Typography
        sx={{
          // color: "black",
          // color: customColors.label,
          fontWeight: "bold",
          fontSize: "15px",
        }}
      >
        {label}
      </Typography>
      <ReactQuill
        theme="snow"
        id="description_ar"
        formats={formats}
        modules={modules}
        style={{
          direction: "ltr",
          // border: `0.4px solid ${customColors.label} ${error ? colors.dangerous : "transparent"}`,
          // border: `0.1px solid ${customColors.label}`,
          backgroundColor: customColors.bg,
        }}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {error ? (
        <Typography
          sx={{
            color: colors.dangerous,
            position: "absolute",
            left: "10px",
            fontSize: "12px",
          }}
        >
          {error}
        </Typography>
      ) : undefined}
    </Box>
  );
};
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
];
export default QuillInput;
