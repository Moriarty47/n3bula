#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outDir = resolve(__dirname, '..', 'certs');
const certPath = join(outDir, 'cert.pem');
const keyPath = join(outDir, 'key.pem');

const CERT_PEM = `-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUTuk8I3YHZP9gx+QSARGbAKe8eMIwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCQ04xEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yNTEwMzEwNjQ1NTZaFw0yNTEx
MzAwNjQ1NTZaMEUxCzAJBgNVBAYTAkNOMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQC80sftnHvdtxbc3PN2bUsp/xM4MVv2M9XWXvfS0ZbL
jWlmN3icvkDsE5xFzOUtxueXrHvnmFUg6zBkUaW3JCoKWlS/kIkqilwYS9gknJiE
Bo1BAiYdTpFk5gtSb3IctlZmfc1+S7Wbao4SKRUyHaGWbRdhFGFpgU/9YCyXI4Up
RZMvFcpdPUL0n9zNJ/cSBfPaTmJZNmO7ypynqfNijoR7o95BP2ECbW8MId1BK62c
daVW2jo0vH80/OQzMfHX2ClBPsi1urxaJnFS8iqgHYaL/TqaSUiAm2XUA7ufAQZh
JnwxCCIdvc0S3F5dXZMdEb9MTZeQGVCrtsE5lmkXmRpVAgMBAAGjUzBRMB0GA1Ud
DgQWBBQhXV1cEHyjcI7EPsU6JHyw8Tf9eDAfBgNVHSMEGDAWgBQhXV1cEHyjcI7E
PsU6JHyw8Tf9eDAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQBB
myS4TE60r4/UV0U1gL1eUX9c0qJqMOZyFol+lZ+f+tUXsyAyDRMoZCjkO/un5+xN
5Ssqc/alPPW/jF9UnL4f8A8NQVSKKEEpOtxY7ki8EWC4JZjtEkSseO23LQHAPKzi
p+kCZFu4cRKtEJR1gTnNP67LH62R/7onN96Azp+z1ELn0VOCPsZOq6a3Kj/szTwV
aAdWe2e7lxYkVXfckRAHXzUwmys+jW5H5Rb9lJRh7CburZm29tLIIKMCck3FZei6
un/ZsQ3eE/DlG3gPUFjFHMr2GB6AMsUSVA6ZN9cLox4RkAE4llX538251Fi3YNyF
dDKm1J4dK+e/EKKsQ+iE
-----END CERTIFICATE-----
`;
const KEY_PEM = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC80sftnHvdtxbc
3PN2bUsp/xM4MVv2M9XWXvfS0ZbLjWlmN3icvkDsE5xFzOUtxueXrHvnmFUg6zBk
UaW3JCoKWlS/kIkqilwYS9gknJiEBo1BAiYdTpFk5gtSb3IctlZmfc1+S7Wbao4S
KRUyHaGWbRdhFGFpgU/9YCyXI4UpRZMvFcpdPUL0n9zNJ/cSBfPaTmJZNmO7ypyn
qfNijoR7o95BP2ECbW8MId1BK62cdaVW2jo0vH80/OQzMfHX2ClBPsi1urxaJnFS
8iqgHYaL/TqaSUiAm2XUA7ufAQZhJnwxCCIdvc0S3F5dXZMdEb9MTZeQGVCrtsE5
lmkXmRpVAgMBAAECggEAAbw74P1uBfy+ei//7MofxZHjrsGp8Ppv1KdfWNHI2Pzn
IxFYlLOdMI45ApRZwkMVIBDbcqaQT25Hm5If8pt/C/uYiYECitdBiEVX4XUcrSMU
kBoYYdyRRO1Bb6rLGa0Fl2SuS1myMrW7aIPjkWgNcvfiQoxsQeY/eV7sUyBmJ75b
UrXjDJ34PWO5WSUZ9uBTB2znD1w6KXEs2z6NsurjbVosEReaBNazpASEsf0CuU66
2hBA8rnpBuBr0C+ka9e+WCAxG+sr387OLKZyjul5Q2q2x2JLZo4Qf2Lg+BJ7X/O8
Kwf/jKDqzJoxxbamVT1GlWEUFuXs9/CJNlI/Oci+AQKBgQDqX4jrmpCdaVrrNWjh
NXpqRidMPlBPotnXXR79pSrJF6wODDeLSd8nQx9ZWWGKHspsEVbCgBjNbkl+ZRYj
ZnwLnkEaUfU/7yxd39NjSoCqq/+uOOvuRrBTwFJqeRyRV5G3PhYiGhwBGM4g/9zS
7lPELV0ZjHP05kH9ex3sxQDH8QKBgQDOPz+dFsPXm47UzlNhaHH0EYKRnxZ+f/Za
ADpoPd5dDJQdB0Q0gGLX38X6GJzm/7kAGXIoOvQxr0ER/qyM1w7rqHiKo4fhphK8
fFQQWbpqjiXnyNzlxDmumz6GTL6PNLUFmEdetysG1mpBSmDpw0+LPLcId9wQabwr
NnFFLLf8pQKBgGuoZqSS40rrUjAo4HxSrGCUyQhkt09dZuNeixXIANdOYGIzinAZ
BsBqPMQ2Im/npOPvMwM1BC+ZMXk1xe2M7f4IO69zZkxv+NlGLzu0xVWgnFnTG8zf
+6788N6ns0+wAedCRbh0ddirJERUQ4NApom+rL1HnxwniLh/DUftVmaBAoGAFOfe
V9r94PX4pWOAmigPHPFFbeNVUV9BJmBNi1FyH7ZtsP+Sj0vQOReKps4l4VhcdUEf
DCrlo7+i9eL9tIz8CzEZftwSovHFhmuHzdx6g+CCwRrgIT4hpqw/yzcuPa/XBYko
+tXQO7IyNQoIBsnwXym5V9dmbBd7plmvY5aj060CgYEA5ViEmd8qeKgG9xrHUn88
PuCpyeLztIrZ3CEL1/A3wA3vtko//aTEv761dAbZNGhGakA51m28J9/l2swbfEvE
XVcqWt4e1MH1+lr5YsxYrigJXrqhItgkVW8XOrP1drJ3opgNY+q+bdytN9elu9B1
/JMLhP484YlBhtScm7QTTlw=
-----END PRIVATE KEY-----
`;

try {
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  if (existsSync(certPath)) {
    console.log('cert.pem already exists, skipping.');
  } else {
    writeFileSync(certPath, CERT_PEM, { mode: 0o644 });
    console.log('Wrote', certPath);
  }

  if (existsSync(keyPath)) {
    console.log('key.pem already exists, skipping.');
  } else {
    writeFileSync(keyPath, KEY_PEM, { mode: 0o600 });
    console.log('Wrote', keyPath);
  }
} catch (error) {
  console.error('Failed to write cert files:', err);
  process.exit(1);
}