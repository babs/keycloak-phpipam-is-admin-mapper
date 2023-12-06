# Keycloak phpIPAM SAML2 is_admin mapper

Simple mapper for phpIPAM / SAML2 users.

## Configuration

To use it, in Keycloak's client configuration:
* create a role `is_admin`
* in client dedicated scope, add a mapper by configuration
* choose "Bool is_admin in role"
* set the following parameters  

| Param                     | Value      |
|---------------------------|------------|
| Name                      | `is_admin` |
| Single Value Attribute    | On         |
| Friendly Name             | `is_admin` |
| SAML Attribute Name       | `is_admin` |
| SAML Attribute NameFormat | `Basic`    |


## Use in a keycloak build chain

```Dockerfile
### JAR Builder ###
FROM alpine AS jarbuilder
RUN apk add --no-cache zip
COPY . /tmp/phpipam-mapper/
RUN sh -c "cd /tmp/phpipam-mapper && zip -r ../phpipam-mapper.jar ."

### Main Builder ###
FROM quay.io/keycloak/keycloak:${KEYCLOAK_TAG} as builder

USER root

ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_FEATURES=scripts

COPY --from=jarbuilder /tmp/phpipam-mapper.jar /opt/keycloak/providers/
# [...] other additions
RUN /opt/keycloak/bin/kc.sh build

### Main container ###
FROM quay.io/keycloak/keycloak:${KEYCLOAK_TAG}
COPY --from=builder /opt/keycloak/ /opt/keycloak/

USER keycloak
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]

```