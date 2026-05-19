import { Config } from "../../Config";
import type { ApiResponse, CnLink } from "../../models";
import type { Details } from "../../models/Details";
import { isValidCnLink } from "../isValidCnLink";
import { fetchData } from "./fetchData";

export async function getDetails(
  cnLink: CnLink | null | undefined,
): Promise<ApiResponse<Details> | null> {
  if (!isValidCnLink(cnLink)) {
    return null;
  }
  const d = await fetchData<ApiResponse<Details>>(
    `${Config.endpoint.details}/${cnLink.marketplace}/${cnLink.id}`,
  );
  return d;
}
