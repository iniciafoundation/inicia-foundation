export function canOpenApplicationIntake(isLoading: boolean, hasPrivacyDocument: boolean, hasAgreementDocument: boolean) {
  return !isLoading && hasPrivacyDocument && hasAgreementDocument;
}
