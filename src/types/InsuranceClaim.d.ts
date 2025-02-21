
export interface InsuranceClaim {
  id: string;
  tracking_number: string;
  billed_amount: number;
  client_insurance_id: string;
  professional_id: string;
  session_id: string;
  service_date: string;
  diagnosis_codes: string[];
  procedure_codes: string[];
  notes: string;
  status: string;
  submission_date: string;
  created_at: string;
  updated_at: string;
}

