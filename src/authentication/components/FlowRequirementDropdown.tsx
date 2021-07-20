import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Select, SelectOption, SelectVariant } from "@patternfly/react-core";

import type AuthenticationExecutionInfoRepresentation from "keycloak-admin/lib/defs/authenticationExecutionInfoRepresentation";

type FlowRequirementDropdownProps = {
  flow: AuthenticationExecutionInfoRepresentation;
};

export const FlowRequirementDropdown = ({
  flow,
}: FlowRequirementDropdownProps) => {
  const { t } = useTranslation("authentication");
  const [open, setOpen] = useState(false);

  const options = flow.requirementChoices!.map((option, index) => (
    <SelectOption key={index} value={option}>
      {t(`requirements.${option}`)}
    </SelectOption>
  ));

  return (
    <Select
      className="keycloak__authentication__requirement-dropdown"
      variant={SelectVariant.single}
      onToggle={() => setOpen(!open)}
      onSelect={() => console.log("hello")}
      selections={[flow.requirement]}
      isOpen={open}
    >
      {options}
    </Select>
  );
};
