import React from "react";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { Button, ButtonProps } from "@patternfly/react-core";
import { IFormatter, IFormatterValueType } from "@patternfly/react-table";

export const ExternalLink = ({ title, href, ...rest }: ButtonProps) => {
  return (
    <Button
      variant="link"
      icon={href?.startsWith("http") && <ExternalLinkAltIcon />}
      iconPosition="right"
      component="a"
      href={href}
      target="_blank"
      {...rest}
    >
      {title ? title : href}
    </Button>
  );
};

export const externalLinkFormatter = (): IFormatter => (
  data?: IFormatterValueType
) => {
  return (data ? <ExternalLink href={data.toString()} /> : undefined) as object;
};
