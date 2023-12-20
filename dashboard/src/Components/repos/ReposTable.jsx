import { useTheme } from "@emotion/react";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetAllReposQuery } from "../../api/repos.api";
import RepoRow from "./RepoRow";
import useSearch from "../../hooks/useSearch";
import { useEffect } from "react";
const OrderLoading = () => {
  const { customColors } = useTheme();
  return (
    <Box height={"60vh"} display={"grid"} sx={{ placeItems: "center" }}>
      <CircularProgress sx={{ color: customColors.main }} />
    </Box>
  );
};

const OrderError = ({ error }) => {
  const { colors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  return (
    <TableRow>
      <TableCell
        colSpan={5}
        sx={{
          width: "100%",
        }}
      >
        <Stack height={"5vh"} direction={"row"} justifyContent={"center"}>
          <Typography variant={"h5"} align="center" color={colors.dangerous}>
            {language === "en"
              ? error?.data[`error_en`]
              : error?.data[`error_ar`]}
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
const ReposTable = () => {
  const {
    i18n: { language: lang },
  } = useTranslation();
  const { customColors } = useTheme();
  const { addToSearch, search } = useSearch();
  const {
    data: repos,
    isLoading,
    isError,
    error,
  } = useGetAllReposQuery(search);

  useEffect(() => {
    addToSearch({ key: "limit", value: "1000" });
  }, [search]);

  if (isLoading) return <OrderLoading />;
  // if (isError) return <OrderError error={error} />;

  return (
    <TableContainer component={Paper} sx={{ minWidth: "100%" }}>
      <Table sx={{ minWidth: "100%" }}>
        <TableHead
          sx={{ bgcolor: customColors.secondary, borderRadius: "5px" }}
        >
          <TableRow>
            <TableCell align="center">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                }}
              >
                #
              </Typography>
            </TableCell>

            <TableCell align="center">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {lang === "en" ? "Repository" : "المستودع"}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {lang === "en" ? "Address" : "العنوان"}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {lang === "en" ? "Products" : "المنتجات"}
              </Typography>
            </TableCell>

            <TableCell align="center">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {lang === "en" ? "Total" : "الاجمالي"}
              </Typography>
            </TableCell>
            <TableCell align="center" colSpan={2}></TableCell>
          </TableRow>
        </TableHead>


        <TableBody>
          {repos?.data && !error ? (
            repos.data?.map((repo, index) => (
              <RepoRow key={index} repo={repo} index={index} />
            ))
          ) : (
            <OrderError error={error} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReposTable;
