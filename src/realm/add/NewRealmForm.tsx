import React, { useState, FormEvent, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Text,
  PageSection,
  TextContent,
  FormGroup,
  Form,
  TextInput,
  Switch,
  ActionGroup,
  Button,
  Divider,
  AlertVariant,
} from "@patternfly/react-core";

import { JsonFileUpload } from "../../components/json-file-upload/JsonFileUpload";
import { RealmRepresentation } from "../models/Realm";
import { HttpClientContext } from "../../http-service/HttpClientContext";
import { useAlerts } from "../../components/alert/Alerts";
import { useForm, Controller } from "react-hook-form";

export const NewRealmForm = () => {
  const { t } = useTranslation("realm");
  const httpClient = useContext(HttpClientContext)!;
  const [add, Alerts] = useAlerts();

  const { register, handleSubmit, setValue, control } = useForm<
    RealmRepresentation
  >();

  const handleFileChange = (value: string | File) => {
    const defaultRealm = { id: "", realm: "", enabled: true };

    const obj = value ? JSON.parse(value as string) : defaultRealm;
    Object.keys(obj).forEach((k) => {
      setValue(k, obj[k]);
    });
  };

  const save = async (realm: RealmRepresentation) => {
    try {
      await httpClient.doPost("/admin/realms", realm);
      add(t("createdSuccess"), AlertVariant.success);
    } catch (error) {
      add(`${t("createFailure")} '${error}'`, AlertVariant.danger);
    }
  };

  return (
    <>
      <Alerts />
      <PageSection variant="light">
        <TextContent>
          <Text component="h1">Create Realm</Text>
        </TextContent>
      </PageSection>
      <Divider />
      <PageSection variant="light">
        <Form isHorizontal onSubmit={handleSubmit(save)}>
          <JsonFileUpload id="kc-realm-filename" onChange={handleFileChange} />
          <FormGroup label={t("realmName")} isRequired fieldId="kc-realm-name">
            <TextInput
              isRequired
              type="text"
              id="kc-realm-name"
              name="realm"
              ref={register()}
            />
          </FormGroup>
          <FormGroup label={t("enabled")} fieldId="kc-realm-enabled-switch">
            <Controller
              name="enabled"
              defaultValue={true}
              control={control}
              render={({ onChange, value }) => (
                <Switch
                  id="kc-realm-enabled-switch"
                  name="enabled"
                  label={t("common:on")}
                  labelOff={t("common:off")}
                  isChecked={value}
                  onChange={onChange}
                />
              )}
            />
          </FormGroup>
          <ActionGroup>
            <Button variant="primary" type="submit">
              {t("create")}
            </Button>
            <Button variant="link">{t("common:cancel")}</Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </>
  );
};
