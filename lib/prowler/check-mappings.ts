export type ProwlerProvider = "aws" | "azure" | "m365";

export type ProwlerCheckMapping = {
  prowlerCheckId: string;
  provider: ProwlerProvider;
  complianceTags: string[];
  category: string;
};

function mapChecks(
  provider: ProwlerProvider,
  complianceTags: string[],
  category: string,
  prowlerCheckIds: string[]
): ProwlerCheckMapping[] {
  return prowlerCheckIds.map((prowlerCheckId) => ({
    prowlerCheckId,
    provider,
    complianceTags,
    category
  }));
}

export const PROWLER_CHECK_MAPPINGS: ProwlerCheckMapping[] = [
  ...mapChecks("aws", ["IAM-001", "IAM-002"], "Identity and access", [
    "iam_root_mfa_enabled",
    "iam_root_access_key_check",
    "iam_user_mfa_enabled_console_access",
    "iam_user_accesskey_rotated_90_days",
    "iam_policy_no_administrative_privileges"
  ]),
  ...mapChecks("aws", ["LOG-001", "CLD-002"], "Logging and monitoring", [
    "cloudtrail_multi_region_enabled",
    "cloudtrail_log_file_validation_enabled",
    "cloudtrail_cloudwatch_logging_enabled",
    "cloudwatch_log_metric_filter_unauthorized_api_calls",
    "cloudwatch_log_metric_filter_root_usage",
    "config_recorder_all_regions_enabled",
    "guardduty_is_enabled"
  ]),
  ...mapChecks("aws", ["CLD-001", "DAT-001"], "Data protection", [
    "s3_bucket_public_access",
    "s3_account_level_public_access_blocks",
    "s3_bucket_default_encryption",
    "s3_bucket_policy_public_write_access",
    "ec2_ebs_default_encryption",
    "kms_cmk_rotation_enabled",
    "rds_instance_storage_encrypted",
    "secretsmanager_secret_rotated_as_scheduled"
  ]),
  ...mapChecks("aws", ["CLD-001"], "Network exposure", [
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_22",
    "ec2_securitygroup_allow_ingress_from_internet_to_tcp_port_3389",
    "ec2_vpc_flow_logs_enabled",
    "ec2_instance_public_ip"
  ]),
  ...mapChecks("azure", ["CLD-001", "DAT-001"], "Data protection", [
    "storage_accounts_secure_transfer_required_enabled",
    "storage_accounts_blob_public_access_disabled",
    "storage_accounts_minimum_tls_version_1_2",
    "storage_account_default_network_access_rule_denied",
    "storage_accounts_soft_delete_enabled"
  ]),
  ...mapChecks("azure", ["DAT-001", "IR-001"], "Data protection", [
    "keyvault_purge_protection_enabled",
    "keyvault_soft_delete_enabled",
    "keyvault_rbac_enabled",
    "keyvault_public_network_access_disabled"
  ]),
  ...mapChecks("azure", ["CLD-001"], "Network exposure", [
    "network_security_groups_rdp_access_restricted",
    "network_security_groups_ssh_access_restricted",
    "network_watcher_enabled",
    "network_security_group_flow_logs_enabled"
  ]),
  ...mapChecks("azure", ["LOG-001", "CLD-002"], "Logging and monitoring", [
    "monitor_diagnostic_setting_enabled",
    "monitor_log_profile_enabled",
    "monitor_activity_log_alert_security_policy",
    "defender_plan_servers_enabled",
    "defender_plan_storageaccounts_enabled",
    "defender_plan_keyvaults_enabled"
  ]),
  ...mapChecks("m365", ["IAM-001", "IAM-002"], "Identity and access", [
    "entra_admin_users_mfa_enabled",
    "entra_conditional_access_mfa_enabled",
    "entra_legacy_authentication_blocked",
    "entra_guest_users_reviewed",
    "entra_privileged_roles_reviewed"
  ]),
  ...mapChecks("m365", ["DAT-001"], "Data protection", [
    "sharepoint_external_sharing_disabled",
    "exchange_mailbox_auditing_enabled",
    "purview_audit_log_search_enabled",
    "teams_external_access_reviewed"
  ]),
  ...mapChecks("m365", ["DEV-001"], "Device security", [
    "intune_device_compliance_policy_configured",
    "intune_device_encryption_required",
    "defender_endpoint_onboarding_configured"
  ])
];

const mappingByCheckId = new Map(
  PROWLER_CHECK_MAPPINGS.map((mapping) => [mapping.prowlerCheckId, mapping])
);

export function getProwlerCheckMapping(prowlerCheckId: string) {
  return mappingByCheckId.get(prowlerCheckId) ?? null;
}
