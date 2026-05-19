import { Config } from "../../Config";
import type { ApiResponse, CnLink } from "../../models";
import type { Details } from "../../models/Details";
import { fetchData } from "./fetchData";

export async function getDetails(
  cnLink: CnLink,
): Promise<ApiResponse<Details> | null> {
  const d = await fetchData<ApiResponse<Details>>(
    `${Config.endpoint.details}/${cnLink.marketplace}/${cnLink.id}`,
  );
  return d;
}
