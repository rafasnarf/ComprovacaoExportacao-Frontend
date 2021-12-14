export interface ManualConfirmationDTO {
  id?: string;
  nrOper: number;
  prefDepe: number;
  dataConfirmacao?: Date;
  matriculaConfirmacao: string;
  observacoes?: string;
}
