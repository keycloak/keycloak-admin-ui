import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core";

import { ClientIdSecret } from "../component/ClientIdSecret";
import { HelpItem } from "../../components/help-enabler/HelpItem";

const clientAuthenticationTypes = [
  "clientAuth_post",
  "clientAuth_basic",
  "clientAuth_secret_jwt",
  "clientAuth_privatekey_jwt",
];

export const OIDCAuthentication = () => {
  const { t } = useTranslation("identity-providers");
  const { t: th } = useTranslation("identity-providers-help");

  const { control } = useFormContext();
  const [openClientAuth, setOpenClientAuth] = useState(false);

  const clientAuthMethod = useWatch({
    control: control,
    name: "config.clientAuthMethod",
  });

  return (
    <>
      <FormGroup
        label={t("clientAuthentication")}
        labelIcon={
          <HelpItem
            helpText={th("clientAuthentication")}
            forLabel={t("clientAuthentication")}
            forID="clientAuthentication"
          />
        }
        fieldId="clientAuthentication"
      >
        <Controller
          name="config.clientAuthMethod"
          defaultValue={clientAuthenticationTypes[0]}
          control={control}
          render={({ onChange, value }) => (
            <Select
              toggleId="clientAuthMethod"
              required
              onToggle={() => setOpenClientAuth(!openClientAuth)}
              onSelect={(_, value) => {
                onChange(value as string);
                setOpenClientAuth(false);
              }}
              selections={value}
              variant={SelectVariant.single}
              aria-label={t("prompt")}
              isOpen={openClientAuth}
            >
              {clientAuthenticationTypes.map((option) => (
                <SelectOption
                  selected={option === value}
                  key={option}
                  value={option}
                >
                  {t(`clientAuthentications.${option}`)}
                </SelectOption>
              ))}
            </Select>
          )}
        />
      </FormGroup>
      <ClientIdSecret
        secretRequired={clientAuthMethod !== "clientAuth_privatekey_jwt"}
      />
    </>
  );
};