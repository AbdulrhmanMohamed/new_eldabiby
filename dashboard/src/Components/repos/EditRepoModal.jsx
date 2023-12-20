import { useTheme } from "@emotion/react";
import { useState } from "react";
import {
  Autocomplete,
  Box,
  FormControl,
  InputBase,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useFormik } from "formik";
import * as React from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useUpdateRepoMutation } from "../../api/repos.api";

function EditRepoistoryModal({ open, setOpen, selectedItem, setSelectItem }) {
  const { btnStyle, colors, customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  const handleClose = () => {
    setOpen(false);
    setSelectItem();
    resetForm();
  };
  const [updateRepo] = useUpdateRepoMutation();
  const {
    handleSubmit,
    errors,
    values,
    touched,
    handleChange,
    setFieldValue,
    resetForm,
    handleBlur,
  } = useFormik({
    initialValues: {
      name_ar: "",
      name_en: "",
      address: "",
      products: [],
    },
    validationSchema: Yup.object({
      name_ar: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      name_en: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      address: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      products: Yup.array()
        .min(1, language === "en" ? "Add Product" : "أضف منتج")
        .required(language === "en" ? "Required" : "مطلوب"),
    }),
    onSubmit: (values) => {
      updateRepo({
        payload: values,
        id: selectedItem._id,
      })
        .unwrap()
        .then((res) => {
          toast.success(res[`success_${language}`]);
          handleClose();
        })
        .catch((err) => {
          toast.error(err.data[`error_${language}`]);
        });
    },
  });
  React.useEffect(() => {
    if (open && selectedItem) {
      setFieldValue("name_en", selectedItem.name_en);
      setFieldValue("name_ar", selectedItem.name_ar);
      setFieldValue("address", selectedItem.address);
      setFieldValue(
        "products",
        selectedItem.products.map((el) => ({
          productId: el.productId._id,
          quantity: el.quantity,
        }))
      );
    }
  }, [open, selectedItem]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "720px!important",
          py: "40px",
          px: "30px",
          borderRadius: "15px",
          direction: language === "en" ? "ltr" : "rtl",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: "100%", gap: 3 }}>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Name Arabic" : "الأسم  بالعربي"}
            </Typography>
            <TextField
              name="name_ar"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name_ar}
              helperText={
                touched.name_ar && errors.name_ar ? errors.name_ar : ""
              }
              error={touched.name_ar && errors.name_ar}
              variant="outlined"
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Name English" : "الأسم  بالانجليزي"}
            </Typography>
            <TextField
              name="name_en"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name_en}
              helperText={
                touched.name_en && errors.name_en ? errors.name_en : ""
              }
              error={touched.name_en && errors.name_en}
              variant="outlined"
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Address" : "العنوان"}
            </Typography>
            <TextField
              name="address"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.address}
              helperText={
                touched.address && errors.address ? errors.address : ""
              }
              error={touched.address && errors.address}
              variant="outlined"
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
        </FormControl>

        <Stack
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            mt: "20px",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            type="submit"
            sx={{
              bgcolor: colors.main,
              textTransform: "capitalize",
              "&:hover": { bgcolor: customColors.main },
            }}
          >
            {language === "en" ? "Save" : "حفظ"}
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: colors.main,
              color: colors.main,
              textTransform: "capitalize",
              "&:hover": { borderColor: customColors.main },
            }}
          >
            {language === "en" ? "cancel" : "الغاء"}
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
}

export default EditRepoistoryModal;
