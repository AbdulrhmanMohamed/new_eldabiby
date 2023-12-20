import {
  Box,
  Stack,
  Table,
  TableCell,
  TableContainer,
  Button,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableBody,
  TextField,
  CircularProgress,
  useTheme,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import {
  useDeleteUserByIdMutation,
  useGetAllUsersQuery,
} from "../../api/user.api";
import { toast } from "react-toastify";

import Breadcrumbs from "../../Components/Breadcrumbs";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
const UsersSales = () => {
  const {
    data: users,
    isSuccess,
    isError,
    isLoading,
    error,
  } = useGetAllUsersQuery("limit=10000");
  const { role } = useSelector((state) => state.user);
  const [deleteUserById, { isLoading: deleteUserByIdLoading }] =
    useDeleteUserByIdMutation();
  const { customColors, colors, palette } = useTheme();
  const [usersData, setUsers] = useState([]);
  useEffect(() => {
    if (isSuccess) {
      setUsers(users.data);
    }
  }, [isSuccess]);
  // table
  const [, { language: lang }] = useTranslation();
  // delete user
  const handleDelete = (user) => {
    const newData = usersData.filter((item) => item.id !== user.id);
    setUsers(newData);
    deleteUserById(user.id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${lang}`]);
      })
      .catch((err) => {
        toast.error(err.data[`error_${lang}`]);
        setUsers(users.data);
      });
  };

  const handleSearch = (value) => {
    if (value === "") {
      setUsers(users?.data);
    }
    const newData = users?.data.filter((item) => {
      return (
        (item.name && item.name.toLowerCase().includes(value.toLowerCase())) ||
        (item.email &&
          item.email.toLowerCase().includes(value.toLowerCase())) ||
        (item.phone && item.phone.toLowerCase().includes(value.toLowerCase()))
      );
    });
    setUsers(newData);
  };

  return (
    <Box
      sx={{
        p: { xs: 0, sm: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minHeight: "100vh",
      }}
    >
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "50%",
            left: lang === "en" ? "55%" : "40%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress
            sx={{
              color: "#00e3d2",
            }}
          />
        </Box>
      )}

      {!isLoading &&(
        <>
   <Breadcrumbs page_en={"Users"} page_ar={"المستخدمين"} />

   {/* search  */}
   <Stack
     direction={{ xs: "column", md: "row" }}
     justifyContent={"space-between"}
     px={2}
     gap={2}
   >
     <Stack
       direction={"row"}
       alignItems={"center"}
       px={2}
       sx={{
         background:
           " linear-gradient(90deg,rgba(207, 249, 170, 1) 0%,rgba(117, 219, 209, 1) 100%)",
         borderRadius: "15px",
         height: "40px",
         mr: lang === "ar" ? { xs: "0", md: "20px" } : undefined,
         ml: lang === "en" ? { xs: "0", md: "20px" } : undefined,
         width: { xs: "50%", md: "auto" },
       }}
     >
       <SearchIcon />
       <TextField
         sx={{
           width: "auto",
           "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
             borderColor: "transparent !important",
             outline: "none !important",
             backgroundColor: "transparent !important",
           },
         }}
         placeholder={lang === "en" ? "Search" : "ابحث هنا"}
         name="search"
         onChange={(e) => handleSearch(e.target.value)}
       />
     </Stack>
   </Stack>

  
     
       <Box
         sx={{
           display: "flex",

           flexDirection: "column",
           
         }}
       >
         {/* table */}
         
          
         
           <Box
             sx={{
               maxWidth: { md: "100%", sm: "100%", xs: "95%" },
               mx: { xs: "auto", sm: "initial" },
               overflow: "hidden",
             }}
           >
             <Box
               sx={{ width: { xs: "100%", md: "95%" }, mx: "auto" }}
               mt={2}
             >
               {/* head */}
               <TableContainer component={Paper}>
                 <Table
                   sx={{
                     minWidth: 650,
                     overflowX: {
                       lg: "auto",
                       xs: "scroll",
                     },
                     height: "50%",
                  
                   }}
                 >
                   <TableHead>
                     <TableRow
                       sx={{
                         bgcolor: customColors.secondary,
                         borderRadius: "10px",
                         boxShadow:
                           palette.mode === "dark"
                             ? "none"
                             : "0px 0px 15px 0px #c6d5d3",
                         "&:last-child td, &:last-child th": {
                           textAlign: "center",
                         },
                       }}
                     >
                       <TableCell>
                         <Typography
                           variant="subtitle1"
                           sx={{
                             fontWeight: "bold",
                           }}
                         >
                           #
                         </Typography>
                       </TableCell>

                       <TableCell>
                         <Typography
                           variant="subtitle1"
                           sx={{
                             fontWeight: "bold",
                           }}
                         >
                           {lang === "en" ? "Name" : "الاسم"}
                         </Typography>
                       </TableCell>
                       <TableCell>
                         <Typography
                           variant="subtitle1"
                           sx={{
                             fontWeight: "bold",
                           }}
                         >
                           {lang === "en" ? "Phone" : "رقم الجوال"}
                         </Typography>
                       </TableCell>

                       <TableCell>
                         <Typography
                           variant="subtitle1"
                           sx={{
                             fontWeight: "bold",
                           }}
                         >
                           {lang === "en" ? "Email" : "البريد الالكتروني"}
                         </Typography>
                       </TableCell>

                       <TableCell>
                         <Typography
                           variant="subtitle1"
                           sx={{
                             fontWeight: "bold",
                           }}
                         >
                           {lang === "en" ? "Total" : "اجمالي "}
                         </Typography>
                       </TableCell>
                       <TableCell>
                         <Typography
                           variant="subtitle1"
                           sx={{
                             fontWeight: "bold",
                           }}
                         >
                           {lang === "en" ? "Join Date" : "تاريخ الانضمام"}
                         </Typography>
                       </TableCell>

                       <TableCell></TableCell>
                     </TableRow>
                   </TableHead>
                   {usersData?.length === 0 && !isError&&(
                       <Box
                       sx={{
                        position: "absolute",
                        top: "60%",
                        left: lang === "en" ? "55%" : "45%",
                        transform:
                          lang === "en" ? "translate(-30%, -50%)" : "translate(-50%, -50%)",
                       
                       }}
                     >
                       <Typography
                         sx={{
                           fontWeight: "bold",
                           fontSize: { xs: "20px", sm: "25px", lg: "30px" },
                           color: colors.dangerous,
                         }}
                       >
                         {lang === "en" ? "No Data" : "لا يوجد بيانات"}
                       </Typography>
                     </Box>
                   )}
                   {isError  ? (
                     <Box
                       sx={{
                        display: "flex",
                        position: "absolute",
                        top: "60%",
                        left: lang === "en" ? "55%" : "45%",
                        transform:
                          lang === "en" ? "translate(-30%, -50%)" : "translate(-50%, -50%)",
                       }}
                     >
                       <Typography
                         sx={{
                           fontWeight: "bold",
                           fontSize: { xs: "20px", sm: "25px", lg: "30px" },
                           color: colors.dangerous,
                           
                           
                         }}
                       >
                         {error?.data[`error_${lang}`]}
                       </Typography>
                     </Box>
                   ):(

                   <TableBody>
                     {usersData?.map((item, index) => (
                       <TableRow
                         key={index}
                         sx={{
                           bgcolor: customColors.bg,
                         }}
                       >
                         <TableCell align="center">{index + 1}</TableCell>
                         <TableCell align="center">
                           {item.name
                             ? item.name
                             : lang === "en"
                             ? "No Name"
                             : "لا يوجد اسم"}
                         </TableCell>
                         <TableCell align="center">
                           {item?.phone
                             ? item.phone
                             : lang === "en"
                             ? "No Phone"
                             : "لا يوجد جوال"}
                         </TableCell>

                         <TableCell align="center">
                           {item.email
                             ? item.email
                             : lang === "en"
                             ? "No Email"
                             : "لا يوجد بريد الكتروني"}
                         </TableCell>
                         <TableCell align="center">{item.revinue}</TableCell>
                         <TableCell align="center">
                           {new Date(item.updatedAt).toLocaleDateString(
                             lang === "ar" ? "ar-EG" : "en-US",
                             {
                               day: "numeric",
                               month: "long",
                               year: "numeric",
                             }
                           )}
                         </TableCell>

                         <TableCell
                           sx={{
                             color: "gray",
                           }}
                         >
                           {allowed({ page: "users", role }) ? (
                             <Button
                               size="small"
                               onClick={() => {
                                 handleDelete(item);
                               }}
                               disabled={deleteUserByIdLoading}
                               sx={{
                                 backgroundColor: "transparent !important",
                                 // width: { xs: "100%", sm: "80%", xl: "65%" },
                                 // p: "9px 20px",
                                 color: colors.dangerous,
                                 fontWeight: "bold",
                               }}
                             >
                               <DeleteIcon />
                             </Button>
                           ) : (
                             <></>
                           )}
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                   )}
                 </Table>
               </TableContainer>
             </Box>
           </Box>
         
       </Box>
        </>
      )}
   
    </Box>
  );
};

export default UsersSales;
