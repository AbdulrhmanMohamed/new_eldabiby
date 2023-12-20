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
import { useCreateNewRepoMutation } from "../../api/repos.api";
import { useGetAllProductsQuery } from "../../api/product.api";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";

function RepoOperationsModal({ open, setOpen }) {
  const { btnStyle, colors, customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  const handleClose = () => {
    setOpen(false);
    resetForm();
    setSelectedProducts([]);
    setProductItem({
      id: "",
      quantity: 0,
    });
  };
  const [createNewRepo] = useCreateNewRepoMutation();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const {
    handleSubmit,
    errors,
    setFieldValue,
    values,
    touched,
    handleChange,
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
      createNewRepo(values)
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
  const { data } = useGetAllProductsQuery(`?limit=1000`);
  const [productItem, setProductItem] = useState({
    id: "",
    quantity: 0,
  });
  const [addingError, setAddingError] = useState({});
  const handleChangeProductItem = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      setProductItem({
        ...productItem,
        quantity: value,
      });
    }
    setProductItem({
      ...productItem,
      [name]: value,
    });
    setAddingError({
      ...addingError,
      [name]: "",
    });
    if (name === "quantity" && value < 1) {
      setAddingError({
        [name]:
          language === "en"
            ? "Quantity must be greater than 0"
            : "الكمية لا تجب اكبر من 0",
      });
    }
  };
  const addProductToRepoValues = () => {
    if (productItem.quantity === 0 && !productItem.id) {
      setAddingError({
        quantity: language === "en" ? "Quantity is required" : "الكمية مطلوبة",
        id: language === "en" ? "Product is required" : "المنتج مطلوب",
      });
    } else if (!productItem.id) {
      setAddingError({
        ...addingError,
        id: language === "en" ? "Product is required" : "المنتج مطلوب",
      });
    } else if (productItem.quantity === 0) {
      setAddingError({
        ...addingError,
        quantity: language === "en" ? "Quantity is required" : "الكمية مطلوبة",
      });
    } else {
      if (selectedProducts.find(({ _id }) => _id === productItem.id)) {
        toast.error(
          language === "en"
            ? "Product is added in the list"
            : "المنتج مضاف في القائمة"
        );
      } else {
        const findedproduct = repoProducts.items.find(
          (item) => item._id === productItem.id
        );
        if (
          productItem?.quantity >
          findedproduct?.quantity - findedproduct?.repoQuantity
        ) {
          toast.error(
            language === "en"
              ? `The quantity of this product isn't enough`
              : `كمية هذا المنتج غير متوفرة`
          );
        } else {
          setFieldValue("products", [
            ...values.products,
            {
              productId: productItem.id,
              quantity: +productItem.quantity,
            },
          ]);
          setSelectedProducts((prev) => {
            let findProduct = data?.data.find(
              (item) => item._id === productItem.id
            );

            return [
              ...prev,
              {
                _id: findProduct._id,
                title_en: findProduct.title_en,
                title_ar: findProduct.title_ar,
                quantity: +productItem.quantity,
              },
            ];
          });
          setProductItem({
            id: "",
            quantity: 0,
          });
        }
      }
    }
  };
  const deleteSelectedProduct = (item) => {
    setFieldValue(
      "products",
      values.products.filter(({ productId }) => productId !== item._id)
    );
    setSelectedProducts(
      selectedProducts.filter((selected) => selected._id !== item._id)
    );
  };
  const { repoProducts } = useSelector((state) => state);
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

          <Box
            border={1}
            borderColor={
              errors.products && touched.products?.length < 1
                ? colors.dangerous
                : colors.inputBorderColor
            }
            p={2.5}
          >
            <Typography>{language === "en" ? "Quantity" : "الكمية"}</Typography>
            <InputBase
              type="number"
              name="quantity"
              value={productItem.quantity}
              onChange={handleChangeProductItem}
              sx={{
                width: 1,
                border: 1,
                borderColor: colors.inputBorderColor,
                p: 1,
              }}
            />
            {addingError.quantity && (
              <Typography color={colors.dangerous}>
                {addingError.quantity}
              </Typography>
            )}
            <Box
              sx={{
                mt: "15px",
                position: "relative",
              }}
            >
              <Typography
                sx={{
                  color: colors.text,
                  fontSize: "15px",
                }}
              >
                {language === "en" ? "Select Product" : "اختار منتج"}
              </Typography>
              <FormControl
                sx={{
                  width: 1,
                  svg: {
                    color: `${colors.main} !important`,
                  },
                }}
              >
                <Select
                  value={productItem.id}
                  name={"id"}
                  onChange={handleChangeProductItem}
                  displayEmpty
                  sx={{
                    width: 1,
                    border: 1,
                    height: 45,
                    bgcolor: customColors.bg,
                  }}
                >
                  {repoProducts.items.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item[`title_${language}`]}
                    </MenuItem>
                  ))}
                </Select>
                {addingError.id && (
                  <Typography color={colors.dangerous}>
                    {addingError.id}
                  </Typography>
                )}

                <Stack>
                  <Button
                    sx={{ ...btnStyle, color: "#fff", mt: 2, width: 1 }}
                    type="button"
                    onClick={addProductToRepoValues}
                  >
                    {language === "en" ? "Add product" : "إضافة منتج"}
                  </Button>
                </Stack>
                {selectedProducts?.length > 0 && (
                  <Box
                    border={1}
                    borderColor={colors.inputBorderColor}
                    p={2}
                    mt={"20px"}
                    sx={{
                      display: "flex",
                      gap: "20px",
                      flexWrap: "20px",
                    }}
                  >
                    {selectedProducts.map((selPro) => (
                      <Box
                        border={1}
                        borderColor={colors.inputBorderColor}
                        p={0.75}
                        position={"relative"}
                        borderRadius={2}
                      >
                        <CloseIcon
                          onClick={() => deleteSelectedProduct(selPro)}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: language === "ar" ? 0 : undefined,
                            right: language === "en" ? 0 : undefined,
                            cursor: "pointer",
                            color: "red",
                          }}
                        />
                        <Typography
                          sx={{
                            color: colors.text,
                            p: "10px",
                          }}
                        >
                          {selPro[`title_${language}`]}
                        </Typography>
                        <Typography align="center">
                          {selPro.quantity}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </FormControl>
            </Box>
          </Box>
          {errors.products && touched.products?.length < 1 ? (
            <Typography color={colors.dangerous}>{errors.products}</Typography>
          ) : undefined}
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

export default RepoOperationsModal;
