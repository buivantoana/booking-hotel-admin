// import {
//   addCategories,
//   deleteCategories,
//   updateCategories,
// } from "@/service/categories";
// import { useMutation, useQueryClient } from "react-query";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// type useCategoriesMutationProps = {
//   action: "CREATE" | "UPDATE" | "DELETE";
//   defaultValues?: any;
//   onSuccess?: () => void;
// };
// const schema = yup.object({
//   _id: yup.string(),
//   name: yup.string().required(),
//   description: yup.string().required(),
// });
// export const useCategoriesMutation = ({
//   action,
//   defaultValues = { name: "" },
//   onSuccess,
// }: useCategoriesMutationProps) => {
//   const queryClient = useQueryClient();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//   });
//   const { mutate, ...rest } = useMutation({
//     mutationFn: async (categories: typeCategories) => {
//       switch (action) {
//         case "CREATE":
//           return await addCategories({ ...categories });
//         case "UPDATE":
//           return await updateCategories(categories);
//         case "DELETE":
//           return await deleteCategories(categories._id);
//         default:
//           return null;
//       }
//     },
//     onSuccess: (data) => {
//       console.log(data);
//       queryClient.invalidateQueries({
//         queryKey: ["categories"],
//       });
//       onSuccess && onSuccess();
//     },
//   });
//   const onFinish = async (values: typeCategories) => {
//     console.log(values);
//     mutate(values);
//   };
//   const onRemove = (categories: typeCategories) => {
//     mutate(categories);
//   };
//   return {
//     register,
//     onFinish,
//     onRemove,
//     handleSubmit,
//     errors,
//     reset,
//   };
// };
