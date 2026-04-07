export type MessagesOk =
  | 'default'
  | 'alreadyUploaded'
  | 'cancel2FA'
  | 'chunksUploaded'
  | 'confirmUploaded'
  | 'deleted'
  | 'generatePDF'
  | 'sentUnlock'
  | 'setup2FA'
  | 'unlock'
  | 'uploaded'
  | 'verify2FA'
  | 'test'
  | 'created'
  | 'updated'
  | 'saved'
  | 'fetched'
  | 'listed'
  | 'restored'
  | 'moved'
  | 'copied'
  | 'imported'
  | 'exported'
  | 'subscribed'
  | 'unsubscribed'
  | 'connected'
  | 'disconnected'
  | 'sent'
  | 'delivered'
  | 'accepted'
  | 'rejectedSuccess'
  | 'passwordChanged'
  | 'emailSent'
  | 'verified'
  | 'loggedIn'
  | 'loggedOut'
  | 'permissionGranted'
  | 'permissionRevoked'
  | 'tokenIssued'
  | 'tokenRevoked'
  | 'roleAssigned'
  | 'roleRemoved'
  | 'invitationSent'
  | 'onboardingComplete'
  | 'paymentProcessed'
  | 'refundProcessed'
  | 'billingUpdated'
  | 'profileUpdated'
  | 'avatarUploaded'
  | 'avatarRemoved'
  | 'wallpaperUpdated'
  | 'cacheCleared'
  | 'cronScheduled'
  | 'cronRun'
  | 'rateLimitedReset'
  | 'apiKeyCreated'
  | 'apiKeyDeleted'
  | 'webhookRegistered'
  | 'webhookUnregistered'
  | 'encryptionEnabled'
  | 'encryptionDisabled'
  | 'licenseActivated'
  | 'licenseDeactivated'
  | 'syncCompleted'
  | 'migrationCompleted'
  | 'buildSucceeded'
  | 'deploySucceeded'
  | 'restorePointCreated';

export const Messages: Record<MessagesOk, string> = {
  accepted: 'Accepted successfully.',
  alreadyUploaded: 'Already uploaded.',
  apiKeyCreated: 'API key created successfully.',
  apiKeyDeleted: 'API key deleted successfully.',
  avatarRemoved: 'Avatar removed successfully.',
  avatarUploaded: 'Avatar uploaded successfully.',
  billingUpdated: 'Billing information updated successfully.',
  buildSucceeded: 'Build succeeded.',
  cacheCleared: 'Cache cleared successfully.',
  cancel2FA: 'Two-factor authentication cancelled successfully.',
  chunksUploaded: 'All chunks received. Upload complete.',
  confirmUploaded: 'Uploaded file confirmed successfully.',
  connected: 'Connected successfully.',
  copied: 'Copied successfully.',
  created: 'Created successfully.',
  cronRun: 'Task executed successfully.',
  cronScheduled: 'Task scheduled successfully.',
  default: 'Successfully retrieved.',
  deleted: 'Deleted successfully.',
  delivered: 'Delivered successfully.',
  deploySucceeded: 'Deployment succeeded.',
  disconnected: 'Disconnected successfully.',
  emailSent: 'Email sent successfully.',
  encryptionDisabled: 'Encryption disabled successfully.',
  encryptionEnabled: 'Encryption enabled successfully.',
  exported: 'Exported successfully.',
  fetched: 'Fetched successfully.',
  generatePDF: 'PDF generated successfully.',
  imported: 'Imported successfully.',
  invitationSent: 'Invitation sent successfully.',
  licenseActivated: 'License activated successfully.',
  licenseDeactivated: 'License deactivated successfully.',
  listed: 'List retrieved successfully.',
  loggedIn: 'Logged in successfully.',
  loggedOut: 'Logged out successfully.',
  migrationCompleted: 'Migration completed successfully.',
  moved: 'Moved successfully.',
  onboardingComplete: 'Onboarding completed successfully.',
  passwordChanged: 'Password changed successfully.',
  paymentProcessed: 'Payment processed successfully.',
  permissionGranted: 'Permission granted.',
  permissionRevoked: 'Permission revoked.',
  profileUpdated: 'Profile updated successfully.',
  rateLimitedReset: 'Rate limit reset.',
  refundProcessed: 'Refund processed successfully.',
  rejectedSuccess: 'Rejected successfully.',
  restored: 'Restored successfully.',
  restorePointCreated: 'Restore point created successfully.',
  roleAssigned: 'Role assigned successfully.',
  roleRemoved: 'Role removed successfully.',
  saved: 'Saved successfully.',
  sent: 'Sent successfully.',
  sentUnlock: 'Unlock request sent successfully.',
  setup2FA: 'Two-factor authentication set up successfully.',
  subscribed: 'Subscription successful.',
  syncCompleted: 'Synchronization completed successfully.',
  test: 'Test successful.',
  tokenIssued: 'Token issued successfully.',
  tokenRevoked: 'Token revoked successfully.',
  unlock: 'Unlocked successfully.',
  unsubscribed: 'Unsubscribed successfully.',
  updated: 'Updated successfully.',
  uploaded: 'Uploaded successfully.',
  verified: 'Verified successfully.',
  verify2FA: 'Two-factor authentication verified successfully.',
  wallpaperUpdated: 'Wallpaper updated successfully.',
  webhookRegistered: 'Webhook registered successfully.',
  webhookUnregistered: 'Webhook unregistered successfully.',
};
