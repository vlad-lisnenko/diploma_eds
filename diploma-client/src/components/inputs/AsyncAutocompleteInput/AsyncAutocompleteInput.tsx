import React, {FC} from 'react';
import {Input} from "../Input";

type Props = {
  value: string
  onChange ?: (value: string) => void
}

export const AsyncAutocompleteInput: FC<Props> = props => {
  return (
    <Input value={props.value} onChange={props.onChange} />
  );
};