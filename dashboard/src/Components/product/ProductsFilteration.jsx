import React from "react";
import FilterMenu from "./FilterMenu";
import { Button, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useFetchAllCategories } from "../../hooks/categories.hooks";
import { useFetchSubCategoriesByCategoryId } from "../../hooks/subCategories.hooks";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
const ProductsFilteration = ({ filter, handleChangeFilter, language }) => {
  const { btnStyle, palette } = useTheme();
  const navigate = useNavigate();
  const { categories } = useFetchAllCategories();
  const { subCategories } = useFetchSubCategoriesByCategoryId(filter.category);
  const { role } = useSelector((state) => state.user);

  return (
    <Stack
      gap={"20px"}
      p={"15px"}
      bgcolor={palette.mode === "dark" ? "#3D5A58" : "transparent"}
      boxShadow={
        palette.mode === "light" ? "rgba(0, 0, 0, 0.24) 0px 3px 8px" : undefined
      }
      sx={{
        flexDirection: {
          md: "row",
          xs: "column",
        },
        alignItems: "flex-end",
        width: {
          md: "auto",
          xs: 1,
        },
      }}
    >
      <FilterMenu
        item="category"
        label={language === "en" ? "Categories" : "الأقسام"}
        value={filter.category}
        options={categories.data}
        handleChange={handleChangeFilter}
        field={`name_${language}`}
        text={language === "en" ? "All categories" : "جميع الأقسام"}
      />
      <FilterMenu
        item="subCategory"
        label={language === "en" ? "sub Categories" : "الأقسام الفرعية"}
        value={filter.subCategory}
        options={subCategories.data}
        handleChange={handleChangeFilter}
        field={`name_${language}`}
        text={language === "en" ? "All sub categories" : "جميع الأقسام الفرعية"}
      />
      {allowed({ page: "products", role }) ? (
        <Stack
          direction={"row"}
          justifyContent={"center"}
          width={{ md: "auto", xs: 1 }}
        >
          <Button
            sx={{
              ...btnStyle,
              color: "#fff",
              px: 2,
              height: 45,
              width: {
                md: "auto",
                xs: 0.5,
              },
            }}
            onClick={() => navigate("/products/add")}
          >
            {language === "en" ? "Add product" : "إضافة منتج"}
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
};
export default ProductsFilteration;
