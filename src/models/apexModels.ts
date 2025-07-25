// ===== APEX DATA MODELS =====
export interface ApexShareholder {
  COMPANY_NAME?: string;
  run_date?: string;
  ea_code?: string;
  TOTAL_TSR_NUMBER?: string;
  SHARE_NAV_PRICE?: number;
  CURRENCY_CODE?: string;
  shareholder_name?: string;
  nav_value?: number;
  ea_sort?: string;
  cp_category?: string;
  cp_subcategory?: string;
  investor_domicile?: string;
  shareholder_id?: string;
  eq_accrual?: number;
  currency_decimals?: number;
  investor_no?: string;
  price_decimals?: number;
  price_rounding?: string;
  share_decimals?: number;
  share_rounding?: string;
  nav_status?: string;
  agent?: string;
  agent_external_code?: string;
  dealer?: string;
  dealer_external_code?: string;
  company_id?: string;
  equity_attribution_id?: string;
  wf_status?: string;
  percent_holding?: number;
  ea_description?: string;
  cost?: number;
  finra_5131?: string;
  new_issues_participation?: string;
  external_code_2?: string;
  external_code_3?: string;
  external_code_4?: string;
  external_code_5?: string;
  external_code_6?: string;
  isin?: string;
  total_lcy?: number;
  counterpart_type?: string;
  valuation_date?: string;
  Commitment?: number;
  latest_val_date?: string;
}

export interface ApexTransaction {
  DEAL_NUMBER?: string;
  ea_code?: string;
  COMP_SHAREHOLDER?: string;
  SETTLEMENT_DATE?: string;
  TRADE_TYPE?: string;
  TSR_NUMBER?: string;
  PRICE?: number;
  GROSS_AMOUNT?: number;
  STATUS?: string;
  ORD?: string;
  EA_SORT?: string;
  share_decimals?: number;
  price_decimals?: number;
  price_rounding?: string;
  company_name?: string;
  non_partnership?: string;
  transfer?: string;
  eq_amount?: number;
  equal_type?: string;
  fee_amount?: number;
  fees_to?: string;
  fee_2_amount?: number;
  fees_2_to?: string;
  nav_status?: string;
  net_settlement?: number;
  lock?: string;
  counterpart_id?: string;
  transfer_deal_number?: string;
  switch_deal_number?: string;
  rollup_deal_number?: string;
  reversal_deal_number?: string;
  rounding_adjustment?: number;
  spread_amount?: number;
  currency_code?: string;
  share_truncation?: string;
  share_rounding?: string;
  ea_description?: string;
  investor_no?: string;
  agent?: string;
  agent_external_code?: string;
  dealer?: string;
  dealer_external_code?: string;
  wf_status?: string;
  aml_category?: string;
  description_internal?: string;
  external_reference?: string;
  external_reference_2?: string;
  gain?: number;
  trailer_fee_rate_pa?: number;
  trailer_fee_calculation_basis?: string;
  trailer_fee_ccy?: string;
  trailer_fee_payer?: string;
  trailer_fee_payee?: string;
  investor_no_2?: string;
  investor_no_3?: string;
  investor_no_4?: string;
  investor_no_5?: string;
  investor_no_6?: string;
  share_reg_value_date_method?: string;
  company_id_returned?: string;
  transaction_type?: string;
  transaction_type_for_grouping?: string;
  fx_rate?: number;
  gross_amount_lcy?: number;
  fee_description?: string;
  fee_2_description?: string;
  fee_ccy?: string;
  fee_2_ccy?: string;
  currency_code_pmt?: string;
  net_settlement_fcy?: number;
  settlement_fx_rate?: number;
  fcy_settlements_exist?: string;
  TRADE_DATE?: string;
  CASH_DATE?: string;
  interim_pf_crystallisation?: string;
}

export interface ApexContact {
  Shareholder_id?: string;
  long_name?: string;
  cp_code?: string;
  TSR_NUMBER?: string;
  address_line_1?: string;
  address_line_2?: string;
  address_line_3?: string;
  address_line_4?: string;
  telephone_no_1?: string;
  telephone_no_2?: string;
  facsimile_no?: string;
  e_mail_address?: string;
  contact_person?: string;
  rm?: string;
  agent?: string;
  dealer?: string;
  what_addr?: string;
  share_decimals?: number;
  show_rm?: string;
  eq_type?: string;
  external_code_1?: string;
  external_code_2?: string;
  external_code_3?: string;
  category?: string;
  subcategory?: string;
  tax_number?: string;
  title?: string;
  first_name?: string;
  second_name?: string;
  surname?: string;
  address_city?: string;
  address_state?: string;
  address_postcode?: string;
  mailing_address_city?: string;
  mailing_address_state?: string;
  mailing_address_postcode?: string;
  banking_details?: string;
  cc_details?: string;
  other_address_line_1?: string;
  other_address_line_2?: string;
  other_address_line_3?: string;
  other_address_line_4?: string;
  date_of_birth?: string;
  country_of_residence?: string;
  country_of_birth?: string;
  passport_number?: string;
  country_of_citizenship?: string;
  passport2_number?: string;
  passport2_country?: string;
  us_tax_number?: string;
  company_name?: string;
}