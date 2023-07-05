export type QcAvailable = {
  data?: {
    product_has_qc: boolean;
    qc_platform_with_qc_found: string;
  };
  message: string;
  success: boolean;
};
