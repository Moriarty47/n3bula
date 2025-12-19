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
  default: 'Successfully retrieved.',
  alreadyUploaded: 'Already uploaded.',
  cancel2FA: 'Two-factor authentication cancelled successfully.',
  chunksUploaded: 'All chunks received. Upload complete.',
  confirmUploaded: 'Uploaded file confirmed successfully.',
  deleted: 'Deleted successfully.',
  generatePDF: 'PDF generated successfully.',
  sentUnlock: 'Unlock request sent successfully.',
  setup2FA: 'Two-factor authentication set up successfully.',
  unlock: 'Unlocked successfully.',
  uploaded: 'Uploaded successfully.',
  verify2FA: 'Two-factor authentication verified successfully.',
  test: 'Test successful.',
  created: 'Created successfully.',
  updated: 'Updated successfully.',
  saved: 'Saved successfully.',
  fetched: 'Fetched successfully.',
  listed: 'List retrieved successfully.',
  restored: 'Restored successfully.',
  moved: 'Moved successfully.',
  copied: 'Copied successfully.',
  imported: 'Imported successfully.',
  exported: 'Exported successfully.',
  subscribed: 'Subscription successful.',
  unsubscribed: 'Unsubscribed successfully.',
  connected: 'Connected successfully.',
  disconnected: 'Disconnected successfully.',
  sent: 'Sent successfully.',
  delivered: 'Delivered successfully.',
  accepted: 'Accepted successfully.',
  rejectedSuccess: 'Rejected successfully.',
  passwordChanged: 'Password changed successfully.',
  emailSent: 'Email sent successfully.',
  verified: 'Verified successfully.',
  loggedIn: 'Logged in successfully.',
  loggedOut: 'Logged out successfully.',
  permissionGranted: 'Permission granted.',
  permissionRevoked: 'Permission revoked.',
  tokenIssued: 'Token issued successfully.',
  tokenRevoked: 'Token revoked successfully.',
  roleAssigned: 'Role assigned successfully.',
  roleRemoved: 'Role removed successfully.',
  invitationSent: 'Invitation sent successfully.',
  onboardingComplete: 'Onboarding completed successfully.',
  paymentProcessed: 'Payment processed successfully.',
  refundProcessed: 'Refund processed successfully.',
  billingUpdated: 'Billing information updated successfully.',
  profileUpdated: 'Profile updated successfully.',
  avatarUploaded: 'Avatar uploaded successfully.',
  avatarRemoved: 'Avatar removed successfully.',
  wallpaperUpdated: 'Wallpaper updated successfully.',
  cacheCleared: 'Cache cleared successfully.',
  cronScheduled: 'Task scheduled successfully.',
  cronRun: 'Task executed successfully.',
  rateLimitedReset: 'Rate limit reset.',
  apiKeyCreated: 'API key created successfully.',
  apiKeyDeleted: 'API key deleted successfully.',
  webhookRegistered: 'Webhook registered successfully.',
  webhookUnregistered: 'Webhook unregistered successfully.',
  encryptionEnabled: 'Encryption enabled successfully.',
  encryptionDisabled: 'Encryption disabled successfully.',
  licenseActivated: 'License activated successfully.',
  licenseDeactivated: 'License deactivated successfully.',
  syncCompleted: 'Synchronization completed successfully.',
  migrationCompleted: 'Migration completed successfully.',
  buildSucceeded: 'Build succeeded.',
  deploySucceeded: 'Deployment succeeded.',
  restorePointCreated: 'Restore point created successfully.',
};
