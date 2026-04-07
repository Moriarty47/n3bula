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
  acceptFailed: 'Accept failed.',
  alreadyUploadedFail: 'Upload failed: file already uploaded.',
  apiKeyCreateFailed: 'Failed to create API key.',
  apiKeyDeleteFailed: 'Failed to delete API key.',
  authenticationError: 'Authentication failed.',
  authorizationError: 'Authorization failed.',
  avatarRemoveFailed: 'Failed to remove avatar.',
  avatarUploadFailed: 'Failed to upload avatar.',
  badRequest: 'Bad request.',
  billingUpdateFailed: 'Failed to update billing information.',
  buildFailed: 'Build failed.',
  cacheClearFailed: 'Failed to clear cache.',
  cancel2FAFail: 'Failed to cancel two-factor authentication.',
  chunksUploadError: 'Chunk upload failed.',
  concurrencyError: 'Concurrency error.',
  confirmUploadFail: 'Failed to confirm uploaded file.',
  conflictError: 'Conflict error.',
  connectFailed: 'Connection failed.',
  copyFailed: 'Copy failed.',
  createFailed: 'Creation failed.',
  cronRunFailed: 'Task execution failed.',
  cronScheduleFailed: 'Failed to schedule task.',
  default: 'Operation failed.',
  deleteFailed: 'Delete failed.',
  deliverFailed: 'Delivery failed.',
  dependencyFailed: 'Dependent operation failed.',
  deployFailed: 'Deployment failed.',
  disconnectFailed: 'Disconnection failed.',
  emailSendFailed: 'Failed to send email.',
  encryptionDisableFailed: 'Failed to disable encryption.',
  encryptionEnableFailed: 'Failed to enable encryption.',
  exportFailed: 'Export failed.',
  fetchFailed: 'Fetch failed.',
  generatePDFFail: 'Failed to generate PDF.',
  importFailed: 'Import failed.',
  insufficientStorage: 'Insufficient storage.',
  invitationSendFailed: 'Failed to send invitation.',
  licenseActivateFailed: 'Failed to activate license.',
  licenseDeactivateFailed: 'Failed to deactivate license.',
  listFailed: 'Failed to retrieve list.',
  loginFailed: 'Login failed.',
  logoutFailed: 'Logout failed.',
  migrationFailed: 'Migration failed.',
  moveFailed: 'Move failed.',
  networkError: 'Network error.',
  notFound: 'Resource not found.',
  onboardingFailed: 'Onboarding failed.',
  passwordChangeFailed: 'Failed to change password.',
  paymentFailed: 'Payment failed.',
  permissionGrantFailed: 'Failed to grant permission.',
  permissionRevokeFailed: 'Failed to revoke permission.',
  profileUpdateFailed: 'Failed to update profile.',
  quotaExceeded: 'Quota exceeded.',
  rateLimited: 'Rate limit exceeded.',
  refundFailed: 'Refund failed.',
  rejectFailed: 'Reject failed.',
  restoreFailed: 'Restore failed.',
  restorePointCreateFailed: 'Failed to create restore point.',
  roleAssignFailed: 'Failed to assign role.',
  roleRemoveFailed: 'Failed to remove role.',
  saveFailed: 'Save failed.',
  sendFailed: 'Send failed.',
  sendUnlockFail: 'Failed to send unlock request.',
  serverError: 'Internal server error.',
  setup2FAFail: 'Failed to set up two-factor authentication.',
  subscribeFailed: 'Subscription failed.',
  syncFailed: 'Synchronization failed.',
  testFail: 'Test failed.',
  timeout: 'Operation timed out.',
  tokenIssueFailed: 'Failed to issue token.',
  tokenRevokeFailed: 'Failed to revoke token.',
  unlockFail: 'Failed to unlock.',
  unsubscribeFailed: 'Unsubscribe failed.',
  unsupportedMediaType: 'Unsupported media type.',
  updateFailed: 'Update failed.',
  uploadFail: 'Upload failed.',
  validationError: 'Validation error.',
  verify2FAFail: 'Failed to verify two-factor authentication.',
  verifyFailed: 'Verification failed.',
  wallpaperUpdateFailed: 'Failed to update wallpaper.',
  webhookRegisterFailed: 'Failed to register webhook.',
  webhookUnregisterFailed: 'Failed to unregister webhook.',
};
