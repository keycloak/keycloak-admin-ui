import React, { useState } from "react";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { Controller, useForm, UseFormMethods } from "react-hook-form";

import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import { useAlerts } from "../components/alert/Alerts";
import type ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { useRealm } from "../context/realm-context/RealmContext";
import { useParams } from "react-router-dom";

type AESGeneratedFormProps = {
  providerType?: string;
  handleModalToggle?: () => void;
  refresh?: () => void;
  save: (component: ComponentRepresentation) => void;
  form?: UseFormMethods<ComponentRepresentation>;
  editMode?: boolean;
};

export const AESGeneratedForm = ({
  providerType,
form,
  handleModalToggle,
  save,
  editMode,
  refresh,
}: // save,
AESGeneratedFormProps) => {
  const { t } = useTranslation("groups");
  const serverInfo = useServerInfo();
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const { handleSubmit, control } = useForm({});
  const [isKeySizeDropdownOpen, setIsKeySizeDropdownOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const realm = useRealm();
  const { id } = useParams<{ id: string }>();

//   useFetch(
//     async () => {
//       if (editMode) return await adminClient.components.findOne({ id: id });
//     },
//     (component) => {
//       if (component) setupForm(component);
//     },
//     []
//   );

//   const setupForm = (component: ComponentRepresentation) => {
//     reset();
//     Object.entries(component).map((entry) => {
//       setValue(entry[0], entry[1]);
//     });
//   };

  console.log("provider type", providerType);

  const allComponentTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ];

  return (
    <Form
      isHorizontal
      id="add-provider"
      className="pf-u-mt-lg"
      onSubmit={handleSubmit(save!)}
    >
      <FormGroup
        label={t("realm-settings:consoleDisplayName")}
        fieldId="kc-console-display-name"
        labelIcon={
          <HelpItem
            helpText="realm-settings-help:displayName"
            forLabel={t("loginTheme")}
            forID="kc-console-display-name"
          />
        }
      >
        <Controller
          name="name"
          control={control}
          defaultValue={providerType}
          render={({ onChange }) => (
            <TextInput
              aria-label={t("consoleDisplayName")}
              defaultValue={providerType}
              onChange={(value) => {
                onChange(value);
                setDisplayName(value);
              }}
              data-testid="display-name-input"
            ></TextInput>
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("common:enabled")}
        fieldId="kc-enabled"
        labelIcon={
          <HelpItem
            helpText={t("realm-settings-help:enabled")}
            forLabel={t("enabled")}
            forID="kc-enabled"
          />
        }
      >
        <Controller
          name="config.enabled"
          control={control}
          defaultValue={["true"]}
          render={({ onChange, value }) => (
            <Switch
              id="kc-enabled"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={value[0] === "true"}
              data-testid={
                value[0] === "true"
                  ? "internationalization-enabled"
                  : "internationalization-disabled"
              }
              onChange={(value) => {
                onChange([value + ""]);
              }}
            />
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("realm-settings:active")}
        fieldId="kc-active"
        labelIcon={
          <HelpItem
            helpText="realm-settings-help:active"
            forLabel={t("active")}
            forID="kc-active"
          />
        }
      >
        <Controller
          name="config.active"
          control={control}
          defaultValue={["true"]}
          render={({ onChange, value }) => (
            <Switch
              id="kc-active"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={value[0] === "true"}
              data-testid={
                value[0] === "true"
                  ? "internationalization-enabled"
                  : "internationalization-disabled"
              }
              onChange={(value) => {
                onChange([value + ""]);
              }}
            />
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("realm-settings:AESKeySize")}
        fieldId="kc-aes-keysize"
        labelIcon={
          <HelpItem
            helpText="realm-settings-help:AESKeySize"
            forLabel={t("AESKeySize")}
            forID="kc-aes-key-size"
          />
        }
      >
        <Controller
          name="config.secretSize"
          control={control}
          defaultValue={["16"]}
          render={({ onChange, value }) => (
            <Select
              toggleId="kc-aes-keysize"
              onToggle={() => setIsKeySizeDropdownOpen(!isKeySizeDropdownOpen)}
              onSelect={(_, value) => {
                onChange([value + ""]);
                setIsKeySizeDropdownOpen(false);
              }}
              selections={[value + ""]}
              isOpen={isKeySizeDropdownOpen}
              variant={SelectVariant.single}
              aria-label={t("aesKeySize")}
              data-testid="select-secret-size"
            >
              {allComponentTypes[0].properties[3].options!.map((item, idx) => (
                <SelectOption
                  selected={item === value}
                  key={`email-theme-${idx}`}
                  value={item}
                />
              ))}
            </Select>
          )}
        />
      </FormGroup>
    </Form>
  );
};
