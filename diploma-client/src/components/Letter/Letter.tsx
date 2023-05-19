import React, {FC} from 'react';

type Props = {
  value: string
}

export const Letter: FC<Props> = props => {
  return (
    <div>{props.value}</div>
  );
};