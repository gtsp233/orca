import { FC, FormEvent, useEffect, useState } from 'react';
import { InputText, Spacing, P, Toggle, Button, Text } from '../ui';
import { LabelAndToggle, ButtonContainer } from './style';
import { Channel } from '../../constants';

export enum ChannelFormMode {
  Create,
  Edit,
}

export interface IChannelForm {
  name: string;
  authRequired: boolean;
}

interface ChannelFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>, formValues: Channel) => Promise<void>;
  loading: boolean;
  channel?: Channel;
  mode: ChannelFormMode;
  closeModal: () => void;
  apiErrorMessage?: string;
}

const ChannelForm: FC<ChannelFormProps> = ({ channel, loading, closeModal, onSubmit, mode, apiErrorMessage }) => {
  const initialState = {
    name: channel?.name || '',
    authRequired: channel?.authRequired || false,
  };
  const [formValues, setFormValues] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target as HTMLInputElement;
    if (name === 'authRequired') {
      setFormValues({ ...formValues, [name]: checked });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e, formValues);
  };

  useEffect(() => {
    const validateForm = () => {
      const { name } = formValues;

      const channelNameReg = /[-!$%^&*()_+|~=`\\#{}\[\]:";'<>?,.\/]/;
      if (channelNameReg.test(name) || !name || name.length > 32) {
        setErrorMessage('Channel names can only use letters, numbers, underscores, and periods by max character 32.');
        return;
      }

      setErrorMessage('');
    };

    validateForm();
  }, [formValues]);

  return (
    <form onSubmit={handleSubmit}>
      <Spacing top="sm" bottom="md">
        <InputText
          autoFocus
          label="Name"
          onChange={handleChange}
          value={formValues.name}
          type="text"
          name="name"
          autoComplete="off"
          placeholder="Choose a name for your channel"
        />
      </Spacing>

      <Spacing top="sm" bottom="md">
        <LabelAndToggle>
          <div>
            <P weight="bold">Privacy</P>
            <P color="textSecondary">Only authenticated users can see the channel.</P>
          </div>
          <Toggle name="authRequired" checked={formValues.authRequired} onChange={handleChange} />
        </LabelAndToggle>
      </Spacing>

      {errorMessage && formValues.name.length > 0 && (
        <Spacing bottom="sm">
          <Text color="error">{errorMessage}</Text>
        </Spacing>
      )}

      {apiErrorMessage && (
        <Spacing bottom="sm">
          <Text color="error">{apiErrorMessage}</Text>
        </Spacing>
      )}

      <ButtonContainer>
        <Button type="button" text color="primary" onClick={closeModal}>
          Cancel
        </Button>
        <Spacing right="sm" />

        <Button type="submit" color="primary" disabled={Boolean(errorMessage) || loading}>
          {mode === ChannelFormMode.Create ? 'Create' : 'Update'}
        </Button>
      </ButtonContainer>
    </form>
  );
};

export default ChannelForm;