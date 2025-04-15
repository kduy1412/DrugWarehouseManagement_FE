import { useQuery } from "@tanstack/react-query";
import { User } from "../../../types/user";
import { whoAmI } from "../../../api/auth";

export const useGetAccountQuery = () =>
  useQuery<User, Error, User>({
    queryKey: ["profile"],
    queryFn: () => whoAmI(null, false),
  });
