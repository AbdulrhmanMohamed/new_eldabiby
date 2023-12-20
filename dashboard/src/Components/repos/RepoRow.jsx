import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
import { useState } from "react";
import RepoProductsModal from "./RepoProductsModal";
import { useDeleteRepoMutation } from "../../api/repos.api";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import AddRepositoryProductModal from "./AddRepositoryProductModal";
import EditRepoistoryModal from "./EditRepoModal";
const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const RepoRow = ({ repo, index }) => {
  const {
    i18n: { language },
  } = useTranslation();
  const { colors, customColors } = useTheme();
  const { role } = useSelector((state) => state.user);
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [openRepoProducts, setOpenRepoProducts] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedEdited, setSelectedEdited] = useState();
  const [deleteRepo] = useDeleteRepoMutation();
  const [openedRepo, setOpenedRepo] = useState();
  const handleRemoveRepo = () => {
    deleteRepo(repo._id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`]);
      })
      .catch((error) => {
        toast.error(error.data[`success_${language}`]);
      });
  };
  const handleOpenRepoProductsModal = (item) => {
    setOpenedRepo(item);
    setOpenRepoProducts(true);
  };
  const handleSelectRepoForEdit = (item) => {
    setSelectedEdited(item);
    setEditModal(true);
  };
  return (
    <>
      {/* Adding product to repo */}
      <AddRepositoryProductModal
        open={openCreateProduct}
        setOpen={setOpenCreateProduct}
        repo={repo}
      />
      <RepoProductsModal
        open={openRepoProducts}
        setOpen={setOpenRepoProducts}
        openedItem={openedRepo}
        setOpenedItem={setOpenedRepo}
      />
      <EditRepoistoryModal
        open={editModal}
        setOpen={setEditModal}
        selectedItem={selectedEdited}
        setSelectItem={setSelectedEdited}
      />

      <TableRow
        sx={{
          bgcolor: customColors.bg,
        }}
      >
        <TableCell align="center">
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
            }}
          >
            {index + 1}
          </Typography>
        </TableCell>

        <TableCell align="center">
          {language === "en" ? repo?.name_en : repo?.name_ar}
        </TableCell>
        <TableCell align="center">{repo?.address}</TableCell>
        <TableCell align="center">{repo?.products?.length}</TableCell>
        <TableCell align="center">{repo?.quantity}</TableCell>
        <TableCell align="center">
          <Box
            sx={{
              display: "flex",
              direction: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Add Product to  Specific Repo */}
            {allowed({ page: "repositories", role }) ? (
              <BootstrapTooltip
                title={language === "en" ? "Add Products" : "أضافة منتج"}
              >
                <Button
                  variant="raised"
                  sx={{
                    ":hover": {
                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                    },
                    p: "2px",
                    minWidth: "0px",
                  }}
                  onClick={() => {
                    setOpenCreateProduct(true);
                  }}
                >
                  <AddCircleOutlineIcon
                    sx={{
                      color: "green",
                      p: "4px",
                      width: "30px",
                      height: "30px",
                    }}
                  />
                </Button>
              </BootstrapTooltip>
            ) : (
              <></>
            )}
            {allowed({ page: "repositories", role }) ? (
              <BootstrapTooltip
                title={
                  language === "en"
                    ? "Edit this repository"
                    : "تعديل هذا المستودع"
                }
              >
                <Button
                  variant="raised"
                  sx={{
                    ":hover": {
                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                    },
                    p: "2px",
                    minWidth: "0px",
                  }}
                  onClick={() => handleSelectRepoForEdit(repo)}
                >
                  <EditIcon
                    sx={{
                      color: "#00e3d2",
                      cursor: "pointer",
                    }}
                  />
                </Button>
              </BootstrapTooltip>
            ) : (
              <></>
            )}

            {/*Show Repo Products */}

            <BootstrapTooltip
              title={
                language === "en"
                  ? "Display all products in this repository."
                  : "عرض جميع المنتجات في هذا المستودع"
              }
            >
              <Button
                variant="raised"
                sx={{
                  ":hover": {
                    backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                  },
                  p: "2px",
                  minWidth: "0px",
                }}
                onClick={() => {
                  handleOpenRepoProductsModal(repo);
                }}
              >
                <VisibilityIcon
                  sx={{
                    color: colors.main,
                    p: "2px",
                    width: "30px",
                    height: "30px",
                  }}
                />
              </Button>
            </BootstrapTooltip>
            {allowed({ page: "repositories", role }) ? (
              <BootstrapTooltip
                title={
                  language === "en"
                    ? "Delete this repository."
                    : "حذف هذا المستودع"
                }
              >
                <Button
                  variant="raised"
                  sx={{
                    ":hover": {
                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                    },
                    p: "2px",
                    minWidth: "0px",
                  }}
                >
                  <DeleteIcon
                    sx={{
                      color: colors.dangerous,
                      cursor: "pointer",
                    }}
                    onClick={handleRemoveRepo}
                  />
                </Button>
              </BootstrapTooltip>
            ) : undefined}
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RepoRow;
