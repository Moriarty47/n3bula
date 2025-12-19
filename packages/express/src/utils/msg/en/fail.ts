export type MessagesFail =
  | 'default'
  | 'alreadyUploadedFail'
  | 'cancel2FAFail'
  | 'chunksUploadError'
  | 'confirmUploadFail'
  | 'deleteFailed'
  | 'generatePDFFail'
  | 'sendUnlockFail'
  | 'setup2FAFail'
  | 'unlockFail'
  | 'uploadFail'
  | 'verify2FAFail'
  | 'testFail'
  | 'createFailed'
  | 'updateFailed'
  | 'saveFailed'
  | 'fetchFailed'
  | 'listFailed'
  | 'restoreFailed'
  | 'moveFailed'
  | 'copyFailed'
  | 'importFailed'
  | 'exportFailed'
  | 'subscribeFailed'
  | 'unsubscribeFailed'
  | 'connectFailed'
  | 'disconnectFailed'
  | 'sendFailed'
  | 'deliverFailed'
  | 'acceptFailed'
  | 'rejectFailed'
  | 'passwordChangeFailed'
  | 'emailSendFailed'
  | 'verifyFailed'
  | 'loginFailed'
  | 'logoutFailed'
  | 'permissionGrantFailed'
  | 'permissionRevokeFailed'
  | 'tokenIssueFailed'
  | 'tokenRevokeFailed'
  | 'roleAssignFailed'
  | 'roleRemoveFailed'
  | 'invitationSendFailed'
  | 'onboardingFailed'
  | 'paymentFailed'
  | 'refundFailed'
  | 'billingUpdateFailed'
  | 'profileUpdateFailed'
  | 'avatarUploadFailed'
  | 'avatarRemoveFailed'
  | 'wallpaperUpdateFailed'
  | 'cacheClearFailed'
  | 'cronScheduleFailed'
  | 'cronRunFailed'
  | 'rateLimited'
  | 'apiKeyCreateFailed'
  | 'apiKeyDeleteFailed'
  | 'webhookRegisterFailed'
  | 'webhookUnregisterFailed'
  | 'encryptionEnableFailed'
  | 'encryptionDisableFailed'
  | 'licenseActivateFailed'
  | 'licenseDeactivateFailed'
  | 'syncFailed'
  | 'migrationFailed'
  | 'buildFailed'
  | 'deployFailed'
  | 'restorePointCreateFailed'
  | 'validationError'
  | 'authenticationError'
  | 'authorizationError'
  | 'notFound'
  | 'conflictError'
  | 'badRequest'
  | 'serverError'
  | 'timeout'
  | 'networkError'
  | 'unsupportedMediaType'
  | 'quotaExceeded'
  | 'insufficientStorage'
  | 'dependencyFailed'
  | 'concurrencyError';

export const Messages: Record<MessagesFail, string> = {
  default: 'Operation failed.',
  alreadyUploadedFail: 'Upload failed: file already uploaded.',
  cancel2FAFail: 'Failed to cancel two-factor authentication.',
  chunksUploadError: 'Chunk upload failed.',
  confirmUploadFail: 'Failed to confirm uploaded file.',
  deleteFailed: 'Delete failed.',
  generatePDFFail: 'Failed to generate PDF.',
  sendUnlockFail: 'Failed to send unlock request.',
  setup2FAFail: 'Failed to set up two-factor authentication.',
  unlockFail: 'Failed to unlock.',
  uploadFail: 'Upload failed.',
  verify2FAFail: 'Failed to verify two-factor authentication.',
  testFail: 'Test failed.',
  createFailed: 'Creation failed.',
  updateFailed: 'Update failed.',
  saveFailed: 'Save failed.',
  fetchFailed: 'Fetch failed.',
  listFailed: 'Failed to retrieve list.',
  restoreFailed: 'Restore failed.',
  moveFailed: 'Move failed.',
  copyFailed: 'Copy failed.',
  importFailed: 'Import failed.',
  exportFailed: 'Export failed.',
  subscribeFailed: 'Subscription failed.',
  unsubscribeFailed: 'Unsubscribe failed.',
  connectFailed: 'Connection failed.',
  disconnectFailed: 'Disconnection failed.',
  sendFailed: 'Send failed.',
  deliverFailed: 'Delivery failed.',
  acceptFailed: 'Accept failed.',
  rejectFailed: 'Reject failed.',
  passwordChangeFailed: 'Failed to change password.',
  emailSendFailed: 'Failed to send email.',
  verifyFailed: 'Verification failed.',
  loginFailed: 'Login failed.',
  logoutFailed: 'Logout failed.',
  permissionGrantFailed: 'Failed to grant permission.',
  permissionRevokeFailed: 'Failed to revoke permission.',
  tokenIssueFailed: 'Failed to issue token.',
  tokenRevokeFailed: 'Failed to revoke token.',
  roleAssignFailed: 'Failed to assign role.',
  roleRemoveFailed: 'Failed to remove role.',
  invitationSendFailed: 'Failed to send invitation.',
  onboardingFailed: 'Onboarding failed.',
  paymentFailed: 'Payment failed.',
  refundFailed: 'Refund failed.',
  billingUpdateFailed: 'Failed to update billing information.',
  profileUpdateFailed: 'Failed to update profile.',
  avatarUploadFailed: 'Failed to upload avatar.',
  avatarRemoveFailed: 'Failed to remove avatar.',
  wallpaperUpdateFailed: 'Failed to update wallpaper.',
  cacheClearFailed: 'Failed to clear cache.',
  cronScheduleFailed: 'Failed to schedule task.',
  cronRunFailed: 'Task execution failed.',
  rateLimited: 'Rate limit exceeded.',
  apiKeyCreateFailed: 'Failed to create API key.',
  apiKeyDeleteFailed: 'Failed to delete API key.',
  webhookRegisterFailed: 'Failed to register webhook.',
  webhookUnregisterFailed: 'Failed to unregister webhook.',
  encryptionEnableFailed: 'Failed to enable encryption.',
  encryptionDisableFailed: 'Failed to disable encryption.',
  licenseActivateFailed: 'Failed to activate license.',
  licenseDeactivateFailed: 'Failed to deactivate license.',
  syncFailed: 'Synchronization failed.',
  migrationFailed: 'Migration failed.',
  buildFailed: 'Build failed.',
  deployFailed: 'Deployment failed.',
  restorePointCreateFailed: 'Failed to create restore point.',
  validationError: 'Validation error.',
  authenticationError: 'Authentication failed.',
  authorizationError: 'Authorization failed.',
  notFound: 'Resource not found.',
  conflictError: 'Conflict error.',
  badRequest: 'Bad request.',
  serverError: 'Internal server error.',
  timeout: 'Operation timed out.',
  networkError: 'Network error.',
  unsupportedMediaType: 'Unsupported media type.',
  quotaExceeded: 'Quota exceeded.',
  insufficientStorage: 'Insufficient storage.',
  dependencyFailed: 'Dependent operation failed.',
  concurrencyError: 'Concurrency error.',
};
