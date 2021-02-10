import React from "react";
import { FormGroup, TextInput, ValidatedOptions } from "@patternfly/react-core";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormAccess } from "../components/form-access/FormAccess";
import { ClientForm } from "./ClientDetails";

export const ClientDescription = () => {
  const { t } = useTranslation("clients");
  const { register, errors } = useFormContext<ClientForm>();
  return (
    <FormAccess role="manage-clients" unWrap>
      <FormGroup
        label={t("clientID")}
        fieldId="kc-client-id"
        helperTextInvalid={t("common:required")}
        validated={
          errors.clientId ? ValidatedOptions.error : ValidatedOptions.default
        }
        isRequired
      >
        <TextInput
          ref={register({ required: true })}
          type="text"
          id="kc-client-id"
          name="clientId"
          validated={
            errors.clientId ? ValidatedOptions.error : ValidatedOptions.default
          }
        />
      </FormGroup>
      <FormGroup label={t("common:name")} fieldId="kc-name">
        <TextInput ref={register()} type="text" id="kc-name" name="name" />
      </FormGroup>
      <FormGroup
        label={t("common:description")}
        fieldId="kc-description"
        validated={
          errors.description ? ValidatedOptions.error : ValidatedOptions.default
        }
        helperTextInvalid={errors.description?.message}
      >
        <TextInput
          ref={register({
            maxLength: {
              value: 255,
              message: t("common:maxLength", { length: 255 }),
            },
          })}
          type="text"
          id="kc-description"
          name="description"
          validated={
            errors.description
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
        />
      </FormGroup>
    </FormAccess>
  );
};
