# Cloud Scanning

CloudGuard Lite uses two scanner paths:

- Demo Azure scan: fixture-backed, no credentials, always available for portfolio review.
- Real provider scan: native lightweight checks plus Prowler where credentials are configured.

## Prowler

The worker image installs a pinned Prowler subprocess (`PROWLER_VERSION=3.11.3` by default). The runner calls:

```text
prowler <provider> -M json-ocsf -o <tempdir>
```

The OCSF JSON output is normalized into CloudGuard Lite scanner results and mapped to internal controls such as `IAM-001`, `CLD-001`, `LOG-001`, and `DAT-001`.

## Providers

| Provider | Path | Notes |
| --- | --- | --- |
| Azure | Native checks plus Prowler | Uses service principal env auth and subscription scope |
| AWS | Prowler | Uses access key/session env vars and optional region list |
| Microsoft 365 | Prowler | Uses app registration env auth for Microsoft 365 checks |

## Environment

| Variable | Default |
| --- | --- |
| `PROWLER_VERSION` | `3.11.3` |
| `PROWLER_BIN` | `prowler` |
| `PROWLER_CONCURRENCY` | `2` |
| `PROWLER_SEVERITY` | `critical,high,medium` |
| `PROWLER_COMPLIANCE_AZURE` | `cis_2.0_azure` |
| `PROWLER_COMPLIANCE_AWS` | `cis_2.0_aws` |
| `PROWLER_COMPLIANCE_M365` | `cis_2.0_m365` |

Set a compliance variable to an empty string to run the broader provider check set instead of a CIS profile.

## Failure Handling

Prowler subprocess failures become scanner findings with `engine: "prowler"` and `status: "error"`. This keeps scan history readable when credentials are missing, permissions are insufficient, or the binary is not installed.
