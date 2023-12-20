import {
  Box,
  Button,
  CardMedia,
  Grid,
  InputBase,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useFormik } from "formik";
import { productValues } from "../../formik/initValues";
import { productErrors } from "../../formik/errors";
import ProductQualities from "../../Components/product/ProductQualities";
import { useNavigate, useParams } from "react-router-dom";
import { useUploadImageMutation } from "../../api/upload.api";
import {
  useGetProductById,
  useUpdateProductInfo,
} from "../../hooks/products.hooks";
import ProductQualitiesImages from "../../Components/product/ProductQualitiesImages";
import ProductAttributes from "../../Components/product/ProductAttributes";
import MetaAccordions from "../../Components/metaAccordion/MetaAccordions";
import QuillInput from "../../Components/globals/QuillInput";
import SelectTag from "../../Components/globals/SelectTag";
import { useFetchAllCategories } from "../../hooks/categories.hooks";
import { useFetchSubCategoriesByCategoryId } from "../../hooks/subCategories.hooks";
import {
  deliveryTypes,
  paymentTypes,
} from "../../Components/product/productAssets";
import ProductKeywords from "../../Components/product/ProductKeywords";
import UploadFiles from "../../Components/globals/UploadFiles";
import { imageBaseUrl } from "../../api/baseUrl";
import { useTranslation } from "react-i18next";
const EditProductPage = () => {
  const { id } = useParams();
  const { product } = useGetProductById(id);
  const { colors, btnStyle, customColors, breakpoints } = useTheme();
  const [_, { language }] = useTranslation();
  const [uploadImage] = useUploadImageMutation();
  const [updateProductInfo, { isLoading }] = useUpdateProductInfo();
  const formik = useFormik({
    initialValues: productValues,
    validationSchema: productErrors(language),
    onSubmit: (values) => {
      const temp = JSON.parse(JSON.stringify(values));
      // !temp.attributes[0] ? delete temp.attributes : undefined;
      // !temp.qualities[0] ? delete temp.qualities : undefined;
      // !temp.qualitiesImages[0] ? delete temp.qualitiesImages : undefined;
      !temp.title_meta ? delete temp.title_meta : undefined;
      !temp.desc_meta ? delete temp.desc_meta : undefined;
      !temp.link ? delete temp.link : undefined;
      !temp.extention ? delete temp.extention : undefined;
      delete temp.title;
      delete temp.role;
      delete temp.message;
      delete temp.receiver;
      updateProductInfo(temp, product?.data._id);
    },
  });
  const navigate = useNavigate();
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  } = formik;
  const [file, setFile] = useState();
  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const formData = new FormData();
      formData.append("image", file);
      uploadImage(formData)
        .unwrap()
        .then((res) => {
          setFieldValue("images", [...values.images, res.image]);
        });
    }
  };
  const deleteImage = (file) => {
    formik.setValues({
      ...values,
      images: values.images.filter((item) => item !== file),
    });
    if (file) setFile();
  };
  useEffect(() => {
    if (product?.data) {
      Object.keys(product.data).forEach((key) => {
        if (key in values) {
          switch (key) {
            case "category":
              return setFieldValue(
                "category",
                product.data.category?._id || ""
              );
            case "subCategory":
              return setFieldValue(
                "subCategory",
                product.data.subCategory?._id || ""
              );
            case "qualitiesImages":
              return setFieldValue(
                "qualitiesImages",
                product.data.qualitiesImages.map((item) => ({
                  image: item.image,
                  qualities: item.qualities.map((qual) => ({
                    key_en: qual.key_en,
                    key_ar: qual.key_ar,
                    value_en: qual.value_en,
                    value_ar: qual.value_ar,
                    price: qual.price,
                  })),
                }))
              );
            case "attributes":
              return setFieldValue(
                "attributes",
                product.data.attributes.map((attribute) => ({
                  key_en: attribute.key_en,
                  key_ar: attribute.key_ar,
                  values: attribute.values.map((item) => ({
                    value_en: item.value_en,
                    value_ar: item.value_ar,
                  })),
                }))
              );
            case "qualities":
              return setFieldValue(
                "qualities",
                product.data.qualities.map((quality) => ({
                  key_en: quality.key_en,
                  key_ar: quality.key_ar,
                  values: quality.values.map((item) => ({
                    value_en: item.value_en,
                    value_ar: item.value_ar,
                    price: item.price,
                  })),
                }))
              );
            default:
              setFieldValue(key, product.data[key]);
              break;
          }
        }
        setFieldValue("title_meta", product.data?.metaDataId?.title_meta || "");
        setFieldValue("desc_meta", product.data?.metaDataId?.desc_meta || "");
      });
    }
  }, [product]);
  const { categories } = useFetchAllCategories();
  const { subCategories } = useFetchSubCategoriesByCategoryId(values.category);
  const phoneScreen = useMediaQuery(breakpoints.down("lg"));

  return (
    <Box
      sx={{
        p: {
          lg: 3,
          md: 2.5,
          xs: 1.5,
        },
        bgcolor: colors.bg_main,
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Box py={5}>
        <Typography variant="h4" mb={"10px"}>
          {language === "en" ? "products" : "المنتجات"}
        </Typography>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack direction={"row"} alignItems={"center"} gap={"10px"}>
            <Typography
              variant="h6"
              onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {language === "en" ? "Home" : "الصفحة الرئيسية"}
            </Typography>
            <ArrowForwardIosIcon
              sx={{
                transform: language === "ar" ? "rotateY(180deg)" : 0,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/products")}
            >
              {language === "en" ? "products" : "المنتجات"}
            </Typography>
            {product.data && !product.error ? (
              <>
                <ArrowForwardIosIcon
                  sx={{
                    transform: language === "ar" ? "rotateY(180deg)" : 0,
                    fontSize: "16px",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.main,
                    fontSize: "16px",
                  }}
                >
                  {product.data[`title_${language}`]}
                </Typography>
              </>
            ) : undefined}
          </Stack>
          <ArrowForwardIosIcon
            onClick={() => navigate(-1)}
            sx={{
              cursor: "pointer",
              transform: language === "ar" ? "rotateY(180deg)" : 0,
            }}
          />
        </Stack>
      </Box>
      <Grid container>
        {/* Grid Media */}
        <Grid item lg={6} xs={12}>
          <Stack
            sx={{
              flexDirection: {
                lg: "row",
                xs: "column-reverse",
              },
              gap: "15px",
            }}
          >
            {values.images.length > 0 ? (
              <Stack
                sx={{
                  flexDirection: {
                    lg: "column",
                    xs: "row",
                  },
                  width: 80,
                }}
              >
                {values.images.map((image, idx) => (
                  <Box position={"relative"} key={idx}>
                    <Button
                      sx={{
                        bgcolor: `${colors.dangerous} !important`,
                        minWidth: 0,
                        position: "absolute",
                        top: 0,
                        left: language === "ar" ? 0 : undefined,
                        right: language === "en" ? 0 : undefined,
                        height: 20,
                        width: 20,
                      }}
                      onClick={() => deleteImage(image)}
                    >
                      <CloseIcon
                        sx={{
                          color: "#fff",
                          fontSize: "15px",
                        }}
                      />
                    </Button>
                    <CardMedia
                      src={`${imageBaseUrl}${image}`}
                      component="img"
                      sx={{
                        height: 100,
                        width: 80,
                        objectFit: "cover",
                        borderRadius: "10px",
                        mt: {
                          lg: "15px",
                          xs: 0,
                        },
                        mb: {
                          lg: 0,
                          xs: "15px",
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            ) : undefined}
            <UploadFiles
              error={errors.images}
              touched={touched.images?.length < 1}
              file={file}
              handleUploadFile={handleUploadFile}
              context={true ? "Uplaad product image" : "رفع صورة المنتج"}
              extraStyle={{
                height: 500,
                width: {
                  lg: values.images.length > 0 ? "calc(100% - 100px)" : 1,
                  xs: 1,
                },
              }}
            />
          </Stack>
          {!phoneScreen && (
            <Box>
              <Box mt={"15px"}>
                <ProductQualities
                  language={language}
                  productQualities={values?.qualities || []}
                  produuctSetFieldValue={setFieldValue}
                />
              </Box>
              {/* FORM Qualities IMAGES LARGE */}

              <Box mt={"15px"}>
                <ProductQualitiesImages
                  language={language}
                  productQualities={values?.qualities || []}
                  productQualitiesImages={values.qualitiesImages}
                  produuctSetFieldValue={setFieldValue}
                />
              </Box>
              <Box mt={"15px"}>
                <ProductAttributes
                  language={language}
                  productAttributes={values.attributes}
                  setProductFieldValue={setFieldValue}
                />
              </Box>
              <Box mt={"15px"}>
                <MetaAccordions
                  metaTitle={values.title_meta}
                  metaDesc={values.desc_meta}
                  setFieldValue={setFieldValue}
                  isEdit={true}
                />
              </Box>
            </Box>
          )}
        </Grid>

        {/* Grid fields */}
        <Grid
          item
          lg={6}
          xs={12}
          sx={{
            px: {
              md: "20px",
              xs: 0,
            },
          }}
        >
          {/* FORM TITLE_EN */}
          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "English title" : "اللقب الانجليزى"}
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.title_en && touched.title_en
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"title_en"}
              type={"text"}
              value={values?.title_en}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.title_en && touched.title_en ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.title_en}
              </Typography>
            ) : undefined}
          </Box>
          {/* FORM TITLE_AR */}
          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Arabic title" : "اللقب العربي"}
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.title_ar && touched.title_ar
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"title_ar"}
              type={"text"}
              value={values?.title_ar}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.title_ar && touched.title_ar ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.title_ar}
              </Typography>
            ) : undefined}
          </Box>
          {/* FORM DESCRIPTION_EN */}

          <Box mt={"15px"}>
            <QuillInput
              label={
                language === "en" ? "english description" : "الوصف الانجليزي"
              }
              field="description_en"
              error={errors.description_en}
              value={values.description_en}
              touched={touched.description_en}
              handleChange={(value) => {
                setFieldValue("description_en", value);
              }}
              handleBlur={(v) => {
                setFieldTouched("description_en", true);
              }}
            />
          </Box>
          {/* FORM DESCRIPTION_AR */}
          <Box mt={"15px"}>
            <QuillInput
              label={language === "en" ? "arabic description" : "الوصف العربي"}
              field="description_ar"
              error={errors.description_ar}
              value={values.description_ar}
              touched={touched.description_ar}
              handleChange={(value) => setFieldValue("description_ar", value)}
              handleBlur={(v) => {
                setFieldTouched("description_ar", true);
              }}
            />
          </Box>
          {/* FORM PRICE BEFORE DISCOUNT */}

          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Price" : "السعر"}
              <Typography
                component="span"
                sx={{
                  fontSize: "small",
                }}
              >
                {` (${
                  language === "en" ? "in Saudi riyalss" : "بالريال السعودي"
                }) `}
              </Typography>
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.priceBeforeDiscount && touched.priceBeforeDiscount
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"priceBeforeDiscount"}
              type={"number"}
              value={values?.priceBeforeDiscount}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.priceBeforeDiscount && touched.priceBeforeDiscount ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.priceBeforeDiscount}
              </Typography>
            ) : undefined}
          </Box>
          {/* FORM QUANTITY */}

          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Quantity" : "الكمية"}
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.quantity && touched.quantity
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"quantity"}
              type={"number"}
              value={values.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.quantity && touched.quantity ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.quantity}
              </Typography>
            ) : undefined}
          </Box>
          {/* FORM WEIGHT */}

          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Weight" : "الوزن"}
              <Typography
                component="span"
                sx={{
                  fontSize: "small",
                }}
              >
                {` (${
                  language === "en"
                    ? "in grams - 1000 gram equal 1 kg"
                    : "بالجرام - 1000 جرام يساوي كيلو جرام"
                }) `}
              </Typography>
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.weight && touched.weight
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"weight"}
              type={"number"}
              value={values?.weight}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.weight && touched.weight ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.weight}
              </Typography>
            ) : undefined}
          </Box>
          {/* FORM CATEGORY */}

          <Box mt={"15px"}>
            <SelectTag
              label={language === "en" ? "category" : "القسم"}
              name="category"
              error={errors.category}
              value={values.category}
              touched={touched.category}
              handleChange={handleChange}
              handleBlur={handleBlur}
              optionsData={categories.data}
              itemField={`name_${language}`}
            />
          </Box>
          {/* FORM SUB CATEGORY */}

          <Box mt={"15px"}>
            <SelectTag
              label={language === "en" ? "sub category" : "القسم الفرعي"}
              name="subCategory"
              error={errors.subCategory}
              value={values.subCategory}
              touched={touched.subCategory}
              handleChange={handleChange}
              handleBlur={handleBlur}
              optionsData={subCategories.data}
              itemField={`name_${language}`}
            />
          </Box>
          {/* FORM PAYMENT TYPE */}

          <Box mt={"15px"}>
            <SelectTag
              label={language === "en" ? "Payment type" : "نوع الدفع"}
              name="paymentType"
              error={errors.paymentType}
              value={values?.paymentType || ""}
              touched={touched.paymentType}
              handleChange={handleChange}
              handleBlur={handleBlur}
              optionsData={paymentTypes}
              link={values.link}
            />
          </Box>

          {/* FORM DELIVERY TYPE */}

          <Box mt={"15px"}>
            <SelectTag
              label={language === "en" ? "delivery type" : "نوع التوصيل"}
              name="deliveryType"
              error={errors.deliveryType}
              value={values?.deliveryType || ""}
              touched={touched.deliveryType}
              handleChange={handleChange}
              handleBlur={handleBlur}
              optionsData={deliveryTypes}
            />
          </Box>
          {/* FORM KEYWORDS */}

          <Box mt={"15px"}>
            <ProductKeywords
              language={language}
              keywordsValues={values?.keywords || []}
              keywordsErrors={errors.keywords}
              keywordsTouched={touched.keywords?.length < 1}
              setFieldValue={setFieldValue}
            />
          </Box>

          {/* FORM Link */}

          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Link" : "الرابط"}
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.link && touched.link
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"link"}
              type={"text"}
              value={values?.link}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.link && touched.link ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.link}
              </Typography>
            ) : undefined}
          </Box>
        </Grid>
      </Grid>
      {phoneScreen && (
        <Box>
          {/* FORM ATTRIBUTES SMALL */}

          <Box mt="20px">
            <ProductAttributes
              language={language}
              productAttributes={values.attributes}
              setProductFieldValue={setFieldValue}
            />
          </Box>
          {/* FORM QUALITIES SMALL */}

          <Box mt="20px">
            <ProductQualities
              language={language}
              productQualities={values.qualities}
              produuctSetFieldValue={setFieldValue}
            />
          </Box>
          {/* FORM QUALITIES IMAGES SMALL */}

          <Box mt="20px">
            <ProductQualitiesImages
              language={language}
              productQualities={values.qualities}
              productQualitiesImages={values.qualitiesImages}
              produuctSetFieldValue={setFieldValue}
            />
          </Box>
          {/* FORM META TITLE SMALL */}
          <Box mt="20px">
            <MetaAccordions
              metaTitle={formik.values.title_meta}
              metaDesc={formik.values.desc_meta}
              setFieldValue={formik.setFieldValue}
              isEdit={true}
            />
          </Box>
          {/* FORM META DESCRIPTION SMALL */}
        </Box>
      )}
      <Stack direction={"row"} justifyContent={"center"} mt={"30px"}>
        <Button
          sx={{
            ...btnStyle,
            color: "#fff",
            mt: "30px",
            fontSize: "17px",
          }}
          type="submit"
        >
          {isLoading
            ? language === "en"
              ? "Updating product...."
              : "جارى التحديث..."
            : language === "en"
            ? "Update Product"
            : "تحديث المنتج"}
        </Button>
      </Stack>
    </Box>
  );
};
export default EditProductPage;
